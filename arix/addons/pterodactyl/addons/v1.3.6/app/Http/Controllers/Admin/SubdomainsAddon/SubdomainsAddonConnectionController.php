<?php

namespace Pterodactyl\Http\Controllers\Admin\SubdomainsAddon;

use GuzzleHttp\Promise\Utils;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Exceptions\DisplayExceptionl;
use Pterodactyl\Http\Controllers\Api\Client\SubdomainsAddon\DomainController;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Helpers\Cloudflare;
use \Illuminate\Http\RedirectResponse;
use Pterodactyl\Models\Subdomains\SubdomainsCloudflareConfig;
use Pterodactyl\Models\Subdomains\SubdomainsConnectedDomains;
use Pterodactyl\Models\Subdomains\SubdomainBlocklist;
use Pterodactyl\Models\Subdomains\SubdomainsUserSubdomain;

class SubdomainsAddonConnectionController extends Controller
{
    public function __construct(
        protected AlertsMessageBag $alert,
    )
    {
    }

    public function Index(): Factory|View|Application
    {
        // Fetch connected domains from the database
        $connectedDomains = SubdomainsConnectedDomains::all();

        // Fetch the latest Cloudflare configuration
        $cloudflareConfig = SubdomainsCloudflareConfig::latest()->first();

        $blockedDomains = SubdomainBlocklist::all();

        // Fetch the amount of servers connected to each domain and add it to the connectedDomains array
        foreach ($connectedDomains as $connectedDomain) {
            $connectedDomain->serverCount = SubdomainsUserSubdomain::where('domain', $connectedDomain->domain)->count();
        }

        // Pass the data to the view
        return view('admin.subdomainsAddon.domainconnection', [
            'connectedDomains' => $connectedDomains,
            'cloudflareConfig' => $cloudflareConfig,
            'blockedDomains' => $blockedDomains,
        ]);
    }

    public function GetConnectedDomains(): JsonResponse
    {
        return response()->json(SubdomainsConnectedDomains::all());
    }

    public function ConnectNewDomain(Request $request): RedirectResponse|JsonResponse
    {
        $domain = $request->input('domain');
        $domainIsSubdomain = $this->domainIsSubdomain($domain);
        $acceptsHtml = $request->acceptsHtml();

        // get the newest credentials
        $config = SubdomainsCloudflareConfig::latest()->first();

        if (!$config) {
            if ($acceptsHtml) {
                throw new DisplayException('No Cloudflare credentials found, please set your Cloudflare credentials first.');
            }

            return response()->json(['error' => 'No Cloudflare credentials found']);
        }

        $cfRes = $this->listCloudflareZones($config);

        $zoneId = null;

        $rootDomain = $this->getRootDomain($domain, $config, $cfRes);

        foreach ($cfRes as $zone) {
            if ($zone['name'] == $rootDomain && $zone['status'] == 'active') {
                ;
                $zoneId = $zone['id'];
                break;
            }
        }
        if ($zoneId == null) {
            if ($acceptsHtml) {
                throw new DisplayException('Domain not found in Cloudflare, please check if its added to your account.');
            }
            return response()->json(['error' => 'Domain not found in Cloudflare']);
        }


        DB::beginTransaction();

        SubdomainsConnectedDomains::updateOrCreate([
            'domain' => $domain,
            'zone_id' => $zoneId,
        ]);

        DB::commit();

        if ($acceptsHtml) {
            $this->alert->success('Domain connected successfully')->flash();
            return redirect()->route('admin.domain');
        }

        return response()->json(['success' => 'Domain connected successfully']);
    }

    public function DisconnectDomain(string $domain): RedirectResponse|JsonResponse
    {
        $acceptsHtml = request()->acceptsHtml();
        DB::beginTransaction();

        $domains = SubdomainsUserSubdomain::where('domain', $domain)->get();

        $DomainController = new DomainController();
        foreach ($domains as $subdomain) {
            $delDomainError = $DomainController->DeleteDomainsFromServer($subdomain->server_id);
            if ($delDomainError) {
                if ($acceptsHtml) {
                    throw new DisplayException($delDomainError);
                }
                return response()->json(['error' => $delDomainError]);
            }
        }

        SubdomainsConnectedDomains::where('domain', $domain)->delete();
        SubdomainsUserSubdomain::where('domain', $domain)->delete();

        DB::commit();

        if ($acceptsHtml) {
            $this->alert->success('Domain disconnected successfully')->flash();
            return redirect()->route('admin.domain');
        }

        return response()->json(['success' => 'Domain disconnected successfully']);
    }

    public function GetCloudflareConfig()
    {
        return response()->json(SubdomainsCloudflareConfig::latest()->first());
    }

    public function SetCloudflareKey(Request $request): RedirectResponse|JsonResponse
    {
        $acceptsHtml = request()->acceptsHtml();
        $existingKey = SubdomainsCloudflareConfig::latest()->first();

        // for some reason I have to make these a variable first before I can use them in the object properly...
        $CloudFlareKey = $request->input('CloudFlareKey');
        $proxyRecords = $request->input('proxyRecords');
        $useAlias = $request->input('useAlias');
        $useDomainAlias = $request->input('useDomainAlias');

        // parse the proxy records from an html checkbox to a boolean
        $proxyRecords = $proxyRecords == 'on';
        $useAlias = $useAlias == 'on';
        $useDomainAlias = $useDomainAlias == 'on';

        $newKey = (object)[
            'api_key' => $CloudFlareKey,
        ];

        if ($existingKey) {
            $checked = $this->CheckDomainsForNewCloudflareKey($newKey);

            if (gettype($checked) == 'object') {
                if ($acceptsHtml) {
                    throw new DisplayException($checked);
                }

                return $checked;
            }

            if (count($checked['domainsNotFound']) > 0) {
                foreach ($checked['domainsNotFound'] as $domain) {
                    SubdomainsConnectedDomains::where('domain', $domain)->update(['status' => 'error']);
                }
            }

            if (count($checked['domainsWithClearedError']) > 0) {
                foreach ($checked['domainsWithClearedError'] as $domain) {
                    SubdomainsConnectedDomains::where('domain', $domain)->update(['status' => 'active']);
                }
            }
        }

        // clear all previous keys
        SubdomainsCloudflareConfig::truncate();

        SubdomainsCloudflareConfig::create([
            'api_key' => $CloudFlareKey,
            'proxy_records' => $proxyRecords,
            'use_alias' => $useAlias,
            'use_domain_alias' => $useDomainAlias,
        ]);

        if ($acceptsHtml) {
            $this->alert->success('Cloudflare key set successfully')->flash();
            return redirect()->route('admin.domain');
        }

        return response()->json(['success' => 'Cloudflare key set successfully']);
    }

    public function MockSetCloudflareKey(Request $request): JsonResponse
    {
        $existingKey = SubdomainsCloudflareConfig::latest()->first();

        // for some reason I have to make these a variable first before I can use them in the object properly...
        $CloudFlareKey = $request->input('CloudFlareKey');

        $newKey = (object)[
            'api_key' => $CloudFlareKey,
        ];

        if ($existingKey) {
            $checked = $this->CheckDomainsForNewCloudflareKey($newKey);

            if (gettype($checked) == 'object') {
                return $checked;
            }

            $clearedErrorMessage = '';
            if (count($checked['domainsWithClearedError']) > 0) {
                $clearedErrorMessage = " and the following domains will been cleared of their error status: " . implode(', ', $checked['domainsWithClearedError']);
            }

            if (count($checked['domainsNotFound']) > 0) {
                return response()->json(['error' => 'The following connected domains will be not found in the Cloudflare account: ' . implode(', ', $checked['domainsNotFound']) . $clearedErrorMessage]); // 820fa5898ae2d66b13fd198a5224c379
            }

            DB::beginTransaction();

            SubdomainsCloudflareConfig::updateOrCreate([
                'api_key' => $newKey->api_key,
            ]);

            if (count($checked['domainsWithClearedError']) > 0) {
                return response()->json(['success' => 'The Cloudflare key can ben set successfully ' . $clearedErrorMessage]);
            }
        }

        DB::beginTransaction();

        SubdomainsCloudflareConfig::updateOrCreate([
            'api_key' => $newKey->api_key,
        ]);


        return response()->json(['success' => 'Cloudflare key can be set successfully']);
    }

    public function domainIsSubdomain($domain): bool
    {
        $domain = explode('.', $domain);
        return count($domain) > 2;
    }

    public function ForceDeleteSubdomainFromServer(Request $request, $server): RedirectResponse
    {
        $DomainController = new DomainController();
        $DomainController->DeleteUserSubdomain($request->subdomain_id);

        // if the other function returns an error, just continue with the deletion of the subdomain from the server.
        // This may leave it in Cloudflare, but it'll be removed from the database.
        SubdomainsUserSubdomain::where('id', $request->subdomain_id)->delete();

        return redirect()->route('admin.servers.view.subdomains', $server);
    }

    private function listCloudflareZones(object $config): array
    {
        $zones = [];
        $totalPages = 1; // Initialize with 1 to ensure the loop runs at least once, we'll update it later

        for ($page = 1; $page <= $totalPages; $page++) {
            $response = Cloudflare::DoAuthenticatedCloudflareCall(
                $config->api_key,
                "client/v4/zones?per_page=50&page={$page}"
            );

            if ($response->failed() || $response->status() != 200) {
                throw new DisplayException('Error fetching Cloudflare zones: ' . $response->body());
            }

            $responseData = $response->json();
            $zones = array_merge($zones, $responseData['result']);
            $totalPages = $responseData['result_info']['total_pages']; // Update total pages
        }

        return $zones;
    }

    private function CheckforCloudflareErrors(\GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response $cfRes): bool|JsonResponse
    {
        if ($cfRes->failed()) {
            return response()->json(['error' => 'Error: ' . $cfRes->body()]);
        }
        if ($cfRes->status() != 200) {
            return response()->json(['error' => 'Error: ' . $cfRes->body()]);
        }

        return false;
    }

    private function CheckDomainsForNewCloudflareKey(object $newKey): array|JsonResponse
    {
        $cfRes = $this->listCloudflareZones($newKey);

        $connectedDomains = SubdomainsConnectedDomains::all();

        $domainsFound = [];
        $domainsNotFound = [];
        $domainsWithClearedError = [];
        // check if the connected domains are all still available
        foreach ($connectedDomains as $connectedDomain) {
            foreach ($cfRes as $zone) {
                if ($zone['id'] == $connectedDomain->zone_id && $zone['status'] == 'active') {
                    $domainsFound[] = $zone['name'];
                    break;
                }
            }


            // check if domains with an error status are found in the cloudflare zones
            $connectedDomainsWithError = SubdomainsConnectedDomains::where('status', 'error')->get();
            foreach ($connectedDomainsWithError as $connectedDomain) {
                foreach ($domainsFound as $domain) {
                    if ($connectedDomain->domain == $domain) {
                        $domainsWithClearedError[] = $domain;
                    }
                }
            }
        }

        // find the domains that are in the database but not in the cloudflare zones
        foreach ($connectedDomains as $connectedDomain) {
            if (!in_array($connectedDomain->domain, $domainsFound)) {
                $domainsNotFound[] = $connectedDomain->domain;
            }
        }

        return ['domainsWithClearedError' => $domainsWithClearedError, 'domainsNotFound' => $domainsNotFound];
    }

    private function getRootDomain(string $domain, object $config, $zones): string
    {
        $domainParts = explode('.', $domain);
        for ($i = 0; $i < count($domainParts) - 1; $i++) {
            $potentialRoot = implode('.', array_slice($domainParts, $i));
            foreach ($zones as $zone) {
                if ($zone['name'] === $potentialRoot) {
                    return $potentialRoot;
                }
            }
        }

        // Fallback to the last two parts if no match is found
        return $domainParts[count($domainParts) - 2] . '.' . $domainParts[count($domainParts) - 1];
    }
}

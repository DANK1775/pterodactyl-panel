<?php

namespace Pterodactyl\Http\Controllers\Admin\SubdomainsAddon;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Models\Subdomains\SubdomainBlocklist;

class SubdomainsAddonBlocklistController  {
    public function __construct(
        protected AlertsMessageBag $alert,
    ){}

    public function index(): RedirectResponse | JsonResponse {
        $subdomain = SubdomainBlocklist::all();

        return $subdomain;
    }

    public function AddBlocklist() : RedirectResponse | JsonResponse {
        $acceptsHtml = request()->acceptsHtml();
        if (empty(request()->input('word'))) {
            if ($acceptsHtml) {
                throw new DisplayException('Please enter a subdomain to block.');
            }

            return response()->json(['error' => 'Please enter a subdomain to block.']);
        }

        $word = strtolower(request()->input('word'));

        $subdomain = new SubdomainBlocklist();
        $subdomain->subdomain = $word;
        $subdomain->reason = request()->input('reason');
        $subdomain->save();

        if ($acceptsHtml) {
            $this->alert->success('Subdomain added to blocklist')->flash();
            return redirect()->route('admin.domain');
        }

        return response()->json(['success' => 'Subdomain added to blocklist.']);
    }

    public function RemoveBlocklist($id): RedirectResponse | JsonResponse {
        $acceptsHtml = request()->acceptsHtml();
        if (empty($id)) {
            $id = request()->input('id');

            if ($id != null){
                if ($acceptsHtml) {
                    throw new DisplayException('Please enter a subdomain to remove.');
                }

                return response()->json(['error' => 'Please enter a subdomain to remove.']);
            }
        }
        $subdomain = SubdomainBlocklist::findOrFail($id);
        $subdomain->delete();

        if ($acceptsHtml) {
            $this->alert->success('Subdomain removed from blocklist')->flash();
            return redirect()->route('admin.domain');
        }

        return response()->json(['success' => 'Subdomain removed from blocklist.']);
    }
}

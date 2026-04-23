<?php

namespace Pterodactyl\Http\Controllers\Api\Client\PluginsAddon;

use GuzzleHttp\Promise\PromiseInterface;
use GuzzleHttp\Promise\Utils;
use http\Env\Request;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Helpers\ArixAddons;


use Illuminate\Auth\Access\AuthorizationException;
use Pterodactyl\Helpers\Cloudflare;
use Pterodactyl\Http\Requests\Api\Client\Servers\GetServerRequest;
use Pterodactyl\Models\Permission;
use Pterodactyl\Models\Plugins\InstalledPlugins;
use Pterodactyl\Models\Server;


class PluginsController extends Controller
{
    private $PLUGIN_SERVICES = ['spigot', 'curseforge', 'modrinth', 'hangar'];

    public function index()
    {
        return response()->json([
            'services'=> $this->PLUGIN_SERVICES,
        ]);
    }

    public function getFilters() {
        return ArixAddons::licensedRequestToApi('/plugins/filters', [], false, 'GET', 24);
    }

    public function getInstalled($server) {
        $request = Request();

        if (!$request->user()->can(Permission::ACTION_FILE_READ, $server)) {
            throw new AuthorizationException();
        }

        $installedPlugins = InstalledPlugins::where('server_id', $server->id)->get();

        return response()->json($installedPlugins);

    }

    public function getService($server, string $service, ?string $plugin = null) {
        if (!$this->serviceExists($service)) {
            return response()->json([
                'error' => 'Service not found',
            ], 404);
        }

        $acceptableQueryParams = ['search', 'license', 'loader', 'version', 'page', 'sortfield', 'sortdirection'];

        $queryParameters = Request()->query();

        // remove unacceptable query parameters to prevent abuse
        foreach ($queryParameters as $key => $value) {
            if (!in_array($key, $acceptableQueryParams)) {
                unset($queryParameters[$key]);
            }
        }

        $route = "plugins/$service". ($plugin ? "/$plugin" : '');

        $response = ArixAddons::licensedRequestToApi($route, $queryParameters, false, 'GET');

        if (!isset($response['meta']) && !isset($response['versions'])) {
            return response()->json([
                'error' => 'Something went wrong fetching the plugins',
            ], 500);
        }

        return $response;
    }

    public function store(Server $server) {
        $request = Request();

        if (!$request->user()->can(Permission::ACTION_FILE_CREATE, $server)) {
            throw new AuthorizationException();
        }

        // validate that plugin_service, plugin_version, plugin_service_id, plugin_name, plugin_icon and file_name are in the body
        $request->validate([
            'plugin_service' => 'required|string',
            'plugin_version' => 'required|string',
            'plugin_service_id' => 'required|string',
            'plugin_name' => 'required|string',
            'plugin_icon' => 'required|string',
            'file_name' => 'required|string',
        ]);
        $service = $request->plugin_service;
        $plugin_id = $request->plugin_service_id;
        $plugin_version = $request->plugin_version;
        $name = $request->plugin_name;
        $file_name = $request->file_name;

        if (!$this->serviceExists($service)) {
            return response()->json([
                'error' => 'Service not found',
            ], 404);
        }

        // get the plugin
        $response = ArixAddons::licensedRequestToApi("plugins/$service/$plugin_id", [], false, 'GET');

        if (!isset($response['data']) && !isset($response['versions'])) {
            return response()->json([
                'error' => 'Plugin fetch failed',
            ], 500);
        }

        // reverse the array to get the latest version first
        $response['versions'] = array_reverse($response['versions']);

        // find the specific version as the latest name key in the versions array
        foreach ($response['versions'] as $version) {
            if ($version['name'] == $plugin_version) {
                $response = $version;
                break;
            }
        }

        // check if plugin is already installed
        $installedPlugin = InstalledPlugins::where('server_id', $server->id)->where([
            ['plugin_service', $service],
            ['plugin_service_id', $plugin_id],
        ])->first();

        if ($installedPlugin) {
            return response()->json([
                'error' => 'Plugin already installed',
            ], 400);
        }

        // store the plugin
        $installedPlugin = InstalledPlugins::create([
            'plugin_service' => $service,
            'plugin_version' => $plugin_version,
            'plugin_service_id' => $plugin_id,
            'plugin_name' => $name,
            'plugin_icon' => $request->plugin_icon,
            'server_id' => $server->id,
            'file_name' => $file_name,
        ]);

        return response()->json([
            'message' => 'Plugin installed',
            'id' => $installedPlugin->id,
            'plugin_service' => $service,
            'plugin_version' => $plugin_version,
            'plugin_service_id' => $plugin_id,
            'plugin_name' => $name,
            'server_id' => $server->id,
            'file_name' => $file_name,
            'plugin_icon' => $request->plugin_icon,
        ]);
    }

    public function destroy($server, string $plugin_id) {
        $request = Request();

        if (!$request->user()->can(Permission::ACTION_FILE_DELETE, $server)) {
            throw new AuthorizationException();
        }

        // check if plugin is already installed
        $installedPlugin = InstalledPlugins::where([
            ['id', $plugin_id],
            ['server_id', $server->id]
        ])->first();
        if (!$installedPlugin) {
            return response()->json([
                'error' => 'Plugin not installed',
            ], 400);
        }

        // delete the plugin
        $installedPlugin->delete();

        return response()->json([
            'message' => 'Plugin uninstalled',
        ]);
    }

    public function prepareFile() {
        $request = Request();
        $request->validate([
            'url' => 'string|required',
            'name' => 'string|required',
            'version' => 'string|required'
        ]);

        $url = $request->url;
        $name = $request->name;
        $version = $request->version;

        $res = ArixAddons::licensedRequestToApi('file/prepare', [
            'url' => $url,
            'name' => $name,
            'version' => $version,
        ], true, 'POST');

        // return the response without escaping the slashes
        return response()->json($res, 200, [], JSON_UNESCAPED_SLASHES);
    }

    public function rename($server, string $plugin_id) {
        $request = Request();

        // validate that the new name is in the body
        $request->validate([
            'plugin_name' => 'string',
            'file_name' => 'string',
            'plugin_version' => 'string'
        ]);

        // check if plugin is already installed
        $installedPlugin = InstalledPlugins::where([
            ['id', $plugin_id],
            ['server_id', $server->id]
        ])->first();
        if (!$installedPlugin) {
            return response()->json([
                'error' => 'Plugin not installed',
            ], 400);
        }

        // update the plugin
        $installedPlugin->update([
            'plugin_name' => $request->plugin_name ?? $installedPlugin->plugin_name,
            'file_name' => $request->file_name ?? $installedPlugin->file_name,
            'plugin_version' => $request->plugin_version ?? $installedPlugin->plugin_version,
        ]);

        return response()->json([
            'message' => 'Plugin renamed',
        ]);
    }

    private function serviceExists($service) {
        return in_array($service, $this->PLUGIN_SERVICES);
    }
    
    public function checkIfFileIsManagedByAddon(string $path, int $server_id, array|string $files) {
        if ($path == '/plugins') {
            // check if there are any plugins installed
            $installedPlugins = InstalledPlugins::where('server_id', $server_id)->get();

            if ($installedPlugins->count() == 0) {
                return [];
            }

            if (!is_array($files)) {
                $files = [$files];
            }

            $pluginFiles = [];
            foreach ($installedPlugins as $plugin) {
                $pluginFiles[] = $plugin->file_name;
            }

            // return the installed plugins that are managed by the addon
            return array_intersect($pluginFiles, $files);
        }
        return [];
    }

    public function removeAddonByFileNames(int $server_id, array $files) {
        $installedPlugins = InstalledPlugins::where('server_id', $server_id)->get();

        $pluginFiles = [];
        foreach ($installedPlugins as $plugin) {
            $pluginFiles[] = $plugin->file_name;
        }

        $filesToRemove = array_intersect($pluginFiles, $files);

        foreach ($filesToRemove as $file) {
            $plugin = InstalledPlugins::where('file_name', $file)->first();
            $plugin->delete();
        }
    }

    public function removeAllAddonsForServer(int $server_id) {
        $installedPlugins = InstalledPlugins::where('server_id', $server_id)->get();

        foreach ($installedPlugins as $plugin) {
            $plugin->delete();
        }
    }

    public function renameAddonFilenameByRenameObject(int $server_id, string $old_name, string $new_name) {
        $installedPlugins = InstalledPlugins::where([
            ['server_id', $server_id],
            ['file_name', $old_name],
        ])->get();

        foreach ($installedPlugins as $plugin) {
            $plugin->update([
                'file_name' => $new_name,
            ]);
        }
    }
}

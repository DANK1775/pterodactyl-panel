<?php

namespace Pterodactyl\Http\Controllers\Api\Client\VersionsAddon;

use GuzzleHttp\Promise\PromiseInterface;
use GuzzleHttp\Promise\Utils;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\File;
use Pterodactyl\Console\Commands\Arix;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

use Pterodactyl\Helpers\ArixAddons;
use Pterodactyl\Repositories\Wings\DaemonFileRepository;

class VersionsController extends ClientApiController
{

    public function __construct(
        private DaemonFileRepository $fileRepository,
    )
    {
        parent::__construct();
    }

    /**
     * Returns the latest version of the addon.
     */
    public function getServices($server, ?string $service = null): JsonResponse|PromiseInterface
    {
        $file = File::get(base_path('version_changer_disallowed_eggs.json'));

        $egg_rules = json_decode($file, true)[$server->egg_id] ?? [];

        if (!$this->isAllowedToUseWithEgg($egg_rules, $service)) {
            return response()->json([
                'status' => 'error',
                'message' => 'This egg is not allowed to use this service.',
            ], 403);
        }

        $response = ArixAddons::licensedRequestToApi('versions' . ($service ? "/$service" : ''), [], false, 'GET', ($service ? 1 : 48));

        if ($response && count($response) > !0) {
            return response()->json([
                'status' => 'error',
                'message' => 'No versions found.',
            ], 404);
        }

        if (count($egg_rules) > 0 && !$service) {
            $egg_rules = array_map('strtolower', $egg_rules);
            $response = array_filter($response, function ($service) use ($egg_rules) {
                return !in_array(strtolower($service), $egg_rules);
            });
            $response = array_values($response);
        }

        $current_version = $server->mc_version;

        $current_version = explode('|', $current_version);

        if (count($current_version) == 2) {
            $current_version = [
                'service' => $current_version[0],
                'version' => $current_version[1],
            ];
        }

        //if ($service) dd($response);

        return response()->json([
            'status' => 'success',
            'data' => $response,
            'current' => $current_version,
        ]);
    }

    public function store($server, string $service, string $version): JsonResponse
    {
        $file = File::get(base_path('version_changer_disallowed_eggs.json'));

        $egg_rules = json_decode($file, true)[$server->egg_id] ?? [];

        if (!$this->isAllowedToUseWithEgg($egg_rules, $service)) {
            return response()->json([
                'status' => 'error',
                'message' => 'This egg is not allowed to use this service.',
            ], 403);
        }

        $response = ArixAddons::licensedRequestToApi('versions/' . $service, [], false, 'GET', ($service ? 1 : 48));

        foreach ($response as $version_data) {
            if ($version_data['version'] === $version) {
                $response = $version_data;
                break;
            }
        }
        // should be impossible to not find the version since the dropdown only shows available versions, but just in case
        if (!isset($response['download_url'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Version not found.',
            ], 404);
        }

        $extension = pathinfo($response['download_url'], PATHINFO_EXTENSION);
        $filename = $version . '.' . $extension;

        if ($extension === 'jar') {
            $filename = 'server.jar'; // so I don't have to rename it after downloading
        }

        $params = [
            'filename' => $filename,
            'override' => true,
        ];

        $this->fileRepository->setServer($server)->pull(
            ArixAddons::baseUrl() . $response['download_url'],
            '/',
            $params
        );

        if ($extension === 'zip') {
            $this->fileRepository->setServer($server)->deleteFiles(
                '/',
                ['libraries', 'server.jar']
            );

            usleep(500000);
            if (!$this->fileIsOnServer($filename, $server)) {
                usleep(1000000);
            }
            if (!$this->fileIsOnServer($filename, $server)) {
                usleep(1000000);
            }

            $this->fileRepository->setServer($server)->decompressFile(
                '/',
                $filename
            );

            // delete the zip file after extraction
            $this->fileRepository->setServer($server)->deleteFiles(
                '/',
                [$filename]
            );
        }

        // update the servers table with the new version
        $server->update([
            'mc_version' => $service . "|" . $version,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Version updated successfully.',
        ]);
    }

    private function fileIsOnServer($filename, $server): bool
    {
        $folder = $this->fileRepository->setServer($server)->getDirectory('/');

        if (!isset($folder['files'])) {
            return false;
        }

        foreach ($folder as $file) {
            if ($file['name'] === $filename) {
                return true;
            }
        }

        return false;
    }

    private function isAllowedToUseWithEgg($egg_rules, $service): bool
    {
        if (count($egg_rules) > 0) {
            $services = array_map('strtolower', $egg_rules); // Convert all elements to lowercase
            $service = strtolower($service); // Convert the target value to lowercase
            if (in_array('*', $services) || in_array($service, $services)) {
                return false; // The egg is disallowed for all services or this specific service
            }
        }

        return true;
    }
}
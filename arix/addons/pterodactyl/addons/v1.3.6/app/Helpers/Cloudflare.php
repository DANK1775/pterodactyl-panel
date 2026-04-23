<?php

namespace Pterodactyl\Helpers;

use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

final class Cloudflare {
    public static function DoAuthenticatedCloudflareCall (string $key, string $urlSlug, string $method = "GET", array $data = []) : PromiseInterface|Response
    {
        $headers = [
            'Content-Type' => 'application/json',
        ];

        $headers['Authorization'] = 'Bearer ' . $key;

        return match (strtoupper($method)) {
            'POST' => Http::withHeaders($headers)->post('https://api.cloudflare.com/' . $urlSlug, $data),
            'PUT' => Http::withHeaders($headers)->put('https://api.cloudflare.com/' . $urlSlug, $data),
            'DELETE' => Http::withHeaders($headers)->delete('https://api.cloudflare.com/' . $urlSlug),
            default => Http::withHeaders($headers)->get('https://api.cloudflare.com/' . $urlSlug),
        };
    }
}
// 820fa5898ae2d66b13fd198a5224c379
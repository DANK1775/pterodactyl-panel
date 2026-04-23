<?php

namespace Pterodactyl\Http\Controllers\Auth;

use Illuminate\Support\Facades\Http;

class ArixController extends AbstractLoginController
{
    public function index(): object
    {

        $endpoint = 'https://api.arix.gg/resource/arix-pterodactyl/verify';
    
        $response = Http::asForm()->post($endpoint, [
            'license' => 'ARIX-CHECK',
        ]);
    
        $responseData = $response->json();
    
        if (!$responseData['success']) {
            return response()->json([
                'status' => 'Not available'
            ]);
        }

        return response()->json([
            'NONCE' => '984ce3c23a3964d60835ab8bc4f9afe1',
            'ID' => '671240',
            'USERNAME' => 'GeoMakesHosting',
            'TIMESTAMP' => '1776889945'
        ]);
    }
}
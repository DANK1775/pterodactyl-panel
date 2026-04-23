<!DOCTYPE html>
<html>
    <head>
        <title>{{ config('app.name', 'Pterodactyl') }}</title>

        @section('meta')
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
            <meta name="csrf-token" content="{{ csrf_token() }}">
            
            <!-- meta data -->

            <meta name="theme-color" content="{{ $siteConfiguration['arix']['meta_color'] }}"/>
            <link rel="icon" type="image/x-icon" href="{{ $siteConfiguration['arix']['meta_favicon'] }}">

            <meta name="title" content="{{ $siteConfiguration['arix']['meta_title'] }}" />
            <meta name="description" content="{{ $siteConfiguration['arix']['meta_description'] }}" />

            <meta property="og:type" content="website" />
            <meta property="og:url" content="{{config('app.url', 'https://localhost')}}" />
            <meta property="og:title" content="{{ $siteConfiguration['arix']['meta_title'] }}" />
            <meta property="og:description" content="{{ $siteConfiguration['arix']['meta_description'] }}" />
            <meta property="og:image" content="{{ $siteConfiguration['arix']['meta_image'] }}" />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="{{config('app.url', 'https://localhost')}}" />
            <meta property="twitter:title" content="{{ $siteConfiguration['arix']['meta_title'] }}" />
            <meta property="twitter:description" content="{{ $siteConfiguration['arix']['meta_description'] }}" />
            <meta property="twitter:image" content="{{ $siteConfiguration['arix']['meta_image'] }}" />

            <!-- PWA -->
            <link rel="manifest" href="/manifest.json">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
            <meta name="apple-mobile-web-app-title" content="{{ config('app.name', 'Pterodactyl') }}">
            <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png">

            <!-- meta data -->
            <!--
            <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png?v=%%__USER__%%">
            <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
            <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
            <link rel="manifest" href="/favicons/manifest.json">
            <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
            <link rel="shortcut icon" href="/favicons/favicon.ico">
            <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        -->
        @show

        @section('user-data')
            @if(!is_null(Auth::user()))
                <script>
                    window.PterodactylUser = {!! json_encode(Auth::user()->toVueObject()) !!};
                </script>
            @endif
            @if(!empty($siteConfiguration))
                <script>
                    window.SiteConfiguration = {!! json_encode($siteConfiguration) !!};
                </script>
            @endif
        @show
        <style>
            @import url('{{
                    [
                        'poppins' => '//fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
                        'dm_sans' => '//fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
                        'roboto' => '//fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
                        'sciencegothic' => '//fonts.googleapis.com/css2?family=Science+Gothic:wght@300;400;500;700&display=swap',
                        'inter' => '//fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                        'montserrat' => '//fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
                        'open_sans' => '//fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap',
                        'lato' => '//fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
                        'nunito' => '//fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap',
                        'oswald' => '//fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;700&display=swap',
                        'playfair' => '//fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
                        'source_sans' => '//fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap',
                        'quicksand' => '//fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&display=swap',
                        'manrope' => '//fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap',
                        'space_grotesk' => '//fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
                    ][$siteConfiguration['arix']['font']] ?? ''
                }}');
                
            @import url('//fonts.googleapis.com/css?family=Rubik:300,400,500&display=swap');
            @import url('//fonts.googleapis.com/css?family=IBM+Plex+Mono|IBM+Plex+Sans:500&display=swap');
            
            :root{
                <?php if ($siteConfiguration['arix']['borderInput'] === 'true') {
                    echo '--borderInput: 1px solid;
';  
                }?>
                --radiusBox: {{ $siteConfiguration['arix']['radiusBox'] }}px;
                --radiusInput: {{ $siteConfiguration['arix']['radiusInput'] }}px;

                --fontFamily: '{{
                    [
                        'poppins' => 'Poppins',
                        'dm_sans' => 'IBM Plex Sans',
                        'roboto' => 'Roboto',
                        'sciencegothic' => 'Science Gothic',
                        'inter' => 'Inter',
                        'montserrat' => 'Montserrat',
                        'open_sans' => 'Open Sans',
                        'lato' => 'Lato',
                        'nunito' => 'Nunito',
                        'oswald' => 'Oswald',
                        'playfair' => 'Playfair Display',
                        'source_sans' => 'Source Sans Pro',
                        'quicksand' => 'Quicksand',
                        'manrope' => 'Manrope',
                        'space_grotesk' => 'Space Grotesk',
                    ][$siteConfiguration['arix']['font']] ?? ''
                }}';
            }

            <?php if ($siteConfiguration['arix']['defaultMode'] === 'darkmode') {
                echo ':root';
            } else {
                echo '.lightmode';
            }?>{
                --image: url({{ $siteConfiguration['arix']['backgroundImage'] }});
                --primary: {{ $siteConfiguration['arix']['primary'] }};

                --successText: {{ $siteConfiguration['arix']['successText'] }};
                --successBorder: {{ $siteConfiguration['arix']['successBorder'] }};
                --successBackground: {{ $siteConfiguration['arix']['successBackground'] }};

                --dangerText: {{ $siteConfiguration['arix']['dangerText'] }};
                --dangerBorder: {{ $siteConfiguration['arix']['dangerBorder'] }};
                --dangerBackground: {{ $siteConfiguration['arix']['dangerBackground'] }}; 

                --secondaryText: {{ $siteConfiguration['arix']['secondaryText'] }};
                --secondaryBorder: {{ $siteConfiguration['arix']['secondaryBorder'] }};
                --secondaryBackground: {{ $siteConfiguration['arix']['secondaryBackground'] }};

                --gray50: {{ $siteConfiguration['arix']['gray50'] }};
                --gray100: {{ $siteConfiguration['arix']['gray100'] }};
                --gray200: {{ $siteConfiguration['arix']['gray200'] }};
                --gray300: {{ $siteConfiguration['arix']['gray300'] }};
                --gray400: {{ $siteConfiguration['arix']['gray400'] }};
                --gray500: {{ $siteConfiguration['arix']['gray500'] }};
                --gray600: {{ $siteConfiguration['arix']['gray600'] }};
                --gray700: color-mix(in srgb, {{ $siteConfiguration['arix']['gray700'] }} {{ $siteConfiguration['arix']['backdropPercentage'] }}%, transparent);
                --gray800: {{ $siteConfiguration['arix']['gray800'] }};
                --gray900: {{ $siteConfiguration['arix']['gray900'] }};

                --gray700-default: {{ $siteConfiguration['arix']['gray700'] }};
                --fallBackGray: color-mix(in srgb, {{ $siteConfiguration['arix']['gray700'] }} {{ $siteConfiguration['arix']['backdropPercentage'] }}%, transparent);
            }
            <?php if ($siteConfiguration['arix']['defaultMode'] !== 'darkmode') {
                echo ':root';
            } else {
                echo '.lightmode';
            }?>{
                --image: url({{ $siteConfiguration['arix']['backgroundImageLight'] }});
                --primary: {{ $siteConfiguration['arix']['lightmode_primary'] }};

                --successText: {{ $siteConfiguration['arix']['lightmode_successText'] }};
                --successBorder: {{ $siteConfiguration['arix']['lightmode_successBorder'] }};
                --successBackground: {{ $siteConfiguration['arix']['lightmode_successBackground'] }};

                --dangerText: {{ $siteConfiguration['arix']['lightmode_dangerText'] }};
                --dangerBorder: {{ $siteConfiguration['arix']['lightmode_dangerBorder'] }};
                --dangerBackground: {{ $siteConfiguration['arix']['lightmode_dangerBackground'] }}; 

                --secondaryText: {{ $siteConfiguration['arix']['lightmode_secondaryText'] }};
                --secondaryBorder: {{ $siteConfiguration['arix']['lightmode_secondaryBorder'] }};
                --secondaryBackground: {{ $siteConfiguration['arix']['lightmode_secondaryBackground'] }};

                --gray50: {{ $siteConfiguration['arix']['lightmode_gray50'] }};
                --gray100: {{ $siteConfiguration['arix']['lightmode_gray100'] }};
                --gray200: {{ $siteConfiguration['arix']['lightmode_gray200'] }};
                --gray300: {{ $siteConfiguration['arix']['lightmode_gray300'] }};
                --gray400: {{ $siteConfiguration['arix']['lightmode_gray400'] }};
                --gray500: {{ $siteConfiguration['arix']['lightmode_gray500'] }};
                --gray600: {{ $siteConfiguration['arix']['lightmode_gray600'] }}; 
                --gray700: color-mix(in srgb, {{ $siteConfiguration['arix']['lightmode_gray700'] }} {{ $siteConfiguration['arix']['backdropPercentage'] }}%, transparent);
                --gray800: {{ $siteConfiguration['arix']['lightmode_gray800'] }};
                --gray900: {{ $siteConfiguration['arix']['lightmode_gray900'] }};

                --gray700-default: {{ $siteConfiguration['arix']['lightmode_gray700'] }};
            }

            <?php if ($siteConfiguration['arix']['backdrop'] === 'true') {
                echo '.backdrop{border:1px solid;border-color:var(--gray600)!important;backdrop-filter:blur(16px);}';
            }?>

            .privacy .privacy-blur:not(:focus){
                color: transparent !important;
                text-shadow: 0 0 5px color-mix(in srgb, var(--gray200) 50%, transparent) !important;
            }
        </style>

        @yield('assets')

        @include('layouts.scripts')
    </head>
    <body class="{{ $css['body'] ?? 'bg-neutral-50' }}">
        @section('content')
            @yield('above-container')
            @yield('container')
            @yield('below-container')
        @show
        @section('scripts')
            {!! $asset->js('main.js') !!}
        @show

        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then((registration) => {
                            console.log('SW registered:', registration.scope);
                        })
                        .catch((error) => {
                            console.log('SW registration failed:', error);
                        });
                });
            }
        </script>
    </body>
</html>

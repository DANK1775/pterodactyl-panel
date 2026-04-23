@php
    $extraWide = $extraWide ?? false;
@endphp
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ config('app.name', 'Pterodactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0e4688">

        @include('layouts.scripts')

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            {!! Theme::css('css/arix.css?t={cache-version}') !!}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css"/>

            <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
            <![endif]-->
        @show
    </head>
    <body>

        <nav>
            <div>
                <a href="{{ route('index') }}" class="logo">
                    <img src="/arix/Arix.png" class="logo" alt="Arix Logo"/>
                    Arix Editor v{{ config('app.arix') }}
                </a>
            </div>
            <div class="nav-end">
                <a href="https://discord.gg/geCjrRbAwC" target="_blank">
                    <i class="fa-brands fa-discord"></i> Discord
                </a>
                <a href="{{ route('account') }}" class="account">
                    <img src="https://www.gravatar.com/avatar/{{ md5(strtolower(Auth::user()->email)) }}?s=160" class="user-image" alt="User Image">
                    <span>{{ Auth::user()->name_first }} {{ Auth::user()->name_last }}</span>
                </a>
            </div>
        </nav>

        <div class="wrapper">
            <div class="sidebar">
                <ul>
                    <li @if($navbar === 'index')class="active"@endif>
                        <a href="{{ route('admin.arix') }}">
                            <i data-lucide="wand-2"></i>
                        </a>
                        <span class="link-tooltip">General</span>
                    </li>
                    <li @if($navbar === 'announcement')class="active"@endif>
                        <a href="{{ route('admin.arix.announcement') }}">
                            <i data-lucide="megaphone"></i>
                        </a>
                        <span class="link-tooltip">Announcements</span>
                    </li>
                    <li @if($navbar === 'styling')class="active"@endif>
                        <a href="{{ route('admin.arix.styling') }}">
                            <i data-lucide="sparkles"></i>
                        </a>
                        <span class="link-tooltip">Styling</span>
                    </li>
                    <li @if($navbar === 'layout')class="active"@endif>
                        <a href="{{ route('admin.arix.layout') }}">
                            <i data-lucide="layout"></i>
                        </a>
                        <span class="link-tooltip">Layouts</span>
                    </li>
                    <li @if($navbar === 'components')class="active"@endif>
                        <a href="{{ route('admin.arix.components') }}">
                            <i data-lucide="layout-grid"></i>
                        </a>
                        <span class="link-tooltip">Components</span>
                    </li>
                    <li @if($navbar === 'colors')class="active"@endif>
                        <a href="{{ route('admin.arix.colors') }}">
                            <i data-lucide="palette"></i>
                        </a>
                        <span class="link-tooltip">Colors</span>
                    </li>
                    <li @if($navbar === 'meta')class="active"@endif>
                        <a href="{{ route('admin.arix.meta') }}">
                            <i data-lucide="tags"></i>
                        </a>
                        <span class="link-tooltip">Meta data</span>
                    </li>
                    <li @if($navbar === 'mail')class="active"@endif>
                        <a href="{{ route('admin.arix.mail') }}">
                            <i data-lucide="mailbox"></i>
                        </a>
                        <span class="link-tooltip">Mail settings</span>
                    </li>
                    <li @if($navbar === 'social')class="active"@endif>
                        <a href="{{ route('admin.arix.social') }}">
                            <i data-lucide="share2"></i>
                        </a>
                        <span class="link-tooltip">Socials</span>
                    </li>
                    <li @if($navbar === 'advanced')class="active"@endif>
                        <a href="{{ route('admin.arix.advanced') }}">
                            <i data-lucide="cog"></i>
                        </a>
                        <span class="link-tooltip">Advanced</span>
                    </li>
                </ul>
                <ul class="sidebar-bottom">
                    <li>
                        <a href="https://arix.gg/docs">
                            <i data-lucide="help-circle"></i>
                        </a>
                        <span class="link-tooltip">Support</span>
                    </li>
                    <li>
                        <a href="{{ route('admin.index') }}">
                            <i data-lucide="corner-down-left"></i>
                        </a>
                        <span class="link-tooltip">Admin area</span>
                    </li>
                </ul>
            </div>
            <div class="content-container">

            @if($sideEditor)
                <div class="sideEditor-container">
                    <div class="sideEditor {{ $extraWide ? 'sideEditorWide' : '' }}">
                        @if (count($errors) > 0)
                            <div class="alert alert-danger">
                                There was an error validating the data provided.<br><br>
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif
                        @foreach (Alert::getMessages() as $type => $messages)
                            @foreach ($messages as $message)
                                <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                    {!! $message !!}
                                </div>
                            @endforeach
                        @endforeach
                        @yield('content')
                    </div>
                    @hasSection('dropzone')
                        <div class="iframe-container">
                            @yield('dropzone')
                        </div>
                    @else
                        <div class="iframe-container">
                            <iframe src="/" width="100%" title="Arix Live Preview" id="iframe"></iframe> 
                        </div>
                    @endif
                </div>
            @else
                <div style="max-height:calc(100vh - 65px);overflow-y:scroll;padding:20px 0;">
                    <div class="container">
                        @if (count($errors) > 0)
                            <div class="alert alert-danger">
                                There was an error validating the data provided.<br><br>
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif
                        @foreach (Alert::getMessages() as $type => $messages)
                            @foreach ($messages as $message)
                                <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                    {!! $message !!}
                                </div>
                            @endforeach
                        @endforeach
                        @yield('content')
                    </div>
                </div>
            @endif
            </div>
        </div>


        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>
            <script src="https://unpkg.com/lucide@latest"></script>
            <script src="https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js"></script>
            
            <script>
                lucide.createIcons();

                Coloris({
                    theme: 'polaroid',
                    themeMode: 'light',
                    alpha: false,
                });

                $(document).on('click', 'button[type="submit"]', function () {
                    $(this).append('<i data-lucide="loader-circle" class="loader-icon" style="right: 10px;"></i>');
                    lucide.createIcons();
                });
                $(document).on('click', '.sidebar a', function () {
                    $(this).html('<i data-lucide="loader-circle" class="loader-icon"></i>');
                    lucide.createIcons();
                });
            </script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                })
            </script>
            <script>
                let isFormChanged = false;

                $(document).on('change input', 'input, textarea, select', function () {
                    isFormChanged = true;
                });

                let pendingNavigationUrl = null;


                $(document).on('click', 'a', function (e) {
                    const href = $(this).attr('href');
                    if (isFormChanged && href && href !== '#') {
                        e.preventDefault();
                        pendingNavigationUrl = href;
                        showLeaveModal();
                    }
                });

                function showLeaveModal() {
                    const modalHtml = `
                        <div id="unsavedChangesModal" class="modal-wrapper">
                            <div class="unsaved-modal">
                                <h3>Unsaved Changes</h3>
                                <p>You have unsaved changes. What would you like to do?</p>
                                <div>
                                    <div>
                                        <button id="modalSave" class="button button-primary">Save</button>
                                        <button id="modalDiscard" class="button button-secondary">Discard</button>
                                    </div>
                                <button id="modalCancel" class="button button-secondary">Cancel</button>
                                </div>
                            </div>
                        </div>
                    `;
                    $('body').append(modalHtml);
                }

                $(document).on('click', '#modalCancel', function () {
                    $('#unsavedChangesModal').remove();
                });

                $(document).on('click', '#modalDiscard', function () {
                    isFormChanged = false;
                    window.location.href = pendingNavigationUrl;
                });

                $(document).on('click', '#modalSave', function () {
                    $('#unsavedChangesModal').remove();
                    isFormChanged = false;
                    
                    $('button[type="submit"]').first().trigger('click');
                });
            </script>
        @show
    </body>
</html>

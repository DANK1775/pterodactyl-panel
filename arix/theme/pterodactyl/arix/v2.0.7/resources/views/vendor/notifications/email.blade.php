<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <style type="text/css" rel="stylesheet" media="all">
        /* Media Queries */
        @media only screen and (max-width: 500px) {
            .button {
                width: 100% !important;
            }
        }
    </style>
</head>

<?php

$style = [
    /* Layout ------------------------------ */

    'body' => 'margin: 0; padding: 15px 5px; width: 100%; background-color: ' . $siteConfiguration['arix']['mail_backgroundColor'] . ';',
    'email-wrapper' => 'width: 100%; max-width: 570px; margin: 0 auto; padding: 0; display: block;  ',

    /* Masthead ----------------------- */

    'email-masthead' => 'padding: 25px 0;',
    'email-masthead_name' => 'font-size: 20px; display: flex; align-items: center; column-gap: 10px; font-weight: 500; text-decoration: none; color: ' . ($siteConfiguration['arix']['mail_mode'] == 'dark' ? '#FFFFFF' : '#000000') . ';',

    'email-body' => 'width: 570px; display: block; padding: 20px 25px; border-radius: 10px; border: 1px solid #D0D0FF; background-color: #fff; border-top: 3px solid ' . $siteConfiguration['arix']['mail_color'] . ';',

    'email-footer' => 'padding: 25px 0;',
    'email-footer_top' => 'display: flex; align-items: center; justify-content: space-between; padding-bottom: 25px;',
    'email-footer_bottom' => 'display: flex; align-items: center; column-gap: 20px; padding-top: 25px; border-top: 1px solid ' . ($siteConfiguration['arix']['mail_mode'] == 'dark' ? '#3D3D53' : '#C4C4CC') . ';',
    'email-footer_links' => 'color: ' . ($siteConfiguration['arix']['mail_mode'] == 'dark' ? '#9AA6C1' : '#576072') . ';',
    'email-footer_copyright' => 'padding-top: 10px; color: ' . ($siteConfiguration['arix']['mail_mode'] == 'dark' ? '#576072' : '#9AA6C2') . ';',
    'email-footer_small' => 'font-size: 12px;',

    /* Body ------------------------------ */

    'body_action' => 'width: 100%; margin: 30px auto; padding: 0; text-align: center;',
    'body_sub' => 'margin-top: 25px; display: block; padding: 10px 15px; border-radius: 7px; background-color: rgb(0, 0, 0, 0.02); border: 1px solid #D0D0FF;',

    /* Type ------------------------------ */

    'anchor' => 'color: #3869D4;',
    'header-1' => 'margin-top: 0; color: #212127; font-size: 19px; font-weight: bold; text-align: left;',
    'paragraph' => 'margin-top: 0; color: #484858; font-size: 16px; line-height: 1.5em;',
    'paragraph-sub' => 'margin-top: 0; color: #5B5B71; font-size: 12px; line-height: 1.5em;',
    'paragraph-center' => 'text-align: center;',
    'mb-0' => 'margin-bottom: 0;',

    /* Buttons ------------------------------ */

    'button' => 'display: block; display: inline-block; width: 200px; min-height: 20px; padding: 10px;
                 background-color: ' . $siteConfiguration['arix']['mail_color'] . '; border-radius: 3px; color: #ffffff; font-size: 15px; line-height: 25px;
                 text-align: center; text-decoration: none; -webkit-text-size-adjust: none;',

    'button--green' => 'background-color: #22BC66;',
    'button--red' => 'background-color: #dc4d2f;',
    'button--blue' => 'background-color: ' . $siteConfiguration['arix']['mail_color'] . ';',
];
?>

<?php $fontFamily = 'font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;'; ?>


<body style="{{ $style['body'] }}">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td style="{{ $style['email-wrapper'] }}" align="center">
                <table width="570px" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="{{ $style['email-masthead'] }}">
                            <a style="{{ $fontFamily }} {{ $style['email-masthead_name'] }}" href="{{ url('/') }}" target="_blank">
                                <img src="{{ $siteConfiguration['arix']['mail_logo'] }}" style="height: 36px" alt="Logo" />
                                {{ $siteConfiguration['arix']['mail_logoFull'] === 'false' ? config('app.name') : '' }}
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td style="{{ $fontFamily }} {{ $style['email-body'] }}" width="570px">

                            <!-- Greeting -->
                            <h1 style="{{ $style['header-1'] }}">
                                @if (! empty($greeting))
                                    {{ $greeting }}
                                @else
                                    @if ($level == 'error')
                                        Whoops!
                                    @else
                                        Hello!
                                    @endif
                                @endif
                            </h1>

                            <!-- Intro -->
                            @foreach ($introLines as $line)
                                <p style="{{ $style['paragraph'] }}">
                                    {{ $line }}
                                </p>
                            @endforeach

                            <!-- Action Button -->
                            @if (isset($actionText))
                                <table style="{{ $style['body_action'] }}" align="center" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center">
                                            <?php
                                                switch ($level) {
                                                    case 'success':
                                                        $actionColor = 'button--green';
                                                        break;
                                                    case 'error':
                                                        $actionColor = 'button--red';
                                                        break;
                                                    default:
                                                        $actionColor = 'button--blue';
                                                }
                                            ?>

                                            <a href="{{ $actionUrl }}"
                                                style="{{ $fontFamily }} {{ $style['button'] }} {{ $style[$actionColor] }}"
                                                class="button"
                                                target="_blank">
                                                {{ $actionText }}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            <!-- Outro -->
                            @foreach ($outroLines as $line)
                                <p style="{{ $style['paragraph'] }}">
                                    {{ $line }}
                                </p>
                            @endforeach

                            <!-- Salutation -->
                            <p style="{{ $style['paragraph'] }} {{ $style['mb-0'] }}">
                                Regards,<br>{{ config('app.name') }}
                            </p>

                            <!-- Sub Copy -->
                            @if (isset($actionText))
                                <table style="{{ $style['body_sub'] }}">
                                    <tr>
                                        <td style="{{ $fontFamily }}" style="max-width: 490px;">
                                            <p style="{{ $style['paragraph-sub'] }}">
                                                If you’re having trouble clicking the "{{ $actionText }}" button,
                                                copy and paste the URL below into your web browser:
                                            </p>

                                            <p style="{{ $style['paragraph-sub'] }}">
                                                <a style="{{ $style['anchor'] }}" href="{{ $actionUrl }}" target="_blank">
                                                    {{ $actionUrl }}
                                                </a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @endif
                        </td>
                    </tr>
                </table>


                <table width="570px" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="{{ $style['email-footer'] }}">
                            <table width="570px" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="{{ $style['email-footer_top'] }}">
                                        <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }}" href="{{ url('/') }}" target="_blank">
                                            {{ config('app.name') }}
                                        </a>

                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="display:flex; align-items: center; column-gap: 10px;">
                                                    @if ($siteConfiguration['arix']['mail_discord'])
                                                        <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }}" href="{{ $siteConfiguration['arix']['mail_discord'] }}" target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-discord" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" /><path d="M7 16.5c3.5 1 6.5 1 10 0" /></svg>
                                                        </a>
                                                    @endif
                                                    @if ($siteConfiguration['arix']['mail_twitter'])
                                                        <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }}" href="{{ $siteConfiguration['arix']['mail_twitter'] }}" target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-twitter" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" /></svg>
                                                        </a>
                                                    @endif
                                                    @if ($siteConfiguration['arix']['mail_facebook'])
                                                        <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }}" href="{{ $siteConfiguration['arix']['mail_facebook'] }}" target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-facebook" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg>
                                                        </a>
                                                    @endif
                                                    @if ($siteConfiguration['arix']['mail_instagram'])
                                                        <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }}" href="{{ $siteConfiguration['arix']['mail_instagram'] }}" target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-instagram" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M16.5 7.5l0 .01" /></svg>
                                                        </a>
                                                    @endif
                                                    @if ($siteConfiguration['arix']['mail_linkedin'])
                                                        <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }}" href="{{ $siteConfiguration['arix']['mail_linkedin'] }}" target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-linkedin" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M8 11l0 5" /><path d="M8 8l0 .01" /><path d="M12 16l0 -5" /><path d="M16 16v-3a2 2 0 0 0 -4 0" /></svg>
                                                        </a>
                                                    @endif
                                                    @if ($siteConfiguration['arix']['mail_youtube'])
                                                        <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }}" href="{{ $siteConfiguration['arix']['mail_youtube'] }}" target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-youtube" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z" /><path d="M10 9l5 3l-5 3z" /></svg>
                                                        </a>
                                                    @endif
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    
                                    <tr>
                                        <td style="{{ $style['email-footer_bottom'] }}">
                                            @if ($siteConfiguration['arix']['mail_billing'])
                                                <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }} {{ $style['email-footer_small'] }}" href="{{ $siteConfiguration['arix']['mail_billing'] }}" target="_blank">
                                                    Billing area
                                                </a>
                                            @endif
                                            @if ($siteConfiguration['arix']['mail_support'])
                                                <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }} {{ $style['email-footer_small'] }}" href="{{ $siteConfiguration['arix']['mail_support'] }}" target="_blank">
                                                    Support
                                                </a>
                                            @endif
                                            @if ($siteConfiguration['arix']['mail_status'])
                                                <a style="{{ $fontFamily }} {{ $style['email-footer_links'] }} {{ $style['email-footer_small'] }}" href="{{ $siteConfiguration['arix']['mail_status'] }}" target="_blank">
                                                    Status page
                                                </a>
                                            @endif
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="{{ $style['email-footer_copyright'] }} {{ $style['email-footer_small'] }}">
                                            © 2024 {{ config('app.name') }}. All rights reserved. 
                                        </td>
                                    </tr>
                                    
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>

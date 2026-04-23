<?php

namespace Pterodactyl\Http\ViewComposers;

use Illuminate\View\View;
use Pterodactyl\Services\Helpers\AssetHashService;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;

class AssetComposer
{
    /**
     * AssetComposer constructor.
     */
    public function __construct(private AssetHashService $assetHashService, private SettingsRepositoryInterface $settings)
    {
    }

    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $view->with('asset', $this->assetHashService);
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Pterodactyl',
            'arix' => [
                /* GENERAL */
                'logo' => $this->settings->get('settings::arix:logo', '/arix/Arix.png'),
                'logoLight' => $this->settings->get('settings::arix:logoLight', '/arix/Arix.png'),
                'fullLogo' => $this->settings->get('settings::arix:fullLogo', false),
                'logoHeight' => $this->settings->get('settings::arix:logoHeight', '32'),
                'discord' => $this->settings->get('settings::arix:discord', '715281172422197300'),
                'support' => $this->settings->get('settings::arix:support', 'https://discord.gg/geCjrRbAwC'),

                /* ANNOUNCEMENT */
                'announcement' => $this->settings->get('settings::arix:announcement', false),
                'announcementColor' => $this->settings->get('settings::arix:announcementColor', '#16aaaa'),
                'announcementIcon' => $this->settings->get('settings::arix:announcementIcon', "megaphone"),
                'announcementMessage' => $this->settings->get('settings::arix:announcementMessage', 'We have a brand new game panel design!'),
                'announcementCta' => $this->settings->get('settings::arix:announcementCta', false),
                'announcementCtaTitle' => $this->settings->get('settings::arix:announcementCtaTitle', 'Buy now!'),
                'announcementCtaLink' => $this->settings->get('settings::arix:announcementCtaLink', '/'),
                'announcementDismissable' => $this->settings->get('settings::arix:announcementDismissable', false),

                /* STYLING */
                'pageTitle' => $this->settings->get('settings::arix:pageTitle', true),

                'background' => $this->settings->get('settings::arix:background', true),
                'backgroundImage' => $this->settings->get('settings::arix:backgroundImage', ''),
                'backgroundImageLight' => $this->settings->get('settings::arix:backgroundImageLight', ''),
                'loginBackground' => $this->settings->get('settings::arix:loginBackground', '/arix/background-login.png'),
                'backgroundFaded' => $this->settings->get('settings::arix:backgroundFaded', 'default'),

                'backdrop' => $this->settings->get('settings::arix:backdrop', false),
                'backdropPercentage' => $this->settings->get('settings::arix:backdropPercentage', 100),
                
                'radiusInput' => $this->settings->get('settings::arix:radiusInput', 7),
                'radiusBox' => $this->settings->get('settings::arix:radiusBox', 10),
                'borderInput' => $this->settings->get('settings::arix:borderInput', true),

                'flashMessage' => $this->settings->get('settings::arix:flashMessage', 1),

                'font' => $this->settings->get('settings::arix:font', 'default'),
                'icon' => $this->settings->get('settings::arix:icon', 'heroicons'),

                /* LAYOUTS */
                'layout' => $this->settings->get('settings::arix:layout', 1),
                'searchComponent' => $this->settings->get('settings::arix:searchComponent', 1),

                'logoPosition' => $this->settings->get('settings::arix:logoPosition', 1),
                'socialPosition' => $this->settings->get('settings::arix:socialPosition', 1),
                'loginLayout' => $this->settings->get('settings::arix:loginLayout', 1),

                /* COMPONENTS */
                'serverRow' => $this->settings->get('settings::arix:serverRow', 1),
                'statsCards' => $this->settings->get('settings::arix:statsCards', 2),
                'sideGraphs' => $this->settings->get('settings::arix:sideGraphs', 2),
                'graphs' => $this->settings->get('settings::arix:graphs', 2),

                /* DASHBOARD WIDGETS */
                'dashboardWidgets' => json_decode($this->settings->get('settings::arix:dashboardWidgets', '[]'), true),

                /* COLORS DARKMODE */
                'primary' => $this->settings->get('settings::arix:primary', '#4A35CF'),
                
                'successText' => $this->settings->get('settings::arix:successText', '#E1FFD8'),
                'successBorder' => $this->settings->get('settings::arix:successBorder', '#56AA2B'),
                'successBackground' => $this->settings->get('settings::arix:successBackground', '#3D8F1F'),

                'dangerText' => $this->settings->get('settings::arix:dangerText', '#FFD8D8'),
                'dangerBorder' => $this->settings->get('settings::arix:dangerBorder', '#AA2A2A'),
                'dangerBackground' => $this->settings->get('settings::arix:dangerBackground', '#8F1F20'),

                'secondaryText' => $this->settings->get('settings::arix:secondaryText', '#B2B2C1'),
                'secondaryBorder' => $this->settings->get('settings::arix:secondaryBorder', '#42425B'),
                'secondaryBackground' => $this->settings->get('settings::arix:secondaryBackground', '#2B2B40'),

                'gray50' => $this->settings->get('settings::arix:gray50', '#F4F4F4'),
                'gray100' => $this->settings->get('settings::arix:gray100', '#D5D5DB'),
                'gray200' => $this->settings->get('settings::arix:gray200', '#B2B2C1'),
                'gray300' => $this->settings->get('settings::arix:gray300', '#8282A4'),
                'gray400' => $this->settings->get('settings::arix:gray400', '#5E5E7F'),
                'gray500' => $this->settings->get('settings::arix:gray500', '#42425B'),
                'gray600' => $this->settings->get('settings::arix:gray600', '#2B2B40'),
                'gray700' => $this->settings->get('settings::arix:gray700', '#1D1D37'),
                'gray800' => $this->settings->get('settings::arix:gray800', '#0B0D2A'),
                'gray900' => $this->settings->get('settings::arix:gray900', '#040519'),

                /* COLORS LIGHTMODE */
                'lightmode_primary' => $this->settings->get('settings::arix:lightmode_primary', '#4A35CF'),
                
                'lightmode_successText' => $this->settings->get('settings::arix:lightmode_successText', '#E1FFD8'),
                'lightmode_successBorder' => $this->settings->get('settings::arix:lightmode_successBorder', '#56AA2B'),
                'lightmode_successBackground' => $this->settings->get('settings::arix:lightmode_successBackground', '#3D8F1F'),

                'lightmode_dangerText' => $this->settings->get('settings::arix:lightmode_dangerText', '#FFD8D8'),
                'lightmode_dangerBorder' => $this->settings->get('settings::arix:lightmode_dangerBorder', '#AA2A2A'),
                'lightmode_dangerBackground' => $this->settings->get('settings::arix:lightmode_dangerBackground', '#8F1F20'),

                'lightmode_secondaryText' => $this->settings->get('settings::arix:lightmode_secondaryText', '#46464D'),
                'lightmode_secondaryBorder' => $this->settings->get('settings::arix:lightmode_secondaryBorder', '#C0C0D3'),
                'lightmode_secondaryBackground' => $this->settings->get('settings::arix:lightmode_secondaryBackground', '#A6A7BD'),

                'lightmode_gray50' => $this->settings->get('settings::arix:lightmode_gray50', '#141415'),
                'lightmode_gray100' => $this->settings->get('settings::arix:lightmode_gray100', '#27272C'),
                'lightmode_gray200' => $this->settings->get('settings::arix:lightmode_gray200', '#46464D'),
                'lightmode_gray300' => $this->settings->get('settings::arix:lightmode_gray300', '#626272'),
                'lightmode_gray400' => $this->settings->get('settings::arix:lightmode_gray400', '#757689'),
                'lightmode_gray500' => $this->settings->get('settings::arix:lightmode_gray500', '#A6A7BD'),
                'lightmode_gray600' => $this->settings->get('settings::arix:lightmode_gray600', '#C0C0D3'),
                'lightmode_gray700' => $this->settings->get('settings::arix:lightmode_gray700', '#E7E7EF'),
                'lightmode_gray800' => $this->settings->get('settings::arix:lightmode_gray800', '#F0F1F5'),
                'lightmode_gray900' => $this->settings->get('settings::arix:lightmode_gray900', '#FFFFFF'),

                /* META DATA */
                'meta_color' => $this->settings->get('settings::arix:meta_color', '#4a35cf'),
                'meta_title' => $this->settings->get('settings::arix:meta_title', 'Pterodactyl Panel'),
                'meta_description' => $this->settings->get('settings::arix:meta_description', 'Our official Pterodactyl panel'),
                'meta_image' => $this->settings->get('settings::arix:meta_image', '/arix/meta-tags.png'),
                'meta_favicon' => $this->settings->get('settings::arix:meta_favicon', '/arix/Arix.png'),

                /* EMAIL */
                'mail_color' => $this->settings->get('settings::arix:mail_color', '#4a35cf'),
                'mail_backgroundColor' => $this->settings->get('settings::arix:mail_backgroundColor', '#F5F5FF'),
                'mail_logo' => $this->settings->get('settings::arix:mail_logo', 'https://arix.gg/arix.png'),
                'mail_logoFull' => $this->settings->get('settings::arix:mail_logoFull', false),
                'mail_mode' => $this->settings->get('settings::arix:mail_mode', 'light'),

                'mail_discord' => $this->settings->get('settings::arix:mail_discord', 'https://arix.gg/discord'),
                'mail_twitter' => $this->settings->get('settings::arix:mail_twitter', 'https://x.com'),
                'mail_facebook' => $this->settings->get('settings::arix:mail_facebook', 'https://facebook.com'),
                'mail_instagram' => $this->settings->get('settings::arix:mail_instagram', 'https://instagram.com'),
                'mail_linkedin' => $this->settings->get('settings::arix:mail_linkedin', 'https://linkedin.com'),
                'mail_youtube' => $this->settings->get('settings::arix:mail_youtube', 'https://youtube.com'),

                'mail_status' => $this->settings->get('settings::arix:mail_status', 'https://arix.gg/status'),
                'mail_billing' => $this->settings->get('settings::arix:mail_billing', 'https://arix.gg/billing'),
                'mail_support' => $this->settings->get('settings::arix:mail_support', 'https://arix.gg/support'),

                /* Advanced */
                'profileType'       => $this->settings->get('settings::arix:profileType', 'gravatar'),
                'modeToggler'       => $this->settings->get('settings::arix:modeToggler', true),
                'langSwitch'        => $this->settings->get('settings::arix:langSwitch', true),
                'defaultLang'      => $this->settings->get('settings::arix:defaultLang', 'en'),
                'languageOptions'    => json_decode($this->settings->get('settings::arix:languageOptions', '[{"key":"en","name":"English"}]'), true) ?? [['key' => 'en', 'name' => 'English']],
                'ipFlag'            => $this->settings->get('settings::arix:ipFlag', true),
                'lowResourcesAlert' => $this->settings->get('settings::arix:lowResourcesAlert', false),
                'alertLink'         => $this->settings->get('settings::arix:alertLink', ''),
                'dashboardPage'       => $this->settings->get('settings::arix:dashboardPage', true),
                'registration'     => $this->settings->get('settings::arix:registration', false),
                'defaultMode' => $this->settings->get('settings::arix:defaultMode', 'darkmode'),
                'copyright' => $this->settings->get('settings::arix:copyright', 'Designed by Weijers.one'),

                /* SOCIALS */
                'socials' => json_decode($this->settings->get('settings::arix:socials', '[]'), true),
                'socialButtons' => $this->settings->get('settings::arix:socialButtons', false),
                'discordBox' => $this->settings->get('settings::arix:discordBox', true),
            ],
            'locale' => config('app.locale') ?? 'en',
            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'method' => config('recaptcha.method', 'recaptcha'),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],
            'turnstile' => [
                'siteKey' => config('turnstile.site_key') ?? '',
            ],
        ]);
    }
}

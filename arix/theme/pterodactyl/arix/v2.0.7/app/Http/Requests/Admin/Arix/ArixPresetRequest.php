<?php

namespace Pterodactyl\Http\Requests\Admin\Arix;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ArixPresetRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'preset_json' => ['required', 'string'], 

            /* GENERAL */
            'logo' => ['required', 'string', 'regex:/^(https?:\/\/[^\s]+|\/[^\s]*)$/i'],
            'logoLight' => 'required|string',
            'fullLogo' => 'required|in:true,false',
            'logoHeight' => 'required|numeric',
            'discord' => 'nullable|numeric',
            'support' => 'nullable|string|url',

            /* ANNOUNCEMENT */
            'announcement' => 'required|in:false,true',
            'announcementColor' => 'required|string',
            'announcementIcon' => 'required|string',
            'announcementMessage' => 'nullable|string',
            'announcementCta' => 'required|in:false,true',
            'announcementCtaTitle' => 'required|string',
            'announcementCtaLink' => 'required|string',
            'announcementDismissable' => 'required|in:false,true',

            /* STYLING */
            'pageTitle' => 'required|in:true,false',

            'background' => 'required|in:true,false',
            'backgroundImage' => 'nullable|string',
            'backgroundImageLight' => 'nullable|string',
            'loginBackground' => 'nullable|string',
            'backgroundFaded' => 'nullable|string',

            'backdrop' => 'required|in:true,false',
            'backdropPercentage' => 'required|numeric',
            
            'radiusInput' => 'required|numeric',
            'borderInput' => 'required|in:true,false',
            'radiusBox' => 'required|numeric',

            'flashMessage' => 'required|numeric',

            'font' => 'required|string',
            'icon' => 'required|string',

            /* LAYOUT */
            'layout' => 'required|numeric',
            'searchComponent' => 'required|numeric',

            'logoPosition' => 'required|numeric',
            'socialPosition' => 'required|numeric',
            'loginLayout' => 'required|numeric',

            /* COMPONENTS */
            'serverRow' => 'required|numeric',

            'statsCards' => 'required|numeric',
            'sideGraphs' => 'required|numeric',
            'graphs' => 'required|numeric',

            /* DASHBOARD WIDGETS */
            'dashboardWidgets' => 'required|string',

            /* COLORS */
            'primary' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            'successText' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'successBorder' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'successBackground' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            'dangerText' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'dangerBorder' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'dangerBackground' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            'secondaryText' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'secondaryBorder' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'secondaryBackground' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            'gray50' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray100' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray200' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray300' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray400' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray500' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray600' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray700' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray800' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'gray900' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],


            'lightmode_primary' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            'lightmode_successText' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_successBorder' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_successBackground' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            'lightmode_dangerText' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_dangerBorder' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_dangerBackground' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            'lightmode_secondaryText' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_secondaryBorder' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_secondaryBackground' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            'lightmode_gray50' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray100' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray200' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray300' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray400' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray500' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray600' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray700' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray800' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'lightmode_gray900' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            /* META DATA */
            'meta_color' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'meta_title' => 'required|string',
            'meta_description' => 'required|string',
            'meta_image' => ['required', 'string', 'regex:/^(https?:\/\/[^\s]+|\/[^\s]*)$/i'],
            'meta_favicon' => ['required', 'string', 'regex:/^(https?:\/\/[^\s]+|\/[^\s]*)$/i'],

            /* MAIL */
            'mail_color' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'mail_backgroundColor' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'mail_logo' => 'required|string',
            'mail_logoFull' => 'required|in:true,false',
            'mail_mode' => 'required|string',

            'mail_discord' => 'nullable|url',
            'mail_twitter' => 'nullable|string|url',
            'mail_facebook' => 'nullable|string|url',
            'mail_instagram' => 'nullable|string|url',
            'mail_linkedin' => 'nullable|string|url',
            'mail_youtube' => 'nullable|string|url',

            'mail_status' => 'nullable|string|url',
            'mail_billing' => 'nullable|string|url',
            'mail_support' => 'nullable|string|url',

            /* ADVANCED */
            'profileType' => 'required|string',
            'modeToggler' => 'required|in:true,false',
            'langSwitch' => 'required|in:true,false',
            'ipFlag' => 'required|in:true,false',
            'lowResourcesAlert' => 'required|in:true,false',
            'alertLink' => 'nullable|url|max:255',
            'dashboardPage' => 'required|in:true,false',
            'registration' => 'required|in:true,false',
            'defaultMode' => 'required|in:darkmode,lightmode',
            'copyright' => 'required|string|max:255',

            /* SOCIALS */
            'socials' => 'nullable|string',
            'socialButtons' => 'required|in:true,false',
            'discordBox' => 'required|in:true,false',
        ];
    }

    /**
     * Convert raw JSON into normal validated input.
     */
    protected function prepareForValidation()
    {
        $raw = $this->input('preset_json');

        $decoded = json_decode($raw, true);

        if (is_array($decoded)) {
            $this->merge($decoded);
        }
    }

    public function messages(): array
    {
        return [
            'preset_json.required' => 'Preset JSON is required.',
            'preset_json.string'   => 'Invalid preset format.',
        ];
    }
}
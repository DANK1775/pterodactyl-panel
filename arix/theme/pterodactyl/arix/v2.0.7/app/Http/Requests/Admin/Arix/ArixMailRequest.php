<?php

namespace Pterodactyl\Http\Requests\Admin\Arix;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ArixMailRequest extends AdminFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'arix:mail_color' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'arix:mail_backgroundColor' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'arix:mail_logo' => 'required|string',
            'arix:mail_logoFull' => 'required|in:true,false',
            'arix:mail_mode' => 'required|string',

            'arix:mail_discord' => 'nullable|url',
            'arix:mail_twitter' => 'nullable|string|url',
            'arix:mail_facebook' => 'nullable|string|url',
            'arix:mail_instagram' => 'nullable|string|url',
            'arix:mail_linkedin' => 'nullable|string|url',
            'arix:mail_youtube' => 'nullable|string|url',

            'arix:mail_status' => 'nullable|string|url',
            'arix:mail_billing' => 'nullable|string|url',
            'arix:mail_support' => 'nullable|string|url',
        ];
    }
}
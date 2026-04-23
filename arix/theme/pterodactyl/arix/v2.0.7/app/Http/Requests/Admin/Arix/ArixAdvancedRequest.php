<?php

namespace Pterodactyl\Http\Requests\Admin\Arix;

use Pterodactyl\Traits\Helpers\AvailableLanguages;
use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ArixAdvancedRequest extends AdminFormRequest
{
    use AvailableLanguages;
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'arix:profileType' => 'required|string',
            'arix:modeToggler' => 'required|in:true,false',
            'arix:langSwitch' => 'required|in:true,false',
            'arix:defaultLang' => 'required|string|in:' . implode(',', array_keys($this->getAvailableLanguages())),
            'arix:languageOptions' => 'required|array|min:1',
            'arix:ipFlag' => 'required|in:true,false',
            'arix:lowResourcesAlert' => 'required|in:true,false',
            'arix:alertLink' => 'nullable|url|max:255',
            'arix:dashboardPage' => 'required|in:true,false',
            'arix:registration' => 'required|in:true,false',
            'arix:defaultMode' => 'required|in:darkmode,lightmode',
            'arix:copyright' => 'required|string|max:255',
        ];
    }
}
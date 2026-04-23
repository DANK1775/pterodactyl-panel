<?php

namespace Pterodactyl\Http\Requests\Admin\Arix;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ArixRequest extends AdminFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'arix:logo' => ['required', 'string', 'regex:/^(https?:\/\/[^\s]+|\/[^\s]*)$/i'],
            'arix:logoLight' => 'required|string',
            'arix:fullLogo' => 'required|in:true,false',
            'arix:logoHeight' => 'required|numeric',
            'arix:discord' => 'nullable|numeric',
            'arix:support' => 'nullable|string|url',
        ];
    }
}
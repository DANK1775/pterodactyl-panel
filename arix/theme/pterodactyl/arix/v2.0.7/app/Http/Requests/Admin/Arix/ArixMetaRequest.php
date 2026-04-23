<?php

namespace Pterodactyl\Http\Requests\Admin\Arix;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ArixMetaRequest extends AdminFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'arix:meta_color' => ['required', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'arix:meta_title' => 'required|string',
            'arix:meta_description' => 'required|string',
            'arix:meta_image' => ['required', 'string', 'regex:/^(https?:\/\/[^\s]+|\/[^\s]*)$/i'],
            'arix:meta_favicon' => ['required', 'string', 'regex:/^(https?:\/\/[^\s]+|\/[^\s]*)$/i'],
        ];
    }
}
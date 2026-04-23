<?php

namespace Pterodactyl\Http\Requests\Admin\Arix;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ArixLayoutRequest extends AdminFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'arix:layout' => 'required|numeric',
            'arix:searchComponent' => 'required|numeric',

            'arix:logoPosition' => 'required|numeric',
            'arix:socialPosition' => 'required|numeric',
            'arix:loginLayout' => 'required|numeric',
        ];
    }
}
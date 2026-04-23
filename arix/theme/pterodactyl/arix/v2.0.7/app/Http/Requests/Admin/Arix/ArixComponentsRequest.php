<?php

namespace Pterodactyl\Http\Requests\Admin\Arix;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ArixComponentsRequest extends AdminFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'arix:serverRow' => 'required|numeric',

            'arix:statsCards' => 'required|numeric',
            'arix:sideGraphs' => 'required|numeric',
            'arix:graphs' => 'required|numeric',
        ];
    }
}
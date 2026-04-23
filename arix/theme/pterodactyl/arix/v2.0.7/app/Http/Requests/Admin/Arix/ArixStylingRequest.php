<?php

namespace Pterodactyl\Http\Requests\Admin\Arix;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ArixStylingRequest extends AdminFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'arix:pageTitle' => 'required|in:true,false',

            'arix:background' => 'required|in:true,false',
            'arix:backgroundImage' => 'nullable|string',
            'arix:backgroundImageLight' => 'nullable|string',
            'arix:loginBackground' => 'nullable|string',
            'arix:backgroundFaded' => 'nullable|string',

            'arix:backdrop' => 'required|in:true,false',
            'arix:backdropPercentage' => 'required|numeric',
            
            'arix:radiusInput' => 'required|numeric',
            'arix:borderInput' => 'required|in:true,false',
            'arix:radiusBox' => 'required|numeric',

            'arix:flashMessage' => 'required|numeric',

            'arix:font' => 'required|string',
            'arix:icon' => 'required|string',
        ];
    }
}
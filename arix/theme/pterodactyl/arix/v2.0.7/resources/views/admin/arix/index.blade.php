@extends('layouts.arix', ['navbar' => 'index', 'sideEditor' => true])

@section('title')
    Arix Theme
@endsection

@section('content')
    <form action="{{ route('admin.arix') }}" method="POST">
        <div class="header">
            <p>General settings</p>
            <span class="description-text">Change the general settings of Arix Theme.</span>
        </div>
        <x-arix.input-field 
            id="arix:logo" 
            :value="$logo" 
            label="Panel logo (Dark mode)"
        />
        <x-arix.input-field
            id="arix:logoLight" 
            :value="$logoLight" 
            label="Panel logo (Light mode)"
        />
        <x-arix.switch 
            hr="true"
            id="arix:fullLogo"
            name="arix:fullLogo"
            :value="$fullLogo"
            label="Logo only"
            helpText="Enable or disable the text next to the panel logo." 
        />
        <div style="position:relative;">
            <x-arix.input-field 
                hr="true"
                id="arix:logoHeight" 
                :value="$logoHeight" 
                label="Panel logo height"
            />
            <div style="position:absolute;bottom:42px;right:16px">
                px
            </div>
        </div>
        <div>
            <p class="subtitle">Support links</p>
            <x-arix.callout
                message="Leave empty remove the a specific support link from your panel."
            />
        </div>
        <x-arix.input-field 
            hr="true"
            id="arix:discord" 
            :value="$discord" 
            label="Discord ID"
        />
        <x-arix.input-field
            id="arix:support" 
            :value="$support" 
            label="Supportcenter"
        />
        <div class="floating-button">
            {!! csrf_field() !!}
            <button type="submit" class="button button-primary">Save changes</button>
        </div>
    </form>
@endsection
@extends('layouts.arix', ['navbar' => 'styling', 'sideEditor' => false])

@section('title')
    Arix Styling
@endsection

@php
    $pageTitles = [
        ['img' => '/arix/styling/pagetitleson.png', 'value' => 'true', 'label' => 'Enable'],
        ['img' => '/arix/styling/pagetitlesoff.png', 'value' => 'false', 'label' => 'Disable'],
    ];
    $backgroundFadedOptions = [
        ['img' => '/arix/styling/backgroundDefault.png', 'value' => 'default', 'label' => 'Non faded'],
        ['img' => '/arix/styling/backgroundFaded.png', 'value' => 'faded', 'label' => 'Faded'],
        ['img' => '/arix/styling/backgroundTranslucent.png', 'value' => 'translucent', 'label' => 'Translucent'],
    ];
    $backdropOptions = [
        ['img' => '/arix/styling/blurFalse.png', 'value' => 'false', 'label' => 'No blur'],
        ['img' => '/arix/styling/blurTrue.png', 'value' => 'true', 'label' => 'Blur'],
    ];
    $borderInputOptions = [
        ['img' => '/arix/styling/borderFalse.png', 'value' => 'false', 'label' => 'Without border'],
        ['img' => '/arix/styling/borderTrue.png', 'value' => 'true', 'label' => 'With border'],
    ];
    $flashMessageOptions = [
        ['img' => '/arix/styling/flashStyleOne.png', 'value' => 0, 'label' => 'Basic'],
        ['img' => '/arix/styling/flashStyleZero.png', 'value' => 1, 'label' => 'Fancy'],
    ];
    $iconOptions = [
        ['img' => '/arix/styling/Heroicons Outlined.png', 'value' => 'heroicons', 'label' => 'Heroicons (Outlined)'],
        ['img' => '/arix/styling/Heroicons Filled.png', 'value' => 'heroiconsFilled', 'label' => 'Heroicons (Solid)'],
        ['img' => '/arix/styling/Lucide.png', 'value' => 'lucide', 'label' => 'Lucide'],
        ['img' => '/arix/styling/Remixicons Outlined.png', 'value' => 'remixicon', 'label' => 'Remixicon (Outlined)'],
        ['img' => '/arix/styling/Remixicons Filled.png', 'value' => 'remixiconFilled', 'label' => 'Remixicon (Solid)'],
    ];
@endphp

@section('content')
    <form action="{{ route('admin.arix.styling') }}" method="POST" class="content-box">
        <div class="header">
            <p>Styling settings</p>
            <span class="description-text">Customize the general appears of Arix Theme.</span>
        </div>
        
        <x-arix.form-wrapper 
            title="Page titles" 
            description="Display the page title with an icon above every page."
        >
            <x-arix.option-picture
                id="arix:pageTitle" 
                :value="$pageTitle"
                :options="$pageTitles"
            />
        </x-arix.form-wrapper>

        <x-arix.form-wrapper 
            title="Background image" 
            description="Set a background image for both dark and light mode (leave empty to disable)."
        >
            <x-arix.switch 
                id="arix:background"
                name="arix:background"
                :value="$background"
                label="Enable background images"
            />
            <div id="dropdown-background" class="{{ $background === 'true' ? 'open' : '' }}">
                    <x-arix.input-field
                    id="arix:backgroundImage"
                    :value="$backgroundImage"
                    label="Dark mode: Background image"
                />
                <x-arix.input-field
                    id="arix:backgroundImageLight"
                    :value="$backgroundImageLight"
                    label="Light mode: Background image"
                />
                <div class="content-box-wide">
                    <x-arix.option-picture
                        id="arix:backgroundFaded" 
                        :value="$backgroundFaded"
                        :options="$backgroundFadedOptions"
                        label="Background style"
                    />
                </div>
            </div>
            <x-arix.input-field
                id="arix:loginBackground"
                :value="$loginBackground"
                label="Login page: Background image"
            />
        </x-arix.form-wrapper>

        <x-arix.form-wrapper 
            title="Component styling" 
            description="Customize the components styling, opacity, backdrop and border radius"
        >
            <div>
                @php
                    $opacityOptions = ["0%", "20%", "40%", "60%", "80%", "100%"];
                    $radiusBoxOptions = ["0px", "4px", "8px", "12px", "16px", "20px"];
                    $radiusInputOptions = ["0px", "3px", "6px", "9px", "12px", "15px"];
                @endphp
                <x-arix.slider
                    label="Component opacity/transparency"
                    id="arix:backdropPercentage"
                    :value="$backdropPercentage"
                    :options="$opacityOptions"
                    max="100"
                    min="0"
                />
                <x-arix.callout
                    message="We recommend ~60% for the best effect"
                />
            </div>
            {{ $backdrop === 'true' ? 'hey' : 'hey 2' }}
            <x-arix.option-picture
                id="arix:backdrop" 
                :value="$backdrop"
                :options="$backdropOptions"
                label="Backdrop effect"
            />
            <x-arix.slider
                label="Component border radius"
                id="arix:radiusBox"
                :value="$radiusBox"
                :options="$radiusBoxOptions"
                max="20"
                min="0"
            />
            <x-arix.slider
                label="Input & Button border radius"
                id="arix:radiusInput"
                :value="$radiusInput"
                :options="$radiusInputOptions"
                max="15"
                min="0"
            />
            <x-arix.option-picture
                id="arix:borderInput" 
                :value="$borderInput"
                :options="$borderInputOptions"
                label="Input border"
            />
        </x-arix.form-wrapper>

        <x-arix.form-wrapper 
            title="Flash message" 
            description="Set the flash message style."
        >
            <x-arix.option-picture
                id="arix:flashMessage" 
                :value="$flashMessage"
                :options="$flashMessageOptions"
                label="Flash message style"
            />
        </x-arix.form-wrapper>

        <x-arix.form-wrapper 
            title="Font styling" 
            description="Pick a different font and icon style"
        >
            <div class="input-field">
                <select
                    id="arix:font"
                    name="arix:font"
                >
                    <option value="default" {{ $font === 'default' ? 'selected' : '' }}>Default</option>
                    <option value="poppins" {{ $font === 'poppins' ? 'selected' : '' }}>Poppins</option>
                    <option value="dm_sans" {{ $font === 'dm_sans' ? 'selected' : '' }}>DM Sans</option>
                    <option value="roboto" {{ $font === 'roboto' ? 'selected' : '' }}>Roboto</option>
                    <option value="sciencegothic" {{ $font === 'sciencegothic' ? 'selected' : '' }}>Science Gothic</option>
                    <option value="inter" {{ $font === 'inter' ? 'selected' : '' }}>Inter</option>
                    <option value="montserrat" {{ $font === 'montserrat' ? 'selected' : '' }}>Montserrat</option>
                    <option value="open_sans" {{ $font === 'open_sans' ? 'selected' : '' }}>Open Sans</option>
                    <option value="lato" {{ $font === 'lato' ? 'selected' : '' }}>Lato</option>
                    <option value="nunito" {{ $font === 'nunito' ? 'selected' : '' }}>Nunito</option>
                    <option value="oswald" {{ $font === 'oswald' ? 'selected' : '' }}>Oswald</option>
                    <option value="playfair" {{ $font === 'playfair' ? 'selected' : '' }}>Playfair Display</option>
                    <option value="source_sans" {{ $font === 'source_sans' ? 'selected' : '' }}>Source Sans Pro</option>
                    <option value="quicksand" {{ $font === 'quicksand' ? 'selected' : '' }}>Quicksand</option>
                    <option value="manrope" {{ $font === 'manrope' ? 'selected' : '' }}>Manrope</option>
                    <option value="space_grotesk" {{ $font === 'space_grotesk' ? 'selected' : '' }}>Space Grotesk</option>
                </select>
            </div>
            <div class="content-box-wide">
                <x-arix.option-picture
                    id="arix:icon" 
                    :value="$icon"
                    :options="$iconOptions"
                    label="Icon style"
                />
            </div>
        </x-arix.form-wrapper>

        <div class="floating-button">
            {!! csrf_field() !!}
            <button type="submit" class="button button-primary">Save changes</button>
        </div>
    </form>
    <script>
    document.addEventListener('DOMContentLoaded', function () {
        const switchElement = document.querySelector('#arix\\:background');
        const dropdownBackground = document.querySelector('#dropdown-background');

        const toggleVisibility = () => {
            if (switchElement.checked) {
                dropdownBackground.classList.add('open');
            } else {
                dropdownBackground.classList.remove('open');
            }
        };

        toggleVisibility();

        switchElement.addEventListener('change', toggleVisibility);
    });
    </script>
@endsection
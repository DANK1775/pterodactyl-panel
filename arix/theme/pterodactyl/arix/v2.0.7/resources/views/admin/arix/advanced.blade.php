@extends('layouts.arix', ['navbar' => 'advanced', 'sideEditor' => false])

@section('title')
    Arix Advanced
@endsection

@section('content')
    <form action="{{ route('admin.arix.advanced') }}" method="POST" class="content-box">
        <div class="header">
            <p>Advanced settings</p>
            <span class="description-text">Change Arix advanced settings.</span>
        </div>

        <x-arix.form-wrapper 
            title="Customize Arix" 
            description="Change Arix advanced settings."
        >
            <x-arix.input-field 
                id="arix:copyright" 
                :value="$copyright" 
                label="Copyright Text"
            />
            <div class="input-field">
                <label for="arix:defaultMode">Default mode</label>
                <select
                    id="arix:defaultMode"
                    name="arix:defaultMode"
                >
                    <option value="darkmode">Darkmode</option>
                    <option value="lightmode" @if(old('arix:defaultMode', $defaultMode) == 'lightmode') selected @endif>Lightmode</option>
                </select>
            </div>
            <div class="input-field">
                <label for="arix:profileType">Profile Style</label>
                <select
                    id="arix:profileType"
                    name="arix:profileType"
                >
                    <option value="boring">Boring Avatars</option>
                    <option value="avataaars" @if(old('arix:profileType', $profileType) == 'avataaars') selected @endif>Avataaars Neutral</option>
                    <option value="bottts" @if(old('arix:profileType', $profileType) == 'bottts') selected @endif>Bottts Neutral</option>
                    <option value="identicon" @if(old('arix:profileType', $profileType) == 'identicon') selected @endif>Identicon</option>
                    <option value="initials" @if(old('arix:profileType', $profileType) == 'initials') selected @endif>Initials</option>
                    <option value="gravatar" @if(old('arix:profileType', $profileType) == 'gravatar') selected @endif>Gravatar</option>
                </select>
            </div>
            <hr />
            <x-arix.switch 
                id="arix:lowResourcesAlert"
                name="arix:lowResourcesAlert"
                :value="$lowResourcesAlert"
                label="Low Resources Alert"
            />
            <x-arix.input-field 
                id="arix:alertLink" 
                :value="$alertLink" 
                label="Low Resources Alert Link"
                helpText="The link users will be directed to when clicking the 'Upgrade Server' button in the low resources alert."
            />
            <x-arix.switch
                id="arix:ipFlag"
                name="arix:ipFlag"
                :value="$ipFlag"
                label="IP Flag"
            />
            <x-arix.switch
                id="arix:modeToggler"
                name="arix:modeToggler"
                :value="$modeToggler"
                label="Dark/light mode Toggler"
            />
            <x-arix.switch
                id="arix:langSwitch"
                name="arix:langSwitch"
                :value="$langSwitch"
                label="Language Switcher"
            />
            @php
                $languageOptionsArray = json_decode($languageOptions, true) ?? [['key' => 'en', 'name' => 'English']];
                $activeLanguageKeys = array_column($languageOptionsArray, 'key');
            @endphp

            <script>const languages = @json($activeLanguageKeys);</script>

            <div class="input-field">
                <label for="arix:defaultLang">Default Language</label>
                <select
                    id="arix:defaultLang"
                    name="arix:defaultLang"
                >
                    @foreach($languageOptionsArray as $lang)
                        <option value="{{ $lang['key'] }}" @if(old('arix:defaultLang', $defaultLang) == $lang['key']) selected @endif>{{ $lang['name'] }}</option>
                    @endforeach
                </select>
            </div>

            <div class="input-field">
                <label>Available Languages</label>
                <div class="languages-options">
                    @foreach($languages as $key => $value)
                        <label>
                            <input 
                                type="checkbox" 
                                name="arix:languageOptions[]" 
                                value="{{ $key }}" 
                                @if(in_array($key, $activeLanguageKeys)) checked @endif
                            />
                            <span></span>
                            {{ $value }}
                        </label>
                    @endforeach
                </div>
            </div>

            <x-arix.switch
                id="arix:dashboardPage"
                name="arix:dashboardPage"
                :value="$dashboardPage"
                label="Dashboard Page"
            />
            <x-arix.switch
                id="arix:registration"
                name="arix:registration"
                :value="$registration"
                label="User Registration"
            />
        </x-arix.form-wrapper>

        <div class="floating-button">
            {!! csrf_field() !!}
            <button type="submit" class="button button-primary">Save changes</button>
        </div>
    </form>
    <div class="header">
        <p>Arix Presets</p>
        <span class="description-text">Import and export presets.</span>
    </div>
    <form action="{{ route('admin.arix.advanced.preset') }}" method="POST" id="arix-preset-form" style="margin-top:40px;">
            {!! csrf_field() !!}
        <x-arix.form-wrapper 
            title="Import / Export Arix Preset"
            description="Export or import Arix advanced settings presets."
        >
            <p>Keep in mind: although we try to keep our products safe with input sanitization, importing presets may still break your installation. Only use presets from people you trust or from official sources (such as BuiltByBit or Arix.gg).</p>

            <div style="display:flex; gap:10px;">
                <button type="button" class="button button-primary" onclick="exportArixPreset()">
                    Export preset
                </button>

                <button type="button" class="button button-secondary" onclick="document.getElementById('preset-file-input').click()">
                    Import preset
                </button>

                <!-- Hidden file input -->
                <input type="file" id="preset-file-input" accept=".arix" style="display:none" />
                <input type="hidden" id="arix-preset-json" name="preset_json" value='@json($arixSettings)' />
            </div>
        </x-arix.form-wrapper>
    </form>

<script>
    // EXPORT FUNCTION
    function exportArixPreset() {
        const json = document.getElementById('arix-preset-json').value.trim();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "preset.arix";
        a.click();

        URL.revokeObjectURL(url);
    }

    // IMPORT FUNCTION
    document.getElementById("preset-file-input").addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const text = e.target.result;

                // Optional: validate JSON
                JSON.parse(text);

                // Put JSON into textarea
                document.getElementById("arix-preset-json").value = text;

                // Auto-submit form
                document.getElementById("arix-preset-form").submit();
            } catch (err) {
                alert("Invalid preset file: not valid JSON.");
            }
        };
        reader.readAsText(file);
    });
</script>
@endsection
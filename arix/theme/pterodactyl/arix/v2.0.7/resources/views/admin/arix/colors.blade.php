@extends('layouts.arix', ['navbar' => 'colors', 'sideEditor' => true, 'extraWide' => true])

@section('title')
    Arix Colors
@endsection

@section('content')
    <form action="{{ route('admin.arix.colors') }}" method="POST">
        <div class="header">
            <p>Color settings</p>
            <span class="description-text">Utilize the Arix theme color picker to apply your color scheme effortlessly!</span>
        </div>
        <div>
            <p class="subtitle">Color presets</p>

        </div>
        <div>
            <p class="subtitle">Color presets</p>
            <div class="color-options">
                <x-arix.preset 
                    name="Pink"
                    color="pink"
                    text="#9d7f9a"
                    primary="#d528ba"
                    background="#3C2B3A"
                />
                <x-arix.preset 
                    name="Purple"
                    color="purple"
                    text="#8c7f9d"
                    primary="#7F30C2"
                    background="#180d26"
                />
                <x-arix.preset 
                    name="Default"
                    color="default"
                    text="#8282a4"
                    primary="#4a35cf"
                    background="#0b0b2a"
                />
                <x-arix.preset 
                    name="Blue"
                    color="blue"
                    text="#8e90bb"
                    primary="#4184f7"
                    background="#020539"
                />
                <x-arix.preset 
                    name="Cyan"
                    color="cyan"
                    text="#877d9e"
                    primary="#0ba9ac"
                    background="#140c27"
                />
                <x-arix.preset 
                    name="Green"
                    color="green"
                    text="#645d67"
                    primary="#007b27"
                    background="#130e15"
                />
                <x-arix.preset 
                    name="Yellow"
                    color="yellow"
                    text="#b58d8e"
                    primary="#eae21f"
                    background="#330708"
                />
                <x-arix.preset 
                    name="Orange"
                    color="orange"
                    text="#997871"
                    primary="#d67a1d"
                    background="#260e0a"
                />
                <x-arix.preset 
                    name="Red"
                    color="red"
                    text="#936f66"
                    primary="#d51919"
                    background="#250e08"
                />
            </div>
        </div>
        <div>
            <p class="subtitle" style="margin-top:20px">Darkmode</p>
            <div class="color-options">
                <x-arix.color-input
                    target="primary"
                    id="arix:primary" 
                    :value="$primary"
                />
            </div>
        </div>
        <div class="color-options">
            <x-arix.color-input
                target="successText"
                id="arix:successText" 
                :value="$successText"
                helpText="Element text"
            />
            <x-arix.color-input
                target="successBorder"
                id="arix:successBorder" 
                :value="$successBorder"
                helpText="Element border"
            />
            <x-arix.color-input
                target="successBackground"
                id="arix:successBackground" 
                :value="$successBackground"
                helpText="Element background"
            />
        </div>
        <div class="color-options">
            <x-arix.color-input
                target="dangerText"
                id="arix:dangerText" 
                :value="$dangerText"
                helpText="Element text"
            />
            <x-arix.color-input
                target="dangerBorder"
                id="arix:dangerBorder" 
                :value="$dangerBorder"
                helpText="Element border"
            />
            <x-arix.color-input
                target="dangerBackground"
                id="arix:dangerBackground" 
                :value="$dangerBackground"
                helpText="Element background"
            />
        </div>
        <div class="color-options">
            <x-arix.color-input
                target="secondaryText"
                id="arix:secondaryText" 
                :value="$secondaryText"
                helpText="Element text"
            />
            <x-arix.color-input
                target="secondaryBorder"
                id="arix:secondaryBorder" 
                :value="$secondaryBorder"
                helpText="Element border"
            />
            <x-arix.color-input
                target="secondaryBackground"
                id="arix:secondaryBackground" 
                :value="$secondaryBackground"
                helpText="Element background"
            />
        </div>
        <div class="color-options">
            <x-arix.color-input
                target="gray50"
                id="arix:gray50" 
                :value="$gray50"
                helpText="Title color"
            />
            <x-arix.color-input
                target="gray100"
                id="arix:gray100" 
                :value="$gray100"
                helpText="Subtitle color"
            />
            <x-arix.color-input
                target="gray200"
                id="arix:gray200" 
                :value="$gray200"
                helpText="Text color"
            />
            <x-arix.color-input
                target="gray300"
                id="arix:gray300" 
                :value="$gray300"
                helpText="Subtext color"
            />
            <x-arix.color-input
                target="gray400"
                id="arix:gray400" 
                :value="$gray400"
            />
            <x-arix.color-input
                target="gray500"
                id="arix:gray500" 
                :value="$gray500"
                helpText="Input border"
            />
            <x-arix.color-input
                target="gray600"
                id="arix:gray600" 
                :value="$gray600"
                helpText="Input background"
            />
            <x-arix.color-input
                target="gray700"
                id="arix:gray700" 
                :value="$gray700"
                helpText="Element background"
            />
            <x-arix.color-input
                target="gray800"
                id="arix:gray800" 
                :value="$gray800"
                helpText="Panel background"
            />
            <x-arix.color-input
                target="gray900"
                id="arix:gray900" 
                :value="$gray900"
            />
        </div>

        <div>
            <p class="subtitle" style="margin-top:20px">Lightmode</p>
            <div class="color-options">
                <x-arix.color-input
                    target="light-primary"
                    id="arix:lightmode_primary" 
                    :value="$lightmode_primary"
                />
            </div>
        </div>
        <div class="color-options">
            <x-arix.color-input
                target="light-successText"
                id="arix:lightmode_successText" 
                :value="$lightmode_successText"
                helpText="Element text"
            />
            <x-arix.color-input
                target="light-successBorder"
                id="arix:lightmode_successBorder" 
                :value="$lightmode_successBorder"
                helpText="Element border"
            />
            <x-arix.color-input
                target="light-successBackground"
                id="arix:lightmode_successBackground" 
                :value="$lightmode_successBackground"
                helpText="Element background"
            />
        </div>
        <div class="color-options">
            <x-arix.color-input
                target="light-dangerText"
                id="arix:lightmode_dangerText" 
                :value="$lightmode_dangerText"
                helpText="Element text"
            />
            <x-arix.color-input
                target="light-dangerBorder"
                id="arix:lightmode_dangerBorder" 
                :value="$lightmode_dangerBorder"
                helpText="Element border"
            />
            <x-arix.color-input
                target="light-dangerBackground"
                id="arix:lightmode_dangerBackground" 
                :value="$lightmode_dangerBackground"
                helpText="Element background"
            />
        </div>
        <div class="color-options">
            <x-arix.color-input
                target="light-secondaryText"
                id="arix:lightmode_secondaryText" 
                :value="$lightmode_secondaryText"
                helpText="Element text"
            />
            <x-arix.color-input
                target="light-secondaryBorder"
                id="arix:lightmode_secondaryBorder" 
                :value="$lightmode_secondaryBorder"
                helpText="Element border"
            />
            <x-arix.color-input
                target="light-secondaryBackground"
                id="arix:lightmode_secondaryBackground" 
                :value="$lightmode_secondaryBackground"
                helpText="Element background"
            />
        </div>
        <div class="color-options">
            <x-arix.color-input
                target="light-gray50"
                id="arix:lightmode_gray50" 
                :value="$lightmode_gray50"
            />
            <x-arix.color-input
                target="light-gray100"
                id="arix:lightmode_gray100" 
                :value="$lightmode_gray100"
                helpText="Panel background"
            />
            <x-arix.color-input
                target="light-gray200"
                id="arix:lightmode_gray200" 
                :value="$lightmode_gray200"
                helpText="Element background"
            />
            <x-arix.color-input
                target="light-gray300"
                id="arix:lightmode_gray300" 
                :value="$lightmode_gray300"
                helpText="Input background"
            />
            <x-arix.color-input
                target="light-gray400"
                id="arix:lightmode_gray400" 
                :value="$lightmode_gray400"
                helpText="Input border"
            />
            <x-arix.color-input
                target="light-gray500"
                id="arix:lightmode_gray500" 
                :value="$lightmode_gray500"
            />
            <x-arix.color-input
                target="light-gray600"
                id="arix:lightmode_gray600" 
                :value="$lightmode_gray600"
                helpText="Subtext color"
            />
            <x-arix.color-input
                target="light-gray700"
                id="arix:lightmode_gray700" 
                :value="$lightmode_gray700"
                helpText="Text color"
            />
            <x-arix.color-input
                target="light-gray800"
                id="arix:lightmode_gray800" 
                :value="$lightmode_gray800"
                helpText="Subtitle color"
            />
            <x-arix.color-input
                target="light-gray900"
                id="arix:lightmode_gray900" 
                :value="$lightmode_gray900"
                helpText="Title color"
            />
        </div>

        <div class="floating-button">
            {!! csrf_field() !!}
            <button type="submit" class="button button-primary">Save changes</button>
        </div>
    </form>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const colorPresets = {
            default: {
                "light-primary": "#4a35cf",

                "light-successText": "#e1ffd8",
                "light-successBorder": "#56aa2b",
                "light-successBackground": "#3d8f1f",

                "light-dangerText": "#ffd8d8",
                "light-dangerBorder": "#aa2a2a",
                "light-dangerBackground": "#8f1f20",

                "light-secondaryText": "#46464d",
                "light-secondaryBorder": "#c0c0d3",
                "light-secondaryBackground": "#a6a7bd",

                "light-gray50": "#141415",
                "light-gray100": "#27272c",
                "light-gray200": "#46464d",
                "light-gray300": "#626272",
                "light-gray400": "#757689",
                "light-gray500": "#a6a7bd",
                "light-gray600": "#c0c0d3",
                "light-gray700": "#e7e7ef",
                "light-gray800": "#f0f1f5",
                "light-gray900": "#ffffff",

                "primary": "#4a35cf",

                "successText": "#e1ffd8",
                "successBorder": "#56aa2b",
                "successBackground": "#3d8f1f",

                "dangerText": "#ffd8d8",
                "dangerBorder": "#aa2a2a",
                "dangerBackground": "#8f1f20",

                "secondaryText": "#b2b2c1",
                "secondaryBorder": "#42425b",
                "secondaryBackground": "#2b2b40",

                "gray50": "#F4F4F4",
                "gray100": "#D5D5DB",
                "gray200": "#B2B2C1",
                "gray300": "#8282A4",
                "gray400": "#5E5E7F",
                "gray500": "#42425B",
                "gray600": "#2B2B40",
                "gray700": "#1D1D37",
                "gray800": "#0B0B2A",
                "gray900": "#040416",
            },
            pink: {
                "light-primary": "#d528ba",
                "primary": "#d528ba",

                "secondaryText": "#BAACB9",
                "secondaryBorder": "#554153",
                "secondaryBackground": "#3C2B3A",

                "gray50": "#EBEBEB",
                "gray100": "#D4CDD3",
                "gray200": "#BAACB9",
                "gray300": "#9D7F9A",
                "gray400": "#785D75",
                "gray500": "#554153",
                "gray600": "#3C2B3A",
                "gray700": "#331E31",
                "gray800": "#260D24",
                "gray900": "#140613",
            },
            purple: {
                "light-primary": "#7F30C2",
                "primary": "#7F30C2",

                "secondaryText": "#B2ACBA",
                "secondaryBorder": "#4A4155",
                "secondaryBackground": "#322B3C",

                "gray50": "#EBEBEB",
                "gray100": "#D0CDD4",
                "gray200": "#B2ACBA",
                "gray300": "#8C7F9D",
                "gray400": "#695D78",
                "gray500": "#4A4155",
                "gray600": "#322B3C",
                "gray700": "#271E33",
                "gray800": "#180D26",
                "gray900": "#0C0614",
            },
            blue: {
                "light-primary": "#4184F7",
                "primary": "#4184F7",

                "secondaryText": "#C7C8D8",
                "secondaryBorder": "#41436D",
                "secondaryBackground": "#292B4F",

                "gray50": "#FFFFFF",
                "gray100": "#F0F1F4",
                "gray200": "#C7C8D8",
                "gray300": "#8E90BB",
                "gray400": "#5E6199",
                "gray500": "#41436D",
                "gray600": "#292B4F",
                "gray700": "#181A46",
                "gray800": "#020539",
                "gray900": "#00011E",
            },
            cyan: {
                "light-primary": "#0ba9ac",
                "primary": "#0ba9ac",

                "secondaryText": "#B0ABBB",
                "secondaryBorder": "#474056",
                "secondaryBackground": "#302A3D",

                "gray50": "#EBEBEB",
                "gray100": "#CFCDD4",
                "gray200": "#B0ABBB",
                "gray300": "#877D9E",
                "gray400": "#655C79",
                "gray500": "#474056",
                "gray600": "#302A3D",
                "gray700": "#241D34",
                "gray800": "#140C27",
                "gray900": "#0A0515",
            },
            green: {
                "light-primary": "#007b27",
                "primary": "#007b27",

                "secondaryText": "#7D7781",
                "secondaryBorder": "#353137",
                "secondaryBackground": "#242126",

                "gray50": "#A2A2A2",
                "gray100": "#918D93",
                "gray200": "#7D7781",
                "gray300": "#645D67",
                "gray400": "#4B464D",
                "gray500": "#353137",
                "gray600": "#242126",
                "gray700": "#1D191F",
                "gray800": "#130E15",
                "gray900": "#0A070B",
            },
            yellow: {
                "light-primary": "#EAE21F",
                "primary": "#EAE21F",

                "secondaryText": "#D3C4C4",
                "secondaryBorder": "#684344",
                "secondaryBackground": "#4A2B2C",

                "gray50": "#FFFFFF",
                "gray100": "#EFEBEB",
                "gray200": "#D3C4C4",
                "gray300": "#B58D8E",
                "gray400": "#916162",
                "gray500": "#684344",
                "gray600": "#4A2B2C",
                "gray700": "#411B1C",
                "gray800": "#330708",
                "gray900": "#1C0202",
            },
            orange: {
                "light-primary": "#D67A1D",
                "primary": "#D67A1D",

                "secondaryText": "#B2A19E",
                "secondaryBorder": "#523F3B",
                "secondaryBackground": "#3A2A26",

                "gray50": "#DCDCDC",
                "gray100": "#C9C0BF",
                "gray200": "#B2A19E",
                "gray300": "#997871",
                "gray400": "#735A55",
                "gray500": "#523F3B",
                "gray600": "#3A2A26",
                "gray700": "#321E1A",
                "gray800": "#260E0A",
                "gray900": "#140704",
            },
            red: {
                "light-primary": "#D51919",
                "primary": "#D51919",

                "secondaryText": "#A99590",
                "secondaryBorder": "#4E3B36",
                "secondaryBackground": "#372723",

                "gray50": "#CECECE",
                "gray100": "#BDB3B0",
                "gray200": "#A99590",
                "gray300": "#936F66",
                "gray400": "#6D544D",
                "gray500": "#4E3B36",
                "gray600": "#372723",
                "gray700": "#301C17",
                "gray800": "#250E08",
                "gray900": "#140603",
            }
        };

        document.querySelectorAll('.apply-preset').forEach(button => {
            button.addEventListener('click', function() {
                const presetName = this.getAttribute('data-preset');
                const preset = colorPresets[presetName];
                if (!preset) return;

                Object.keys(preset).forEach(target => {
                    const value = preset[target];
                    const input = document.querySelector(`input[data-target="${target}"]`);
                    if (input) {
                        input.value = value;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });

                if (window.Coloris) {
                    Coloris.update();
                }
            });
        });
    });
    </script>
    <script>
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[data-coloris]')) {
            const input = e.target;
            const newValue = input.value;
            const target = input.getAttribute('data-target') || input.getAttribute('target');

            if (!target || !newValue) return;

            const iframe = document.getElementById('iframe');
            if (iframe && iframe.contentDocument) {
                const iframeDoc = iframe.contentDocument;
                if (target.startsWith('light-')) {
                    if (!iframeDoc.documentElement.classList.contains('lightmode')) {
                        iframeDoc.documentElement.classList.add('lightmode');
                    }
                } else {
                    if (iframeDoc.documentElement.classList.contains('lightmode')) {
                        iframeDoc.documentElement.classList.remove('lightmode');
                    }
                }
                if (target.startsWith('light-')) {
                    const varName = target.replace('light-', '');
                    iframeDoc.querySelectorAll('.lightmode').forEach(el => {
                        el.style.setProperty(`--${varName}`, newValue);
                    });
                } else {
                    iframeDoc.documentElement.style.setProperty(`--${target}`, newValue);
                }
            }
        }
    });
    </script>
@endsection
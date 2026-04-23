@extends('layouts.arix', ['navbar' => 'announcement', 'sideEditor' => true])

@section('title')
    Arix Announcements
@endsection

@section('content')

    <form action="{{ route('admin.arix.announcement') }}" method="POST">
        <div class="header">
            <p>Announcement settings</p>
            <span class="description-text">Change the announcement settings of Arix Theme.</span>
        </div>
        <x-arix.switch 
            hr="true"
            id="arix:announcement"
            name="arix:announcement"
            :value="$announcement"
            label="Enable announcement"
        />
        <div>
            <div class="input-field">
                <select id="announcement-type">
                    <option value="custom" disabled hidden>Select type</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                    <option value="update">Update</option>
                    <option value="info">Information</option>
                </select>
            </div>

            <button type="button" id="dropdown-toggle">
                Advanced settings
                <i data-lucide="chevron-down"></i>
            </button>
            <div id="announcement-dropdown" class="dropdown">
                <x-arix.color-input
                    id="arix:announcementColor" 
                    :value="$announcementColor"
                    label="Color"
                />
                @php
                    $options = [
                        [ 'value' => 'megaphone' ],
                        [ 'value' => 'party-popper' ],
                        [ 'value' => 'info' ],
                        [ 'value' => 'circle-check' ],
                        [ 'value' => 'circle-alert' ],
                        [ 'value' => 'triangle-alert' ],
                        [ 'value' => 'life-buoy' ],
                        [ 'value' => 'flame' ]
                    ];
                @endphp
                <div id="arix:announcementIcon" class="icon-options-wrapper">
                    <x-arix.icon-option 
                        :options="$options" 
                        id="arix:announcementIcon"
                        :oldValue="$announcementIcon"
                    />
                </div>
            </div>
            <hr />
        </div>
        <x-arix.textarea-field
            hr="true"
            id="arix:announcementMessage" 
            :value="$announcementMessage"
            label="Announcement message"
            helpText="For styling use Markdown format."
        />
        <x-arix.switch
            id="arix:announcementCta"
            name="arix:announcementCta"
            :value="$announcementCta"
            label="Call to action"
            helpText="Add a call to action to your announcement"
        />
        <x-arix.input-field
            id="arix:announcementCtaTitle" 
            :value="$announcementCtaTitle"
            label="Button Text"
        />
        <x-arix.input-field 
            hr="true"
            id="arix:announcementCtaLink" 
            :value="$announcementCtaLink"
            label="Button Link"
        />
        <x-arix.switch
            id="arix:announcementDismissable"
            name="arix:announcementDismissable"
            :value="$announcementDismissable"
            label="Dismissable"
            helpText="Allow users to hide an announcement."
        />
        <div class="floating-button">
            {!! csrf_field() !!}
            <button type="submit" class="button button-primary">Save changes</button>
        </div>
    </form>

    <script>
    document.addEventListener('DOMContentLoaded', function () {
        const toggleButton = document.getElementById('dropdown-toggle');
        const dropdown = document.getElementById('announcement-dropdown');
        const select = document.getElementById('announcement-type');
        const colorInput = document.getElementById('arix:announcementColor');
        const iconInput = document.getElementById('arix:announcementIcon');

        const configMap = {
            success:    { color: '#0da22c', icon: 'circle-check' },
            warning:    { color: '#d71919', icon: 'triangle-alert' },
            alert:      { color: '#d7c219', icon: 'circle-alert' },
            update:     { color: '#16aaaa', icon: 'megaphone' },
            info:       { color: '#0a7fe6', icon: 'info' },
        };

        toggleButton.addEventListener('click', function () {
            dropdown.classList.toggle('open');
        });

        select.addEventListener('change', function () {
            const selected = this.value;
            const config = configMap[selected];

            if (config) {
                colorInput.value = config.color;
                colorInput.dispatchEvent(new Event('input', { bubbles: true }));

                iconInput.querySelectorAll('input[type=radio]').forEach(radio => {
                    radio.checked = (radio.value === config.icon);
                });
            }
        });

        // Auto-detect current type on page load
        function detectPresetType() {
            const currentColor = colorInput.value?.toLowerCase();
            let currentIcon = null;

            iconInput.querySelectorAll('input[type=radio]').forEach(radio => {
                if (radio.checked) {
                    currentIcon = radio.value;
                }
            });

            for (const [type, config] of Object.entries(configMap)) {
                if (config.color.toLowerCase() === currentColor && config.icon === currentIcon) {
                    select.value = type;
                    return;
                }
            }

            // If no match found, set to custom
            select.value = 'custom';
        }

        detectPresetType();
    });
    </script>
@endsection
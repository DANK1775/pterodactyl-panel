@extends('layouts.arix', ['navbar' => 'mail', 'sideEditor' => false])

@section('title')
    Arix Mail
@endsection

@section('content')
    <form action="{{ route('admin.arix.mail') }}" method="POST" class="content-box">
        <div class="header">
            <p>Mail settings</p>
            <span class="description-text">Change the mail template settings.</span>
        </div>

        <x-arix.form-wrapper 
            title="Logo Settings" 
            description="Configure the logo settings for your mail templates."
        >
            <x-arix.input-field 
                id="arix:mail_logo" 
                :value="$mail_logo" 
                label="Mail logo"
            />
            <x-arix.switch 
                id="arix:mail_logoFull"
                name="arix:mail_logoFull"
                :value="$mail_logoFull"
                label="Logo only"
            />
        </x-arix.form-wrapper>
        <x-arix.form-wrapper 
            title="Mail Styling" 
            description="Configure the mail styling settings for your mail templates."
        >
            <div class="input-field">
                <label for="mail_color">Mail primary color</label>
                <x-arix.color-input
                    target="mail_color"
                    id="arix:mail_color"
                    :value="$mail_color"
                />
            </div>
            <div class="input-field">
                <label for="mail_backgroundColor">Mail background color</label>
                <x-arix.color-input
                    target="mail_backgroundColor"
                    id="arix:mail_backgroundColor" 
                    :value="$mail_backgroundColor"
                />
            </div>
            <div class="input-field">
                <label for="arix:mail_mode">Mail color mode</label>
                <select
                    id="arix:mail_mode"
                    name="arix:mail_mode"
                >
                    <option value="dark" @if(old('arix:mail_mode', $mail_mode) == 'dark') selected @endif>Dark mode</option>
                    <option value="light" @if(old('arix:mail_mode', $mail_mode) == 'light') selected @endif>Light mode</option>
                </select>
                <span style="font-size:0.8rem">If the background color is light, use a light setting. If the background color is dark, use a dark setting.</span>
            </div>
        </x-arix.form-wrapper>
        <x-arix.form-wrapper 
            title="Utility Links" 
            description="Configure the utility links settings for your mail templates. Leave empty to remove a specific utility link."
        >
            <x-arix.input-field 
                id="arix:mail_status" 
                :value="$mail_status"
                label="Mail status page"
            />
            <x-arix.input-field 
                id="arix:mail_billing" 
                :value="$mail_billing" 
                label="Mail billing"
            />
            <x-arix.input-field 
                id="arix:mail_support" 
                :value="$mail_support" 
                label="Mail support"
            />
        </x-arix.form-wrapper>
        <x-arix.form-wrapper 
            title="Mail socials" 
            description="Configure the mail socials settings for your mail templates. Leave empty to remove a specific social link."
        >
            <x-arix.input-field 
                id="arix:mail_discord" 
                :value="$mail_discord" 
                label="Mail discord"
            />
            <x-arix.input-field 
                id="arix:mail_twitter" 
                :value="$mail_twitter" 
                label="Mail Twitter"
            />
            <x-arix.input-field 
                id="arix:mail_facebook" 
                :value="$mail_facebook" 
                label="Mail Facebook"
            />
            <x-arix.input-field 
                id="arix:mail_instagram" 
                :value="$mail_instagram" 
                label="Mail Instagram"
            />
            <x-arix.input-field 
                id="arix:mail_linkedin" 
                :value="$mail_linkedin" 
                label="Mail Linkedin"
            />
            <x-arix.input-field 
                id="arix:mail_youtube" 
                :value="$mail_youtube" 
                label="Mail Youtube"
            />
        </x-arix.form-wrapper>

        <div class="floating-button">
            {!! csrf_field() !!}
            <button type="submit" class="button button-primary">Save changes</button>
        </div>
    </form>
@endsection
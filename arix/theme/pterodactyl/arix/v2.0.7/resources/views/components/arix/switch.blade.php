@php
    $hr = $hr ?? false;
    $checked = old($name, $value ?? 'false') === 'true' ? 'checked' : '';
@endphp

<div class="switch-input {{ $hr ? 'hr' : '' }}">
    <div>
        <label for="{{ $id }}">{{ $label }}</label>
        @if (!empty($helpText))
            <small>{{ $helpText }}</small>
        @endif
    </div>
    <label class="switch">
        <input type="hidden" name="{{ $name }}" value="false">
        <input 
            type="checkbox" 
            id="{{ $id }}" 
            name="{{ $name }}" 
            value="true" 
            {{ $checked }}
        >
        <span class="slider round"></span>
    </label>
</div>
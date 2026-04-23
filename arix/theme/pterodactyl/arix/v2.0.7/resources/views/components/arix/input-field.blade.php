@php
    $hr = $hr ?? false;
@endphp
<div class="input-field {{ $hr ? 'hr' : '' }}">
    <label for="{{ $id }}">{{ $label }}</label>
    <input 
        type="text" 
        id="{{ $id }}" 
        name="{{ $id }}" 
        value="{{ old($id, $value) }}" 
    />
    @if (!empty($helpText))
        <small>{{ $helpText }}</small>
    @endif
</div>
@php
    $hr = $hr ?? false;
@endphp
<div class="input-field {{ $hr ? 'hr' : '' }}">
    <label for="{{ $id }}">{{ $label }}</label>
    <textarea 
        type="text" 
        id="{{ $id }}" 
        name="{{ $id }}"
        width="100%" 
        rows="5"
    >{{ old($id, $value) }}</textarea>
    @if (!empty($helpText))
        <small>{{ $helpText }}</small>
    @endif
</div>
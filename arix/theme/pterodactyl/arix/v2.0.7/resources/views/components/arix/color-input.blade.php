@php
    $label = $label ?? false;
    $hr = $hr ?? false;
    $target = $target ?? '';
@endphp
<div class="input-field {{ $hr ? 'hr' : '' }}">
    @if ($label) 
        <label for="{{ $id }}">{{ $label }}</label>
    @endif
    <input 
        data-target="{{ $target }}"
        type="text" 
        id="{{ $id }}" 
        name="{{ $id }}" 
        value="{{ old($id, $value) }}" 
        data-coloris
    />
    @if (!empty($helpText))
        <small>{{ $helpText }}</small>
    @endif
</div>
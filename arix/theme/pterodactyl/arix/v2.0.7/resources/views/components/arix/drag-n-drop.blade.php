@php
    $wide = $wide ?? false;
    $long = $long ?? false;
@endphp
<div class="draggable-item {{ $wide ? 'column-2' : '' }} {{ $long ? 'row-2' : '' }}" data-name="{{ $name }}">
    <span>{{ $label }}</span>
    <button class="button button-secondary" type="button" onClick="resetDragItem('{{ $name }}')">
        Remove
    </button>
    <div class="draggable-area">
        <img src="{{ $src }}" />
    </div>
</div>

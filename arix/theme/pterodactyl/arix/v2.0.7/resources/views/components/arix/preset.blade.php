
<button type="button" class="apply-preset" style="color: {{ $primary }};" data-preset="{{ $color }}">
    <span>{{ $name }}</span>

    <div class="palette">
        <div style="background-color: {{ $primary }};"></div>
        <div style="background-color: {{ $text }};"></div>
        <div style="background-color: {{ $background }};" ></div>
    </div>
</button>
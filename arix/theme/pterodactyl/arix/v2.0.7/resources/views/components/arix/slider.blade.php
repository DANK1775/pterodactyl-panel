<div class="input-field input-slider">
    <label>{{ $label }}</label>
    <input
        id={{ $id }}
        name={{ $id }}
        type="range"
        value={{ $value }}
        max={{ $max }}
        min={{ $min }}
    />
    <div class="slide-options">
        @foreach ($options as $option)
            <p>{{ $option }}</p>
        @endforeach
    </div>
</div>
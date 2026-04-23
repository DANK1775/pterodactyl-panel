<div class="input-field">
    <div class="layouts-option">
        <label>
            <input 
                type="radio"
                id="{{ $id }}"
                name="{{ $name }}" 
                value="{{ $value }}" 
                {{ $oldValue == $value ? 'checked' : '' }}
            >
            <div class="label-card">
                <img src="{{ asset($img) }}" alt="{{ $value }}" >
            </div>
            <span>{{ $label }}</span>
        </label>
    </div>
</div>
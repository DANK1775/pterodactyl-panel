<label>
    <input 
        type="radio"
        name={{ $name }}
        id={{ $id }}
        value={{ $value }}
        {{ $oldValue == $value ? 'checked' : '' }}
    />
    {{ $displayName }}
    {{ $style }}
    {{ $img }}
</label>
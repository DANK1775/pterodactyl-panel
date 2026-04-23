@foreach ($options as $option)
    <div class="icon-options">
        <input 
            type="radio" 
            id="{{ $id }}_{{ $loop->index }}" 
            name="{{ $id }}" 
            value="{{ $option['value'] }}" 
            {{ $oldValue == $option['value'] ? 'checked' : '' }}
        >
        <label for="{{ $id }}_{{ $loop->index }}">
            <i data-lucide="{{ $option['value'] }}"></i>
        </label>
    </div>
@endforeach
@props([
    'id',
    'label' => null,
    'value' => null,
    'options' => [],
])

<div class="input-field">
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div class="options-wrapper">
        @foreach ($options as $option)
            <label class="option-input">
                <input 
                    type="radio"
                    name="{{ $id }}" 
                    value="{{ $option['value'] }}" 
                    {{ $value == $option['value'] ? 'checked' : '' }}
                >
                <div class="label-card">
                    <img src="{{ asset($option['img']) }}" alt="{{ $option['value'] }}">
                </div>
                <span>{{ $option['label'] }}</span>
            </label>
        @endforeach
    </div>
</div>
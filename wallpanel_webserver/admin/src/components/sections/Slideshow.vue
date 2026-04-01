<template>
  <section class="card">
    <h2>{{ $t('sections.slideshow') }}</h2>

    <div class="field">
      <label for="display-time-image">{{ $t('fields.display_time_image.label') }}</label>
      <input
        id="display-time-image"
        type="number"
        :value="modelValue.display_time_image"
        @input="update('display_time_image', Number($event.target.value))"
        min="1"
        step="1"
      />
      <p class="hint">{{ $t('fields.display_time_image.hint') }}</p>
    </div>

    <div class="field">
      <label for="display-time-video">{{ $t('fields.display_time_video.label') }}</label>
      <input
        id="display-time-video"
        type="number"
        :value="modelValue.display_time_video"
        @input="update('display_time_video', Number($event.target.value))"
        min="1"
        step="1"
      />
      <p class="hint">{{ $t('fields.display_time_video.hint') }}</p>
    </div>

    <div class="field">
      <label for="crossfade-time">{{ $t('fields.crossfade_time.label') }}</label>
      <input
        id="crossfade-time"
        type="number"
        :value="modelValue.crossfade_time"
        @input="update('crossfade_time', Number($event.target.value))"
        min="0"
        step="0.5"
      />
      <p class="hint">{{ $t('fields.crossfade_time.hint') }}</p>
    </div>

    <div class="field">
      <label for="image-fit">{{ $t('fields.image_fit.label') }}</label>
      <select
        id="image-fit"
        :value="modelValue.image_fit"
        @change="update('image_fit', $event.target.value)"
      >
        <option value="cover">{{ $t('fields.image_fit.options.cover') }}</option>
        <option value="contain">{{ $t('fields.image_fit.options.contain') }}</option>
      </select>
      <p class="hint">{{ $t('fields.image_fit.hint') }}</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function update(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<style scoped>
.card {
  background: #16213e;
  border: 1px solid #0f3460;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 0.82rem;
  color: #a0c4ff;
  margin-bottom: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
}

.field { margin-bottom: 1rem; }

label {
  display: block;
  font-size: 0.82rem;
  color: #aaa;
  margin-bottom: 0.3rem;
}

.hint {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
  line-height: 1.4;
}

input[type="number"],
select {
  width: 100%;
  background: #0d1b2a;
  border: 1px solid #0f3460;
  border-radius: 6px;
  color: #e0e0e0;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  outline: none;
  font-family: inherit;
}

input:focus,
select:focus {
  border-color: #a0c4ff;
}
</style>

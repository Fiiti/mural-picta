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
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 15%, transparent) 65%, transparent 100%);
}

h2 {
  font-size: 0.75rem;
  color: var(--accent);
  margin-bottom: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-weight: 700;
}

.field { margin-bottom: 1rem; }

label {
  display: block;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

.hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  line-height: 1.45;
  opacity: 0.75;
}

input[type="number"],
select {
  width: 100%;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 7px;
  color: var(--text);
  padding: 0.5rem 0.75rem;
  font-size: 0.93rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

input:focus,
select:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
</style>

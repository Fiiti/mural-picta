<template>
  <section class="card">
    <h2>{{ $t('sections.video') }}</h2>

    <div class="field">
      <label for="video-volume">{{ $t('fields.video_volume.label') }}</label>
      <div class="range-row">
        <input
          id="video-volume"
          type="range"
          :value="modelValue.video_volume"
          @input="update('video_volume', Number($event.target.value))"
          min="0"
          max="1"
          step="0.1"
        />
        <span class="range-value">{{ Math.round((modelValue.video_volume ?? 0) * 100) }}%</span>
      </div>
      <p class="hint">{{ $t('fields.video_volume.hint') }}</p>
    </div>

    <div class="field">
      <div class="toggle-row">
        <label for="video-loop">{{ $t('fields.video_loop.label') }}</label>
        <input
          id="video-loop"
          type="checkbox"
          :checked="modelValue.video_loop"
          @change="update('video_loop', $event.target.checked)"
        />
      </div>
      <p class="hint">{{ $t('fields.video_loop.hint') }}</p>
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

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-row label {
  margin: 0;
  font-size: 0.95rem;
  color: #e0e0e0;
}

input[type="checkbox"] {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
  accent-color: #a0c4ff;
}

.range-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

input[type="range"] {
  flex: 1;
  accent-color: #a0c4ff;
  cursor: pointer;
}

.range-value {
  font-size: 0.95rem;
  color: #a0c4ff;
  font-weight: 600;
  min-width: 3rem;
  text-align: right;
  font-family: monospace;
}
</style>

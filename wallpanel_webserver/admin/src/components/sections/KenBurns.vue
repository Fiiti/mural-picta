<template>
  <section class="card">
    <h2>{{ $t('sections.kenBurns') }}</h2>

    <div class="field">
      <div class="toggle-row">
        <label for="ken-burns-enabled">{{ $t('fields.ken_burns_enabled.label') }}</label>
        <input
          id="ken-burns-enabled"
          type="checkbox"
          :checked="modelValue.ken_burns_enabled"
          @change="update('ken_burns_enabled', $event.target.checked)"
        />
      </div>
      <p class="hint">{{ $t('fields.ken_burns_enabled.hint') }}</p>
    </div>

    <div class="field" v-if="modelValue.ken_burns_enabled">
      <label for="ken-burns-zoom">{{ $t('fields.ken_burns_zoom.label') }}</label>
      <div class="range-row">
        <input
          id="ken-burns-zoom"
          type="range"
          :value="modelValue.ken_burns_zoom"
          @input="update('ken_burns_zoom', Number($event.target.value))"
          min="1.0"
          max="2.0"
          step="0.05"
        />
        <span class="range-value">{{ modelValue.ken_burns_zoom?.toFixed(2) }}</span>
      </div>
      <p class="hint">{{ $t('fields.ken_burns_zoom.hint') }}</p>
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
  min-width: 2.5rem;
  text-align: right;
  font-family: monospace;
}
</style>

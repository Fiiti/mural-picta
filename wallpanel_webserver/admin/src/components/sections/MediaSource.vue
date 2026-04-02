<template>
  <section class="card">
    <h2>{{ $t('sections.mediaSource') }}</h2>

    <div class="field">
      <label for="media-base-path">{{ $t('fields.media_base_path.label') }}</label>
      <input
        id="media-base-path"
        type="text"
        :value="modelValue.media_base_path"
        @input="update('media_base_path', $event.target.value)"
        placeholder="/media/photos"
      />
      <p class="hint">{{ $t('fields.media_base_path.hint') }}</p>
    </div>

    <div class="field">
      <label for="media-update-interval">{{ $t('fields.media_list_update_interval.label') }}</label>
      <input
        id="media-update-interval"
        type="number"
        :value="modelValue.media_list_update_interval"
        @input="update('media_list_update_interval', Number($event.target.value))"
        min="60"
        step="60"
      />
      <p class="hint">{{ $t('fields.media_list_update_interval.hint') }}</p>
    </div>

    <div class="field">
      <label for="media-order">{{ $t('fields.media_order.label') }}</label>
      <select
        id="media-order"
        :value="modelValue.media_order"
        @change="update('media_order', $event.target.value)"
      >
        <option value="random">{{ $t('fields.media_order.options.random') }}</option>
        <option value="name">{{ $t('fields.media_order.options.name') }}</option>
        <option value="date">{{ $t('fields.media_order.options.date') }}</option>
      </select>
      <p class="hint">{{ $t('fields.media_order.hint') }}</p>
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

input[type="text"],
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

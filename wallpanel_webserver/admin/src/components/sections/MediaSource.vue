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

input[type="text"],
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

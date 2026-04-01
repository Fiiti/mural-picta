<template>
  <section class="card">
    <h2>{{ $t('sections.filter') }}</h2>

    <div class="field">
      <label>{{ $t('fields.exclude_filenames.label') }}</label>

      <!-- Tag-Chips -->
      <div class="tags-container" @click="focusInput">
        <span
          v-for="(tag, index) in tags"
          :key="index"
          class="tag"
        >
          {{ tag }}
          <button type="button" class="tag-remove" @click.stop="removeTag(index)">×</button>
        </span>
        <input
          ref="tagInput"
          v-model="inputValue"
          type="text"
          class="tag-input"
          placeholder="Add filter pattern..."
          @keydown.enter.prevent="addTag"
          @keydown.comma.prevent="addTag"
          @keydown.backspace="onBackspace"
        />
      </div>

      <p class="hint">{{ $t('fields.exclude_filenames.hint') }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')
const tagInput = ref(null)

const tags = computed(() => Array.isArray(props.modelValue.exclude_filenames) ? props.modelValue.exclude_filenames : [])

function focusInput() {
  tagInput.value?.focus()
}

function addTag() {
  const val = inputValue.value.trim().replace(/,$/, '').trim()
  if (val && !tags.value.includes(val)) {
    emit('update:modelValue', {
      ...props.modelValue,
      exclude_filenames: [...tags.value, val]
    })
  }
  inputValue.value = ''
}

function removeTag(index) {
  const updated = tags.value.filter((_, i) => i !== index)
  emit('update:modelValue', { ...props.modelValue, exclude_filenames: updated })
}

function onBackspace() {
  if (inputValue.value === '' && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
  }
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

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
  min-height: 2.5rem;
  background: #0d1b2a;
  border: 1px solid #0f3460;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  cursor: text;
  transition: border-color 0.15s;
}

.tags-container:focus-within {
  border-color: #a0c4ff;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #0f3460;
  color: #a0c4ff;
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
  font-size: 0.82rem;
  white-space: nowrap;
}

.tag-remove {
  background: none;
  border: none;
  color: #a0c4ff;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.tag-remove:hover {
  opacity: 1;
}

.tag-input {
  flex: 1;
  min-width: 120px;
  background: transparent;
  border: none;
  outline: none;
  color: #e0e0e0;
  font-size: 0.9rem;
  font-family: inherit;
  padding: 0.1rem 0.2rem;
}

.tag-input::placeholder {
  color: #444;
}
</style>

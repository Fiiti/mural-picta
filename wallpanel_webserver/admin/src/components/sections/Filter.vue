<template>
  <section class="card">
    <h2>{{ $t('sections.filter') }}</h2>

    <!-- Dateinamen ausschließen -->
    <div class="field">
      <label>{{ $t('fields.exclude_filenames.label') }}</label>
      <div class="tags-container" @click="focusInput('filename')">
        <span v-for="(tag, index) in filenameTags" :key="'f'+index" class="tag">
          {{ tag }}
          <button type="button" class="tag-remove" @click.stop="removeFilenameTag(index)">×</button>
        </span>
        <input
          ref="filenameInput"
          v-model="filenameInputValue"
          type="text"
          class="tag-input"
          placeholder="Add filter pattern…"
          @keydown="onFilenameKeydown"
          @keydown.backspace="onFilenameBackspace"
        />
      </div>
      <p class="hint" v-html="$t('fields.exclude_filenames.hint')"></p>
    </div>

    <!-- Ordner ausschließen -->
    <div class="field">
      <label>{{ $t('fields.exclude_folders.label') }}</label>
      <div class="tags-container" @click="focusInput('folder')">
        <span v-for="(tag, index) in folderTags" :key="'d'+index" class="tag">
          {{ tag }}
          <button type="button" class="tag-remove" @click.stop="removeFolderTag(index)">×</button>
        </span>
        <input
          ref="folderInput"
          v-model="folderInputValue"
          type="text"
          class="tag-input"
          placeholder="Folder name or regex…"
          @keydown="onFolderKeydown"
          @keydown.backspace="onFolderBackspace"
        />
      </div>
      <p class="hint" v-html="$t('fields.exclude_folders.hint')"></p>
    </div>

    <button class="help-btn" type="button" @click="$emit('open-help')">
      {{ $t('buttons.openFilterHelp') }}
    </button>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['modelValue'])
const emit  = defineEmits(['update:modelValue', 'open-help'])

const filenameInputValue = ref('')
const folderInputValue   = ref('')
const filenameInput      = ref(null)
const folderInput        = ref(null)

const filenameTags = computed(() =>
  Array.isArray(props.modelValue.exclude_filenames) ? props.modelValue.exclude_filenames : []
)
const folderTags = computed(() =>
  Array.isArray(props.modelValue.exclude_folders) ? props.modelValue.exclude_folders : []
)

function focusInput(type) {
  if (type === 'folder') folderInput.value?.focus()
  else filenameInput.value?.focus()
}

function addFilenameTags(raw) {
  const parts = raw.split(',').map(v => v.trim()).filter(v => v && !filenameTags.value.includes(v))
  if (parts.length) emit('update:modelValue', { ...props.modelValue, exclude_filenames: [...filenameTags.value, ...parts] })
  filenameInputValue.value = ''
}
function onFilenameKeydown(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addFilenameTags(filenameInputValue.value)
  }
}
function removeFilenameTag(index) {
  emit('update:modelValue', { ...props.modelValue, exclude_filenames: filenameTags.value.filter((_, i) => i !== index) })
}
function onFilenameBackspace() {
  if (filenameInputValue.value === '' && filenameTags.value.length > 0) removeFilenameTag(filenameTags.value.length - 1)
}

function addFolderTags(raw) {
  const parts = raw.split(',').map(v => v.trim()).filter(v => v && !folderTags.value.includes(v))
  if (parts.length) emit('update:modelValue', { ...props.modelValue, exclude_folders: [...folderTags.value, ...parts] })
  folderInputValue.value = ''
}
function onFolderKeydown(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addFolderTags(folderInputValue.value)
  }
}
function removeFolderTag(index) {
  emit('update:modelValue', { ...props.modelValue, exclude_folders: folderTags.value.filter((_, i) => i !== index) })
}
function onFolderBackspace() {
  if (folderInputValue.value === '' && folderTags.value.length > 0) removeFolderTag(folderTags.value.length - 1)
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
  line-height: 1.4;
  opacity: 0.7;
}

/* Tag-Input */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
  min-height: 2.5rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  cursor: text;
  transition: border-color 0.15s;
}
.tags-container:focus-within { border-color: var(--input-focus); }

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
  font-size: 0.82rem;
  white-space: nowrap;
  font-family: monospace;
}

.tag-remove {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.tag-remove:hover { opacity: 1; }

.tag-input {
  flex: 1;
  min-width: 160px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 0.9rem;
  font-family: monospace;
  padding: 0.1rem 0.2rem;
}
.tag-input::placeholder { color: var(--text-muted); opacity: 0.5; }

.help-btn {
  margin-top: 0.6rem;
  padding: 0.38rem 1rem;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  color: var(--accent);
  border-radius: 7px;
  font-size: 0.83rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.help-btn:hover {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}
</style>

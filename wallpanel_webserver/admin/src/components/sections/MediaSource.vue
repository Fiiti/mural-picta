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

    <!-- Block A: Connection Test -->
    <div class="field">
      <label>Connection Test</label>
      <div class="test-row">
        <button class="btn-test" :disabled="testLoading" @click="runTest">
          {{ testLoading ? 'Testing…' : 'Test Connection' }}
        </button>
        <span v-if="testResult" :class="['test-result', testResult.ok ? 'ok' : 'err']">
          <template v-if="testResult.ok">
            ✓ {{ testResult.fileCount }} files ({{ testResult.imageCount }} images, {{ testResult.videoCount }} videos) — {{ testResult.responseTimeMs }}ms
          </template>
          <template v-else>
            ✗ {{ testResult.error }}
          </template>
        </span>
      </div>
    </div>

    <!-- Block B: Indexed Files -->
    <div class="field">
      <label>Currently Indexed Files</label>
      <div class="test-row">
        <span class="count-badge">{{ mediaCount !== null ? mediaCount + ' files' : '–' }}</span>
        <button class="btn-refresh" @click="loadCount">↻ Refresh</button>
      </div>
      <p class="hint">Number of media files currently available from the configured path.</p>
    </div>

    <!-- Block C: Volume Mapping Hilfe -->
    <button class="help-btn" type="button" @click="$emit('open-help')">
      {{ $t('buttons.openMediaHelp') }}
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { testMediaSource, getMediaCount } from '../../api.js'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'open-help'])

function update(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const testLoading = ref(false)
const testResult = ref(null)
const mediaCount = ref(null)

async function runTest() {
  testLoading.value = true
  testResult.value = null
  try {
    testResult.value = await testMediaSource(props.modelValue.media_base_path)
  } catch (e) {
    testResult.value = { ok: false, error: e.message }
  } finally {
    testLoading.value = false
  }
}

async function loadCount() {
  mediaCount.value = await getMediaCount()
}

onMounted(loadCount)
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

.test-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-test, .btn-refresh {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}
.btn-test:disabled { opacity: 0.55; cursor: default; }
.btn-refresh {
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
}
.btn-refresh:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }

.test-result {
  font-size: 0.82rem;
  font-family: monospace;
}
.test-result.ok { color: #4caf7d; }
.test-result.err { color: #e05555; }

.count-badge {
  font-size: 0.9rem;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 0.3rem 0.6rem;
  font-family: monospace;
}

.help-btn {
  margin-top: 0.75rem;
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

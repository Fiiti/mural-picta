<template>
  <section class="card">
    <h2>{{ $t('sections.system') }}</h2>

    <div v-if="status" class="info-grid">
      <div class="info-row">
        <span class="info-label">{{ $t('system.version') }}</span>
        <span class="info-value">{{ status.version }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">{{ $t('system.uptime') }}</span>
        <span class="info-value">{{ formatUptime(status.uptime) }}</span>
      </div>
    </div>

    <!-- Aktionen -->
    <div class="actions">
      <button
        type="button"
        class="action-btn"
        @click="openSlideshow"
        :title="$t('system.reloadNote')"
      >
        {{ $t('buttons.reload') }}
      </button>
      <button
        type="button"
        class="action-btn danger"
        :disabled="restarting"
        @click="handleRestart"
      >
        {{ restarting ? $t('status.restarting') : $t('buttons.restart') }}
      </button>
    </div>

    <!-- Letzte Fehler -->
    <div class="errors-section">
      <h3>{{ $t('system.recentErrors') }}</h3>
      <div v-if="status && status.recentErrors && status.recentErrors.length > 0" class="error-list">
        <div
          v-for="(err, i) in status.recentErrors"
          :key="i"
          class="error-item"
        >
          <span class="error-ts">{{ formatTs(err.ts) }}</span>
          <span class="error-msg">{{ err.msg }}</span>
        </div>
      </div>
      <p v-else class="no-errors">{{ $t('system.noErrors') }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getStatus, restartServer } from '../../api.js'

const { t } = useI18n()

const status = ref(null)
const restarting = ref(false)
let intervalId = null

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h}h ${m}m ${s}s`
}

function formatTs(ts) {
  try {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return ts
  }
}

function openSlideshow() {
  window.open('/', '_blank')
}

async function handleRestart() {
  const confirmed = window.confirm(t('system.restartConfirm'))
  if (!confirmed) return
  restarting.value = true
  try {
    await restartServer()
  } catch {
    // Server startet neu - Verbindungsfehler erwartet
  }
  // Nach Neustart-Trigger kurz warten, dann Status neu laden
  setTimeout(async () => {
    restarting.value = false
    await loadStatus()
  }, 3000)
}

async function loadStatus() {
  try {
    status.value = await getStatus()
  } catch {
    // Status nicht verfuegbar - Server vielleicht gerade neugestartet
  }
}

onMounted(() => {
  loadStatus()
  intervalId = setInterval(loadStatus, 30000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
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

h3 {
  font-size: 0.82rem;
  color: #888;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.info-grid {
  margin-bottom: 1.2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(15, 52, 96, 0.5);
  font-size: 0.88rem;
}

.info-label {
  color: #888;
}

.info-value {
  color: #e0e0e0;
  font-weight: 500;
  font-family: monospace;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  padding: 0.45rem 1.1rem;
  border-radius: 6px;
  border: 1px solid #0f3460;
  background: #0f3460;
  color: #a0c4ff;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.action-btn:hover:not(:disabled) {
  opacity: 0.85;
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.action-btn.danger {
  background: rgba(255, 80, 80, 0.12);
  border-color: rgba(255, 80, 80, 0.3);
  color: #ff8888;
}

.errors-section {
  border-top: 1px solid #0f3460;
  padding-top: 1rem;
}

.error-list {
  max-height: 200px;
  overflow-y: auto;
  background: #0d1b2a;
  border: 1px solid #0f3460;
  border-radius: 6px;
}

.error-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid rgba(15, 52, 96, 0.5);
  font-size: 0.8rem;
  line-height: 1.4;
}

.error-item:last-child {
  border-bottom: none;
}

.error-ts {
  color: #555;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: monospace;
}

.error-msg {
  color: #ff8888;
  word-break: break-word;
}

.no-errors {
  font-size: 0.82rem;
  color: #555;
  font-style: italic;
}
</style>

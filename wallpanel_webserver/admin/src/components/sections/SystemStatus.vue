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
      <button type="button" class="action-btn" @click="openSlideshow" :title="$t('system.reloadNote')">
        {{ $t('buttons.reload') }}
      </button>
      <button type="button" class="action-btn log-btn" @click="showLogModal = true">
        📋 {{ $t('buttons.viewLog') }}
      </button>
      <button type="button" class="action-btn danger" :disabled="restarting" @click="handleRestart">
        {{ restarting ? $t('status.restarting') : $t('buttons.restart') }}
      </button>
    </div>

    <!-- Letzte Fehler (Kurzübersicht) -->
    <div class="errors-section">
      <h3>{{ $t('system.recentErrors') }}</h3>
      <div v-if="status && status.recentErrors && status.recentErrors.length > 0" class="error-list">
        <div v-for="(err, i) in status.recentErrors.slice(0, 5)" :key="i" class="error-item">
          <span class="error-ts">{{ formatTs(err.ts) }}</span>
          <span class="error-msg">{{ err.msg }}</span>
        </div>
        <div v-if="status.recentErrors.length > 5" class="more-hint">
          +{{ status.recentErrors.length - 5 }} more — click "{{ $t('buttons.viewLog') }}" for full log
        </div>
      </div>
      <p v-else class="no-errors">{{ $t('system.noErrors') }}</p>
    </div>

    <!-- Log-Modal -->
    <LogModal v-if="showLogModal" @close="showLogModal = false" />
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getStatus, restartServer } from '../../api.js'
import LogModal from '../LogModal.vue'

const { t } = useI18n()

const status     = ref(null)
const restarting = ref(false)
const showLogModal = ref(false)
let intervalId   = null

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h}h ${m}m ${s}s`
}

function formatTs(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch { return ts }
}

function openSlideshow() { window.open('/', '_blank') }

async function handleRestart() {
  if (!window.confirm(t('system.restartConfirm'))) return
  restarting.value = true
  try {
    await restartServer()
  } catch { /* Verbindungsfehler erwartet beim Neustart */ }
  setTimeout(async () => {
    restarting.value = false
    await loadStatus()
  }, 3000)
}

async function loadStatus() {
  try { status.value = await getStatus() } catch { /* Server vielleicht neugestartet */ }
}

onMounted(() => {
  loadStatus()
  intervalId = setInterval(loadStatus, 30000)
})
onUnmounted(() => { if (intervalId) clearInterval(intervalId) })
</script>

<style scoped>
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 0.82rem;
  color: var(--accent);
  margin-bottom: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
}

h3 {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.info-grid { margin-bottom: 1.2rem; }

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  font-size: 0.88rem;
}
.info-label { color: var(--text-muted); }
.info-value { color: var(--text); font-weight: 500; font-family: monospace; }

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  padding: 0.45rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--btn-secondary-bg);
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s, border-color 0.15s;
}
.action-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); border-color: var(--accent); }
.action-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.log-btn { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }

.action-btn.danger {
  background: rgba(180, 50, 50, 0.12);
  border-color: rgba(180, 50, 50, 0.35);
  color: #e07070;
}
.action-btn.danger:hover:not(:disabled) { border-color: rgba(180, 50, 50, 0.7); }

.errors-section {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

.error-list {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}

.error-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  font-size: 0.8rem;
  line-height: 1.4;
}
.error-item:last-child { border-bottom: none; }

.error-ts {
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
  font-family: monospace;
  font-size: 0.75rem;
}
.error-msg { color: #e07070; word-break: break-word; }

.more-hint {
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
  background: color-mix(in srgb, var(--accent) 6%, transparent);
}

.no-errors { font-size: 0.82rem; color: var(--text-muted); font-style: italic; }
</style>

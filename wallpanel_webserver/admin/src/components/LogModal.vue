<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <div class="modal-header">
        <h2>{{ $t('log.title') }}</h2>
        <div class="header-right">
          <span class="live-indicator">
            <span class="live-dot"></span>
            {{ $t('log.live') }}
          </span>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>
      </div>

      <div class="log-content">
        <div v-if="logs.length === 0" class="no-logs">{{ $t('log.noErrors') }}</div>
        <div
          v-for="(entry, i) in logs"
          :key="i"
          class="log-entry"
        >
          <span class="log-ts">{{ formatTs(entry.ts) }}</span>
          <span class="log-msg">{{ entry.msg }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getStatus } from '../api.js'

defineEmits(['close'])

const logs = ref([])
let intervalId = null

function formatTs(ts) {
  try {
    return new Date(ts).toLocaleString([], {
      month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
  } catch {
    return ts
  }
}

async function loadLogs() {
  try {
    const data = await getStatus()
    logs.value = data.recentErrors || []
  } catch {
    // Server nicht erreichbar – bleibt leer
  }
}

onMounted(() => {
  loadLogs()
  intervalId = setInterval(loadLogs, 2000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: backdropIn 0.2s ease;
}

@keyframes backdropIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal-panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: panelIn 0.2s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

@keyframes panelIn {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.modal-header h2 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Pulsierender Live-Indikator */
.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.6);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

.close-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 1.3rem;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s;
}
.close-btn:hover { color: var(--text); border-color: var(--accent); }

/* Log-Inhalt */
.log-content {
  overflow-y: auto;
  flex: 1;
  padding: 0.5rem 0;
}

.no-logs {
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.9rem;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.45rem 1.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  font-size: 0.82rem;
  line-height: 1.5;
  font-family: monospace;
}
.log-entry:last-child { border-bottom: none; }

.log-ts {
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 0.78rem;
}

.log-msg {
  color: #e07070;
  word-break: break-word;
}
</style>

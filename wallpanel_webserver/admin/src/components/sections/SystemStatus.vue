<template>
  <section class="card">
    <h2>{{ $t('sections.system') }}</h2>

    <!-- Produkt-Branding -->
    <div class="product-branding">
      <div class="product-name-block">
        <span class="product-name">MuralPicta</span>
        <span class="product-sub">A WallPanel Server</span>
      </div>
      <img :src="iconUrl" class="product-icon" alt="MuralPicta" />
    </div>

    <div v-if="status" class="info-grid">
      <div class="info-row">
        <span class="info-label">{{ $t('system.version') }}</span>
        <span class="info-value version-cell">
          {{ status.version }}
          <span v-if="newVersion" class="update-chip" :title="$t('system.updateAvailable', { v: newVersion })">
            🆕 v{{ newVersion }}
          </span>
        </span>
      </div>
      <div class="info-row">
        <span class="info-label">{{ $t('system.uptime') }}</span>
        <span class="info-value">{{ formatUptime(status.uptime) }}</span>
      </div>
    </div>

    <!-- Aktionen -->
    <div class="actions">
      <button type="button" class="action-btn reload-btn" @click="openSlideshow">
        🖼️ {{ $t('buttons.reload') }}
      </button>
      <button type="button" class="action-btn log-btn" @click="showLogModal = true">
        📋 {{ $t('buttons.viewLog') }}
      </button>
      <button v-if="!status?.isDocker" type="button" class="action-btn danger" :disabled="stopping" @click="handleStop">
        {{ stopping ? '⏹️ Stopping…' : ('🛑 ' + $t('buttons.stop')) }}
      </button>
      <div v-else class="docker-stop-hint">
        🐳 {{ $t('system.dockerStopHint') }}
      </div>
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
import { getStatus, stopServer } from '../../api.js'
import LogModal from '../LogModal.vue'
import iconUrl from '../../assets/app-logo.jpg'

const { t } = useI18n()

const status       = ref(null)
const stopping     = ref(false)
const showLogModal = ref(false)
const newVersion   = ref(null)
let intervalId     = null

const REPO = 'Fiiti/mural-picta'

function parseSemver(v) {
  return (v || '').replace(/^v/, '').split('+')[0].split('.').map(Number)
}

function isNewer(latest, current) {
  const [la, lb = 0, lc = 0] = parseSemver(latest)
  const [ca, cb = 0, cc = 0] = parseSemver(current)
  if (la !== ca) return la > ca
  if (lb !== cb) return lb > cb
  return lc > cc
}

async function checkForUpdates() {
  try {
    let latestTag = null
    // Releases zuerst, dann Tags als Fallback
    const relRes = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
    if (relRes.ok) {
      latestTag = (await relRes.json()).tag_name
    } else {
      const tagRes = await fetch(`https://api.github.com/repos/${REPO}/tags`)
      if (tagRes.ok) {
        const tags = await tagRes.json()
        if (tags.length > 0) latestTag = tags[0].name
      }
    }
    if (latestTag && status.value?.version && isNewer(latestTag, status.value.version)) {
      newVersion.value = latestTag.replace(/^v/, '')
    }
  } catch { /* kein Internet oder GitHub-Limit */ }
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

function formatTs(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch { return ts }
}

function openSlideshow() { window.open('/', '_blank') }

async function handleStop() {
  if (!window.confirm('Stop the server process? In Docker with restart:unless-stopped the container will NOT restart automatically.')) return
  stopping.value = true
  try { await stopServer() } catch { /* Verbindungsfehler erwartet */ }
  setTimeout(() => { stopping.value = false }, 4000)
}

async function loadStatus() {
  try { status.value = await getStatus() } catch { /* Server vielleicht neugestartet */ }
}

onMounted(async () => {
  await loadStatus()
  checkForUpdates()
  intervalId = setInterval(loadStatus, 30000)
})
onUnmounted(() => { if (intervalId) clearInterval(intervalId) })
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

h3 {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

/* Produkt-Branding */
.product-branding {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 0 1.1rem;
  margin-bottom: 1.1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
}

.product-name-block {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}

.product-name {
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.1;
  background: linear-gradient(120deg, var(--accent) 0%, var(--accent-light) 55%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-sub {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  -webkit-text-fill-color: var(--text-muted);
  background: none;
}

.product-icon {
  width: 128px;
  height: 128px;
  object-fit: contain;
  opacity: 0.88;
  flex-shrink: 0;
  align-self: flex-end;
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.docker-stop-hint {
  grid-column: span 2;
  font-size: 0.78rem;
  color: var(--text-muted);
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  line-height: 1.5;
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

.action-btn.reload-btn {
  background: rgba(40, 140, 70, 0.13);
  border-color: rgba(40, 140, 70, 0.38);
  color: #5cc87a;
}
.action-btn.reload-btn:hover:not(:disabled) { border-color: rgba(40, 140, 70, 0.72); }

.action-btn.warn-btn {
  background: rgba(200, 130, 20, 0.12);
  border-color: rgba(200, 130, 20, 0.38);
  color: #e0a840;
}
.action-btn.warn-btn:hover:not(:disabled) { border-color: rgba(200, 130, 20, 0.72); }

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

.version-cell { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

.update-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: color-mix(in srgb, #4caf7d 14%, transparent);
  border: 1px solid color-mix(in srgb, #4caf7d 40%, transparent);
  color: #4caf7d;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.15rem 0.55rem;
  border-radius: 20px;
  font-family: inherit;
  cursor: default;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
</style>

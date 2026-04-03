<template>
  <header class="admin-header">
    <div class="header-left">
      <img :src="iconUrl" class="header-icon" alt="WallPanel Server" />
      <span class="header-title">
        <span class="app-name-block">
          <span class="app-name">MuralPicta</span>
          <span class="app-sub">A WallPanel Server</span>
        </span>
        <span class="title-sep">◆</span>
        <span class="admin-label">Admin</span>
      </span>
    </div>
    <div class="header-center">
      <span
        v-if="status.message"
        class="status-badge"
        :class="{ error: status.isError }"
      >{{ status.message }}</span>
    </div>
    <div class="header-right">
      <!-- Sprach-Dropdown -->
      <select
        class="lang-select"
        :value="locale"
        @change="switchLang($event.target.value)"
        title="Language"
      >
        <option value="en">🌐 EN</option>
        <option value="de">🌐 DE</option>
      </select>

      <!-- Dark / Light Mode Toggle -->
      <button
        class="theme-toggle"
        @click="$emit('toggle-theme')"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >{{ isDark ? '☀️' : '🌙' }}</button>

      <!-- Documentation Button -->
      <button class="docs-btn" @click="$emit('open-docs')" title="Documentation">
        Docs
      </button>

      <button class="save-btn" @click="$emit('save')">{{ $t('buttons.save') }}</button>

      <!-- Heartbeat Indicator -->
      <div class="heartbeat" :title="heartbeatTitle">
        <span class="hb-dot" :class="heartbeatState"></span>
        <span class="hb-label">Heartbeat</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import iconUrl from '../assets/app-icon.jpg'

const props = defineProps({
  locale:       { type: String, required: true },
  currentTheme: { type: String, default: 'dark' },
  status:       { type: Object, default: () => ({ message: '', isError: false }) }
})

const emit = defineEmits(['update:locale', 'save', 'toggle-theme', 'open-docs'])

const { locale: i18nLocale } = useI18n()

const isDark = computed(() => props.currentTheme === 'dark')

function switchLang(lang) {
  i18nLocale.value = lang
  localStorage.setItem('wallpanel-lang', lang)
  emit('update:locale', lang)
}

// Heartbeat
const heartbeatState = ref('unknown')  // 'ok' | 'warning' | 'offline' | 'unknown'
const heartbeatTitle = computed(() => ({
  ok:      'Server running – no errors',
  warning: 'Server running – check recent errors',
  offline: 'Server unreachable',
  unknown: 'Checking…'
})[heartbeatState.value] || '')

let hbInterval = null

async function checkHeartbeat() {
  try {
    const res = await fetch('/api/status')
    if (!res.ok) { heartbeatState.value = 'offline'; return }
    const data = await res.json()
    heartbeatState.value = (data.recentErrors && data.recentErrors.length > 0) ? 'warning' : 'ok'
  } catch {
    heartbeatState.value = 'offline'
  }
}

onMounted(() => {
  checkHeartbeat()
  hbInterval = setInterval(checkHeartbeat, 10000)
})
onUnmounted(() => { if (hbInterval) clearInterval(hbInterval) })
</script>

<style scoped>
.admin-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--status-bar-bg);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--header-shadow);
}

/* Fading-Akzentlinie am unteren Rand des Headers */
.admin-header::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    var(--accent) 0%,
    color-mix(in srgb, var(--accent) 30%, transparent) 40%,
    transparent 75%
  );
  pointer-events: none;
}

.header-left {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

/* App-Icon */
.header-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  opacity: 0.92;
}

/* Titelzeile: "MuralPicta / A WallPanel Server ◆ Admin" */
.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.app-name-block {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  line-height: 1.1;
}

.app-name {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  background: linear-gradient(120deg, var(--accent) 0%, var(--accent-light) 55%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-sub {
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  -webkit-text-fill-color: var(--text-muted);
  background: none;
  opacity: 0.75;
}

.title-sep {
  font-size: 0.55rem;
  color: var(--text-muted);
  opacity: 0.6;
  -webkit-text-fill-color: var(--text-muted);
  /* Gradient überschreiben */
  background: none;
}

.admin-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  -webkit-text-fill-color: var(--text-muted);
  background: none;
}

.header-center {
  flex: 1;
  text-align: center;
  min-height: 1.4em;
}

.status-badge {
  display: inline-block;
  padding: 0.22rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  animation: fadeIn 0.2s ease;
  letter-spacing: 0.01em;
}

.status-badge.error {
  background: rgba(200, 60, 60, 0.13);
  color: #e07070;
  border-color: rgba(200, 60, 60, 0.28);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-3px); }
  to   { opacity: 1; transform: translateY(0); }
}

.header-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Sprach-Dropdown */
.lang-select {
  background: var(--btn-secondary-bg);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 0.35rem 0.55rem;
  font-size: 0.8rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s, color 0.15s;
  font-family: inherit;
}
.lang-select:focus,
.lang-select:hover { border-color: var(--accent); color: var(--text); }

/* Theme-Toggle */
.theme-toggle {
  background: var(--btn-secondary-bg);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 0.32rem 0.55rem;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.theme-toggle:hover {
  background: var(--card-bg-hover);
  border-color: var(--accent);
}

/* Speichern-Button */
.save-btn {
  padding: 0.42rem 1.15rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 7px;
  border: none;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
  letter-spacing: 0.01em;
}
.save-btn:hover  {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accent-glow);
}
.save-btn:active { transform: translateY(0); box-shadow: none; }

/* Docs-Button */
.docs-btn {
  padding: 0.32rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--btn-secondary-bg);
  color: var(--text-muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  font-family: inherit;
}
.docs-btn:hover { border-color: var(--accent); color: var(--text); }

/* Heartbeat */
.heartbeat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-left: 0.25rem;
}

.hb-label {
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  opacity: 0.6;
  line-height: 1;
}

.hb-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
  background: var(--text-muted);
  opacity: 0.4;
}

.hb-dot.ok {
  background: #4caf7d;
  opacity: 1;
  animation: hb-pulse 2s ease-in-out infinite;
}

.hb-dot.warning {
  background: #e0b040;
  opacity: 1;
}

.hb-dot.offline {
  background: #e05555;
  opacity: 1;
}

@keyframes hb-pulse {
  0%, 100% { background: #4caf7d; }
  50%       { background: #555568; }
}
</style>

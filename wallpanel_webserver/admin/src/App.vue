<template>
  <div class="app">
    <AdminHeader
      :locale="currentLocale"
      :current-theme="theme"
      @update:locale="currentLocale = $event"
      @save="saveAll"
      :status="saveStatus"
      @toggle-theme="toggleTheme"
    />

    <PinLogin v-if="showPinLogin" @authenticated="onAuthenticated" />

    <main v-else class="content">
      <template v-if="config">
        <MediaSource v-model="config" />
        <Slideshow v-model="config" />
        <KenBurns v-model="config" />
        <InfoOverlay v-model="config" @open-help="showHelp = true" />
        <VideoSection v-model="config" />
        <Display v-model="config" />
        <Filter v-model="config" />
        <Debug v-model="config" />
        <Security />
        <SystemStatus />
      </template>
      <div v-else class="loading-state">{{ $t('status.loading') }}</div>
    </main>

    <HelpModal
      v-if="showHelp"
      :locale="currentLocale"
      @close="showHelp = false"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import AdminHeader from './components/AdminHeader.vue'
import PinLogin from './components/PinLogin.vue'
import HelpModal from './components/HelpModal.vue'

import MediaSource from './components/sections/MediaSource.vue'
import Slideshow from './components/sections/Slideshow.vue'
import KenBurns from './components/sections/KenBurns.vue'
import InfoOverlay from './components/sections/InfoOverlay.vue'
import VideoSection from './components/sections/Video.vue'
import Display from './components/sections/Display.vue'
import Filter from './components/sections/Filter.vue'
import Debug from './components/sections/Debug.vue'
import Security from './components/sections/Security.vue'
import SystemStatus from './components/sections/SystemStatus.vue'

import { getConfig, saveConfig, getAuthStatus } from './api.js'

const { locale } = useI18n()

const config = ref(null)
const currentLocale = ref(locale.value)
const showHelp = ref(false)
const showPinLogin = ref(false)
const saveStatus = ref({ message: '', isError: false })

// Theme-System
const theme = ref(localStorage.getItem('wallpanel-theme') || 'dark')

watch(theme, (val) => {
  document.documentElement.setAttribute('data-theme', val)
  localStorage.setItem('wallpanel-theme', val)
}, { immediate: true })

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

let statusTimeout = null

function showSaveStatus(msg, isError = false) {
  saveStatus.value = { message: msg, isError }
  if (statusTimeout) clearTimeout(statusTimeout)
  statusTimeout = setTimeout(() => {
    saveStatus.value = { message: '', isError: false }
  }, 3000)
}

async function loadConfig() {
  try {
    config.value = await getConfig()
  } catch (err) {
    showSaveStatus('Error loading config: ' + err.message, true)
  }
}

async function checkAuth() {
  try {
    const status = await getAuthStatus()
    // Wenn PIN gesetzt und noch nicht authentifiziert, Login anzeigen
    if (status.requiresPin) {
      showPinLogin.value = true
    }
  } catch {
    // Auth-Endpunkt nicht verfuegbar - kein PIN-Schutz
    showPinLogin.value = false
  }
}

function onAuthenticated() {
  showPinLogin.value = false
}

async function saveAll() {
  if (!config.value) return
  try {
    await saveConfig(config.value)
    showSaveStatus('Settings saved successfully.')
  } catch (err) {
    showSaveStatus('Error saving settings: ' + err.message, true)
  }
}

onMounted(async () => {
  await checkAuth()
  await loadConfig()
})
</script>

<style>
/* CSS Custom Properties – Theme-System */
:root,
:root[data-theme="dark"] {
  --bg: #241D21;
  --bg-gradient: radial-gradient(ellipse at 25% 15%, rgba(125, 31, 198, 0.18) 0%, transparent 55%),
                 radial-gradient(ellipse at 75% 85%, rgba(125, 31, 198, 0.10) 0%, transparent 50%),
                 linear-gradient(160deg, #241D21 0%, #1E1620 60%, #241D21 100%);
  --card-bg: #2D2530;
  --card-bg-hover: #342A38;
  --border: #3D3245;
  --text: #E7E3E5;
  --text-muted: #8C947C;
  --accent: #7D1FC6;
  --accent-light: #9B45D6;
  --accent-contrast: #E7E3E5;
  --input-bg: #1A1317;
  --input-border: #3D3245;
  --input-focus: #7D1FC6;
  --btn-primary-bg: #7D1FC6;
  --btn-primary-text: #E7E3E5;
  --btn-secondary-bg: #2D2530;
  --btn-secondary-text: #E7E3E5;
  --btn-danger-bg: #6B1A2A;
  --btn-danger-text: #E7E3E5;
  --status-bar-bg: #2D2530;
  --scrollbar: #3D3245;
}

:root[data-theme="light"] {
  --bg: #D1CBC8;
  --bg-gradient: radial-gradient(ellipse at 70% 20%, rgba(157, 116, 93, 0.20) 0%, transparent 55%),
                 radial-gradient(ellipse at 20% 80%, rgba(118, 86, 72, 0.12) 0%, transparent 50%),
                 linear-gradient(160deg, #D1CBC8 0%, #C8C0BC 60%, #D1CBC8 100%);
  --card-bg: #E8E2DF;
  --card-bg-hover: #EDE8E5;
  --border: #C0B5B0;
  --text: #1F2026;
  --text-muted: #765648;
  --accent: #9D745D;
  --accent-light: #B08870;
  --accent-contrast: #FFFFFF;
  --input-bg: #F5F0EE;
  --input-border: #C0B5B0;
  --input-focus: #9D745D;
  --btn-primary-bg: #9D745D;
  --btn-primary-text: #FFFFFF;
  --btn-secondary-bg: #E8E2DF;
  --btn-secondary-text: #1F2026;
  --btn-danger-bg: #8B3A3A;
  --btn-danger-text: #FFFFFF;
  --status-bar-bg: #E8E2DF;
  --scrollbar: #C0B5B0;
}

/* Globale Basis-Styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-gradient);
  background-color: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

/* Globale Scrollbar-Stile */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--scrollbar);
  border-radius: 3px;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
}

.content {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}
</style>

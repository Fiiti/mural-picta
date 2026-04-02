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
/* ============================================================
   CSS Design Tokens – Theme-System
   Dark:  Echtes Schwarz + Gold/Metallisch
   Light: Hellgrünes Grau + Waldgrün
   ============================================================ */

:root,
:root[data-theme="dark"] {
  /* Hintergründe */
  --bg: #0E0E12;
  --bg-gradient: linear-gradient(160deg, #0D0E13 0%, #11121A 55%, #0E0D12 100%);
  --card-bg: #15151C;
  --card-bg-hover: #1A1A24;
  --card-radius: 12px;
  --card-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);

  /* Rahmen */
  --border: #21212E;

  /* Text */
  --text: #ECEDF2;
  --text-label: #9898B8;   /* Feldüberschriften: heller als muted */
  --text-muted: #7E7E98;   /* Hinweistexte */

  /* Akzent: Gold / Metallisch */
  --accent: #C9A84C;
  --accent-light: #E2C97E;
  --accent-contrast: #0A0A0E;
  --accent-glow: rgba(201, 168, 76, 0.18);

  /* Eingabefelder */
  --input-bg: #0C0C13;
  --input-border: #1D1D2C;
  --input-focus: #C9A84C;

  /* Buttons */
  --btn-primary-bg: #C9A84C;
  --btn-primary-text: #0A0A0E;
  --btn-secondary-bg: #1A1A24;
  --btn-secondary-text: #ECEDF2;
  --btn-danger-bg: rgba(180, 50, 50, 0.12);
  --btn-danger-text: #E08080;
  --btn-danger-border: rgba(180, 50, 50, 0.30);

  /* Sonstiges */
  --status-bar-bg: #0F0F16;
  --scrollbar: #21212E;
  --header-shadow: 0 4px 24px rgba(0, 0, 0, 0.55);
}

:root[data-theme="light"] {
  /* Hintergründe */
  --bg: #F2F5F2;
  --bg-gradient: linear-gradient(160deg, #EFF3EF 0%, #F5F8F5 60%, #EEF2EE 100%);
  --card-bg: #FFFFFF;
  --card-bg-hover: #F7FAF7;
  --card-radius: 12px;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 14px rgba(0, 0, 0, 0.05);

  /* Rahmen */
  --border: #D2E2D2;

  /* Text */
  --text: #1A201A;
  --text-label: #2E4E2E;   /* Feldüberschriften: satter als muted */
  --text-muted: #4E6B4E;   /* Hinweistexte */

  /* Akzent: Waldgrün */
  --accent: #2D7A3A;
  --accent-light: #4EAF5D;
  --accent-contrast: #FFFFFF;
  --accent-glow: rgba(45, 122, 58, 0.13);

  /* Eingabefelder */
  --input-bg: #FAFCFA;
  --input-border: #BACED4;
  --input-focus: #2D7A3A;

  /* Buttons */
  --btn-primary-bg: #2D7A3A;
  --btn-primary-text: #FFFFFF;
  --btn-secondary-bg: #EAF0EA;
  --btn-secondary-text: #1A201A;
  --btn-danger-bg: rgba(180, 50, 50, 0.08);
  --btn-danger-text: #C62828;
  --btn-danger-border: rgba(180, 50, 50, 0.25);

  /* Sonstiges */
  --status-bar-bg: #FFFFFF;
  --scrollbar: #BACED4;
  --header-shadow: 0 1px 0 #D2E2D2, 0 2px 12px rgba(0, 0, 0, 0.07);
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
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}

/* Globale Scrollbar-Stile */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--scrollbar);
  border-radius: 3px;
}
</style>

<style>
/* ============================================================
   Globale Typografie-Overrides für alle Section-Cards.
   Höhere Spezifizität als Vue-Scoped-Styles → überschreibt
   korrekt ohne !important.
   Gilt NICHT für Modals (LogModal, HelpModal).
   ============================================================ */

/* Section-Titel: etwas größer */
.content section h2 {
  font-size: 0.8rem;
}

/* Feld-Labels: etwas größer + heller (--text-label statt --text-muted) */
.content .field label {
  font-size: 0.875rem;
  color: var(--text-label);
}

/* Toggle-Row Labels (inline neben Checkbox): etwas größer */
.content .toggle-row > label {
  font-size: 0.95rem;
  color: var(--text);
}

/* Hint-Texte: etwas größer + etwas besser sichtbar */
.content section .hint {
  font-size: 0.8rem;
  opacity: 0.82;
}

/* Eingabefelder: minimal größer */
.content input[type="text"],
.content input[type="number"],
.content input[type="password"],
.content select,
.content textarea {
  font-size: 0.95rem;
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

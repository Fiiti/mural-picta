<template>
  <div class="app">
    <AdminHeader
      :locale="currentLocale"
      @update:locale="currentLocale = $event"
      @save="saveAll"
      :status="saveStatus"
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
import { ref, onMounted } from 'vue'
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
/* Globale Basis-Styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: #1a1a2e;
  color: #e0e0e0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
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
  color: #888;
  font-size: 0.95rem;
}
</style>

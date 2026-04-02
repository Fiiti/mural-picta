<template>
  <div class="pin-login-wrapper">
    <div class="pin-card">
      <!-- Oberer Bereich: Produktname links, Logo rechts -->
      <div class="pin-header">
        <div class="brand-block">
          <span class="brand-name">MuralPicta</span>
          <span class="brand-sub">A WallPanel Server</span>
        </div>
        <img :src="logoUrl" class="brand-logo" alt="MuralPicta" />
      </div>

      <!-- Trennlinie -->
      <div class="pin-divider"></div>

      <!-- PIN-Dialog -->
      <p class="login-prompt">{{ $t('pin.loginPrompt') }}</p>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label for="pin-input">{{ $t('pin.enterPin') }}</label>
          <div class="pin-input-wrap">
            <input
              id="pin-input"
              ref="pinInput"
              v-model="pin"
              type="password"
              autocomplete="current-password"
              :placeholder="$t('pin.enterPin')"
              autofocus
            />
          </div>
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <div class="btn-wrap">
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? $t('status.loading') : $t('buttons.login') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { login } from '../api.js'
import logoUrl from '../assets/app-logo.jpg'

const emit = defineEmits(['authenticated'])
const { t } = useI18n()

const pin = ref('')
const errorMsg = ref('')
const loading = ref(false)
const pinInput = ref(null)

async function handleLogin() {
  if (!pin.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    const ok = await login(pin.value)
    if (ok) {
      emit('authenticated')
    } else {
      errorMsg.value = t('pin.wrongPin')
      pin.value = ''
      pinInput.value?.focus()
    }
  } catch {
    errorMsg.value = t('pin.wrongPin')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.pin-login-wrapper {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.pin-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  padding: 2.5rem 2.5rem 2rem;
  width: 100%;
  max-width: 520px;
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
}
.pin-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 15%, transparent) 65%, transparent 100%);
}

/* Oberer Header-Bereich: Name links, Logo rechts */
.pin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
}

.brand-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.brand-name {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1;
  background: linear-gradient(120deg, var(--accent) 0%, var(--accent-light) 55%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.brand-sub {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #A8B0BE;
  -webkit-text-fill-color: #A8B0BE;
  background: none;
  white-space: nowrap;
}

.brand-logo {
  width: 110px;
  height: 110px;
  border-radius: 10px;
  object-fit: cover;
  opacity: 0.9;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.35);
  flex-shrink: 0;
}

/* Trennlinie */
.pin-divider {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    color-mix(in srgb, var(--accent) 30%, transparent) 30%,
    color-mix(in srgb, var(--accent) 30%, transparent) 70%,
    transparent 100%
  );
  margin-bottom: 1.5rem;
}

.login-prompt {
  font-size: 0.87rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  text-align: center;
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
  text-align: center;
}

/* PIN-Feld auf feste Breite zentriert */
.pin-input-wrap {
  display: flex;
  justify-content: center;
}

input[type="password"] {
  width: 200px;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 7px;
  color: var(--text);
  padding: 0.55rem 0.75rem;
  font-size: 1rem;
  outline: none;
  text-align: center;
  letter-spacing: 0.2em;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
input[type="password"]:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.error-msg {
  color: #e08080;
  font-size: 0.82rem;
  margin-bottom: 0.8rem;
  text-align: center;
}

/* Login-Button zentriert, nicht full-width */
.btn-wrap {
  display: flex;
  justify-content: center;
}

.login-btn {
  padding: 0.6rem 2.5rem;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
  border-radius: 7px;
  font-size: 0.93rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s, box-shadow 0.15s, transform 0.1s;
}
.login-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accent-glow);
}
.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

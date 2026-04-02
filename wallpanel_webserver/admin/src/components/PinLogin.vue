<template>
  <div class="pin-login-wrapper">
    <div class="pin-card">
      <h2>{{ $t('pin.loginTitle') }}</h2>
      <p class="login-prompt">{{ $t('pin.loginPrompt') }}</p>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label for="pin-input">{{ $t('pin.enterPin') }}</label>
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
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? $t('status.loading') : $t('buttons.login') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { login } from '../api.js'

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
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 360px;
  text-align: center;
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

h2 {
  font-size: 0.88rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.login-prompt {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

input[type="password"] {
  width: 100%;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 7px;
  color: var(--text);
  padding: 0.55rem 0.75rem;
  font-size: 1rem;
  outline: none;
  text-align: center;
  letter-spacing: 0.15em;
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
}

.login-btn {
  width: 100%;
  padding: 0.6rem;
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

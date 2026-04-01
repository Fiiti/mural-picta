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
  background: #16213e;
  border: 1px solid #0f3460;
  border-radius: 10px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 360px;
  text-align: center;
}

h2 {
  font-size: 1.1rem;
  color: #a0c4ff;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.login-prompt {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  font-size: 0.82rem;
  color: #aaa;
  margin-bottom: 0.3rem;
}

input[type="password"] {
  width: 100%;
  background: #0d1b2a;
  border: 1px solid #0f3460;
  border-radius: 6px;
  color: #e0e0e0;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  outline: none;
  text-align: center;
  letter-spacing: 0.15em;
}

input[type="password"]:focus {
  border-color: #a0c4ff;
}

.error-msg {
  color: #ff8888;
  font-size: 0.82rem;
  margin-bottom: 0.8rem;
}

.login-btn {
  width: 100%;
  padding: 0.6rem;
  background: #a0c4ff;
  color: #0d1b2a;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<template>
  <section class="card">
    <h2>{{ $t('sections.security') }}</h2>

    <!-- Status-Anzeige -->
    <div class="status-row" :class="pinActive ? 'pin-on' : 'pin-off'">
      <span class="status-dot"></span>
      <span>{{ pinActive ? $t('pin.pinActive') : $t('pin.noPin') }}</span>
    </div>

    <!-- Feedback-Meldung -->
    <p v-if="feedback.message" class="feedback" :class="{ error: feedback.isError }">
      {{ feedback.message }}
    </p>

    <!-- PIN setzen / ändern -->
    <form class="pin-form" @submit.prevent="handleSetPin">
      <h3>{{ pinActive ? $t('pin.changePinTitle') : $t('pin.setPinTitle') }}</h3>

      <div class="field">
        <label for="new-pin">{{ $t('pin.newPin') }}</label>
        <input id="new-pin" v-model="newPin" type="password" autocomplete="new-password" />
      </div>

      <div class="field">
        <label for="confirm-pin">{{ $t('pin.confirmPin') }}</label>
        <input id="confirm-pin" v-model="confirmPin" type="password" autocomplete="new-password" />
      </div>

      <p v-if="validationError" class="validation-error">{{ validationError }}</p>

      <button type="submit" class="action-btn primary" :disabled="loading">
        {{ pinActive ? $t('buttons.changePin') : $t('buttons.setPin') }}
      </button>
    </form>

    <!-- PIN entfernen -->
    <div v-if="pinActive" class="remove-section">
      <button type="button" class="action-btn danger" :disabled="loading" @click="handleRemovePin">
        {{ $t('buttons.removePin') }}
      </button>
    </div>

    <!-- PIN-Recovery -->
    <button class="help-btn" type="button" @click="$emit('open-help')">
      🔑 {{ $t('buttons.openPinHelp') }}
    </button>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAuthStatus, setPin, removePin } from '../../api.js'

defineEmits(['open-help'])

const { t } = useI18n()

const pinActive   = ref(false)
const newPin      = ref('')
const confirmPin  = ref('')
const loading     = ref(false)
const feedback    = ref({ message: '', isError: false })

const validationError = computed(() => {
  if (!newPin.value && !confirmPin.value) return ''
  if (newPin.value.length > 0 && newPin.value.length < 4) return t('pin.pinTooShort')
  if (!/^[a-zA-Z0-9]*$/.test(newPin.value)) return t('pin.pinInvalidChars')
  if (confirmPin.value && newPin.value !== confirmPin.value) return t('pin.pinMismatch')
  return ''
})

async function loadStatus() {
  try {
    const s = await getAuthStatus()
    pinActive.value = s.pinSet === true
  } catch { pinActive.value = false }
}

function showFeedback(msg, isError = false) {
  feedback.value = { message: msg, isError }
  setTimeout(() => { feedback.value = { message: '', isError: false } }, 3500)
}

async function handleSetPin() {
  if (!newPin.value || validationError.value) return
  loading.value = true
  try {
    const ok = await setPin(newPin.value)
    if (ok) {
      showFeedback(t('status.pinSet'))
      pinActive.value = true
      newPin.value = ''
      confirmPin.value = ''
    } else {
      showFeedback(t('status.pinSetError'), true)
    }
  } catch { showFeedback(t('status.pinSetError'), true) }
  finally { loading.value = false }
}

async function handleRemovePin() {
  loading.value = true
  try {
    const ok = await removePin()
    if (ok) {
      showFeedback(t('status.pinRemoved'))
      pinActive.value = false
    } else {
      showFeedback(t('status.pinRemoveError'), true)
    }
  } catch { showFeedback(t('status.pinRemoveError'), true) }
  finally { loading.value = false }
}

onMounted(loadStatus)
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
  font-size: 0.88rem;
  color: var(--text);
  margin-bottom: 0.8rem;
  font-weight: 600;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  font-size: 0.88rem;
  margin-bottom: 1.2rem;
}
.status-row.pin-off {
  background: color-mix(in srgb, var(--text-muted) 10%, transparent);
  border: 1px solid var(--border);
  color: var(--text-muted);
}
.status-row.pin-on {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  color: var(--accent);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pin-off .status-dot { background: var(--text-muted); }
.pin-on  .status-dot { background: var(--accent); box-shadow: 0 0 6px color-mix(in srgb, var(--accent) 60%, transparent); }

.feedback {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.82rem;
  margin-bottom: 1rem;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
}
.feedback.error {
  background: rgba(180, 50, 50, 0.12);
  color: #e07070;
  border-color: rgba(180, 50, 50, 0.25);
}

.pin-form {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.field { margin-bottom: 0.85rem; }

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
  border-radius: 6px;
  color: var(--text);
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
}
input:focus { border-color: var(--input-focus); }

.validation-error { font-size: 0.78rem; color: #e07070; margin-bottom: 0.6rem; }

.action-btn {
  padding: 0.45rem 1.1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.action-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.action-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.action-btn.primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}
.action-btn.danger {
  background: rgba(180, 50, 50, 0.15);
  color: #e07070;
  border: 1px solid rgba(180, 50, 50, 0.3);
}

.remove-section {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.help-btn {
  margin-top: 1rem;
  padding: 0.38rem 1rem;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  color: var(--accent);
  border-radius: 7px;
  font-size: 0.83rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.help-btn:hover {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}
</style>

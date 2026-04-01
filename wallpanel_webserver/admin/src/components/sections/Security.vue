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

    <!-- PIN setzen / aendern -->
    <form class="pin-form" @submit.prevent="handleSetPin">
      <h3>{{ pinActive ? $t('pin.changePinTitle') : $t('pin.setPinTitle') }}</h3>

      <div class="field">
        <label for="new-pin">{{ $t('pin.newPin') }}</label>
        <input
          id="new-pin"
          v-model="newPin"
          type="password"
          autocomplete="new-password"
        />
      </div>

      <div class="field">
        <label for="confirm-pin">{{ $t('pin.confirmPin') }}</label>
        <input
          id="confirm-pin"
          v-model="confirmPin"
          type="password"
          autocomplete="new-password"
        />
      </div>

      <p v-if="validationError" class="validation-error">{{ validationError }}</p>

      <button type="submit" class="action-btn primary" :disabled="loading">
        {{ pinActive ? $t('buttons.changePin') : $t('buttons.setPin') }}
      </button>
    </form>

    <!-- PIN entfernen -->
    <div v-if="pinActive" class="remove-section">
      <button
        type="button"
        class="action-btn danger"
        :disabled="loading"
        @click="handleRemovePin"
      >
        {{ $t('buttons.removePin') }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAuthStatus, setPin, removePin } from '../../api.js'

const { t } = useI18n()

const pinActive = ref(false)
const newPin = ref('')
const confirmPin = ref('')
const loading = ref(false)
const feedback = ref({ message: '', isError: false })

const validationError = computed(() => {
  if (!newPin.value && !confirmPin.value) return ''
  if (newPin.value.length > 0 && newPin.value.length < 4) return t('pin.pinTooShort')
  if (!/^[a-zA-Z0-9]*$/.test(newPin.value)) return t('pin.pinInvalidChars')
  if (confirmPin.value && newPin.value !== confirmPin.value) return t('pin.pinMismatch')
  return ''
})

async function loadStatus() {
  try {
    const status = await getAuthStatus()
    pinActive.value = status.pinSet === true
  } catch {
    pinActive.value = false
  }
}

function showFeedback(msg, isError = false) {
  feedback.value = { message: msg, isError }
  setTimeout(() => { feedback.value = { message: '', isError: false } }, 3500)
}

async function handleSetPin() {
  if (!newPin.value) return
  if (validationError.value) return
  if (newPin.value.length < 4) {
    return
  }

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
  } catch {
    showFeedback(t('status.pinSetError'), true)
  } finally {
    loading.value = false
  }
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
  } catch {
    showFeedback(t('status.pinRemoveError'), true)
  } finally {
    loading.value = false
  }
}

onMounted(loadStatus)
</script>

<style scoped>
.card {
  background: #16213e;
  border: 1px solid #0f3460;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 0.82rem;
  color: #a0c4ff;
  margin-bottom: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
}

h3 {
  font-size: 0.88rem;
  color: #ccc;
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
  background: rgba(100, 100, 100, 0.1);
  border: 1px solid #333;
  color: #888;
}

.status-row.pin-on {
  background: rgba(160, 196, 255, 0.08);
  border: 1px solid rgba(160, 196, 255, 0.3);
  color: #a0c4ff;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pin-off .status-dot { background: #555; }
.pin-on .status-dot { background: #a0c4ff; box-shadow: 0 0 6px rgba(160,196,255,0.5); }

.feedback {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.82rem;
  margin-bottom: 1rem;
  background: rgba(160, 196, 255, 0.1);
  color: #a0c4ff;
  border: 1px solid rgba(160, 196, 255, 0.2);
}

.feedback.error {
  background: rgba(255, 100, 100, 0.1);
  color: #ff8888;
  border-color: rgba(255, 100, 100, 0.2);
}

.pin-form {
  border-top: 1px solid #0f3460;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.field { margin-bottom: 0.85rem; }

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
  font-size: 0.95rem;
  outline: none;
  font-family: inherit;
}

input:focus {
  border-color: #a0c4ff;
}

.validation-error {
  font-size: 0.78rem;
  color: #ff8888;
  margin-bottom: 0.6rem;
}

.action-btn {
  padding: 0.45rem 1.1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.action-btn:hover:not(:disabled) {
  opacity: 0.88;
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.action-btn.primary {
  background: #a0c4ff;
  color: #0d1b2a;
}

.action-btn.danger {
  background: rgba(255, 80, 80, 0.15);
  color: #ff8888;
  border: 1px solid rgba(255, 80, 80, 0.3);
}

.remove-section {
  border-top: 1px solid #0f3460;
  padding-top: 1rem;
}
</style>

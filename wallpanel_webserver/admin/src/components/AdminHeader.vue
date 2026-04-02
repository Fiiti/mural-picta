<template>
  <header class="admin-header">
    <div class="header-left">
      <span class="header-title">{{ $t('header.title') }}</span>
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

      <button class="save-btn" @click="$emit('save')">{{ $t('buttons.save') }}</button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  locale:       { type: String, required: true },
  currentTheme: { type: String, default: 'dark' },
  status:       { type: Object, default: () => ({ message: '', isError: false }) }
})

const emit = defineEmits(['update:locale', 'save', 'toggle-theme'])

const { locale: i18nLocale } = useI18n()

const isDark = computed(() => props.currentTheme === 'dark')

function switchLang(lang) {
  i18nLocale.value = lang
  localStorage.setItem('wallpanel-lang', lang)
  emit('update:locale', lang)
}
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
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.header-left { flex: 0 0 auto; }

.header-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.03em;
}

.header-center {
  flex: 1;
  text-align: center;
  min-height: 1.4em;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.82rem;
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  animation: fadeIn 0.2s ease;
}

.status-badge.error {
  background: rgba(200, 60, 60, 0.15);
  color: #e07070;
  border-color: rgba(200, 60, 60, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.header-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* Sprach-Dropdown */
.lang-select {
  background: var(--btn-secondary-bg);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.35rem 0.55rem;
  font-size: 0.82rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}
.lang-select:focus,
.lang-select:hover { border-color: var(--accent); }

/* Theme-Toggle */
.theme-toggle {
  background: var(--btn-secondary-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.32rem 0.55rem;
  font-size: 1.05rem;
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
  padding: 0.45rem 1.1rem;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.save-btn:hover  { opacity: 0.88; transform: translateY(-1px); }
.save-btn:active { transform: translateY(0); }
</style>

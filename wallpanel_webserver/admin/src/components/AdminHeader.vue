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
      <div class="lang-switcher">
        <button
          :class="{ active: locale === 'en' }"
          @click="switchLang('en')"
          title="English"
        >EN</button>
        <button
          :class="{ active: locale === 'de' }"
          @click="switchLang('de')"
          title="Deutsch"
        >DE</button>
      </div>
      <button class="save-btn" @click="$emit('save')">{{ $t('buttons.save') }}</button>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  locale: { type: String, required: true },
  status: { type: Object, default: () => ({ message: '', isError: false }) }
})

const emit = defineEmits(['update:locale', 'save'])

const { locale: i18nLocale } = useI18n()

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
  background: #16213e;
  border-bottom: 1px solid #0f3460;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.header-left {
  flex: 0 0 auto;
}

.header-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #a0c4ff;
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
  background: rgba(160, 196, 255, 0.15);
  color: #a0c4ff;
  border: 1px solid rgba(160, 196, 255, 0.3);
  animation: fadeIn 0.2s ease;
}

.status-badge.error {
  background: rgba(255, 100, 100, 0.15);
  color: #ff8888;
  border-color: rgba(255, 100, 100, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lang-switcher {
  display: flex;
  gap: 0.25rem;
}

.lang-switcher button {
  padding: 0.3rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid #0f3460;
  background: transparent;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
}

.lang-switcher button:hover {
  border-color: #a0c4ff;
  color: #a0c4ff;
}

.lang-switcher button.active {
  background: #a0c4ff;
  color: #0d1b2a;
  border-color: #a0c4ff;
}

.save-btn {
  padding: 0.45rem 1.1rem;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  background: #a0c4ff;
  color: #0d1b2a;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.save-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.save-btn:active {
  transform: translateY(0);
}
</style>

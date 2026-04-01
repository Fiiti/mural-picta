import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'

const savedLang = localStorage.getItem('wallpanel-lang') || 'en'

export const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'en',
  messages: { en, de }
})

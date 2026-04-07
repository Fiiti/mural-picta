<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <button class="close-btn" @click="$emit('close')" :title="$t('buttons.close')">×</button>
      <div class="help-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  locale: { type: String, required: true },
  type:   { type: String, default: 'template' }  // 'template' | 'docs' | 'filter' | 'media'
})

defineEmits(['close'])

const renderedContent = ref('')

async function loadHelp() {
  const supported = ['de', 'fr', 'es', 'it']
  const lang = supported.includes(props.locale) ? props.locale : 'en'
  const allowed = ['image_overlay', 'filter', 'media', 'pin', 'api', 'overview']
  const suffix = allowed.includes(props.type) ? props.type : 'image_overlay'
  try {
    const res = await fetch(`/admin/help/${lang}/${suffix}.md`)
    const text = await res.text()
    renderedContent.value = marked.parse(text)
  } catch {
    renderedContent.value = '<p>File could not be loaded.</p>'
  }
}

watch([() => props.locale, () => props.type], loadHelp, { immediate: true })
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: backdropIn 0.2s ease;
}

@keyframes backdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-panel {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: panelIn 0.2s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

@keyframes panelIn {
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}

.close-btn {
  position: sticky;
  float: right;
  top: 0;
  margin-left: 1rem;
  background: var(--btn-secondary-bg);
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: 7px;
  font-size: 1.4rem;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  z-index: 10;
}
.close-btn:hover {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}
</style>

<style>
/* Globale Styles fuer gerendertes Markdown - nicht scoped, da v-html */
.help-content h1 {
  font-size: 1.45rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
}

.help-content h2 {
  font-size: 1.1rem;
  color: var(--accent);
  margin-top: 1.8rem;
  margin-bottom: 0.6rem;
}

.help-content h3 {
  font-size: 0.95rem;
  color: var(--accent-light);
  margin-top: 1.2rem;
  margin-bottom: 0.4rem;
}

.help-content p {
  line-height: 1.65;
  margin-bottom: 0.8rem;
  color: var(--text);
}

.help-content table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1.2rem;
  font-size: 0.88rem;
}

.help-content td,
.help-content th {
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--border);
  text-align: left;
  color: var(--text);
}

.help-content th {
  background: var(--input-bg);
  color: var(--accent);
  font-weight: 600;
}

.help-content tr:nth-child(even) td {
  background: color-mix(in srgb, var(--border) 20%, transparent);
}

.help-content code {
  background: var(--input-bg);
  color: var(--accent-light);
  padding: 0.1em 0.35em;
  border-radius: 4px;
  font-size: 0.87em;
  font-family: 'Fira Mono', 'Cascadia Code', 'Consolas', monospace;
  border: 1px solid var(--border);
}

.help-content pre {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.help-content pre code {
  background: transparent;
  border: none;
  padding: 0;
  color: var(--accent-light);
  font-size: 0.85em;
}

.help-content blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  margin-left: 0;
  color: var(--text-muted);
  font-style: italic;
}

.help-content ul,
.help-content ol {
  padding-left: 1.5rem;
  margin-bottom: 0.8rem;
}

.help-content li {
  margin-bottom: 0.3rem;
  color: var(--text);
}

.help-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5rem 0;
}

.help-content strong {
  color: var(--text);
  font-weight: 600;
}
</style>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <button class="close-btn" @click="$emit('close')" :title="$t('buttons.close')">×</button>
      <div class="help-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import helpEn from '../locales/help/en.md?raw'
import helpDe from '../locales/help/de.md?raw'

const props = defineProps({
  locale: { type: String, required: true }
})

defineEmits(['close'])

const renderedContent = computed(() => {
  const src = props.locale === 'de' ? helpDe : helpEn
  return marked.parse(src)
})
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
  background: #1a1a2e;
  border: 1px solid #0f3460;
  border-radius: 12px;
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: panelIn 0.2s ease;
}

@keyframes panelIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.close-btn {
  position: sticky;
  float: right;
  top: 0;
  margin-left: 1rem;
  background: #0f3460;
  border: 1px solid #a0c4ff;
  color: #a0c4ff;
  border-radius: 6px;
  font-size: 1.4rem;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  z-index: 10;
}

.close-btn:hover {
  background: #a0c4ff;
  color: #0d1b2a;
}
</style>

<style>
/* Globale Styles fuer gerendertes Markdown - nicht scoped, da v-html */
.help-content h1 {
  font-size: 1.5rem;
  color: #a0c4ff;
  margin-bottom: 0.5rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #0f3460;
}

.help-content h2 {
  font-size: 1.15rem;
  color: #a0c4ff;
  margin-top: 1.8rem;
  margin-bottom: 0.6rem;
}

.help-content h3 {
  font-size: 0.98rem;
  color: #a0c4ff;
  margin-top: 1.2rem;
  margin-bottom: 0.4rem;
}

.help-content p {
  line-height: 1.65;
  margin-bottom: 0.8rem;
  color: #e0e0e0;
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
  border: 1px solid #0f3460;
  text-align: left;
  color: #e0e0e0;
}

.help-content th {
  background: #16213e;
  color: #a0c4ff;
  font-weight: 600;
}

.help-content tr:nth-child(even) td {
  background: rgba(15, 52, 96, 0.2);
}

.help-content code {
  background: #0d1b2a;
  color: #a0c4ff;
  padding: 0.1em 0.35em;
  border-radius: 3px;
  font-size: 0.87em;
  font-family: 'Fira Mono', 'Cascadia Code', 'Consolas', monospace;
}

.help-content pre {
  background: #0d1b2a;
  border: 1px solid #0f3460;
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.help-content pre code {
  background: transparent;
  padding: 0;
  color: #c8e6c9;
  font-size: 0.85em;
}

.help-content blockquote {
  border-left: 3px solid #0f3460;
  padding-left: 1rem;
  margin-left: 0;
  color: #aaa;
  font-style: italic;
}

.help-content ul,
.help-content ol {
  padding-left: 1.5rem;
  margin-bottom: 0.8rem;
}

.help-content li {
  margin-bottom: 0.3rem;
  color: #e0e0e0;
}

.help-content hr {
  border: none;
  border-top: 1px solid #0f3460;
  margin: 1.5rem 0;
}

.help-content strong {
  color: #fff;
}
</style>

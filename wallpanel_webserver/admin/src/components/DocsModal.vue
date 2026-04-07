<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="docs-panel">
      <button class="close-btn" @click="$emit('close')" title="Close">×</button>
      <div class="docs-layout">
        <!-- Linke Spalte: Navigation -->
        <nav class="docs-nav">
          <div class="docs-nav-title">Documentation</div>
          <button
            v-for="page in pages"
            :key="page.id"
            class="docs-nav-item"
            :class="{ active: activeId === page.id }"
            @click="activeId = page.id"
          >{{ page.label }}</button>
        </nav>
        <!-- Rechte Spalte: Inhalt -->
        <div class="docs-content help-content" v-html="renderedContent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  locale: { type: String, required: true }
})
defineEmits(['close'])

const overlayLabels = { de: 'Bild Overlay', fr: "Overlay d'image", es: 'Overlay de imagen', it: 'Overlay immagine' }

const pages = computed(() => [
  { id: 'overview',       label: '📖 Overview' },
  { id: 'api',            label: 'API Reference' },
  { id: 'image_overlay',  label: overlayLabels[props.locale] || 'Image Overlay' },
  { id: 'filter',         label: 'Filter / Exclude' },
  { id: 'media',          label: 'Media Sources' },
  { id: 'pin',            label: 'PIN Reset' },
])

const activeId = ref('overview')
const renderedContent = ref('')

async function loadPage() {
  const supported = ['de', 'fr', 'es', 'it']
  const lang = supported.includes(props.locale) ? props.locale : 'en'
  try {
    const res = await fetch(`/admin/help/${lang}/${activeId.value}.md`)
    const text = await res.text()
    renderedContent.value = marked.parse(text)
  } catch {
    renderedContent.value = '<p>Content could not be loaded.</p>'
  }
}

watch([() => props.locale, activeId], loadPage, { immediate: true })
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
  to   { opacity: 1; }
}

.docs-panel {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  width: min(1100px, 96vw);
  height: min(85vh, 820px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: panelIn 0.2s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

@keyframes panelIn {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.close-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
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
}
.close-btn:hover {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}

.docs-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Linke Spalte */
.docs-nav {
  width: 190px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0.75rem;
  gap: 0.25rem;
  overflow-y: auto;
}

.docs-nav-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0.5rem;
}

.docs-nav-item {
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 7px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}
.docs-nav-item:hover {
  background: var(--btn-secondary-bg);
  color: var(--text);
}
.docs-nav-item.active {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  font-weight: 600;
}

/* Rechte Spalte */
.docs-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.75rem 2rem;
}
</style>

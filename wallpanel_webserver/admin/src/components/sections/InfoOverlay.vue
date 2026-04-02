<template>
  <section class="card">
    <h2>{{ $t('sections.infoOverlay') }}</h2>

    <!-- Show overlay toggle -->
    <div class="field">
      <div class="toggle-row">
        <label for="show-image-info">{{ $t('fields.show_image_info.label') }}</label>
        <input
          id="show-image-info"
          type="checkbox"
          :checked="modelValue.show_image_info"
          @change="update('show_image_info', $event.target.checked)"
        />
      </div>
      <p class="hint">{{ $t('fields.show_image_info.hint') }}</p>
    </div>

    <template v-if="modelValue.show_image_info">
      <!-- Position -->
      <div class="field">
        <label for="info-position">{{ $t('fields.info_position.label') }}</label>
        <select
          id="info-position"
          :value="modelValue.info_position"
          @change="update('info_position', $event.target.value)"
        >
          <option value="bottom-right">{{ $t('fields.info_position.options.bottom-right') }}</option>
          <option value="bottom-left">{{ $t('fields.info_position.options.bottom-left') }}</option>
          <option value="top-right">{{ $t('fields.info_position.options.top-right') }}</option>
          <option value="top-left">{{ $t('fields.info_position.options.top-left') }}</option>
        </select>
        <p class="hint">{{ $t('fields.info_position.hint') }}</p>
      </div>

      <!-- Fetch address toggle -->
      <div class="field">
        <div class="toggle-row">
          <label for="fetch-address-data">{{ $t('fields.fetch_address_data.label') }}</label>
          <input
            id="fetch-address-data"
            type="checkbox"
            :checked="modelValue.fetch_address_data"
            @change="update('fetch_address_data', $event.target.checked)"
          />
        </div>
        <p class="hint">{{ $t('fields.fetch_address_data.hint') }}</p>
      </div>

      <!-- Template textarea -->
      <div class="field">
        <label for="image-info-template">{{ $t('fields.image_info_template.label') }}</label>
        <textarea
          id="image-info-template"
          :value="modelValue.image_info_template"
          @input="update('image_info_template', $event.target.value)"
          rows="6"
          spellcheck="false"
        ></textarea>
        <p class="hint template-hint">
          Use <code>${variable}</code> for substitution, <code>${a|b}</code> for fallbacks,
          <code>${var!prefix=TEXT}</code> / <code>${var!suffix=TEXT}</code> for conditional text,
          <code>${DateTimeOriginal!options=year:numeric,month:short}</code> for date formatting.
          Full HTML styling supported via inline styles.
        </p>
        <button class="help-btn" type="button" @click="$emit('open-help')">
          {{ $t('buttons.openHelp') }}
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'open-help'])

function update(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
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

.field { margin-bottom: 1rem; }

label {
  display: block;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

.hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  line-height: 1.45;
  opacity: 0.75;
}

.hint code {
  background: var(--input-bg);
  color: var(--accent-light);
  padding: 0.05em 0.35em;
  border-radius: 4px;
  font-size: 0.88em;
  border: 1px solid var(--border);
}

select,
textarea {
  width: 100%;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 7px;
  color: var(--text);
  padding: 0.5rem 0.75rem;
  font-size: 0.93rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

textarea {
  font-family: 'Fira Mono', 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.84rem;
  resize: vertical;
  min-height: 8rem;
  line-height: 1.55;
}

select:focus,
textarea:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toggle-row label {
  margin: 0;
  font-size: 0.93rem;
  color: var(--text);
}

input[type="checkbox"] {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
  accent-color: var(--accent);
}

.help-btn {
  margin-top: 0.6rem;
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

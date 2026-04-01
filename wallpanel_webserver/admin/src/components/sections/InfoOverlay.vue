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

.field { margin-bottom: 1rem; }

label {
  display: block;
  font-size: 0.82rem;
  color: #aaa;
  margin-bottom: 0.3rem;
}

.hint {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
  line-height: 1.4;
}

.hint code {
  background: #0d1b2a;
  color: #a0c4ff;
  padding: 0.05em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}

.template-hint {
  color: #777;
}

select,
textarea {
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

textarea {
  font-family: 'Fira Mono', 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.85rem;
  resize: vertical;
  min-height: 8rem;
  line-height: 1.5;
}

select:focus,
textarea:focus {
  border-color: #a0c4ff;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-row label {
  margin: 0;
  font-size: 0.95rem;
  color: #e0e0e0;
}

input[type="checkbox"] {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
  accent-color: #a0c4ff;
}

.help-btn {
  margin-top: 0.6rem;
  padding: 0.4rem 1rem;
  background: #0f3460;
  border: 1px solid #a0c4ff;
  color: #a0c4ff;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.help-btn:hover {
  background: #a0c4ff;
  color: #0d1b2a;
}
</style>

<template>
  <section class="card">
    <h2>{{ $t('sections.kenBurns') }}</h2>

    <div class="field">
      <div class="toggle-row">
        <label for="ken-burns-enabled">{{ $t('fields.ken_burns_enabled.label') }}</label>
        <input
          id="ken-burns-enabled"
          type="checkbox"
          :checked="modelValue.ken_burns_enabled"
          @change="update('ken_burns_enabled', $event.target.checked)"
        />
      </div>
      <p class="hint">{{ $t('fields.ken_burns_enabled.hint') }}</p>
    </div>

    <div class="field" v-if="modelValue.ken_burns_enabled">
      <label for="ken-burns-zoom">{{ $t('fields.ken_burns_zoom.label') }}</label>
      <div class="range-row">
        <input
          id="ken-burns-zoom"
          type="range"
          :value="modelValue.ken_burns_zoom"
          @input="update('ken_burns_zoom', Number($event.target.value))"
          min="1.0"
          max="2.0"
          step="0.05"
        />
        <span class="range-value">{{ modelValue.ken_burns_zoom?.toFixed(2) }}</span>
      </div>
      <p class="hint">{{ $t('fields.ken_burns_zoom.hint') }}</p>
    </div>

    <div class="field separator" v-if="modelValue.ken_burns_enabled">
      <div class="toggle-row">
        <label for="panorama-enabled">{{ $t('fields.panorama_mode_enabled.label') }}</label>
        <input
          id="panorama-enabled"
          type="checkbox"
          :checked="modelValue.panorama_mode_enabled"
          @change="update('panorama_mode_enabled', $event.target.checked)"
        />
      </div>
      <p class="hint">{{ $t('fields.panorama_mode_enabled.hint') }}</p>
    </div>

    <template v-if="modelValue.ken_burns_enabled && modelValue.panorama_mode_enabled">
      <div class="field">
        <label for="panorama-threshold">{{ $t('fields.panorama_threshold_ratio.label') }}</label>
        <input
          id="panorama-threshold"
          type="number"
          :value="modelValue.panorama_threshold_ratio"
          @change="update('panorama_threshold_ratio', Number($event.target.value))"
          min="1.0"
          max="10.0"
          step="0.1"
          class="num-input"
        />
        <p class="hint">{{ $t('fields.panorama_threshold_ratio.hint') }}</p>

        <details class="ratio-help">
          <summary>{{ $t('fields.panorama_threshold_ratio.helpToggle') }}</summary>
          <div class="ratio-help-content">
            <p class="help-intro">{{ $t('fields.panorama_threshold_ratio.helpIntro') }}</p>
            <table class="ratio-table">
              <thead>
                <tr>
                  <th>{{ $t('fields.panorama_threshold_ratio.helpColRatio') }}</th>
                  <th>{{ $t('fields.panorama_threshold_ratio.helpColExample') }}</th>
                  <th>{{ $t('fields.panorama_threshold_ratio.helpColAssess') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="val">1.33</td>
                  <td>{{ $t('fields.panorama_threshold_ratio.help133') }}</td>
                  <td class="assess normal">{{ $t('fields.panorama_threshold_ratio.assessNormal') }}</td>
                </tr>
                <tr>
                  <td class="val">1.78</td>
                  <td>{{ $t('fields.panorama_threshold_ratio.help178') }}</td>
                  <td class="assess normal">{{ $t('fields.panorama_threshold_ratio.assessNormal') }}</td>
                </tr>
                <tr>
                  <td class="val">2.00</td>
                  <td>{{ $t('fields.panorama_threshold_ratio.help200') }}</td>
                  <td class="assess border">{{ $t('fields.panorama_threshold_ratio.assessBorder') }}</td>
                </tr>
                <tr>
                  <td class="val">2.35</td>
                  <td>{{ $t('fields.panorama_threshold_ratio.help235') }}</td>
                  <td class="assess wide">{{ $t('fields.panorama_threshold_ratio.assessWide') }}</td>
                </tr>
                <tr class="row-default">
                  <td class="val accent">2.50</td>
                  <td>{{ $t('fields.panorama_threshold_ratio.help250') }}</td>
                  <td class="assess recommended">{{ $t('fields.panorama_threshold_ratio.assessRecommended') }}</td>
                </tr>
                <tr>
                  <td class="val">3.0+</td>
                  <td>{{ $t('fields.panorama_threshold_ratio.help300') }}</td>
                  <td class="assess pano">{{ $t('fields.panorama_threshold_ratio.assessPano') }}</td>
                </tr>
              </tbody>
            </table>
            <p class="help-note">{{ $t('fields.panorama_threshold_ratio.helpNote') }}</p>
          </div>
        </details>
      </div>

      <div class="field">
        <label for="panorama-direction">{{ $t('fields.panorama_direction.label') }}</label>
        <select
          id="panorama-direction"
          :value="modelValue.panorama_direction"
          @change="update('panorama_direction', $event.target.value)"
          class="select-input"
        >
          <option value="ltr">{{ $t('fields.panorama_direction.options.ltr') }}</option>
          <option value="rtl">{{ $t('fields.panorama_direction.options.rtl') }}</option>
          <option value="random">{{ $t('fields.panorama_direction.options.random') }}</option>
        </select>
        <p class="hint">{{ $t('fields.panorama_direction.hint') }}</p>
      </div>

      <div class="field">
        <label for="panorama-max-speed">{{ $t('fields.panorama_max_speed.label') }}</label>
        <input
          id="panorama-max-speed"
          type="number"
          :value="modelValue.panorama_max_speed"
          @change="update('panorama_max_speed', Number($event.target.value))"
          min="50"
          max="2000"
          step="50"
          class="num-input"
        />
        <p class="hint">{{ $t('fields.panorama_max_speed.hint') }}</p>
      </div>
    </template>
  </section>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

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

.range-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

input[type="range"] {
  flex: 1;
  accent-color: var(--accent);
  cursor: pointer;
}

.range-value {
  font-size: 0.93rem;
  color: var(--accent);
  font-weight: 600;
  min-width: 2.5rem;
  text-align: right;
  font-family: monospace;
}

.separator {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.num-input, .select-input {
  width: 100%;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  color: var(--text);
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}
.num-input:focus, .select-input:focus { border-color: var(--input-focus); }

/* Inline Ratio-Hilfe */
.ratio-help {
  margin-top: 0.5rem;
}

.ratio-help summary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.85rem;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  color: var(--accent);
  border-radius: 7px;
  font-size: 0.82rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  list-style: none;
  user-select: none;
}
.ratio-help summary::-webkit-details-marker { display: none; }
.ratio-help summary:hover {
  background: var(--accent);
  color: var(--accent-contrast, #fff);
  border-color: var(--accent);
}

.ratio-help-content {
  margin-top: 0.65rem;
  padding: 0.85rem 1rem;
  background: color-mix(in srgb, var(--accent) 5%, var(--card-bg));
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: 8px;
}

.help-intro {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.65rem;
  line-height: 1.5;
}

.ratio-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  margin-bottom: 0.65rem;
}
.ratio-table th {
  text-align: left;
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.4rem;
  border-bottom: 1px solid var(--border);
}
.ratio-table td {
  padding: 0.22rem 0.4rem;
  color: var(--text-muted);
  border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  font-family: monospace;
}
.ratio-table .val { text-align: right; font-weight: 600; }
.ratio-table .accent { color: var(--accent); font-weight: 700; }
.ratio-table .row-default td {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}
.ratio-table .assess { font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
.ratio-table .assess.normal      { color: #4caf7d; }
.ratio-table .assess.border      { color: #e0a040; }
.ratio-table .assess.wide        { color: #e07830; }
.ratio-table .assess.recommended { color: var(--accent); }
.ratio-table .assess.pano        { color: #7b9fd4; }

.help-note {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
  opacity: 0.85;
}
</style>

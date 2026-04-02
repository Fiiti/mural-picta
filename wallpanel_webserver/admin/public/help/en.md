# Template System Reference

The **Image Info Overlay** in WallPanel allows you to display rich metadata directly on the slideshow screen. You write a small HTML template with special placeholder variables that get replaced with actual data from the current image's EXIF metadata, GPS location, and filename.

This system gives you full control over styling via inline CSS — font size, color, position, shadows, and more.

---

## Available Variables

| Variable | Type | Example Value | Description |
|---|---|---|---|
| `filename` | String | `IMG_1234.jpg` | Filename without directory path |
| `DateTimeOriginal` | Date | `2024-06-15T14:30:00` | Original capture date/time from EXIF |
| `Make` | String | `Apple` | Camera manufacturer from EXIF |
| `Model` | String | `iPhone 14 Pro` | Camera model from EXIF |
| `address.country` | String | `Germany` | Country name (from GPS reverse geocoding) |
| `address.state` | String | `Bavaria` | Federal state or province |
| `address.county` | String | `Munich (district)` | County / administrative district |
| `address.municipality` | String | `Munich` | Municipality |
| `address.city` | String | `Munich` | City name |
| `address.town` | String | `Schwabing` | Town or city district |
| `address.village` | String | `Oberföhring` | Village |
| `address.road` | String | `Leopoldstraße` | Street name |

> **Note:** `address.*` variables are only available when **Fetch location from GPS** is enabled in settings and the image contains GPS EXIF data.

---

## Modifier Syntax

Variables are written as `${variable}` inside the template HTML. Several modifiers allow for conditional display and formatting.

### Simple Substitution
```
${variable}
```
Replaces the placeholder with the variable's value. Outputs an empty string if the variable is not available.

### Fallback Chain
```
${a|b|c}
```
Uses the first non-empty value from the list, left to right. Useful for showing the most specific location available:
```
${address.village|address.town|address.city|address.municipality}
```

### Prefix (only if value exists)
```
${variable!prefix=TEXT}
```
Prepends `TEXT` before the value — but **only** if the variable has a non-empty value. Nothing is output if the variable is empty.

Example:
```
${address.city!prefix=📍 }
```
→ `📍 Munich` (or nothing if city is unknown)

### Suffix (only if value exists)
```
${variable!suffix=TEXT}
```
Appends `TEXT` after the value — only if the variable has a non-empty value.

Example:
```
${address.country!suffix=<br>}
```
→ `Germany` followed by a line break (or nothing if country is unknown)

### Date Formatting
```
${variable!options=INTL_OPTIONS}
```
Formats a date/time value using JavaScript's `Intl.DateTimeFormat`. Options are provided as comma-separated key:value pairs.

Example:
```
${DateTimeOriginal!options=year:numeric,month:long,day:numeric}
```
→ `June 15, 2024`

### Combining Modifiers
Multiple modifiers can be combined on a single variable:
```
${address.city|address.municipality!prefix=📍 !suffix=<br>}
```
→ `📍 Munich` followed by a line break

---

## Date Formatting Options

The `!options=` modifier uses `Intl.DateTimeFormat` option keys and values. Separate multiple options with commas.

| Option | Values |
|---|---|
| `year` | `numeric`, `2-digit` |
| `month` | `long`, `short`, `narrow`, `numeric`, `2-digit` |
| `day` | `numeric`, `2-digit` |
| `hour` | `numeric`, `2-digit` |
| `minute` | `numeric`, `2-digit` |
| `second` | `numeric`, `2-digit` |
| `weekday` | `long`, `short`, `narrow` |

**Examples:**

| Template | Output |
|---|---|
| `${DateTimeOriginal!options=year:numeric,month:long,day:numeric}` | `June 15, 2024` |
| `${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}` | `Jun 15, 2024` |
| `${DateTimeOriginal!options=year:numeric,month:2-digit,day:2-digit}` | `06/15/2024` |
| `${DateTimeOriginal!options=weekday:long,year:numeric,month:long,day:numeric}` | `Saturday, June 15, 2024` |
| `${DateTimeOriginal!options=hour:2-digit,minute:2-digit}` | `14:30` |

---

## Examples

### Simple: Filename only
```html
${filename}
```
Shows the raw filename.

---

### Simple: Date only
```html
${DateTimeOriginal!options=year:numeric,month:long,day:numeric}
```
Shows the capture date formatted in the browser's locale (e.g. `June 15, 2024`).

---

### Simple: Most specific location
```html
${address.town|address.city|address.municipality}
```
Shows the most specific location name available — town first, then city, then municipality.

---

### Medium: Location and date in one line
```html
📍 ${address.town|address.city} · ${DateTimeOriginal!options=year:numeric,month:short,day:numeric}
```
Example output: `📍 Munich · Jun 15, 2024`

---

### Full-Featured Example (lovelace-wallpanel style)
```html
<div style="text-align:right; font-size:7vh; font-weight:900; color:#ffff00; text-shadow:0px 0px 1px rgba(0,0,0,1); -webkit-text-stroke:3px black;">
  ${address.country!suffix=<br>}${address.village|address.town|address.city|address.municipality|address.county!suffix= - }${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}
</div>
```

**What each part does:**

- `${address.country!suffix=<br>}` — Country name followed by a line break. If the country is unknown, nothing is shown (not even the line break).
- `${address.village|address.town|address.city|address.municipality|address.county!suffix= - }` — The most specific available location name, tried from smallest (village) to largest (county). Followed by ` - ` as a separator, but only if a location was found.
- `${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}` — Date formatted as `Jun 15, 2024`.

**Example output (two lines):**
```
Germany
Schwabing - Jun 15, 2024
```

---

### Camera Info
```html
<div style="font-size:1.2vh; color:#ccc; opacity:0.7;">
  ${Make} ${Model} · ${filename}
</div>
```
Shows camera brand, model, and filename in small text.

---

### Full overlay with all common fields
```html
<div style="text-align:left; padding:1rem; background:rgba(0,0,0,0.5); border-radius:8px; max-width:40vw;">
  <div style="font-size:4vh; font-weight:bold; color:#fff;">
    ${address.town|address.city|address.municipality|address.county|address.state}
  </div>
  <div style="font-size:2.5vh; color:#ddd; margin-top:0.3em;">
    ${address.country}
  </div>
  <div style="font-size:1.8vh; color:#aaa; margin-top:0.5em;">
    ${DateTimeOriginal!options=weekday:long,year:numeric,month:long,day:numeric}
  </div>
  <div style="font-size:1.2vh; color:#888; margin-top:0.5em;">
    ${filename}
  </div>
</div>
```

---

## Notes

- All variables resolve to an **empty string** if not available — no error is thrown, and nothing is displayed.
- HTML is rendered directly, so you have full control via **inline styles**. External stylesheets or `<script>` tags are not supported for security reasons.
- The `address.*` variables require both:
  1. **Show info overlay** enabled in admin settings
  2. **Fetch location from GPS** enabled in admin settings
  3. The image must contain GPS coordinates in its EXIF data
- Date formatting uses the **browser's locale** by default. The `Intl.DateTimeFormat` API automatically translates month names etc. to the display language of the device.
- The template is saved as part of the admin configuration and applies to all images in the slideshow.

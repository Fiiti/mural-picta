# Template-System Referenz

Das **Bild-Info-Overlay** in WallPanel ermöglicht Metadaten direkt auf dem Diashow-Bildschirm anzuzeigen. Du schreibst ein kleines HTML-Template mit speziellen Platzhalter-Variablen, die durch tatsächliche Daten aus den EXIF-Metadaten, GPS-Standortdaten und dem Dateinamen des aktuellen Bildes ersetzt werden.

Dieses System gibt dir volle Kontrolle über das Styling per Inline-CSS — Schriftgröße, Farbe, Position, Schatten und mehr.

---

## Verfügbare Variablen

| Variable | Typ | Beispielwert | Beschreibung |
|---|---|---|---|
| `filename` | String | `IMG_1234.jpg` | Dateiname ohne Verzeichnispfad |
| `DateTimeOriginal` | Datum | `2024-06-15T14:30:00` | Originales Aufnahmedatum aus EXIF |
| `Make` | String | `Schnappphone` | Kamerahersteller aus EXIF |
| `Model` | String | `Masterknips 24` | Kameramodell aus EXIF |
| `address.country` | String | `Deutschland` | Ländername (aus GPS-Reverse-Geocoding) |
| `address.state` | String | `Brandenburg` | Bundesland oder Provinz |
| `address.county` | String | `Allesistschön (Landkreis)` | Landkreis / Verwaltungsbezirk |
| `address.municipality` | String | `Heims` | Gemeinde |
| `address.city` | String | `Ruffelhausen` | Stadtname |
| `address.town` | String | `Untertout` | Stadtteil oder Ortschaft |
| `address.village` | String | `Hellebarde` | Dorf |
| `address.road` | String | `Iststraße` | Straßenname |

> **Hinweis:** `address.*`-Variablen sind nur verfügbar, wenn **Standort aus GPS ermitteln** in den Einstellungen aktiviert ist und das Bild GPS-EXIF-Daten enthält.

---

## Modifier-Syntax

Variablen werden als `${variable}` im Template-HTML geschrieben. Mehrere Modifier ermöglichen bedingte Anzeige und Formatierung.

### Einfache Ersetzung
```
${variable}
```
Ersetzt den Platzhalter durch den Wert der Variable. Gibt einen leeren String aus, wenn die Variable nicht verfügbar ist.

### Fallback-Kette
```
${a|b|c}
```
Verwendet den ersten nicht-leeren Wert aus der Liste, von links nach rechts. Nützlich um den spezifischsten verfügbaren Ort anzuzeigen:
```
${address.village|address.town|address.city|address.municipality}
```

### Präfix (nur wenn Wert vorhanden)
```
${variable!prefix=TEXT}
```
Fügt `TEXT` vor dem Wert ein — aber **nur** wenn die Variable einen nicht-leeren Wert hat. Wenn die Variable leer ist, wird nichts ausgegeben.

Beispiel:
```
${address.city!prefix=📍 }
```
→ `📍 Ruffelhausen` (oder nichts, wenn die Stadt unbekannt ist)

### Suffix (nur wenn Wert vorhanden)
```
${variable!suffix=TEXT}
```
Fügt `TEXT` nach dem Wert ein — nur wenn die Variable einen nicht-leeren Wert hat.

Beispiel:
```
${address.country!suffix=<br>}
```
→ `Deutschland` gefolgt von einem Zeilenumbruch (oder nichts, wenn das Land unbekannt ist)

### Datumsformatierung
```
${variable!options=INTL_OPTIONEN}
```
Formatiert einen Datum/Uhrzeit-Wert mit JavaScripts `Intl.DateTimeFormat`. Optionen werden als kommagetrennte Schlüssel:Wert-Paare angegeben.

Beispiel:
```
${DateTimeOriginal!options=year:numeric,month:long,day:numeric}
```
→ `15. Juni 2024`

### Modifier kombinieren
Mehrere Modifier können auf einer einzelnen Variable kombiniert werden:
```
${address.city|address.municipality!prefix=📍 !suffix=<br>}
```
→ `📍 Ruffelhausen` gefolgt von einem Zeilenumbruch

---

## Datumsformatierungsoptionen

Der Modifier `!options=` verwendet `Intl.DateTimeFormat`-Optionsschlüssel und -werte. Mehrere Optionen werden mit Komma getrennt.

| Option | Werte |
|---|---|
| `year` | `numeric`, `2-digit` |
| `month` | `long`, `short`, `narrow`, `numeric`, `2-digit` |
| `day` | `numeric`, `2-digit` |
| `hour` | `numeric`, `2-digit` |
| `minute` | `numeric`, `2-digit` |
| `second` | `numeric`, `2-digit` |
| `weekday` | `long`, `short`, `narrow` |

**Beispiele:**

| Template | Ausgabe (Deutsch) |
|---|---|
| `${DateTimeOriginal!options=year:numeric,month:long,day:numeric}` | `15. Juni 2024` |
| `${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}` | `15. Jun. 2024` |
| `${DateTimeOriginal!options=year:numeric,month:2-digit,day:2-digit}` | `15.06.2024` |
| `${DateTimeOriginal!options=weekday:long,year:numeric,month:long,day:numeric}` | `Samstag, 15. Juni 2024` |
| `${DateTimeOriginal!options=hour:2-digit,minute:2-digit}` | `14:30` |

---

## Beispiele

### Einfach: Nur Dateiname
```html
${filename}
```
Zeigt den rohen Dateinamen an.

---

### Einfach: Nur Datum
```html
${DateTimeOriginal!options=year:numeric,month:long,day:numeric}
```
Zeigt das Aufnahmedatum formatiert in der Browsersprache an (z.B. `15. Juni 2024`).

---

### Einfach: Spezifischster Ort
```html
${address.town|address.city|address.municipality}
```
Zeigt den spezifischsten verfügbaren Ortsnamen an — zuerst Stadtteil, dann Stadt, dann Gemeinde.

---

### Mittel: Ort und Datum in einer Zeile
```html
📍 ${address.town|address.city} · ${DateTimeOriginal!options=year:numeric,month:short,day:numeric}
```
Beispielausgabe: `📍 Ruffelhausen · 15. Jun. 2024`

---

### Vollständiges Beispiel (lovelace-wallpanel Stil)
```html
<div style="text-align:right; font-size:7vh; font-weight:900; color:#ffff00; text-shadow:0px 0px 1px rgba(0,0,0,1); -webkit-text-stroke:3px black;">                                                     
${address.country!suffix=<br>}${address.village|address.town|address.city|address.municipality|address.county!suffix= -}${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}</div> 
```

**Was jeder Teil bewirkt:**

- `${address.country!suffix=<br>}` — Ländername gefolgt von einem Zeilenumbruch. Wenn das Land unbekannt ist, wird nichts angezeigt (auch kein Zeilenumbruch).
- `${address.village|address.town|address.city|address.municipality|address.county!suffix= - }` — Der spezifischste verfügbare Ortsname, von kleinster (Dorf) bis größter (Landkreis) Einheit. Gefolgt von ` - ` als Trennzeichen, aber nur wenn ein Ort gefunden wurde.
- `${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}` — Datum formatiert als `15. Jun. 2024`.

**Was jeder Teil bewirkt:**

#### Das Styling (div style):

- text-align:right; — Richtet den gesamten Block rechtsbündig aus.
- font-size:7vh; — Die Schriftgröße beträgt 7 % der Bildschirmhöhe (skaliert mit der Displaygröße).
- font-weight:900; — Extrem fettgedruckte Schrift.
- color:#ffff00; — Die Schriftfarbe ist leuchtendes Gelb.
- -webkit-text-stroke:3px black; — Erzeugt eine 3 Pixel breite, schwarze Umrandung der Buchstaben für beste Lesbarkeit vor jedem Hintergrund.

#### Die Platzhalter:

- ${address.country!suffix=<br>} — Zeigt das Land an, gefolgt von einem Zeilenumbruch (<br>). Falls kein Land in den Metadaten gefunden wird, bleibt dieser Teil komplett leer (kein Platzhalter, kein Umbruch).
- ${address.village|address.town|address.city|address.municipality|address.county!suffix= -} — Eine Prioritätenliste für den Ort: Es wird der erste gefundene Wert verwendet (vom Dorf über die Stadt bis zum Landkreis). Falls ein Wert gefunden wird, wird ein Bindestrich mit Leerzeichen ( -) als Trenner angefügt.
- ${DateTimeOriginal!options=year:numeric,month:short,day:2-digit} — Das Aufnahmedatum des Fotos, formatiert nach lokalem Standard (z. B. 15. Juni 2024 oder Jun 15, 2024).


**Beispielausgabe (zwei Zeilen):**
```
Deutschland
Ruffelhausen - 15. Jun. 2024
```

---

### Kamera-Info
```html
<div style="font-size:1.2vh; color:#ccc; opacity:0.7;">
  ${Make} ${Model} · ${filename}
</div>
```
Zeigt Kameramarke, Modell und Dateiname in kleiner Schrift.

---

### Vollständiges Overlay mit allen gängigen Feldern
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

## Hinweise

- Alle Variablen lösen sich in einen **leeren String** auf, wenn sie nicht verfügbar sind — es wird kein Fehler ausgelöst und nichts angezeigt.
- HTML wird direkt gerendert, du hast volle Kontrolle über **Inline-Styles**. Externe Stylesheets oder `<script>`-Tags werden aus Sicherheitsgründen nicht unterstützt.
- Die `address.*`-Variablen erfordern:
  1. **Info-Overlay anzeigen** in den Admin-Einstellungen aktiviert
  2. **Standort aus GPS ermitteln** in den Admin-Einstellungen aktiviert
  3. Das Bild muss GPS-Koordinaten in seinen EXIF-Daten enthalten
- Die Datumsformatierung verwendet standardmäßig die **Browser-Sprache**. Die `Intl.DateTimeFormat`-API übersetzt Monatsnamen etc. automatisch in die Anzeigesprache des Geräts.
- Das Template wird als Teil der Admin-Konfiguration gespeichert und gilt für alle Bilder in der Diashow.
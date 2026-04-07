# Riferimento del sistema di modelli

La **Sovrapposizione informazioni** in MuralPicta ti permette di visualizzare metadati direttamente sulla schermata della presentazione. Scrivi un piccolo modello HTML con variabili speciali che vengono sostituite con i dati reali dai metadati EXIF, la posizione GPS e il nome del file dell'immagine corrente.

---

## Variabili disponibili

| Variabile | Tipo | Esempio | Descrizione |
|---|---|---|---|
| `filename` | Stringa | `IMG_1234.jpg` | Nome del file senza percorso |
| `DateTimeOriginal` | Data | `2024-06-15T14:30:00` | Data/ora di scatto EXIF |
| `Make` | Stringa | `Apple` | Produttore della fotocamera |
| `Model` | Stringa | `iPhone 14 Pro` | Modello della fotocamera |
| `address.country` | Stringa | `Italia` | Paese (geocodifica inversa GPS) |
| `address.state` | Stringa | `Lombardia` | Regione o provincia |
| `address.city` | Stringa | `Milano` | Città |
| `address.town` | Stringa | `Brera` | Quartiere o comune |
| `address.village` | Stringa | `Bellagio` | Villaggio |
| `address.road` | Stringa | `Via della Spiga` | Nome della strada |

> **Nota:** Le variabili `address.*` sono disponibili solo quando **Recupera posizione dal GPS** è attivato e l'immagine contiene dati GPS EXIF.

---

## Sintassi dei modificatori

### Sostituzione semplice
```
${variable}
```

### Catena di sostituzione (primo non vuoto)
```
${a|b|c}
```
Esempio: `${address.village|address.town|address.city}`

### Prefisso (solo se il valore esiste)
```
${variable!prefix=TESTO}
```
Esempio: `${address.city!prefix=📍 }` → `📍 Milano` (o nulla se sconosciuto)

### Suffisso (solo se il valore esiste)
```
${variable!suffix=TESTO}
```
Esempio: `${address.country!suffix=<br>}` → `Italia` seguito da a capo

### Formattazione data
```
${variable!options=OPZIONI_INTL}
```
Esempio: `${DateTimeOriginal!options=year:numeric,month:long,day:numeric}` → `15 giugno 2024`

---

## Esempi

### Semplice: solo nome file
```html
${filename}
```

### Luogo e data su una riga
```html
📍 ${address.town|address.city} · ${DateTimeOriginal!options=year:numeric,month:short,day:numeric}
```

### Esempio completo (stile lovelace-wallpanel)
```html
<div style="text-align:right; font-size:7vh; font-weight:900; color:#ffff00; text-shadow:0px 0px 1px rgba(0,0,0,1); -webkit-text-stroke:3px black;">
  ${address.country!suffix=<br>}${address.village|address.town|address.city|address.municipality|address.county!suffix= - }${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}
</div>
```

### Informazioni fotocamera
```html
<div style="font-size:1.2vh; color:#ccc; opacity:0.7;">
  ${Make} ${Model} · ${filename}
</div>
```

---

## Note

- Tutte le variabili si risolvono in **stringa vuota** se non disponibili — nessun errore.
- L'HTML viene reso direttamente — gli stili inline sono completamente supportati.
- La formattazione della data usa **la localizzazione del browser** — i nomi dei mesi vengono tradotti automaticamente.

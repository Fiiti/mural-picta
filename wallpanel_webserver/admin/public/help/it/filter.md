# Riferimento filtri

I pattern possono essere scritti **con o senza** barre oblique — `/^@eaDir/` e `^@eaDir` funzionano allo stesso modo.

---

# Escludi nomi file

I file il cui nome corrisponde a uno dei pattern elencati verranno ignorati durante la scansione dei media. Il pattern viene testato sul **percorso relativo del file** (incluse le sottocartelle).

### Nome file esatto
```
IMG_20231224_Natale.jpg
```

### Carattere jolly (estensione)
```
*.svg
*.bmp
*.tiff
```

### Regex – formati video non supportati
```
\.(avi|wmv|flv|rm|rmvb|3gp|asf|vob)$/i
```

### Regex – duplicati HDR
```
^IMG_\d{8}_\d{6}_HDR
```

### Regex – miniature
```
thumbnail|thumb|_small\.
```

### Regex – file nascosti
```
^\.
```

---

# Escludi cartelle

Le cartelle il cui **nome** corrisponde a uno dei pattern elencati verranno ignorate completamente — incluso tutto il loro contenuto.

### Cartelle di sistema Synology (consigliato!)
```
^@
```
Ignora tutte le cartelle che iniziano con `@` — copre `@eaDir`, `@Recycle`, `@tmp` con una sola regola.

### Nome cartella esatto
```
Ritocchi
Cestino
_temp
```

### Regex – esclusione per anno (prima del 2022)
```
^(200[0-9]|201[0-9]|2020|2021)$
```

---

# Come funzionano i pattern

| Input | Trattamento |
|---|---|
| `IMG_001.jpg` | Corrispondenza letterale (sensibile alle maiuscole) |
| `*.jpg` | Jolly: qualsiasi nome che termina con `.jpg` |
| `^@` | Regex: nomi che iniziano con `@` |
| `/^@/i` | Regex con flag: uguale, case-insensitive |

I pattern vengono applicati internamente come espressioni regolari JavaScript.

# Filter-Referenz

Muster können **mit oder ohne** umgebende Schrägstriche geschrieben werden — `/^@eaDir/` und `^@eaDir` funktionieren identisch.

---

# Dateinamen ausschließen

Dateien, deren Name einem der eingetragenen Muster entspricht, werden beim Medienscan übersprungen. Das Muster wird gegen den **relativen Dateipfad** geprüft (inkl. Unterordner), so können auch Pfadbestandteile abgeglichen werden.

### Exakter Dateiname

```
IMG_20231224_Weihnachten.jpg
```
Schließt genau diese eine Datei aus, egal wo sie im Ordnerbaum vorkommt.

---

### Wildcard (Erweiterung)

```
*.svg
*.bmp
*.tiff
```
Schließt alle Dateien mit dieser Erweiterung aus. Nützlich um Formate zu blockieren, die der Browser nicht darstellen kann.

---

### Regex – veraltete Videoformate

```
\.(avi|wmv|flv|rm|rmvb|3gp|asf|vob)$/i
```
Überspringt Formate, die die meisten Browser nicht nativ abspielen können: AVI, WMV, Flash Video, RealMedia, 3GP, ASF, DVD-VOB.

---

### Regex – HDR-Duplikate

```
^IMG_\d{8}_\d{6}_HDR
```
Überspringt HDR-Duplikate, die von Android-Kameras erstellt werden (z.B. `IMG_20240615_143022_HDR.jpg`).

---

### Regex – Thumbnails

```
thumbnail|thumb|_small\.
```
Überspringt automatisch erzeugte Thumbnail-Varianten im gleichen Ordner.

---

### Regex – versteckte Dateien (Dot-Dateien)

```
^\.
```
Überspringt versteckte Dateien wie `.DS_Store`, `.nomedia`, `.gitkeep`.

---

# Ordner ausschließen

Ordner, deren **Name** einem der eingetragenen Muster entspricht, werden vollständig übersprungen — einschließlich ihres gesamten Inhalts und aller Unterordner. Das Muster wird nur gegen den Ordnernamen geprüft, nicht gegen den vollständigen Pfad.

> Das bedeutet: `Bildbearbeitung` wird überall im Ordnerbaum ausgeschlossen, egal ob unter `/data/media/Bildbearbeitung` oder `/data/media/2024/Bildbearbeitung`.

### Synology-Systemordner (empfohlen!)

```
^@
```
Überspringt **alle** Ordner die mit `@` beginnen — erfasst damit `@eaDir` (Thumbnail-Cache), `@Recycle`, `@tmp` und alle anderen Synology-Systemordner auf einmal.

---

### Exakter Ordnername

```
Bildbearbeitung
Trash
_temp
```

---

### Regex – Jahrgangs-Ausschluss (älter als 2022)

```
^(200[0-9]|201[0-9]|2020|2021)$
```
Schließt alle Ordner aus, die 2000–2021 heißen.

---

# Wie Muster funktionieren

| Eingabe | Behandelt als |
|---|---|
| `IMG_001.jpg` | Literaler String (Groß-/Kleinschreibung beachten) |
| `*.jpg` | Wildcard: jeder Name der auf `.jpg` endet |
| `^@` | Regex: Namen die mit `@` beginnen |
| `/^@/i` | Regex mit Flag: gleich, Groß-/Kleinschreibung ignorieren (Schrägstriche werden automatisch entfernt) |

Muster werden intern als JavaScript-Regulärausdrücke angewendet. Ein einfacher String wie `IMG_001.jpg` wird als literaler Regex behandelt – Punkte treffen auf beliebige Zeichen. Für einen strengen exakten Treffer `^IMG_001\.jpg$` verwenden.

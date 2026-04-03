# Filter Reference

Patterns can be written **with or without** surrounding slashes — both `/^@eaDir/` and `^@eaDir` work the same way.

---

# Exclude Filenames

Files whose name matches any of the listed patterns will be skipped during the media scan. The pattern is tested against the **relative file path** (including any subfolder), so you can also match on path segments.

### Exact filename

```
IMG_20231224_Christmas.jpg
```
Excludes exactly this one file, wherever it appears in the folder tree.

---

### Wildcard (extension)

```
*.svg
*.bmp
*.tiff
```
Excludes all files with that extension. Useful to block formats the browser cannot display.

---

### Regex – legacy video formats

```
\.(avi|wmv|flv|rm|rmvb|3gp|asf|vob)$/i
```
Skips formats most browsers cannot play natively: AVI, WMV, Flash Video, RealMedia, 3GP, ASF, DVD-VOB.

---

### Regex – HDR duplicates

```
^IMG_\d{8}_\d{6}_HDR
```
Skips HDR duplicate files created by Android cameras (e.g. `IMG_20240615_143022_HDR.jpg`).

---

### Regex – thumbnails

```
thumbnail|thumb|_small\.
```
Skips auto-generated thumbnail variants in the same folder.

---

### Regex – hidden files (dot-files)

```
^\.
```
Skips hidden files like `.DS_Store`, `.nomedia`, `.gitkeep`.

---

# Exclude Folders

Folders whose **name** matches any of the listed patterns will be skipped entirely — including all their contents and subfolders. The pattern is tested only against the folder name itself, not the full path.

> This means `Bildbearbeitung` will be excluded wherever it appears in the folder tree, whether at `/data/media/Bildbearbeitung` or `/data/media/2024/Bildbearbeitung`.

### Synology system folders (recommended!)

```
^@
```
Skips **all** folders starting with `@` — this covers `@eaDir` (thumbnail cache), `@Recycle`, `@tmp` and any other Synology system folders in one go.

---

### Exact folder name

```
Bildbearbeitung
Trash
_temp
```

---

### Regex – year-based exclusion (exclude older than 2022)

```
^(200[0-9]|201[0-9]|2020|2021)$
```
Excludes all folders named 2000–2021.

---

# How patterns work

| Input | Treated as |
|---|---|
| `IMG_001.jpg` | Literal string match (case-sensitive) |
| `*.jpg` | Wildcard: any name ending in `.jpg` |
| `^@` | Regex: names starting with `@` |
| `/^@/i` | Regex with flag: same, case-insensitive (slashes are stripped automatically) |

Patterns are applied as JavaScript regular expressions internally. A plain string like `IMG_001.jpg` is treated as a literal regex, so dots match any character — use `^IMG_001\.jpg$` if you want a strict exact match.

# Referencia de filtros

Los patrones pueden escribirse **con o sin** barras oblicuas — `/^@eaDir/` y `^@eaDir` funcionan igual.

---

# Excluir nombres de archivo

Los archivos cuyo nombre coincida con alguno de los patrones listados serán omitidos durante el análisis de medios. El patrón se comprueba contra la **ruta relativa del archivo** (incluidas las subcarpetas).

### Nombre de archivo exacto
```
IMG_20231224_Navidad.jpg
```

### Comodín (extensión)
```
*.svg
*.bmp
*.tiff
```

### Regex – formatos de vídeo no soportados
```
\.(avi|wmv|flv|rm|rmvb|3gp|asf|vob)$/i
```

### Regex – duplicados HDR
```
^IMG_\d{8}_\d{6}_HDR
```

### Regex – miniaturas
```
thumbnail|thumb|_small\.
```

### Regex – archivos ocultos
```
^\.
```

---

# Excluir carpetas

Las carpetas cuyo **nombre** coincida con alguno de los patrones listados serán omitidas completamente — incluido todo su contenido.

### Carpetas del sistema Synology (¡recomendado!)
```
^@
```
Omite todas las carpetas que empiezan por `@` — cubre `@eaDir`, `@Recycle`, `@tmp` con una sola regla.

### Nombre de carpeta exacto
```
Retoques
Papelera
_temp
```

### Regex – exclusión por año (anteriores a 2022)
```
^(200[0-9]|201[0-9]|2020|2021)$
```

---

# Cómo funcionan los patrones

| Entrada | Tratamiento |
|---|---|
| `IMG_001.jpg` | Coincidencia literal (distingue mayúsculas) |
| `*.jpg` | Comodín: cualquier nombre que termine en `.jpg` |
| `^@` | Regex: nombres que empiezan por `@` |
| `/^@/i` | Regex con indicador: igual, sin distinción de mayúsculas |

Los patrones se aplican internamente como expresiones regulares de JavaScript.

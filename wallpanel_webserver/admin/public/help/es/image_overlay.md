# Referencia del sistema de plantillas

La **Superposición de información** en MuralPicta le permite mostrar metadatos directamente en la pantalla del pase de diapositivas. Escribe una pequeña plantilla HTML con variables especiales que se reemplazan con los datos reales de los metadatos EXIF, la ubicación GPS y el nombre de archivo de la imagen actual.

---

## Variables disponibles

| Variable | Tipo | Ejemplo | Descripción |
|---|---|---|---|
| `filename` | Cadena | `IMG_1234.jpg` | Nombre de archivo sin ruta |
| `DateTimeOriginal` | Fecha | `2024-06-15T14:30:00` | Fecha/hora de captura EXIF |
| `Make` | Cadena | `Apple` | Fabricante de la cámara |
| `Model` | Cadena | `iPhone 14 Pro` | Modelo de la cámara |
| `address.country` | Cadena | `España` | País (geocodificación inversa GPS) |
| `address.state` | Cadena | `Cataluña` | Región o provincia |
| `address.city` | Cadena | `Barcelona` | Ciudad |
| `address.town` | Cadena | `Gràcia` | Barrio o localidad |
| `address.village` | Cadena | `Sitges` | Pueblo |
| `address.road` | Cadena | `Las Ramblas` | Nombre de calle |

> **Nota:** Las variables `address.*` solo están disponibles cuando **Obtener ubicación desde GPS** está activado y la imagen contiene datos GPS EXIF.

---

## Sintaxis de modificadores

### Sustitución simple
```
${variable}
```

### Cadena de sustitución (primero no vacío)
```
${a|b|c}
```
Ejemplo: `${address.village|address.town|address.city}`

### Prefijo (solo si el valor existe)
```
${variable!prefix=TEXTO}
```
Ejemplo: `${address.city!prefix=📍 }` → `📍 Barcelona` (o nada si desconocido)

### Sufijo (solo si el valor existe)
```
${variable!suffix=TEXTO}
```
Ejemplo: `${address.country!suffix=<br>}` → `España` seguido de salto de línea

### Formateo de fecha
```
${variable!options=OPCIONES_INTL}
```
Ejemplo: `${DateTimeOriginal!options=year:numeric,month:long,day:numeric}` → `15 de junio de 2024`

---

## Ejemplos

### Simple: solo nombre de archivo
```html
${filename}
```

### Lugar y fecha en una línea
```html
📍 ${address.town|address.city} · ${DateTimeOriginal!options=year:numeric,month:short,day:numeric}
```

### Ejemplo completo (estilo lovelace-wallpanel)
```html
<div style="text-align:right; font-size:7vh; font-weight:900; color:#ffff00; text-shadow:0px 0px 1px rgba(0,0,0,1); -webkit-text-stroke:3px black;">
  ${address.country!suffix=<br>}${address.village|address.town|address.city|address.municipality|address.county!suffix= - }${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}
</div>
```

### Información de cámara
```html
<div style="font-size:1.2vh; color:#ccc; opacity:0.7;">
  ${Make} ${Model} · ${filename}
</div>
```

---

## Notas

- Todas las variables se resuelven como **cadena vacía** si no están disponibles — sin errores.
- El HTML se renderiza directamente — los estilos en línea son totalmente compatibles.
- El formateo de fecha utiliza **la configuración regional del navegador** — los nombres de los meses se traducen automáticamente.

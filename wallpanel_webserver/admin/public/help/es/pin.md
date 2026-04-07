# ¿Olvidó su PIN?

Si ya no puede acceder al Panel de administración porque ha olvidado su PIN, puede restablecerlo manualmente editando un archivo de texto en el servidor.

---

## ¿Dónde está el archivo de configuración?

El archivo se llama **`config.json`** y contiene todos los ajustes de MuralPicta.

### Si usa MuralPicta mediante Docker

El archivo está en el volumen Docker que mapeó al iniciar el contenedor. Si siguió la configuración estándar, está en una carpeta de su ordenador o NAS:

```
/su-carpeta/config/config.json
```

En un **NAS Synology**, puede encontrar esta carpeta en File Station.

### Si instaló MuralPicta directamente (sin Docker)

```
wallpanel_webserver/server/config/config.json
```

---

## Paso a paso: restablecer el PIN

**1. Abra el archivo `config.json`** con cualquier editor de texto.

**2. Encuentre la siguiente línea:**

```json
"admin_pin": "abc123..."
```

**3. Reemplace el valor por `null`** (sin comillas):

```json
"admin_pin": null
```

**4. Guarde el archivo.**

**5. Reinicie MuralPicta** (o el contenedor Docker). Tras el reinicio, el Panel de administración es accesible sin PIN.

---

## Notas importantes

- Escriba `null` **sin** comillas. `"null"` (con comillas) se trataría como el texto "null".
- **No elimine** la línea completa — solo reemplace el valor por `null`.
- Tras restablecer, puede establecer un nuevo PIN en el Panel de administración bajo **Seguridad**.

---

## ¿Sigue teniendo problemas?

- ¿Está mapeado el volumen de configuración correcto en Docker?
- ¿Se ha reiniciado completamente el contenedor/servidor?
- ¿Sigue siendo válido el JSON? Compruebe su archivo en [jsonlint.com](https://jsonlint.com).

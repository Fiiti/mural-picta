# Referencia de API

MuralPicta proporciona una API REST HTTP simple. Puede usarla desde cualquier dispositivo en la misma red — un navegador, un sistema domótico como Home Assistant, una terminal o un script personalizado.

---

## Ejemplos de inicio rápido

### Lo que necesita saber

Reemplace `192.168.1.100` con la dirección IP del dispositivo que ejecuta MuralPicta, y `3000` con el puerto configurado (por defecto: `3000`).

### Linux / macOS (Terminal)

```bash
# Pausar el pase de diapositivas
curl -X POST http://192.168.1.100:3000/api/command/pause

# Reanudar el pase de diapositivas
curl -X POST http://192.168.1.100:3000/api/command/play

# Apagar la pantalla (negro)
curl -X POST http://192.168.1.100:3000/api/command/blank

# Restaurar la pantalla
curl -X POST http://192.168.1.100:3000/api/command/unblank

# Saltar a la siguiente imagen
curl -X POST http://192.168.1.100:3000/api/command/next
```

### Windows (Símbolo del sistema o PowerShell)

```bat
REM Pausar el pase de diapositivas
curl -X POST http://192.168.1.100:3000/api/command/pause

REM Reanudar el pase de diapositivas
curl -X POST http://192.168.1.100:3000/api/command/play
```

> **Consejo:** `curl` está integrado en Windows 10 y versiones posteriores. Abra **Inicio → escriba "cmd" → Enter**, luego pegue el comando.

### Home Assistant (comando REST)

```yaml
rest_command:
  wallpanel_blank:
    url: "http://192.168.1.100:3000/api/command/blank"
    method: POST
  wallpanel_unblank:
    url: "http://192.168.1.100:3000/api/command/unblank"
    method: POST
  wallpanel_pause:
    url: "http://192.168.1.100:3000/api/command/pause"
    method: POST
  wallpanel_play:
    url: "http://192.168.1.100:3000/api/command/play"
    method: POST
  wallpanel_next:
    url: "http://192.168.1.100:3000/api/command/next"
    method: POST
  wallpanel_prev:
    url: "http://192.168.1.100:3000/api/command/prev"
    method: POST
```

---

## Control del pase de diapositivas

Todos los comandos de control devuelven `{ "ok": true }` si tienen éxito.

> **Nota:** El frontend consulta `/api/command/state` cada 2 segundos, por lo que los comandos surten efecto en 2 segundos.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`  | `/api/command/state` | Devuelve el estado de control actual |
| `POST` | `/api/command/blank` | Apagar la pantalla. El diaporama se pausa en segundo plano. |
| `POST` | `/api/command/unblank` | Restaurar la pantalla. Reanuda si estaba en ejecución. |
| `POST` | `/api/command/pause` | Pausar en la imagen actual (mostrada a pantalla completa, sin zoom). |
| `POST` | `/api/command/play` | Reanudar el pase de diapositivas. |
| `POST` | `/api/command/next` | Saltar a la siguiente imagen/vídeo. |
| `POST` | `/api/command/prev` | Volver a la imagen/vídeo anterior. |

---

## Configuración

### GET /api/config

Devuelve la configuración completa como objeto JSON.

```bash
curl http://192.168.1.100:3000/api/config
```

### POST /api/config

Guarda configuración parcial o completa.

```bash
curl -X POST http://192.168.1.100:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"display_time_image": 20}'
```

---

## Medios

### GET /api/media/list

Devuelve la lista de todos los archivos multimedia encontrados por el servidor.

```bash
curl http://192.168.1.100:3000/api/media/list
```

**Parámetro opcional:** `?subpath=2026/Verano`

### GET /api/media-source/test

Comprueba si la ruta de medios configurada es accesible.

```bash
curl http://192.168.1.100:3000/api/media-source/test
```

---

## Geocodificación

### GET /api/geocode

Convierte coordenadas GPS en nombre de lugar mediante Nominatim / OpenStreetMap. Los resultados se almacenan en caché en el servidor.

```bash
curl "http://192.168.1.100:3000/api/geocode?lat=48.1351&lon=11.5820"
```

---

## Sistema y estado

### GET /api/status

Devuelve tiempo de actividad, versión, indicador Docker y errores recientes.

```bash
curl http://192.168.1.100:3000/api/status
```

### POST /api/restart

Reinicia el proceso del servidor.

```bash
curl -X POST http://192.168.1.100:3000/api/restart
```

---

## Autenticación / PIN

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`  | `/api/auth-status` | Devuelve `{ "pinSet": true/false, "requiresPin": true/false }` |
| `POST` | `/api/login` | Autenticarse con PIN. Cuerpo: `{ "pin": "1234" }` |
| `POST` | `/api/logout` | Cerrar sesión |
| `POST` | `/api/set-pin` | Establecer nuevo PIN. Cuerpo: `{ "pin": "nuevopín" }` |
| `POST` | `/api/remove-pin` | Eliminar protección PIN |

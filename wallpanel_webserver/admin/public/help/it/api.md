# Riferimento API

MuralPicta fornisce una semplice API REST HTTP. Puoi usarla da qualsiasi dispositivo sulla stessa rete — un browser, un sistema domotico come Home Assistant, un terminale o uno script personalizzato.

---

## Esempi di avvio rapido

### Cosa devi sapere

Sostituisci `192.168.1.100` con l'indirizzo IP del dispositivo che esegue MuralPicta, e `3000` con la porta configurata (predefinita: `3000`).

### Linux / macOS (Terminale)

```bash
# Mettere in pausa la presentazione
curl -X POST http://192.168.1.100:3000/api/command/pause

# Riprendere la presentazione
curl -X POST http://192.168.1.100:3000/api/command/play

# Spegnere lo schermo (nero)
curl -X POST http://192.168.1.100:3000/api/command/blank

# Ripristinare lo schermo
curl -X POST http://192.168.1.100:3000/api/command/unblank

# Passare all'immagine successiva
curl -X POST http://192.168.1.100:3000/api/command/next
```

### Windows (Prompt dei comandi o PowerShell)

```bat
REM Mettere in pausa la presentazione
curl -X POST http://192.168.1.100:3000/api/command/pause

REM Riprendere la presentazione
curl -X POST http://192.168.1.100:3000/api/command/play
```

> **Suggerimento:** `curl` è integrato in Windows 10 e versioni successive. Apri **Start → digita "cmd" → Invio**, poi incolla il comando.

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

## Controllo della presentazione

Tutti i comandi di controllo restituiscono `{ "ok": true }` in caso di successo.

> **Nota:** Il frontend interroga `/api/command/state` ogni 2 secondi, quindi i comandi hanno effetto entro 2 secondi.

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET`  | `/api/command/state` | Restituisce lo stato di controllo attuale |
| `POST` | `/api/command/blank` | Spegnere lo schermo. La presentazione si mette in pausa in background. |
| `POST` | `/api/command/unblank` | Ripristinare lo schermo. Riprende se era in esecuzione. |
| `POST` | `/api/command/pause` | Mettere in pausa sull'immagine corrente (mostrata a schermo intero, senza zoom). |
| `POST` | `/api/command/play` | Riprendere la presentazione. |
| `POST` | `/api/command/next` | Passare all'immagine/video successivo. |
| `POST` | `/api/command/prev` | Tornare all'immagine/video precedente. |

---

## Configurazione

### GET /api/config

Restituisce la configurazione completa come oggetto JSON.

```bash
curl http://192.168.1.100:3000/api/config
```

### POST /api/config

Salva configurazione parziale o completa.

```bash
curl -X POST http://192.168.1.100:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"display_time_image": 20}'
```

---

## Media

### GET /api/media/list

Restituisce l'elenco di tutti i file multimediali trovati dal server.

```bash
curl http://192.168.1.100:3000/api/media/list
```

**Parametro opzionale:** `?subpath=2026/Estate`

### GET /api/media-source/test

Verifica se il percorso media configurato è accessibile.

```bash
curl http://192.168.1.100:3000/api/media-source/test
```

---

## Geocodifica

### GET /api/geocode

Converte coordinate GPS in nome di luogo tramite Nominatim / OpenStreetMap. I risultati vengono memorizzati nella cache del server.

```bash
curl "http://192.168.1.100:3000/api/geocode?lat=48.1351&lon=11.5820"
```

---

## Sistema e stato

### GET /api/status

Restituisce tempo di attività, versione, indicatore Docker ed errori recenti.

```bash
curl http://192.168.1.100:3000/api/status
```

### POST /api/restart

Riavvia il processo server.

```bash
curl -X POST http://192.168.1.100:3000/api/restart
```

---

## Autenticazione / PIN

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET`  | `/api/auth-status` | Restituisce `{ "pinSet": true/false, "requiresPin": true/false }` |
| `POST` | `/api/login` | Autenticarsi con PIN. Corpo: `{ "pin": "1234" }` |
| `POST` | `/api/logout` | Terminare la sessione |
| `POST` | `/api/set-pin` | Impostare nuovo PIN. Corpo: `{ "pin": "nuovopin" }` |
| `POST` | `/api/remove-pin` | Rimuovere protezione PIN |

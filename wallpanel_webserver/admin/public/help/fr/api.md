# Référence API

MuralPicta fournit une API REST HTTP simple. Vous pouvez l'utiliser depuis n'importe quel appareil sur le même réseau — un navigateur, un système domotique comme Home Assistant, un terminal ou un script personnalisé.

---

## Exemples de démarrage rapide

### Ce qu'il faut savoir

Remplacez `192.168.1.100` par l'adresse IP de l'appareil exécutant MuralPicta, et `3000` par le port configuré (par défaut : `3000`).

### Linux / macOS (Terminal)

```bash
# Mettre le diaporama en pause
curl -X POST http://192.168.1.100:3000/api/command/pause

# Reprendre le diaporama
curl -X POST http://192.168.1.100:3000/api/command/play

# Éteindre l'écran (noir)
curl -X POST http://192.168.1.100:3000/api/command/blank

# Restaurer l'écran
curl -X POST http://192.168.1.100:3000/api/command/unblank

# Passer à l'image suivante
curl -X POST http://192.168.1.100:3000/api/command/next
```

### Windows (Invite de commandes ou PowerShell)

```bat
REM Mettre le diaporama en pause
curl -X POST http://192.168.1.100:3000/api/command/pause

REM Reprendre le diaporama
curl -X POST http://192.168.1.100:3000/api/command/play
```

> **Astuce :** `curl` est intégré à Windows 10 et versions ultérieures. Ouvrez **Démarrer → tapez "cmd" → Entrée**, puis collez la commande.

### Home Assistant (commande REST)

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

## Contrôle du diaporama

Toutes les commandes de contrôle renvoient `{ "ok": true }` en cas de succès.

> **Note :** Le frontend interroge `/api/command/state` toutes les 2 secondes, donc les commandes prennent effet dans les 2 secondes.

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET`  | `/api/command/state` | Retourne l'état de contrôle actuel |
| `POST` | `/api/command/blank` | Éteindre l'écran. Le diaporama se met en pause en arrière-plan. |
| `POST` | `/api/command/unblank` | Restaurer l'écran. Reprend si en cours d'exécution. |
| `POST` | `/api/command/pause` | Mettre en pause sur l'image actuelle (affichée en plein cadre, sans zoom). |
| `POST` | `/api/command/play` | Reprendre le diaporama. |
| `POST` | `/api/command/next` | Passer à l'image/vidéo suivante. |
| `POST` | `/api/command/prev` | Revenir à l'image/vidéo précédente. |

### GET /api/command/state — Réponse

```json
{
  "blank": false,
  "paused": false,
  "nextSeq": 3,
  "prevSeq": 1
}
```

---

## Configuration

### GET /api/config

Retourne la configuration complète sous forme d'objet JSON.

```bash
curl http://192.168.1.100:3000/api/config
```

### POST /api/config

Sauvegarde une configuration partielle ou complète.

```bash
curl -X POST http://192.168.1.100:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"display_time_image": 20}'
```

---

## Médias

### GET /api/media/list

Retourne la liste de tous les fichiers médias trouvés par le serveur.

```bash
curl http://192.168.1.100:3000/api/media/list
```

**Paramètre optionnel :** `?subpath=2026/Ete`

### GET /api/media-source/test

Teste si le chemin médias configuré est accessible.

```bash
curl http://192.168.1.100:3000/api/media-source/test
```

---

## Géocodage

### GET /api/geocode

Convertit des coordonnées GPS en nom de lieu via Nominatim / OpenStreetMap. Les résultats sont mis en cache sur le serveur.

```bash
curl "http://192.168.1.100:3000/api/geocode?lat=48.1351&lon=11.5820"
```

---

## Système & Statut

### GET /api/status

Retourne la durée de fonctionnement, la version, l'indicateur Docker et les erreurs récentes.

```bash
curl http://192.168.1.100:3000/api/status
```

### POST /api/restart

Redémarre le processus serveur.

```bash
curl -X POST http://192.168.1.100:3000/api/restart
```

---

## Authentification / PIN

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET`  | `/api/auth-status` | Retourne `{ "pinSet": true/false, "requiresPin": true/false }` |
| `POST` | `/api/login` | S'authentifier avec le PIN. Corps : `{ "pin": "1234" }` |
| `POST` | `/api/logout` | Terminer la session |
| `POST` | `/api/set-pin` | Définir un nouveau PIN. Corps : `{ "pin": "nouveaupin" }` |
| `POST` | `/api/remove-pin` | Supprimer la protection PIN |

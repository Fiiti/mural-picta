# Docker Volume Mapping

## Funktionsweise

Der Container kann nicht direkt auf deine NAS oder lokale Ordner zugreifen. Du bindest sie als Docker-Volumes ein, und der Pfad **im Container** ist das, was du als *Medien-Basispfad* im Admin-Panel einträgst.

```
Deine NAS oder PC       →  Im Container
/volume1/photo          →  /data/media
```

Die Admin-Einstellung *Medien-Basispfad* ist immer der Pfad auf der Container-Seite (z.B. `/data/media`).

---

## Einfaches Beispiel – ein Hauptordner (empfohlen)

Alle Jahresordner (2000–2026) sind über einen einzigen Mount-Punkt zugänglich. Neue Jahresordner erfordern keine Änderung an der Compose-Datei.

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo:/data/media:ro
```

Admin → Medien-Basispfad: `/data/media`

---

## Mehrere einzelne Ordner

Nur bestimmte Jahresordner einbinden, wenn der Zugriff eingeschränkt werden soll:

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo/2024:/data/media/2024:ro
  - /volume1/photo/2025:/data/media/2025:ro
  - /volume1/photo/2026:/data/media/2026:ro
```

Admin → Medien-Basispfad: `/data/media`

> Hinweis: Bei einem neuen Jahr muss die neue Volume-Zeile ergänzt und der Stack neu deployed werden.

---

## NAS-Pfade nach System

| System | Typischer NAS-Pfad | Container-Pfad |
|---|---|---|
| Synology DSM | `/volume1/photo` | `/data/media` |
| QNAP | `/share/Multimedia` | `/data/media` |
| CachyOS / Linux PC | `/mnt/synology/nas-photo` | `/data/media` |
| Windows-Freigabe (gemountet) | `/mnt/nas/photos` | `/data/media` |

---

## `:ro` Flag

Das `:ro` am Ende bedeutet **read-only** (nur lesen). Der Container kann deine Dateien lesen, aber nicht verändern oder löschen. Immer `:ro` für Medienordner verwenden — es ist eine Sicherheitsmaßnahme.

---

## Anonymer NAS-Zugriff

Wenn deine NAS-Freigabe anonymen Zugriff erlaubt (kein Benutzername/Passwort erforderlich), kann ohne Zugangsdaten gemountet werden:

```bash
sudo mount -t cifs "//192.168.1.100/photos" /mnt/nas -o guest,uid=1000,gid=1000
```

Dann `/mnt/nas` als Host-seitigen Pfad in der Compose-Datei verwenden.

---

## Vollständiges Compose-Beispiel (Synology / Portainer)

```yaml
services:
  wallpanel:
    image: galseq/mural-picta:latest
    container_name: muralpicta
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - wallpanel_config:/app/config
      - /volume1/photo:/data/media:ro
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s

volumes:
  wallpanel_config:
```

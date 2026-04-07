# Docker Volume Mapping

## How it works

The container cannot access your NAS or local folders directly. You mount them as Docker volumes, and the path **inside the container** is what you enter as *Media Base Path* in the admin panel.

```
Your NAS or PC          →  Inside the container
/volume1/photo          →  /data/media
```

The admin setting *Media Base Path* should always be the container-side path (e.g. `/data/media`).

---

## Basic example – single folder (recommended)

All year folders (2000–2026) are accessible under one mount point. Adding a new year folder requires no changes to the compose file.

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo:/data/media:ro
```

Admin → Media Base Path: `/data/media`

---

## Multiple specific folders

Mount only selected year folders if you want to limit what is accessible:

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo/2024:/data/media/2024:ro
  - /volume1/photo/2025:/data/media/2025:ro
  - /volume1/photo/2026:/data/media/2026:ro
```

Admin → Media Base Path: `/data/media`

> Note: When a new year starts you need to add the new volume line and redeploy.

---

## NAS paths by system

| System | Typical NAS path | Container path |
|---|---|---|
| Synology DSM | `/volume1/photo` | `/data/media` |
| QNAP | `/share/Multimedia` | `/data/media` |
| CachyOS / Linux PC | `/mnt/synology/nas-photo` | `/data/media` |
| Windows share (mounted) | `/mnt/nas/photos` | `/data/media` |

---

## `:ro` flag

The `:ro` at the end means **read-only**. The container can read your files but cannot modify or delete them. Always use `:ro` for media folders — it is a safety measure.

---

## Anonymous NAS access

If your NAS share allows anonymous access (no username/password required), you can mount it without credentials:

```bash
sudo mount -t cifs "//192.168.1.100/photos" /mnt/nas -o guest,uid=1000,gid=1000
```

Then use `/mnt/nas` as the host-side path in your compose file.

---

## Full compose example (Synology / Portainer)

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

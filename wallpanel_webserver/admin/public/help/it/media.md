# Mappatura volumi Docker

## Come funziona

Il container non può accedere direttamente al tuo NAS o alle cartelle locali. Le monti come volumi Docker, e il percorso **all'interno del container** è quello che inserisci come *Percorso base dei media* nel pannello di amministrazione.

```
Il tuo NAS o PC         →  All'interno del container
/volume1/photo          →  /data/media
```

Il parametro *Percorso base dei media* deve sempre essere il percorso lato container (es. `/data/media`).

---

## Esempio di base – cartella singola (consigliato)

Tutte le cartelle degli anni (2000–2026) sono accessibili sotto un unico punto di montaggio.

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo:/data/media:ro
```

Admin → Percorso base dei media: `/data/media`

---

## Più cartelle specifiche

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo/2024:/data/media/2024:ro
  - /volume1/photo/2025:/data/media/2025:ro
  - /volume1/photo/2026:/data/media/2026:ro
```

Admin → Percorso base dei media: `/data/media`

---

## Percorsi NAS per sistema

| Sistema | Percorso NAS tipico | Percorso container |
|---|---|---|
| Synology DSM | `/volume1/photo` | `/data/media` |
| QNAP | `/share/Multimedia` | `/data/media` |
| Linux PC | `/mnt/synology/nas-photo` | `/data/media` |
| Cartella condivisa Windows | `/mnt/nas/photos` | `/data/media` |

---

## Il flag `:ro`

`:ro` significa **sola lettura**. Il container può leggere i tuoi file ma non modificarli né eliminarli. Usa sempre `:ro` per le cartelle media.

---

## Accesso NAS anonimo

```bash
sudo mount -t cifs "//192.168.1.100/photos" /mnt/nas -o guest,uid=1000,gid=1000
```

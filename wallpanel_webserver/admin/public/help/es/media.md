# Mapeo de volúmenes Docker

## Cómo funciona

El contenedor no puede acceder directamente a su NAS o carpetas locales. Las monta como volúmenes Docker, y la ruta **dentro del contenedor** es lo que introduce como *Ruta base de medios* en el panel de administración.

```
Su NAS o PC             →  Dentro del contenedor
/volume1/photo          →  /data/media
```

El parámetro *Ruta base de medios* siempre debe ser la ruta del lado del contenedor (ej. `/data/media`).

---

## Ejemplo básico – carpeta única (recomendado)

Todas las carpetas de años (2000–2026) son accesibles bajo un único punto de montaje.

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo:/data/media:ro
```

Admin → Ruta base de medios: `/data/media`

---

## Múltiples carpetas específicas

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo/2024:/data/media/2024:ro
  - /volume1/photo/2025:/data/media/2025:ro
  - /volume1/photo/2026:/data/media/2026:ro
```

Admin → Ruta base de medios: `/data/media`

---

## Rutas NAS según el sistema

| Sistema | Ruta NAS típica | Ruta en contenedor |
|---|---|---|
| Synology DSM | `/volume1/photo` | `/data/media` |
| QNAP | `/share/Multimedia` | `/data/media` |
| Linux PC | `/mnt/synology/nas-photo` | `/data/media` |
| Carpeta compartida Windows | `/mnt/nas/photos` | `/data/media` |

---

## El indicador `:ro`

`:ro` significa **solo lectura**. El contenedor puede leer sus archivos pero no modificarlos ni eliminarlos. Use siempre `:ro` para las carpetas de medios.

---

## Acceso NAS anónimo

```bash
sudo mount -t cifs "//192.168.1.100/photos" /mnt/nas -o guest,uid=1000,gid=1000
```

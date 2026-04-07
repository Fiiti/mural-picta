# Montage de volumes Docker

## Comment ça fonctionne

Le conteneur ne peut pas accéder directement à votre NAS ou vos dossiers locaux. Vous les montez en tant que volumes Docker, et le chemin **à l'intérieur du conteneur** est ce que vous saisissez comme *Chemin de base des médias* dans le panneau d'administration.

```
Votre NAS ou PC         →  À l'intérieur du conteneur
/volume1/photo          →  /data/media
```

Le paramètre *Chemin de base des médias* doit toujours être le chemin côté conteneur (ex. `/data/media`).

---

## Exemple de base – dossier unique (recommandé)

Tous les dossiers d'années (2000–2026) sont accessibles sous un seul point de montage.

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo:/data/media:ro
```

Admin → Chemin de base des médias : `/data/media`

---

## Dossiers multiples spécifiques

```yaml
volumes:
  - wallpanel_config:/app/config
  - /volume1/photo/2024:/data/media/2024:ro
  - /volume1/photo/2025:/data/media/2025:ro
  - /volume1/photo/2026:/data/media/2026:ro
```

Admin → Chemin de base des médias : `/data/media`

---

## Chemins NAS selon le système

| Système | Chemin NAS typique | Chemin conteneur |
|---|---|---|
| Synology DSM | `/volume1/photo` | `/data/media` |
| QNAP | `/share/Multimedia` | `/data/media` |
| Linux PC | `/mnt/synology/nas-photo` | `/data/media` |
| Partage Windows (monté) | `/mnt/nas/photos` | `/data/media` |

---

## L'indicateur `:ro`

`:ro` signifie **lecture seule**. Le conteneur peut lire vos fichiers mais ne peut pas les modifier ni les supprimer. Utilisez toujours `:ro` pour les dossiers médias.

---

## Accès NAS anonyme

```bash
sudo mount -t cifs "//192.168.1.100/photos" /mnt/nas -o guest,uid=1000,gid=1000
```

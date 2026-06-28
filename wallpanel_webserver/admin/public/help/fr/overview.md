# MuralPicta – Vue d'ensemble

**MuralPicta** est un serveur de diaporama auto-hébergé pour panneaux muraux, tablettes et écrans. Il fonctionne entièrement sur votre réseau local — aucun cloud, aucun abonnement, aucun service externe requis. Une fois installé, il fonctionne complètement hors ligne (sauf pour la recherche optionnelle de noms de lieux via GPS).

Cas d'utilisation typique : une tablette ou un écran fixé au mur affiche un beau diaporama continu de vos propres photos et vidéos, directement depuis votre NAS (Synology, QNAP, etc.) ou tout dossier réseau partagé.

---

## Premiers pas

1. **Source multimédia** — configurez où sont stockées vos photos et vidéos (chemin NAS ou partage réseau)
2. **Diaporama** — définissez les durées d'affichage, l'ordre et les fondus
3. Ouvrez le diaporama sur **`http://<ip-de-votre-serveur>:3000`** dans n'importe quel navigateur

Tout le reste est optionnel et peut être ajusté à tout moment.

---

## Aperçu des paramètres

### Source multimédia
Définit où MuralPicta cherche les images et vidéos. C'est le paramètre le plus important.

- **Chemin de base des médias** — le chemin local vers le dossier (ex. `/mnt/nas/photos` ou un montage Docker)
- **Sources supportées :** lecteurs réseau montés (SMB/NAS), dossiers locaux
- Un bouton **Test** vérifie le chemin et indique combien de fichiers ont été trouvés

→ *Voir la documentation "Sources multimédia" pour la configuration NAS et Docker.*

---

### Diaporama
Contrôle le comportement principal du diaporama.

- **Durée d'affichage par image** — combien de secondes chaque photo est affichée
- **Durée d'affichage par vidéo** — combien de secondes chaque vidéo est lue
- **Ordre** — aléatoire, par nom ou par date
- **Durée du fondu enchaîné** — durée de transition entre les diapositives (secondes)
- **Intervalle de rafraîchissement** — fréquence de rechargement de la liste de fichiers (minutes)

---

### Effet Ken Burns et Mode Panorama
Ajoute une animation lente de zoom et panoramique aux images pendant leur affichage.

- **Activer/Désactiver** — activer ou désactiver l'effet
- **Facteur de zoom** — niveau de zoom (ex. 1.3 = 30% de zoom)
- La direction du panoramique est choisie aléatoirement pour un rendu naturel

**Mode panorama (pour les images larges)**

Les images très larges comme les panoramas 180° sont traitées séparément : au lieu de zoomer, MuralPicta effectue un balayage horizontal pour un résultat cinématographique.

- **Activer le mode panorama** — active la détection automatique
- **Seuil de ratio** — ratio largeur/hauteur minimum pour qu'une image soit traitée comme panoramique

**Comment le ratio est-il calculé ?**

Simplement : `Largeur ÷ Hauteur = Ratio`

| Ratio | Exemple | Appréciation |
|------:|---------|-------------|
| 1,33 | 4:3 — photo standard | Normal |
| 1,78 | 16:9 — écran large | Normal |
| 2,00 | Deux fois plus large que haut | Limite |
| 2,35 | Format cinéma | Très large |
| **2,50** | **★ Seuil par défaut** | **Recommandé** |
| 3,0+ | Vrai panorama | Panorama ✓ |

Le défaut de **2,5** détecte fiablement les vrais panoramas tout en laissant intactes les photos standard (4:3 = 1,33 ; 16:9 = 1,78) — quelle que soit leur résolution en pixels.

- **Direction du balayage** — Gauche→Droite, Droite→Gauche ou aléatoire par image
- **Vitesse max. de balayage (px/s)** — si le temps d'affichage est trop court, la durée est prolongée automatiquement

---

### Superposition d'informations
Affiche des informations sur la photo/vidéo actuelle par-dessus l'image.

- **Activer/Désactiver** — activer ou désactiver la superposition
- **Position** — bas-droite, bas-gauche, haut-droite, haut-gauche
- **Modèle Image Overlay** — modèle HTML entièrement personnalisable ; peut afficher nom de fichier, date, lieu GPS, modèle d'appareil, etc.
- **Récupérer le lieu GPS** — résout les coordonnées GPS des données EXIF en nom de lieu (OpenStreetMap / Nominatim)
- **Langue des noms de lieux** — choisir la langue pour les noms de lieux issus du GPS (ex. français, anglais, allemand) — indépendant de la langue de l'interface d'administration

→ *Voir la documentation "Overlay d'image" pour les variables disponibles et des exemples.*

---

### Vidéo
Paramètres spécifiques à la lecture vidéo.

- **Volume** — volume de lecture par défaut (0 = muet, 1 = plein volume)
- **Boucle** — si une vidéo redémarre quand elle se termine

---

### Affichage
Paramètres visuels du diaporama.

- **Ajustement de l'image** — `cover` (remplit l'écran, peut rogner), `contain` (image complète, peut avoir des bordures)
- **Afficher la barre de progression** — fine ligne de progression en bas de l'écran

---

### Filtres / Exclusions
Définit quels fichiers et dossiers doivent être **exclus** du diaporama.

- **Exclure des fichiers** — expressions régulières sur les noms de fichiers
- **Exclure des dossiers** — expressions régulières sur les noms de dossiers (ex. `^@` pour ignorer les dossiers Synology)

→ *Voir la documentation "Filtres" pour des exemples de regex.*

---

### Débogage
Options développeur — utiles uniquement pour le dépannage.

- **Mode débogage** — affiche une superposition avec les données EXIF et détails du fichier

---

### Sécurité / PIN
Protège l'interface d'administration avec un code PIN.

- **Activer/Désactiver** la protection PIN
- Minimum 4 caractères, alphanumérique
- Le diaporama (`/`) est toujours accessible sans PIN

→ *Voir la documentation "Réinitialisation PIN" si vous avez oublié votre PIN.*

---

### Système & Statut
Affiche les informations du serveur et les contrôles.

- **Version** — version actuelle de MuralPicta
- **Temps de fonctionnement** — depuis combien de temps le serveur est en cours d'exécution
- **Ouvrir le diaporama** — ouvre le diaporama dans un nouvel onglet
- **Voir le journal** — affiche les erreurs récentes du serveur

---

## Contrôle à distance via API

MuralPicta dispose d'une API HTTP intégrée qui vous permet de contrôler le diaporama à distance — depuis Home Assistant, un script ou n'importe quel navigateur.

Exemple : `http://<ip-du-serveur>:3000/api/command/pause`

→ *Voir la documentation "Référence API" pour toutes les commandes disponibles.*

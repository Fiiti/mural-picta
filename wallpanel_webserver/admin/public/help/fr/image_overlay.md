# Référence du système de modèles

La **Superposition d'informations** dans MuralPicta vous permet d'afficher des métadonnées directement sur l'écran du diaporama. Vous écrivez un petit modèle HTML avec des variables spéciales qui sont remplacées par les données réelles des métadonnées EXIF, la localisation GPS et le nom de fichier de l'image courante.

---

## Variables disponibles

| Variable | Type | Exemple | Description |
|---|---|---|---|
| `filename` | Chaîne | `IMG_1234.jpg` | Nom de fichier sans chemin |
| `DateTimeOriginal` | Date | `2024-06-15T14:30:00` | Date/heure de prise de vue EXIF |
| `Make` | Chaîne | `Apple` | Fabricant de l'appareil photo |
| `Model` | Chaîne | `iPhone 14 Pro` | Modèle de l'appareil photo |
| `address.country` | Chaîne | `France` | Pays (géocodage inverse GPS) |
| `address.state` | Chaîne | `Île-de-France` | Région ou province |
| `address.city` | Chaîne | `Paris` | Ville |
| `address.town` | Chaîne | `Montmartre` | Quartier ou commune |
| `address.village` | Chaîne | `Barbizon` | Village |
| `address.road` | Chaîne | `Rue de Rivoli` | Nom de rue |

> **Note :** Les variables `address.*` ne sont disponibles que lorsque **Récupérer le lieu via GPS** est activé et que l'image contient des données GPS EXIF.

---

## Syntaxe des modificateurs

### Substitution simple
```
${variable}
```

### Chaîne de substitution (premier non vide)
```
${a|b|c}
```
Exemple : `${address.village|address.town|address.city}`

### Préfixe (uniquement si la valeur existe)
```
${variable!prefix=TEXTE}
```
Exemple : `${address.city!prefix=📍 }` → `📍 Paris` (ou rien si inconnu)

### Suffixe (uniquement si la valeur existe)
```
${variable!suffix=TEXTE}
```
Exemple : `${address.country!suffix=<br>}` → `France` suivi d'un saut de ligne

### Formatage de date
```
${variable!options=OPTIONS_INTL}
```
Exemple : `${DateTimeOriginal!options=year:numeric,month:long,day:numeric}` → `15 juin 2024`

---

## Exemples

### Simple : nom de fichier uniquement
```html
${filename}
```

### Lieu et date sur une ligne
```html
📍 ${address.town|address.city} · ${DateTimeOriginal!options=year:numeric,month:short,day:numeric}
```

### Exemple complet (style lovelace-wallpanel)
```html
<div style="text-align:right; font-size:7vh; font-weight:900; color:#ffff00; text-shadow:0px 0px 1px rgba(0,0,0,1); -webkit-text-stroke:3px black;">
  ${address.country!suffix=<br>}${address.village|address.town|address.city|address.municipality|address.county!suffix= - }${DateTimeOriginal!options=year:numeric,month:short,day:2-digit}
</div>
```

### Informations caméra
```html
<div style="font-size:1.2vh; color:#ccc; opacity:0.7;">
  ${Make} ${Model} · ${filename}
</div>
```

---

## Notes

- Toutes les variables se résolvent en **chaîne vide** si non disponibles — aucune erreur.
- Le HTML est rendu directement — les styles en ligne sont pleinement supportés.
- Le formatage de date utilise **la locale du navigateur** — les noms de mois sont traduits automatiquement.

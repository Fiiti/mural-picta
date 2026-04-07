# Référence des filtres

Les motifs peuvent être écrits **avec ou sans** barres obliques entourantes — `/^@eaDir/` et `^@eaDir` fonctionnent de la même façon.

---

# Exclure des noms de fichiers

Les fichiers dont le nom correspond à l'un des motifs listés seront ignorés lors de l'analyse des médias. Le motif est testé sur le **chemin relatif du fichier** (y compris les sous-dossiers).

### Nom de fichier exact
```
IMG_20231224_Noel.jpg
```

### Joker (extension)
```
*.svg
*.bmp
*.tiff
```

### Regex – formats vidéo non supportés
```
\.(avi|wmv|flv|rm|rmvb|3gp|asf|vob)$/i
```

### Regex – doublons HDR
```
^IMG_\d{8}_\d{6}_HDR
```

### Regex – miniatures
```
thumbnail|thumb|_small\.
```

### Regex – fichiers cachés
```
^\.
```

---

# Exclure des dossiers

Les dossiers dont le **nom** correspond à l'un des motifs listés seront ignorés entièrement — y compris tout leur contenu.

### Dossiers système Synology (recommandé !)
```
^@
```
Ignore tous les dossiers commençant par `@` — couvre `@eaDir`, `@Recycle`, `@tmp` en une seule règle.

### Nom de dossier exact
```
Retouches
Corbeille
_temp
```

### Regex – exclusion par année (avant 2022)
```
^(200[0-9]|201[0-9]|2020|2021)$
```

---

# Comment fonctionnent les motifs

| Entrée | Traitement |
|---|---|
| `IMG_001.jpg` | Correspondance littérale (sensible à la casse) |
| `*.jpg` | Joker : tout nom se terminant par `.jpg` |
| `^@` | Regex : noms commençant par `@` |
| `/^@/i` | Regex avec indicateur : même chose, insensible à la casse |

Les motifs sont appliqués comme expressions régulières JavaScript en interne.

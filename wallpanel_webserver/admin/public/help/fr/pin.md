# Code PIN oublié ?

Si vous ne pouvez plus accéder au panneau d'administration parce que vous avez oublié votre PIN, vous pouvez le réinitialiser manuellement en modifiant un fichier texte sur le serveur.

---

## Où se trouve le fichier de configuration ?

Le fichier s'appelle **`config.json`** et contient tous les paramètres de MuralPicta.

### Si vous utilisez MuralPicta via Docker

Le fichier se trouve dans le volume Docker que vous avez mappé au démarrage du conteneur. Si vous avez suivi la configuration standard, il se trouve dans un dossier sur votre ordinateur ou NAS :

```
/votre-dossier/config/config.json
```

Sur un **NAS Synology**, vous pouvez trouver ce dossier dans la File Station.

### Si vous avez installé MuralPicta directement (sans Docker)

```
wallpanel_webserver/server/config/config.json
```

---

## Étape par étape : réinitialiser le PIN

**1. Ouvrez le fichier `config.json`** avec n'importe quel éditeur de texte.

**2. Trouvez la ligne suivante :**

```json
"admin_pin": "abc123..."
```

**3. Remplacez la valeur par `null`** (sans guillemets) :

```json
"admin_pin": null
```

**4. Sauvegardez le fichier.**

**5. Redémarrez MuralPicta** (ou le conteneur Docker). Après le redémarrage, le panneau d'administration est accessible sans PIN.

---

## Notes importantes

- Écrivez `null` **sans** guillemets. `"null"` (avec guillemets) serait traité comme le texte "null".
- Ne **supprimez pas** la ligne entièrement — remplacez simplement la valeur par `null`.
- Après la réinitialisation, vous pouvez définir un nouveau PIN dans le panneau d'administration sous **Sécurité**.

---

## Toujours des problèmes ?

- Le bon volume de configuration est-il mappé dans Docker ?
- Le conteneur/serveur a-t-il été complètement redémarré ?
- Le JSON est-il toujours valide ? Vérifiez votre fichier sur [jsonlint.com](https://jsonlint.com).

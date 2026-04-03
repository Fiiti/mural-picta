# PIN vergessen?

Wenn du keinen Zugriff mehr auf das Admin-Panel hast, weil du deinen PIN vergessen hast, kannst du ihn manuell zurücksetzen, indem du eine Textdatei auf dem Server bearbeitest.

---

## Wo befindet sich die Konfigurationsdatei?

Die Datei heißt **`config.json`** und enthält alle Einstellungen von MuralPicta.

### Wenn du MuralPicta über Docker betreibst

Die Datei befindet sich in dem Docker-Volume, das du beim Start des Containers angegeben hast. Bei einer Standard-Installation findest du sie in einem Ordner auf deinem Computer oder NAS, den du als Config-Volume eingetragen hast, zum Beispiel:

```
/dein-ordner/config/config.json
```

Auf einer **Synology NAS** findest du diesen Ordner in der File Station. Auf einem **Windows-PC** kannst du ihn im Explorer öffnen.

### Wenn du MuralPicta direkt installiert hast (ohne Docker)

Die Datei liegt im Projektordner:

```
wallpanel_webserver/server/config/config.json
```

---

## Schritt für Schritt: PIN zurücksetzen

**1. Öffne die Datei `config.json`** mit einem beliebigen Texteditor (z. B. Editor/Notepad, TextEdit, VS Code oder dem Texteditor in deiner NAS-Oberfläche).

**2. Suche nach folgender Zeile:**

```json
"admin_pin": "abc123..."
```

Der Wert nach dem Doppelpunkt sieht anders aus — es ist ein langer verschlüsselter Text.

**3. Ersetze den Wert durch `null`** (ohne Anführungszeichen):

```json
"admin_pin": null
```

Das Ergebnis sollte in der Datei so aussehen:

```json
{
  "admin_pin": null,
  ...weitere Einstellungen...
}
```

**4. Speichere die Datei.**

**5. Starte MuralPicta neu** (bzw. den Docker-Container). Nach dem Neustart ist das Admin-Panel wieder ohne PIN erreichbar.

---

## Wichtige Hinweise

- Schreibe `null` **ohne** Anführungszeichen. `"null"` (mit Anführungszeichen) würde als Text "null" behandelt werden und funktioniert nicht korrekt.
- Lösche die Zeile **nicht** komplett — ersetze nur den Wert durch `null`.
- Nach dem Zurücksetzen kannst du im Admin-Panel unter **Sicherheit** einen neuen PIN vergeben.

---

## Immer noch Probleme?

Falls die Datei nicht gefunden wird oder die Änderung keine Wirkung zeigt, prüfe:

- Ist das richtige Config-Volume in Docker eingebunden?
- Wurde der Container/Server vollständig neu gestartet (nicht nur neu geladen)?
- Ist das JSON noch gültig? Jede Zeile außer der letzten muss mit einem Komma enden. Du kannst deine Datei auf [jsonlint.com](https://jsonlint.com) prüfen.

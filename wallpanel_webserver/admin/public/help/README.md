# Help-Dateien – Hinweise zur Bearbeitung

`de.md` und `en.md` **nur hier** bearbeiten – **nicht** in `admin/dist/help/`!

`dist/` wird bei jedem Build vollständig überschrieben. Änderungen dort gehen verloren.

## Nach der Bearbeitung

```bash
npm run build
```

Danach sind die Änderungen in `admin/dist/help/` und sofort im Browser sichtbar
(Server-Neustart nicht nötig, da die Datei per fetch zur Laufzeit geladen wird).

# Help-Dateien – Hinweise zur Bearbeitung

`*.md` Datein **nur in** `wallpanel_webserver/admin/public/help` bearbeiten – **nicht** in `admin/dist/help/`!

`dist/` wird bei jedem Build vollständig überschrieben. Änderungen dort gehen verloren.

## Nach der Bearbeitung

```bash
npm run build
```

Danach sind die Änderungen in `admin/dist/help/` und sofort im Browser sichtbar
(Server-Neustart nicht nötig, da die Datei per fetch zur Laufzeit geladen wird).

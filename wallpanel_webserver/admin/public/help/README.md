# Help files – Editing instructions

Edit `*.md` files **only in** `wallpanel_webserver/admin/public/help` – **not** in `admin/dist/help/`!
`dist/` is completely overwritten with every build. Changes made there will be lost.

## After editing

```bash
npm run build
```

The changes will then be visible in `admin/dist/help/` and immediately in the browser
(no need to restart the server, as the file is loaded via fetch at runtime).

---

# Help-Dateien – Hinweise zur Bearbeitung

`*.md` Datein **nur in** `wallpanel_webserver/admin/public/help` bearbeiten – **nicht** in `admin/dist/help/`!
`dist/` wird bei jedem Build vollständig überschrieben. Änderungen dort gehen verloren.

## Nach der Bearbeitung

```bash
npm run build
```

Danach sind die Änderungen in `admin/dist/help/` und sofort im Browser sichtbar
(Server-Neustart nicht nötig, da die Datei per fetch zur Laufzeit geladen wird).

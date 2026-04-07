# PIN dimenticato?

Se non riesci più ad accedere al Pannello di amministrazione perché hai dimenticato il PIN, puoi reimpostarlo manualmente modificando un file di testo sul server.

---

## Dove si trova il file di configurazione?

Il file si chiama **`config.json`** e contiene tutte le impostazioni di MuralPicta.

### Se stai usando MuralPicta tramite Docker

Il file si trova nel volume Docker che hai mappato all'avvio del container. Se hai seguito la configurazione standard, si trova in una cartella del tuo computer o NAS:

```
/tua-cartella/config/config.json
```

Su un **NAS Synology**, puoi trovare questa cartella in File Station.

### Se hai installato MuralPicta direttamente (senza Docker)

```
wallpanel_webserver/server/config/config.json
```

---

## Passo dopo passo: reimpostare il PIN

**1. Apri il file `config.json`** con qualsiasi editor di testo.

**2. Trova la seguente riga:**

```json
"admin_pin": "abc123..."
```

**3. Sostituisci il valore con `null`** (senza virgolette):

```json
"admin_pin": null
```

**4. Salva il file.**

**5. Riavvia MuralPicta** (o il container Docker). Dopo il riavvio, il Pannello di amministrazione è accessibile senza PIN.

---

## Note importanti

- Scrivi `null` **senza** virgolette. `"null"` (con virgolette) verrebbe trattato come il testo "null".
- **Non eliminare** l'intera riga — sostituisci solo il valore con `null`.
- Dopo la reimpostazione, puoi impostare un nuovo PIN nel Pannello di amministrazione sotto **Sicurezza**.

---

## Hai ancora problemi?

- Il volume di configurazione corretto è mappato in Docker?
- Il container/server è stato completamente riavviato?
- Il JSON è ancora valido? Controlla il tuo file su [jsonlint.com](https://jsonlint.com).

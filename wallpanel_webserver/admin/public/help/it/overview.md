# MuralPicta – Panoramica

**MuralPicta** è un server di presentazione auto-ospitato per pannelli a parete, tablet e schermi. Funziona interamente sulla tua rete locale — nessun cloud, nessun abbonamento, nessun servizio esterno richiesto. Una volta installato, funziona completamente offline (tranne la ricerca opzionale di nomi di luoghi tramite GPS).

Caso d'uso tipico: un tablet o schermo montato a parete mostra una bellissima presentazione continua delle tue foto e video, direttamente dal tuo NAS (Synology, QNAP, ecc.) o qualsiasi cartella di rete condivisa.

---

## Primi passi

1. **Sorgente multimediale** — configura dove sono archiviate le tue foto e video (percorso NAS o cartella condivisa)
2. **Presentazione** — imposta i tempi di visualizzazione, l'ordine e la dissolvenza
3. Apri la presentazione su **`http://<ip-del-tuo-server>:3000`** in qualsiasi browser

Tutto il resto è opzionale e può essere modificato in qualsiasi momento.

---

## Panoramica delle impostazioni

### Sorgente multimediale
Definisce dove MuralPicta cerca immagini e video. È l'impostazione più importante.

- **Percorso base dei media** — il percorso locale alla cartella (es. `/mnt/nas/foto` o un montaggio Docker)
- **Sorgenti supportate:** unità di rete montate (SMB/NAS), cartelle locali
- Un pulsante **Test** verifica il percorso e mostra quanti file sono stati trovati

→ *Vedere la documentazione "Sorgenti multimediali" per la configurazione NAS e Docker.*

---

### Presentazione
Controlla il comportamento principale della presentazione.

- **Tempo di visualizzazione per immagine** — quanti secondi viene mostrata ogni foto
- **Tempo di visualizzazione per video** — quanti secondi viene riprodotto ogni video
- **Ordine** — casuale, per nome o per data
- **Durata della dissolvenza** — tempo di transizione tra le diapositive (secondi)
- **Intervallo di aggiornamento** — ogni quanto viene ricaricato l'elenco dei file (minuti)

---

### Effetto Ken Burns
Aggiunge un'animazione lenta di zoom e panoramica alle immagini durante la visualizzazione.

- **Attiva/Disattiva** — attivare o disattivare l'effetto
- **Fattore di zoom** — livello di zoom (es. 1.3 = 30% di zoom)
- La direzione della panoramica viene scelta casualmente per un aspetto naturale

---

### Sovrapposizione informazioni
Mostra informazioni sulla foto/video corrente sopra l'immagine.

- **Attiva/Disattiva** — attivare o disattivare la sovrapposizione
- **Posizione** — in basso a destra, in basso a sinistra, in alto a destra, in alto a sinistra
- **Modello Image Overlay** — modello HTML completamente personalizzabile; può mostrare nome file, data, posizione GPS, modello fotocamera, ecc.
- **Recupera posizione GPS** — risolve le coordinate GPS dai dati EXIF in nome di luogo (OpenStreetMap / Nominatim)
- **Lingua dei nomi di luogo** — scegliere la lingua per i nomi di luogo derivati dal GPS (es. italiano, inglese, tedesco) — indipendente dalla lingua dell'interfaccia di amministrazione

→ *Vedere la documentazione "Overlay immagine" per le variabili disponibili ed esempi.*

---

### Video
Impostazioni specifiche per la riproduzione video.

- **Volume** — volume di riproduzione predefinito (0 = disattivato, 1 = volume massimo)
- **Loop** — se un video si riavvia quando termina

---

### Visualizzazione
Impostazioni visive della presentazione.

- **Adattamento immagine** — `cover` (riempie lo schermo, può ritagliare), `contain` (immagine intera, può avere bordi)
- **Mostra barra di avanzamento** — sottile linea di avanzamento in fondo allo schermo

---

### Filtri / Esclusioni
Definisce quali file e cartelle devono essere **esclusi** dalla presentazione.

- **Escludi file** — espressioni regolari per i nomi dei file
- **Escludi cartelle** — espressioni regolari per i nomi delle cartelle (es. `^@` per ignorare le cartelle Synology)

→ *Vedere la documentazione "Filtri" per esempi di regex.*

---

### Debug
Opzioni sviluppatore — necessarie solo per la risoluzione dei problemi.

- **Modalità debug** — mostra una sovrapposizione con dati EXIF e dettagli del file

---

### Sicurezza / PIN
Protegge l'interfaccia di amministrazione con un codice PIN.

- **Attiva/Disattiva** la protezione PIN
- Minimo 4 caratteri, alfanumerico
- La presentazione (`/`) è sempre accessibile senza PIN

→ *Vedere la documentazione "Reset PIN" se hai dimenticato il tuo PIN.*

---

### Sistema e stato
Mostra le informazioni del server e i controlli.

- **Versione** — versione attuale di MuralPicta
- **Tempo di attività** — da quanto tempo il server è in esecuzione
- **Apri presentazione** — apre la presentazione in una nuova scheda
- **Visualizza registro** — mostra gli errori recenti del server

---

## Controllo remoto via API

MuralPicta ha un'API HTTP integrata che ti permette di controllare la presentazione da remoto — da Home Assistant, uno script o qualsiasi browser.

Esempio: `http://<ip-del-server>:3000/api/command/pause`

→ *Vedere la documentazione "Riferimento API" per tutti i comandi disponibili.*

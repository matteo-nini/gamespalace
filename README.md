# Games Palace · Calcinaia

Sito vetrina e video promo per i monitor in sala, costruiti sul marchio originale della sala
(cinque stelle oro, "Games" in corsivo, PALACE maiuscolo tra due filetti) e sui colori dell'arredamento:
avorio, rosso del tappeto, oro. Font: Pinyon Script, Cormorant Garamond, Montserrat (inclusi in locale).
Le foto della sala sono in `site/foto/` e sono usate sia dal sito sia dai video.

## Sito — `site/`
Sito statico (HTML/CSS/JS, nessuna dipendenza, font inclusi in locale): si pubblica copiando la cartella `site/` su qualsiasi hosting (Netlify, Vercel, GitHub Pages, hosting tradizionale).

- Avviso maggiore età all'ingresso, fascia "gioco responsabile" e numero verde ISS nel footer.
- **Foto**: sono in `site/foto/` (ingrandite dalle foto Google originali). Per sostituirne una basta
  sovrascrivere il file con lo stesso nome; le nuove foto professionali miglioreranno molto la resa.
- Testi, telefono e orari sono in `site/index.html`.

## Video — `video/`
Tutti i video sono MP4 1920×1080, 30 fps, H.264, senza audio.

### Canali per le TV — `video/out/TV-1.mp4` … `TV-4.mp4`
Quattro montaggi diversi (circa 1 minuto e 45 secondi ciascuno) da mettere **in loop**, uno per televisore:
le TV vicine non mostrano mai la stessa cosa nello stesso momento. Ogni canale contiene sempre orari,
informazioni e il messaggio di gioco responsabile.

In ogni fotogramma restano sempre visibili:
- in alto: logo e **Sala VLT & Slot · Nuova gestione**;
- fascia rossa: **Tutti i giorni 10:00 – 03:00**, indirizzo, telefono;
- avvertenze 18+ / gioco responsabile / Telefono Verde.

Tutti i testi stanno nell'area sicura delle TV (5% dai bordi, così l'overscan non taglia nulla) e non
vanno mai a capo spezzando le parole: il renderer lo controlla su ogni scena e si ferma se trova un testo tagliato.

### Scene singole — `video/out/scene/`
apertura · nuova-gestione · orari · sala-vlt-slot (rulli) · jackpot · galleria · vlt · slot · bar ·
promo-caffe · promozioni · aperitivo · mattino · notte · dove-siamo · accoglienza · gioco-responsabile

### Immagini statiche — `video/out/`
`sfondo-monitor.png` (logo, Sala VLT & Slot, orari) e `sfondo-monitor-solo-logo.png`, in 4K (3840×2160).

### Modificare testi, promo e canali
- **Testi e info** (orari, indirizzo, telefono, testi di ogni scheda): `video/scenes/contenuti.js`.
- **Nuova promo**: aggiungi una scheda in `contenuti.js` (layout `centro` o `foto`) e una riga in
  `video/videos.json` → `scene`, poi inseriscila in uno o più `canali`.
- **Ordine dei canali TV**: `video/videos.json` → `canali`.
- Rigenera con `cd video && node render.mjs` (Node.js, Playwright/Chromium e ffmpeg).
  `node render.mjs canali` rimonta solo i canali senza rifare le scene.

## Da verificare prima della pubblicazione
- Telefono `0587 291514` e indirizzo vengono dal vecchio sito: confermare che siano ancora validi con la nuova gestione.
- Pubblicità del gioco con vincite in denaro: il Decreto Dignità (art. 9, DL 87/2018) e le linee guida AGCOM limitano fortemente i messaggi promozionali, soprattutto online. Far verificare testi del sito e dei video al concessionario/consulente prima dell'uso.

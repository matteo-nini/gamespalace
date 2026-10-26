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
### Canali — `video/out/TV-1.mp4` … `TV-5.mp4` e `BAR.mp4`
Sei montaggi diversi da mettere **in loop**: cinque per i televisori della sala e uno per lo schermo del bar
(più centrato su bar, caffè e accoglienza). Le TV vicine non mostrano mai la stessa cosa nello stesso momento;
ogni canale contiene sempre orari, informazioni e il messaggio di gioco responsabile.

### Versioni lunghe (1 ora) — `video/out/lunghi/`
Per le TV vecchie, dove a ogni cambio file il lettore si blocca e mostra il nome in sovrimpressione:
`TV-1-60min.mp4` … `TV-5-60min.mp4`, `BAR-60min.mp4`. Ogni file dura un'ora e a ogni giro le scene sono
rimescolate (mai la stessa scena due volte di fila). Impostare sul lettore la ripetizione del singolo file.
Sono file grandi (circa 1 GB): non sono su GitHub, si generano con `node render.mjs lunghi`
(la durata si cambia in `videos.json` → `lunghi.minuti`). Restano sotto i 4 GB, il limite delle chiavette FAT32.

Codifica compatibile con TV e lettori USB datati: H.264 High@4.0, 1920×1080, 25 fps, senza audio.

In ogni fotogramma restano sempre visibili:
- in alto: logo e **Sala VLT & Slot · Nuova gestione**;
- fascia rossa: **Tutti i giorni 10:00 – 03:00**, indirizzo, telefono;
- avvertenze 18+ / gioco responsabile / Telefono Verde.

Tutti i testi stanno nell'area sicura delle TV (5% dai bordi, così l'overscan non taglia nulla) e non
vanno mai a capo spezzando le parole: il renderer lo controlla su ogni scena e si ferma se trova un testo tagliato.

### Scene singole — `video/out/scene/`
apertura · nuova-gestione · orari · sala-vlt-slot (rulli) · jackpot · galleria · vlt · slot · bar ·
promo-caffe · promozioni · aperitivo · mattino · notte · dove-siamo (non usata nei canali) · accoglienza · gioco-responsabile

### Immagini statiche — `video/out/`
`sfondo-monitor.png` (logo, Sala VLT & Slot, orari) e `sfondo-monitor-solo-logo.png`, in 4K (3840×2160).

### Modificare testi, promo e canali
- **Testi e info** (orari, indirizzo, telefono, testi di ogni scheda): `video/scenes/contenuti.js`.
- **Nuova promo**: aggiungi una scheda in `contenuti.js` (layout `centro` o `foto`) e una riga in
  `video/videos.json` → `scene`, poi inseriscila in uno o più `canali`.
- **Ordine dei canali**: `video/videos.json` → `canali`.
- Rigenera con `cd video && node render.mjs` (Node.js, Playwright/Chromium e ffmpeg).
  `node render.mjs canali` rimonta canali e versioni lunghe senza rifare le scene.

## Da verificare prima della pubblicazione
- Telefono `0587 291514` e indirizzo vengono dal vecchio sito: confermare che siano ancora validi con la nuova gestione.
- Pubblicità del gioco con vincite in denaro: il Decreto Dignità (art. 9, DL 87/2018) e le linee guida AGCOM limitano fortemente i messaggi promozionali, soprattutto online. Far verificare testi del sito e dei video al concessionario/consulente prima dell'uso.

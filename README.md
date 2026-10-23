# Games Palace · Calcinaia

Sito vetrina e video promo per i monitor in sala, con lo stesso brand (oro, nero/prugna, rubino · font Cinzel + Montserrat).

## Sito — `site/`
Sito statico (HTML/CSS/JS, nessuna dipendenza, font inclusi in locale): si pubblica copiando la cartella `site/` su qualsiasi hosting (Netlify, Vercel, GitHub Pages, hosting tradizionale).

- Avviso maggiore età all'ingresso, fascia "gioco responsabile" e numero verde ISS nel footer.
- **Foto**: metti i file in `site/foto/` con questi nomi e compaiono da soli:
  `hero.jpg` (sfondo in alto), `sala-1.jpg` … `sala-4.jpg` (galleria). Se una foto manca, la galleria si adatta o sparisce.
- Testi, telefono e orari sono in `site/index.html`.

## Video — `video/`
I video finiti sono in `video/out/` (MP4 1920×1080, 30 fps, H.264, senza audio):

| File | Durata | Messaggio |
|---|---|---|
| `00-loop-completo.mp4` | 60 s | Tutti i video in sequenza, da mettere in loop sui monitor |
| `01-nuova-gestione.mp4` | 12 s | Logo, "Nuova gestione", indirizzo |
| `02-sala-vlt-slot.mp4` | 13 s | Rulli slot, "Sala VLT & Slot", schede VLT/Slot |
| `03-jackpot.mp4` | 13 s | Jackpot progressivi sulle VLT |
| `04-promo-caffe.mp4` | 11 s | Promo "Il caffè lo offriamo noi" |
| `05-promo-novita.mp4` | 11 s | "Ogni settimana nuove promozioni" |

Ogni video ha il marchio in alto e la fascia "18+ · gioca responsabilmente" sempre visibile.

### Rigenerare / creare nuove promo
Richiede Node.js, Playwright (Chromium) e ffmpeg.

1. Per una nuova promo aggiungi una voce in `video/videos.json` usando la scena `04-promo.html`
   con i testi `etichetta`, `titolo`, `sotto`, `nota`.
2. (Opzionale) metti le foto della sala in `video/foto/` (`sala-1.jpg` … `sala-4.jpg`): diventano lo sfondo animato delle scene.
3. `cd video && node render.mjs` (oppure `node render.mjs promo` per rifare solo quelli con "promo" nel nome).

## Da verificare prima della pubblicazione
- Telefono `0587 291514` e indirizzo vengono dal vecchio sito: confermare che siano ancora validi con la nuova gestione.
- Orari precisi (ora c'è solo "Aperti tutti i giorni").
- Pubblicità del gioco con vincite in denaro: il Decreto Dignità (art. 9, DL 87/2018) e le linee guida AGCOM limitano fortemente i messaggi promozionali, soprattutto online. Far verificare testi del sito e dei video al concessionario/consulente prima dell'uso.

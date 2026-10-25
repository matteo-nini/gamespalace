// Testi e informazioni di tutti i video. Modifica qui e rilancia `node render.mjs`.
window.INFO = {
  sala: "Sala VLT & Slot",
  sottotitolo: "Nuova gestione",
  orariEtichetta: "Tutti i giorni",
  orari: "10:00 – 03:00",
  indirizzo: "Via del Tiglio 149/F · Calcinaia",
  telefono: "0587 291514"
};

// Schede: layout "centro" (testo centrato, foto sfocata dietro) o "foto" (foto a sinistra, testo a destra).
// Campi: tag, titolo, sotto, punti [...], nota, foto (file in site/foto/).
window.SCHEDE = {
  apertura: { layout: "centro", foto: "accoglienza.jpg", tag: "Nuova gestione", titolo: "Sala VLT & Slot",
    sotto: "L'eleganza e l'accoglienza di sempre", nota: "Tutti i giorni · 10:00 – 03:00" },
  nuova: { layout: "centro", foto: "sala-relax.jpg", tag: "Benvenuti", titolo: "Nuova gestione",
    sotto: "Nuova energia, con l'eleganza e l'accoglienza di sempre", nota: "Ti aspettiamo" },
  vlt: { layout: "foto", foto: "vlt-dettaglio.jpg", tag: "Videolottery", titolo: "Sala VLT",
    punti: ["Tanti giochi collegati in rete", "Jackpot progressivi", "Postazioni confortevoli"], nota: "Aperta fino alle 3:00" },
  slot: { layout: "foto", foto: "slot.jpg", tag: "Slot", titolo: "Area slot",
    punti: ["I titoli più amati", "Sala ordinata e accogliente", "Aperta tutti i giorni"], nota: "Dalle 10:00 alle 3:00" },
  bar: { layout: "foto", foto: "bar.jpg", tag: "Bar", titolo: "Il nostro bar",
    punti: ["Caffetteria", "Bibite e aperitivi", "Servizio cordiale"], nota: "Ti aspettiamo al bar" },
  caffe: { layout: "centro", foto: "bar.jpg", tag: "Benvenuto", titolo: "Il caffè lo offriamo noi",
    sotto: "Un piccolo benvenuto dalla nuova gestione", nota: "Chiedi al bar" },
  promozioni: { layout: "centro", foto: "corridoio.jpg", tag: "In sala", titolo: "Promozioni in sala",
    sotto: "Iniziative dedicate ai nostri clienti, ogni settimana", nota: "Informazioni al bar" },
  aperitivo: { layout: "centro", foto: "bar.jpg", tag: "Bar", titolo: "L'aperitivo è al Games Palace",
    sotto: "Concediti una pausa con stile", nota: "Ti aspettiamo al bar" },
  mattino: { layout: "centro", foto: "bar.jpg", tag: "Dalle 10:00", titolo: "Il caffè è pronto",
    sotto: "Inizia la giornata al Games Palace", nota: "Aperti tutti i giorni" },
  notte: { layout: "centro", foto: "sala-vlt.jpg", tag: "Fino alle 3:00", titolo: "Aperti fino a notte fonda",
    sotto: "Sala VLT & Slot aperta tutti i giorni, fino alle 3 di notte", nota: "7 giorni su 7" },
  dove: { layout: "foto", foto: "ingresso.jpg", tag: "Dove siamo", titolo: "Ti aspettiamo",
    punti: ["Via del Tiglio 149/F", "Centro Torretta White", "56012 Calcinaia (PI)"], nota: "Tel. 0587 291514" },
  accoglienza: { layout: "foto", foto: "accoglienza.jpg", tag: "Accoglienza", titolo: "Benvenuti a palazzo",
    punti: ["Ambiente elegante", "Spazi confortevoli", "Accoglienza cordiale"], nota: "Tutti i giorni dalle 10:00" },
  responsabile: { layout: "centro", tag: "Gioco responsabile", titolo: "Il gioco è un divertimento",
    punti: ["Stabilisci un limite di tempo e di spesa", "Gioco vietato ai minori di 18 anni", "Serve aiuto? Telefono Verde 800 558 822"] }
};

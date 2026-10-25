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
    sotto: "Eleganza, comfort e cortesia, ogni giorno", nota: "Tutti i giorni · 10:00 – 03:00" },
  nuova: { layout: "centro", foto: "sala-relax.jpg", tag: "Benvenuti", titolo: "Nuova gestione",
    sotto: "Lo stile di sempre, con un servizio ancora più attento", nota: "Vi aspettiamo" },
  vlt: { layout: "foto", foto: "vlt-dettaglio.jpg", tag: "Videolottery", titolo: "Sala VLT",
    punti: ["Ampia selezione di giochi", "Jackpot progressivi", "Ambiente curato e confortevole"], nota: "Aperta fino alle 03:00" },
  slot: { layout: "foto", foto: "slot.jpg", tag: "Slot", titolo: "Area slot",
    punti: ["I titoli più richiesti", "Ambiente ordinato e confortevole", "Aperta tutti i giorni"], nota: "Dalle 10:00 alle 03:00" },
  bar: { layout: "foto", foto: "bar.jpg", tag: "Bar", titolo: "Il nostro bar",
    punti: ["Caffetteria", "Bibite e aperitivi", "Servizio attento e cortese"], nota: "Vi aspettiamo al bar" },
  caffe: { layout: "centro", foto: "bar.jpg", tag: "Benvenuto", titolo: "Il caffè è offerto dalla casa",
    sotto: "Un benvenuto dalla nuova gestione", nota: "Chiedete al bar" },
  promozioni: { layout: "centro", foto: "corridoio.jpg", tag: "In sala", titolo: "Promozioni in sala",
    sotto: "Iniziative riservate ai nostri clienti, ogni settimana", nota: "Informazioni al bar" },
  aperitivo: { layout: "centro", foto: "bar.jpg", tag: "Bar", titolo: "L'aperitivo al Games Palace",
    sotto: "Una pausa di gusto, in un ambiente elegante", nota: "Vi aspettiamo al bar" },
  mattino: { layout: "centro", foto: "bar.jpg", tag: "Dalle 10:00", titolo: "Buongiorno al Games Palace",
    sotto: "Caffetteria aperta dal mattino", nota: "Aperti tutti i giorni" },
  notte: { layout: "centro", foto: "sala-vlt.jpg", tag: "Fino alle 03:00", titolo: "Aperti fino alle 3 di notte",
    sotto: "Sala VLT & Slot aperta tutti i giorni, in orario continuato", nota: "7 giorni su 7" },
  dove: { layout: "foto", foto: "ingresso.jpg", tag: "Dove siamo", titolo: "Come raggiungerci",
    punti: ["Via del Tiglio 149/F", "Centro Torretta White", "56012 Calcinaia (PI)"], nota: "Tel. 0587 291514" },
  accoglienza: { layout: "foto", foto: "accoglienza.jpg", tag: "Accoglienza", titolo: "Benvenuti",
    punti: ["Ambiente elegante e curato", "Spazi confortevoli", "Accoglienza cortese"], nota: "Tutti i giorni dalle 10:00" },
  responsabile: { layout: "centro", tag: "Gioco responsabile", titolo: "Il gioco è un divertimento",
    punti: ["Stabilite un limite di tempo e di spesa", "Gioco vietato ai minori di 18 anni", "Telefono Verde: 800 558 822"] }
};

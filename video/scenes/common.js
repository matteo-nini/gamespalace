// Elementi comuni a tutte le scene: cornice fissa con info, dissolvenze, adattamento testi, controllo area sicura.
// Tutto il movimento è in CSS/Web Animations così il renderer può "fermare il tempo" e catturare ogni fotogramma.
(function () {
  var stage = document.querySelector(".stage");
  var dur = Number(document.body.dataset.duration || 10);
  document.documentElement.style.setProperty("--dur", dur + "s");
  var I = window.INFO || {};

  // Pseudo-casuale deterministico: ogni render è identico
  var seed = 7;
  window.rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  var LOGO = '<img class="logo" src="../../site/assets/logo-light.svg" alt="">';
  document.querySelectorAll("[data-logo]").forEach(function (el) { el.innerHTML = LOGO; });

  // Cornice: logo + "Sala VLT & Slot" in alto, fascia rossa con orari/indirizzo/telefono, avvertenze legali.
  // data-chrome="legal" sul body → solo avvertenze (sfondo statico)
  var chrome = document.body.dataset.chrome || "full";
  var html = "";
  if (chrome === "full") {
    html += '<div class="topshade"></div><div class="topbar">' + LOGO + '<div class="topbar__title"><b>' + I.sala + "</b><small>" + I.sottotitolo + "</small></div></div>" +
      '<div class="infobar"><div class="infobar__in">' +
      '<div class="infobar__hours"><small>' + I.orariEtichetta + "</small><b>" + I.orari + "</b></div>" +
      '<div class="infobar__sep"></div>' +
      '<div class="infobar__addr"><small>Dove siamo</small><b>' + I.indirizzo + "</b></div>" +
      '<div class="infobar__sep"></div>' +
      '<div class="infobar__tel"><small>Telefono</small><b>' + I.telefono + "</b></div>" +
      "</div></div>";
  }
  html += '<div class="legal"><b>18+</b>Gioco vietato ai minori · Il gioco può causare dipendenza patologica · Gioca responsabilmente · Telefono Verde 800 558 822</div>';
  if (chrome === "full") html += '<div class="fadebox"></div>';
  stage.insertAdjacentHTML("beforeend", html);

  // Adatta il corpo dei testi [data-fit="altezza max in px"]: niente parole che escono dal riquadro
  window.fitText = function () {
    document.querySelectorAll("[data-fit]").forEach(function (el) {
      var maxH = Number(el.dataset.fit), size = parseFloat(getComputedStyle(el).fontSize);
      while (size > 20 && (el.scrollWidth > el.clientWidth + 1 || el.offsetHeight > maxH)) {
        size *= 0.95; el.style.fontSize = size + "px";
      }
      // Se rimpicciolendo al massimo del 20% il testo sta su una riga in meno, meglio così (niente parole isolate)
      var lines = function () { return Math.round(el.offsetHeight / parseFloat(getComputedStyle(el).lineHeight)); };
      var n0 = lines(), s0 = size, best = size;
      for (var k = s0; k >= s0 * 0.8; k *= 0.97) { el.style.fontSize = k + "px"; if (lines() < n0) { best = k; break; } }
      el.style.fontSize = best + "px";
    });
  };

  // data-in="inUp 1.2" (animazione, secondo d'ingresso) · uscita automatica 1 s prima della fine (data-out per anticiparla)
  var EASE = { inUp: ".9s cubic-bezier(.2,.8,.2,1)", inZoom: ".8s cubic-bezier(.2,.8,.2,1)", inFade: ".8s ease",
    inLeft: ".9s cubic-bezier(.2,.8,.2,1)", inRight: ".9s cubic-bezier(.2,.8,.2,1)" };
  window.applyAnims = function () {
    document.querySelectorAll("[data-in]").forEach(function (el) {
      var p = el.dataset.in.split(" ");
      var anims = [p[0] + " " + EASE[p[0]] + " " + p[1] + "s both"];
      var out = el.dataset.out || (el.closest("[data-keep]") ? "" : dur - 1.1);
      if (out !== "") anims.push("out .5s ease-in " + out + "s forwards");
      el.style.animation = anims.join(", ");
    });
  };

  window.addSparkles = function () {
    var sp = document.querySelector(".sparkles");
    if (!sp) return;
    for (var i = 0; i < 40; i++) {
      var s = document.createElement("i");
      s.style.left = rnd() * 100 + "%";
      s.style.top = rnd() * 92 + "%";
      s.style.animationDelay = -rnd() * 2.4 + "s";
      s.style.animationDuration = 1.6 + rnd() * 2 + "s";
      s.style.width = s.style.height = 6 * (0.4 + rnd()) + "px";
      sp.appendChild(s);
    }
  };

  // Controllo per il renderer: testi visibili fuori dall'area sicura o che escono dal proprio riquadro
  window.checkText = function () {
    var SAFE = { l: 96, t: 54, r: 1824, b: 1026 }, bad = [];
    var walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = walker.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      var el = n.parentElement;
      if (el.closest("[data-nocheck]")) continue;
      var op = 1;
      for (var a = el; a && a !== document.body; a = a.parentElement) op *= Number(getComputedStyle(a).opacity);
      if (op < 0.98) continue;
      var range = document.createRange(); range.selectNodeContents(n);
      var r = range.getBoundingClientRect();
      var name = n.nodeValue.trim().slice(0, 40);
      if (r.left < SAFE.l - 1 || r.right > SAFE.r + 1 || r.top < SAFE.t - 1 || r.bottom > SAFE.b + 1)
        bad.push("fuori area sicura: «" + name + "» [" + Math.round(r.left) + "," + Math.round(r.top) + "," + Math.round(r.right) + "," + Math.round(r.bottom) + "]");
      var box = el.closest("[data-fit], .t-title, .t-sub, .t-points li, .t-note, .t-tag, .card");
      if (box && box.clientWidth && box.scrollWidth > box.clientWidth + 1) bad.push("testo che esce dal riquadro: «" + name + "»");
    }
    return bad;
  };

  // Le scene costruite via script chiamano GP.ready() dopo aver creato il contenuto
  // (prima si caricano i font, altrimenti le misure dei testi sarebbero sbagliate)
  var FONTS = ['600 100px "Cormorant Garamond"', 'italic 500 50px "Cormorant Garamond"', '500 50px "Cormorant Garamond"',
    '400 20px Montserrat', '600 20px Montserrat', '800 20px Montserrat'];
  window.GP = { ready: function () {
    Promise.all(FONTS.map(function (f) { return document.fonts.load(f); })).then(function () {
      fitText(); applyAnims(); addSparkles(); document.body.dataset.ready = "1";
    });
  } };
  if (!document.body.hasAttribute("data-manual")) GP.ready();
})();

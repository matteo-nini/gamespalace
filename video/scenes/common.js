// Elementi comuni a tutte le scene: bug di marca, fascia legale, dissolvenze, scintille.
// Tutto il movimento è in CSS così il renderer può "fermare il tempo" e catturare ogni fotogramma.
(function () {
  var stage = document.querySelector(".stage");
  var dur = Number(document.body.dataset.duration || 12);
  document.documentElement.style.setProperty("--dur", dur + "s");

  // Pseudo-casuale deterministico: ogni render è identico
  var seed = 7;
  window.rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  // Parametri da URL (?titolo=...&sotto=...) per le scene personalizzabili
  var q = new URLSearchParams(location.search);
  document.querySelectorAll("[data-param]").forEach(function (el) {
    var v = q.get(el.dataset.param);
    if (v) el.textContent = v;
  });

  // data-in="inUp 1.2" (animazione, secondi) · data-out="3.6" (uscita in secondi)
  var EASE = { inUp: ".9s cubic-bezier(.2,.8,.2,1)", inZoom: "1s cubic-bezier(.2,1.4,.4,1)", inFade: ".8s ease", inStamp: ".7s cubic-bezier(.3,1.6,.5,1)", inLeft: ".9s cubic-bezier(.2,.8,.2,1)" };
  document.querySelectorAll("[data-in]").forEach(function (el) {
    var p = el.dataset.in.split(" ");
    var anims = [p[0] + " " + EASE[p[0]] + " " + p[1] + "s both"];
    if (el.dataset.out) anims.push("out .6s ease-in " + el.dataset.out + "s forwards");
    el.style.animation = anims.join(", ");
  });

  stage.insertAdjacentHTML("beforeend",
    '<div class="bug"><img src="../../site/assets/logo-mark.svg" alt=""><div><span>GAMES PALACE</span><small>CALCINAIA</small></div></div>' +
    '<div class="legal"><b>18+</b>Gioco vietato ai minori di 18 anni · Il gioco può causare dipendenza patologica · Gioca responsabilmente</div>' +
    '<div class="fadebox"></div>');

  var sp = document.querySelector(".sparkles");
  if (sp) {
    for (var i = 0; i < 46; i++) {
      var s = document.createElement("i");
      s.style.left = (rnd() * 100) + "%";
      s.style.top = (rnd() * 92) + "%";
      s.style.animationDelay = (-rnd() * 2.4) + "s";
      s.style.animationDuration = (1.6 + rnd() * 2) + "s";
      var z = 0.4 + rnd();
      s.style.width = s.style.height = (6 * z) + "px";
      sp.appendChild(s);
    }
  }
})();

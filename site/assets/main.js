(function () {
  // Avviso maggiore età (ricordato per 30 giorni)
  var KEY = "gp_age_ok";
  var gate = document.getElementById("agegate");
  var ok = false;
  try { ok = Number(localStorage.getItem(KEY)) > Date.now(); } catch (e) {}
  if (!ok) {
    gate.hidden = false;
    document.getElementById("agegate-yes").addEventListener("click", function () {
      try { localStorage.setItem(KEY, String(Date.now() + 30 * 864e5)); } catch (e) {}
      gate.hidden = true;
    });
  }

  // Header trasparente → pieno allo scroll
  var nav = document.querySelector(".nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 40); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Comparsa morbida delle sezioni
  var items = document.querySelectorAll(".section .wrap > *, .card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.classList.add("reveal");
      if (el.classList.contains("card")) el.style.transitionDelay = (i % 4) * 90 + "ms";
      io.observe(el);
    });
  }

  // Nasconde la galleria se non ci sono foto in site/foto/
  window.addEventListener("load", function () {
    var g = document.getElementById("galleria");
    if (g && !g.querySelector("figure")) g.remove();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

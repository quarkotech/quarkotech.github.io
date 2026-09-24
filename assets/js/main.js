// QUARKO — nav behavior
(function () {
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Theme mode switcher (system / light / dark)
  var themeSwitch = document.querySelector(".theme-switch");
  if (themeSwitch) {
    var root = document.documentElement;
    var themeMq = window.matchMedia("(prefers-color-scheme: light)");
    var themeButtons = themeSwitch.querySelectorAll("button[data-theme-pref]");

    function syncThemeButtons() {
      var pref = root.dataset.themePref || "system";
      themeButtons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.dataset.themePref === pref));
      });
    }

    themeSwitch.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-theme-pref]");
      if (!btn) return;
      var pref = btn.dataset.themePref;
      root.dataset.themePref = pref;
      try {
        localStorage.setItem("quarko-theme", pref);
      } catch (err) {}
      root.dataset.theme = pref === "system" ? (themeMq.matches ? "light" : "dark") : pref;
      syncThemeButtons();
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });

    syncThemeButtons();
  }

  // Scroll reveal (progressive enhancement: no JS = everything visible)
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll(
      ".section-head, .chips li, .card, .cta-card"
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();

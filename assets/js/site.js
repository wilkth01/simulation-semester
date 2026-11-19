/* The Simulation Semester — site behavior (no dependencies) */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  if (nav && !nav.classList.contains("is-solid")) {
    var onScroll = function () { nav.classList.toggle("is-solid", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- hero title glitch ---------- */
  var glitch = document.querySelector(".hero h1 .glitch");
  if (glitch && !reduceMotion) {
    var fire = function () {
      glitch.classList.add("is-glitching");
      setTimeout(function () { glitch.classList.remove("is-glitching"); }, 140);
      setTimeout(function () { glitch.classList.add("is-glitching"); }, 220);
      setTimeout(function () { glitch.classList.remove("is-glitching"); }, 300);
      setTimeout(fire, 4200 + Math.random() * 5000);
    };
    setTimeout(fire, 1600);
  }

  /* ---------- Architect terminal typer ---------- */
  var typed = document.getElementById("typed");
  if (typed && !reduceMotion) {
    var lines = [];
    try { lines = JSON.parse(typed.getAttribute("data-lines")); } catch (e) { lines = []; }
    if (lines.length) {
      var li = 0, ci = lines[0].length, deleting = false;
      var tick = function () {
        var line = lines[li];
        if (!deleting) {
          ci++;
          typed.textContent = line.slice(0, ci);
          if (ci >= line.length) { deleting = true; return setTimeout(tick, 2600); }
          return setTimeout(tick, 38 + Math.random() * 40);
        }
        ci -= 2;
        typed.textContent = line.slice(0, Math.max(ci, 0));
        if (ci <= 0) { deleting = false; ci = 0; li = (li + 1) % lines.length; return setTimeout(tick, 350); }
        return setTimeout(tick, 16);
      };
      setTimeout(function () { deleting = true; tick(); }, 3200);
    }
  }

  /* ---------- episode dialog ---------- */
  var dataEl = document.getElementById("epData");
  var dlg = document.getElementById("epDialog");
  if (dataEl && dlg) {
    var EP = JSON.parse(dataEl.textContent);
    var current = 1, lastFocus = null;
    var $ = function (id) { return document.getElementById(id); };
    var render = function (n) {
      var e = EP[n]; if (!e) return;
      current = n;
      $("dlgImg").src = e.img; $("dlgImg").alt = e.alt;
      $("dlgImgLink").href = e.img; $("dlgFull").href = e.img;
      $("dlgTheme").innerHTML = "Episode " + n + " &middot; Week " + n + " &middot; " + e.theme;
      $("dlgTitle").textContent = e.title;
      $("dlgQ").innerHTML = e.q;
      $("dlgSyn").innerHTML = e.syn;
      $("dlgReading").innerHTML = e.reading;
      $("dlgMW").innerHTML = e.mw;
      $("dlgRead").href = "episodes.html#ep-" + n;
      $("dlgCount").textContent = n + " / 14";
      $("dlgPrev").disabled = n <= 1;
      $("dlgNext").disabled = n >= 14;
      var sc = dlg.querySelector(".dlg-scroll"); if (sc) sc.scrollTop = 0;
    };
    var open = function (n, trigger) {
      lastFocus = trigger || document.activeElement;
      render(n);
      if (typeof dlg.showModal === "function") { dlg.showModal(); } else { window.location.href = "episodes.html#ep-" + n; return; }
      document.body.style.overflow = "hidden";
      history.replaceState(null, "", "#episode-" + n);
    };
    var close = function () { if (dlg.open) dlg.close(); };
    dlg.addEventListener("close", function () {
      document.body.style.overflow = "";
      if (location.hash.indexOf("#episode-") === 0) history.replaceState(null, "", location.pathname + "#season");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    document.querySelectorAll("[data-open-ep]").forEach(function (el) {
      el.addEventListener("click", function () { open(parseInt(el.getAttribute("data-open-ep"), 10), el); });
    });
    dlg.querySelector("[data-close]").addEventListener("click", close);
    dlg.addEventListener("click", function (ev) { if (ev.target === dlg) close(); });
    $("dlgPrev").addEventListener("click", function () { if (current > 1) { render(current - 1); history.replaceState(null, "", "#episode-" + current); } });
    $("dlgNext").addEventListener("click", function () { if (current < 14) { render(current + 1); history.replaceState(null, "", "#episode-" + current); } });
    dlg.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowRight" && current < 14) { render(current + 1); }
      if (ev.key === "ArrowLeft" && current > 1) { render(current - 1); }
    });
    var m = location.hash.match(/^#episode-(\d+)$/);
    if (m) { var n0 = parseInt(m[1], 10); if (EP[n0]) setTimeout(function () { open(n0); }, 300); }
  }

  /* ---------- copy buttons ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = btn.closest(".prompt").querySelector("pre");
      var text = pre ? pre.innerText : "";
      var done = function () { var t = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, function () {}); }
    });
  });

  /* ---------- episodes reader: active TOC + mobile jump ---------- */
  var tocLinks = document.querySelectorAll(".toc a");
  var jump = document.getElementById("epJump");
  var arts = document.querySelectorAll("article.episode");
  if (arts.length && "IntersectionObserver" in window) {
    var setActive = function (id) {
      tocLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); });
      if (jump && jump.value !== id) jump.value = id;
    };
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    arts.forEach(function (a) { ro.observe(a); });
  }
  if (jump) {
    jump.addEventListener("change", function () {
      var t = document.getElementById(jump.value);
      if (t) { t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); history.replaceState(null, "", "#" + jump.value); }
    });
  }
})();

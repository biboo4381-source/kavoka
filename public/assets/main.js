(function () {
  "use strict";
  var L = window.KAVOKA_LINKS || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Simple Vercel Web Analytics custom events (no-op when analytics is off)
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  function track(name) { try { window.va("event", { name: name }); } catch (e) {} }

  // Wire outbound links from links.js
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var url = L[a.getAttribute("data-link")];
    if (url) a.setAttribute("href", url);
  });
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-track]");
    if (t) track(t.getAttribute("data-track"));
  });

  // Nav
  var nav = document.getElementById("nav");
  var onScroll = function () { nav && nav.classList.toggle("scrolled", window.scrollY > 30); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var menuBtn = document.getElementById("menuBtn"), navLinks = document.getElementById("navLinks");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e) { if (e.target.tagName === "A") navLinks.classList.remove("open"); });
  }

  // Reveal + bar animations
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll("[data-w]").forEach(function (f) { f.style.width = f.getAttribute("data-w") + "%"; });
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 }) : null;
  document.querySelectorAll(".reveal, #funnel, #pricemap").forEach(function (el) {
    if (io) io.observe(el); else { el.classList.add("in"); el.querySelectorAll("[data-w]").forEach(function (f) { f.style.width = f.getAttribute("data-w") + "%"; }); }
  });

  // ---------- Reel storyboard player ----------
  var scenes = [
    { t: "0–3s", tag: "Hook", img: "/img/step-1.webp", dur: 3,
      cap: "POV: you can't choose between <mark>kopi</mark> and <mark>chocolate</mark>",
      title: "The hook", desc: "Close-up of coffee grounds pouring into melted cocoa butter, with a chocolate-snap sound effect. <b>On screen:</b> “POV: you can't choose between kopi and chocolate.”" },
    { t: "3–8s", tag: "Twist", img: "/img/bars-front.webp", dur: 5,
      cap: "So Indonesia put them in <mark>one bar.</mark>",
      title: "The reveal", desc: "Hard cut to the bar sliding into frame on the beat. <b>Voiceover:</b> “So Indonesia put them in one bar.”" },
    { t: "8–14s", tag: "Benefit", img: "/img/step-3.webp", dur: 6,
      cap: "Real Indonesian coffee, <mark>infused</mark> into the chocolate",
      title: "How it's made", desc: "Quick shots of steeping, blending and tempering. <b>Benefit:</b> real coffee flavour inside the chocolate, not a sugary filling." },
    { t: "14–20s", tag: "Choice", img: "/img/pack-lineup.webp", dur: 6,
      cap: "Mild 40% → <mark>Extra Strong 80%</mark><br>Which one are you?",
      title: "Pick your intensity", desc: "The four bars pop in one by one, like a coffee order. <b>Engagement:</b> “Comment your kopi order and we'll match your bar.”" },
    { t: "20–25s", tag: "Story", img: "/img/self-treat.webp", dur: 5,
      cap: "Self-treat or gift — <mark>under S$10</mark>",
      title: "Self-treat or gift", desc: "A CBD professional enjoys a square at their desk, then a Hard Box is handed over with a ribbon. <b>Proof:</b> premium quality for S$9.90." },
    { t: "25–30s", tag: "CTA", img: "/img/giftbox.webp", dur: 5,
      cap: "Tap the <mark>yellow basket</mark><br>Buy 2 · get Mild FREE",
      title: "Call to action", desc: "The product card appears and the yellow basket pulses. <b>CTA:</b> “Tap the yellow basket. Launch Week: buy 2, get Mild free.”" }
  ];
  var screen = document.getElementById("reelScreen"), prog = document.getElementById("reelProgress"), board = document.getElementById("storyboard");
  if (screen && prog && board) {
    var segs = [], rows = [], els = [];
    scenes.forEach(function (s, i) {
      var d = document.createElement("div");
      d.className = "scene";
      d.innerHTML = '<img src="' + s.img + '" alt="" loading="lazy"><div class="shade"></div><div class="caption">' + s.cap + "</div>";
      screen.appendChild(d); els.push(d);
      var sp = document.createElement("span"); sp.innerHTML = "<i></i>"; prog.appendChild(sp); segs.push(sp.firstChild);
      var r = document.createElement("button");
      r.type = "button"; r.className = "sb-row";
      r.innerHTML = '<div class="sb-time">' + s.t + "<small>" + s.tag + "</small></div><div><h4>" + s.title + "</h4><p>" + s.desc + "</p></div>";
      r.addEventListener("click", function () { go(i); play(); });
      board.appendChild(r); rows.push(r);
    });
    var ui = screen.parentElement.querySelector(".reel-ui");
    ui.insertAdjacentHTML("beforeend",
      '<div class="reel-handle"><b>' + (L.handle || "@kavoka") + '</b>Coffee or chocolate? Why not both ☕🍫 #KopiOrChocolate</div>' +
      '<div class="reel-side"><div><svg><use href="#i-heart"/></svg>12.4K</div><div><svg><use href="#i-chat"/></svg>860</div><div><svg><use href="#i-share"/></svg>1.2K</div></div>' +
      '<a class="yellow-basket" data-track="reel_basket" target="_blank" rel="noopener" href="' + (L.tiktokShop || "#") + '"><span class="bk"><svg><use href="#i-basket"/></svg></span><span><b>KAVOKA Coffee Chocolate</b>S$9.90 · Buy 2 get Mild free</span><span class="go">Buy</span></a>');

    var idx = 0, start = 0, elapsed = 0, playing = true, raf = null;
    function go(i) {
      idx = (i + scenes.length) % scenes.length;
      els.forEach(function (e, k) { e.classList.toggle("on", k === idx); });
      rows.forEach(function (r, k) { r.classList.toggle("on", k === idx); });
      segs.forEach(function (s, k) { s.style.width = k < idx ? "100%" : "0%"; });
      elapsed = 0; start = performance.now();
    }
    function tick(now) {
      if (playing) {
        var d = scenes[idx].dur * 1000, p = Math.min(1, (elapsed + now - start) / d);
        segs[idx].style.width = (p * 100) + "%";
        if (p >= 1) go(idx + 1);
      }
      raf = requestAnimationFrame(tick);
    }
    var toggle = document.getElementById("reelToggle");
    function play() { if (!playing) { playing = true; start = performance.now(); } toggle.textContent = "❚❚ Pause"; }
    function pause() { if (playing) { elapsed += performance.now() - start; playing = false; } toggle.textContent = "▶ Play"; }
    toggle.addEventListener("click", function () { playing ? pause() : play(); });
    document.getElementById("reelRestart").addEventListener("click", function () { go(0); play(); });
    go(0);
    if (reduce) pause();
    // only run while visible
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { if (!raf) raf = requestAnimationFrame(tick); }
        else if (raf) { cancelAnimationFrame(raf); raf = null; if (playing) { elapsed += performance.now() - start; start = performance.now(); } }
      }).observe(screen);
    } else raf = requestAnimationFrame(tick);
  }

  // ---------- Lightbox (pitch deck + zoomable images) ----------
  var lb = document.getElementById("lightbox"), lbImg = document.getElementById("lbImg"), lbCount = document.getElementById("lbCount");
  var list = [], cur = 0;
  function show(i) {
    cur = (i + list.length) % list.length;
    lbImg.src = list[cur];
    lbCount.textContent = list.length > 1 ? "Slide " + (cur + 1) + " / " + list.length : "";
    var multi = list.length > 1;
    document.getElementById("lbPrev").style.display = multi ? "" : "none";
    document.getElementById("lbNext").style.display = multi ? "" : "none";
  }
  function open(arr, i) { list = arr; lb.classList.add("open"); document.body.style.overflow = "hidden"; show(i); document.getElementById("lbClose").focus(); }
  function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  if (lb) {
    var deck = [];
    for (var n = 1; n <= 20; n++) deck.push("/img/deck/slide-" + (n < 10 ? "0" + n : n) + ".webp");
    var strip = document.getElementById("deckStrip");
    if (strip) deck.forEach(function (src, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", "Open slide " + (i + 1));
      b.innerHTML = '<img src="' + src + '" alt="KAVOKA deck slide ' + (i + 1) + '" loading="lazy" width="1600" height="900">';
      b.addEventListener("click", function () { open(deck, i); track("deck_open"); });
      strip.appendChild(b);
    });
    document.querySelectorAll("[data-zoom]").forEach(function (b) {
      b.addEventListener("click", function () { open([b.getAttribute("data-zoom")], 0); });
    });
    document.getElementById("lbClose").addEventListener("click", close);
    document.getElementById("lbPrev").addEventListener("click", function () { show(cur - 1); });
    document.getElementById("lbNext").addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });
  }

  // ---------- 60-second pitch timer ----------
  var clock = document.getElementById("clock"), tBtn = document.getElementById("timerBtn"), tReset = document.getElementById("timerReset");
  if (clock && tBtn) {
    var left = 60, iv = null;
    var render = function () { clock.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); clock.style.color = left <= 10 ? "#e87a5d" : ""; };
    tBtn.addEventListener("click", function () {
      if (iv) { clearInterval(iv); iv = null; tBtn.textContent = "Resume"; return; }
      if (left === 0) left = 60;
      tBtn.textContent = "Pause";
      iv = setInterval(function () { left = Math.max(0, left - 1); render(); if (!left) { clearInterval(iv); iv = null; tBtn.textContent = "Start again"; } }, 1000);
    });
    tReset.addEventListener("click", function () { clearInterval(iv); iv = null; left = 60; render(); tBtn.textContent = "Start 60-s timer"; });
    render();
  }
})();

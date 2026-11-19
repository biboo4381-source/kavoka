/* KAVOKA motion layer: hero intro, parallax, tilt cards, count-up stats,
   scroll progress, staggered reveals. Skips everything on reduced motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js-motion");
  if (reduce) { document.documentElement.classList.add("reduced"); return; }

  // Hero intro (CSS keyframes keyed off this class)
  requestAnimationFrame(function () { document.documentElement.classList.add("intro-go"); });

  // Stagger sibling reveals inside grids
  document.querySelectorAll(".grid-3, .grid-4, .bars, .steps, .journey, .channels, .stats, .offer-row, .pack-grid").forEach(function (g) {
    var i = 0;
    Array.prototype.forEach.call(g.children, function (c) {
      if (c.classList.contains("reveal")) { c.style.transitionDelay = Math.min(i * 90, 450) + "ms"; i++; }
    });
  });

  // Scroll progress + parallax (one rAF loop, transform only)
  var bar = document.createElement("div"); bar.className = "scroll-progress"; document.body.appendChild(bar);
  var heroBg = document.querySelector(".hero-bg");
  var para = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var wide = window.matchMedia("(min-width: 901px)");
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    if (heroBg && wide.matches && y < innerHeight * 1.2) heroBg.style.translate = "0 " + (y * 0.18).toFixed(1) + "px";
    para.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      var k = parseFloat(el.getAttribute("data-parallax")) || 0.08;
      var off = (r.top + r.height / 2 - innerHeight / 2) * -k;
      el.style.translate = "0 " + off.toFixed(1) + "px";
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  // 3D tilt + glare on product cards (fine pointers only)
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".bar, .pack-card, .stat").forEach(function (el) {
      el.classList.add("tilt");
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--rx", ((0.5 - y) * 8).toFixed(2) + "deg");
        el.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg");
        el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
      });
    });
  }

  // Count-up numbers (keeps prefix/suffix, e.g. "US$269.3M", "0.9%")
  function countUp(el) {
    var txt = el.textContent, m = txt.match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!m) return;
    var pre = m[1], raw = m[2].replace(/,/g, ""), suf = m[3], end = parseFloat(raw);
    var dec = (raw.split(".")[1] || "").length, t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      var v = (end * e).toFixed(dec);
      if (m[2].indexOf(",") > -1) v = Number(v).toLocaleString("en-US", { minimumFractionDigits: dec });
      el.textContent = pre + v + suf;
      if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll(".stat strong, .hero-price strong, .funnel-row b, .offer .price").forEach(function (el) { cio.observe(el); });
  }
})();

/* Syncopx download site logic: version wiring, reveals, nav, hash copy.
   No frameworks. Motion gated behind prefers-reduced-motion. */
(function () {
  "use strict";

  var FALLBACK = {
    version: "1.5.0",
    file: "https://github.com/Guhanavish/syncopx-site/releases/download/v1.5.0/Syncopx-1.5.0-windows.zip",
    bytes: 163409635,
    sha256: "b70c5bde69227f36cecb8e3df4eab62b6b9a4e3c76e33ce44be23e8a1bcf2e6f",
    date: "2026-10-07"
  };

  function mb(bytes) {
    return Math.max(1, Math.round(bytes / 1048576)) + " MB";
  }

  function applyVersion(v) {
    var href = /^https?:\/\//.test(v.file) ? v.file : "downloads/" + v.file;
    ["dl-btn", "dl-btn-2"].forEach(function (id) {
      var a = document.getElementById(id);
      if (!a) return;
      a.setAttribute("href", href);
      var meta = a.querySelector("[data-size]");
      if (meta) meta.textContent = "· " + mb(v.bytes);
    });
    document.querySelectorAll("[data-ver]").forEach(function (el) {
      el.textContent = v.version;
    });
    document.querySelectorAll("[data-ver-long]").forEach(function (el) {
      el.textContent = "Syncopx " + v.version + " · Windows 10/11 64-bit · ZIP, no admin";
    });
    document.querySelectorAll("[data-date]").forEach(function (el) {
      el.textContent = v.date;
    });
    document.querySelectorAll("[data-sha-short]").forEach(function (el) {
      el.textContent = String(v.sha256).slice(0, 8) + "…";
    });
    var hashBtn = document.getElementById("hash-btn");
    if (hashBtn) hashBtn.dataset.full = v.sha256;
  }

  applyVersion(FALLBACK);
  fetch("downloads/version.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
    .then(function (v) { if (v && v.file && v.sha256) applyVersion(v); })
    .catch(function () {});

  var hashBtn = document.getElementById("hash-btn");
  if (hashBtn) {
    hashBtn.addEventListener("click", function () {
      var full = this.dataset.full || FALLBACK.sha256;
      var ok = document.getElementById("hash-ok");
      function done() {
        ok.hidden = false;
        setTimeout(function () { ok.hidden = true; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = full;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("navlinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();

/* Syncopx download site logic: version wiring, reveals, nav, hash copy.
   No frameworks. Motion gated behind prefers-reduced-motion. */
(function () {
  "use strict";

  var FALLBACK = {
    version: "1.4.3",
    file: "https://github.com/Guhanavish/syncopx-site/releases/download/v1.4.3/Syncopx-1.4.3-windows.zip",
    bytes: 162501637,
    sha256: "333c4a87cfed384a0e4992de7d35eda8b7a290e1b0600f97d02ffec31ea084f7",
    date: "2026-09-10"
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

  // version.json drives the buttons, so each upload only changes data.
  // file:// opens have no fetch — fall back silently to embedded values.
  applyVersion(FALLBACK);
  fetch("downloads/version.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
    .then(function (v) { if (v && v.file && v.sha256) applyVersion(v); })
    .catch(function () { /* offline/file preview: keep fallback */ });

  document.getElementById("hash-btn").addEventListener("click", function () {
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
      try { document.execCommand("copy"); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
      done();
    }
  });

  // staggered reveals, transform/opacity only
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

  // mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("navlinks");
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

  // ---------- live demo (hero textbox) -> Cloudflare Worker proxy, key never touches browser ----------
  var DEMO_API = (window.Syncopx_DEMO_API || window.SYNCOPS_DEMO_API || "https://syncopx-demo.ssgginfotech.workers.dev/api/chat").replace(/\/$/, "");
  var demoForm = document.getElementById("demo-form");
  if (demoForm) {
    var log = document.getElementById("demo-log");
    var input = document.getElementById("demo-input");
    var typing = document.getElementById("demo-typing");
    var status = document.getElementById("demo-status");
    var pill = document.getElementById("demo-pill");
    var send = document.getElementById("demo-send");
    var attach = document.getElementById("demo-attach");
    var fileIn = document.getElementById("demo-file");
    var id = localStorage.getItem("syncopx_demo_id");
    if (!id) { id = "d" + (crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)); localStorage.setItem("syncopx_demo_id", id); }
    var used = parseInt(localStorage.getItem("syncopx_demo_n") || "0", 10) || 0;

    function bubble(text, who) {
      var d = document.createElement("div");
      d.className = "mock-bubble " + (who === "me" ? "me" : "ai");
      d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    }
    function dlButton() {
      var a = document.createElement("a");
      a.className = "btn btn-primary btn-sm demo-dl";
      a.href = "#download";
      a.textContent = "Download Syncopx";
      log.appendChild(a);
      log.scrollTop = log.scrollHeight;
    }
    function setLeft(left) {
      used = 2 - left;
      localStorage.setItem("syncopx_demo_n", String(Math.min(2, Math.max(0, used))));
      status.textContent = left + "/2 left · desktop-only tasks run in the Syncopx app";
      pill.textContent = left > 0 ? "live demo · " + left + " free" : "demo done · get Syncopx";
      if (left <= 0) { send.disabled = true; input.disabled = true; input.placeholder = "Demo done — download Syncopx for more…"; }
    }
    setLeft(Math.max(0, 2 - used));

    demoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = input.value.trim();
      if (!msg || send.disabled) return;
      bubble(msg, "me");
      input.value = "";
      // Backend not deployed yet (placeholder URL) -> local upsell, no key exposed.
      if (DEMO_API.indexOf(".YOU.") !== -1) {
        typing.hidden = false;
        setTimeout(function () {
          typing.hidden = true;
          if (used >= 2) { bubble("That's your 2 free web replies — download Syncopx for unlimited use.", "ai"); dlButton(); setLeft(0); return; }
          bubble("Demo backend connects on deploy — for now, download Syncopx to chat unlimited on your PC.", "ai");
          dlButton();
        }, 600);
        return;
      }
      if (used >= 2) {
        bubble("That's your 2 free web replies — download Syncopx for unlimited voice, screen control, files and programs on your own PC.", "ai");
        dlButton(); setLeft(0); return;
      }
      typing.hidden = false;
      fetch(DEMO_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Demo-Id": id },
        body: JSON.stringify({ message: msg.slice(0, 500), demoId: id }),
      })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          typing.hidden = true;
          bubble(j.reply || "Syncopx demo is busy — download Syncopx to run it locally.", "ai");
          if (j.blocked) dlButton();
          if (typeof j.left === "number") setLeft(j.left);
          else { used += 1; localStorage.setItem("syncopx_demo_n", String(used)); setLeft(Math.max(0, 2 - used)); }
        })
        .catch(function () {
          typing.hidden = true;
          bubble("Syncopx demo is busy right now — download Syncopx to run it locally.", "ai");
          dlButton();
        });
    });

    if (attach && fileIn) {
      attach.addEventListener("click", function () { fileIn.click(); });
      fileIn.addEventListener("change", function () {
        var f = fileIn.files && fileIn.files[0];
        if (!f) return;
        bubble("📎 " + f.name, "me");
        if (DEMO_API.indexOf(".YOU.") !== -1) {
          bubble("Got it — files run fully in the Syncopx app. Download Syncopx to process it.", "ai");
          dlButton(); fileIn.value = ""; return;
        }
        var fd = new FormData();
        fd.append("file", f);
        typing.hidden = false;
        fetch(DEMO_API.replace(/\/api\/chat$/, "/api/upload"), {
          method: "POST",
          headers: { "X-Demo-Id": id },
          body: fd,
        })
          .then(function (r) { return r.json(); })
          .then(function (j) { typing.hidden = true; bubble(j.reply || "Got it — open it in Syncopx to process it fully.", "ai"); dlButton(); })
          .catch(function () { typing.hidden = true; bubble("Got it — open it in Syncopx on your PC to process it fully.", "ai"); dlButton(); });
        fileIn.value = "";
      });
    }
  }

  // footer year is static by design (dated releases); nothing else needed.
})();

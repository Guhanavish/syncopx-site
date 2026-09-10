/* Syncopx download site logic: version wiring, reveals, nav, hash copy.
   No frameworks. Motion gated behind prefers-reduced-motion. */
(function () {
  "use strict";

  var FALLBACK = {
    version: "1.4.6",
    file: "https://github.com/Guhanavish/syncopx-site/releases/download/v1.4.6/Syncopx-1.4.6-windows.zip",
    bytes: 162514999,
    sha256: "1d9298ebff99e3904da23229388285b736a2cf137a930a020937720979a05c16",
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
  // file:// opens have no fetch, so fall back silently to embedded values.
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
      if (left <= 0) { send.disabled = true; input.disabled = true; input.placeholder = "Demo done. Download Syncopx for more…"; }
    }
    // Offline state: grey out the demo while the network is gone so users
    // cannot spam retries into a dead connection.
    function setOffline(off) {
      send.disabled = off || used >= 2;
      input.disabled = off || used >= 2;
      if (off) {
        status.textContent = "You are offline. Reconnect to use the demo.";
        pill.textContent = "offline";
        input.placeholder = "Waiting for connection…";
      } else {
        input.placeholder = "Ask anything. 2 free tries…";
        setLeft(Math.max(0, 2 - used));
      }
    }
    setLeft(Math.max(0, 2 - used));
    if (!navigator.onLine) setOffline(true);
    window.addEventListener("offline", function () { setOffline(true); });
    window.addEventListener("online", function () { setOffline(false); });
    function netFail(msg) {
      // Network failure (not a model/refusal): keep the message in the box
      // so nothing is lost, and say exactly what happened.
      typing.hidden = true;
      input.value = msg;
      bubble("Can't reach the demo. Check your internet connection, then press Send again.", "ai");
    }

    demoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = input.value.trim();
      if (!msg || send.disabled) {
        if (!msg && !send.disabled) {
          status.textContent = "Type a message first, then press Send.";
          setTimeout(function () { setLeft(Math.max(0, 2 - used)); }, 2500);
        }
        return;
      }
      if (!navigator.onLine) { netFail(msg); return; }
      bubble(msg, "me");
      input.value = "";
      // Backend not deployed yet (placeholder URL) -> local upsell, no key exposed.
      if (DEMO_API.indexOf(".YOU.") !== -1) {
        typing.hidden = false;
        setTimeout(function () {
          typing.hidden = true;
          if (used >= 2) { bubble("That's your 2 free web replies. Download Syncopx for unlimited use.", "ai"); dlButton(); setLeft(0); return; }
          bubble("Demo backend connects on deploy. For now, download Syncopx to chat unlimited on your PC.", "ai");
          dlButton();
        }, 600);
        return;
      }
      if (used >= 2) {
        bubble("That's your 2 free web replies. Download Syncopx for unlimited voice, screen control, files and programs on your own PC.", "ai");
        dlButton(); setLeft(0); return;
      }
      typing.hidden = false;
      fetch(DEMO_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Demo-Id": id },
        body: JSON.stringify({ message: msg.slice(0, 500), demoId: id }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("http " + r.status);
          return r.json();
        })
        .then(function (j) {
          typing.hidden = true;
          bubble(j.reply || "Syncopx demo is busy. Download Syncopx to run it locally.", "ai");
          if (j.blocked) dlButton();
          if (typeof j.left === "number") setLeft(j.left);
          else { used += 1; localStorage.setItem("syncopx_demo_n", String(used)); setLeft(Math.max(0, 2 - used)); }
        })
        .catch(function (err) {
          // TypeError = the request never left (offline/DNS/blocked).
          // Anything else = the demo itself failed after receiving it.
          if (err && err.name === "TypeError") { netFail(msg); return; }
          typing.hidden = true;
          input.value = msg;
          bubble("The demo hit a snag on that one. Your message is back in the box. Try again.", "ai");
        });
    });

    if (attach && fileIn) {
      attach.addEventListener("click", function () { fileIn.click(); });
      fileIn.addEventListener("change", function () {
        var f = fileIn.files && fileIn.files[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) {
          bubble("That file is over the 5 MB demo limit. Pick a smaller file, or open it in the Syncopx app with no limit.", "ai");
          dlButton(); fileIn.value = ""; return;
        }
        bubble("📎 " + f.name, "me");
        if (DEMO_API.indexOf(".YOU.") !== -1) {
          bubble("Got it. Files run fully in the Syncopx app. Download Syncopx to process it.", "ai");
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
          .then(function (j) { typing.hidden = true; bubble(j.reply || "Got it. Open it in Syncopx to process it fully.", "ai"); dlButton(); })
          .catch(function (err) { typing.hidden = true; bubble(err && err.name === "TypeError" ? "Can't reach the demo. Check your internet connection, then attach again." : "The upload hit a snag. Try again.", "ai"); });
        fileIn.value = "";
      });
    }
  }

  // footer year is static by design (dated releases); nothing else needed.
})();

/* Syncopx Website UI Logic
   - Dynamic release manifest hydration
   - Interactive Studio Simulator (tabs & diff drawers)
   - One-click SHA-256 hash clipboard copy
   - Mobile navigation drawer
   - Accessible keyboard interactions
*/

(function () {
  "use strict";

  var FALLBACK = {
    version: "1.6.0",
    file: "https://github.com/Guhanavish/syncopx-site/releases/download/v1.6.0/Syncopx-1.6.0-windows.zip",
    bytes: 165712209,
    sha256: "e29df458d16ed94fc94f5ec77507a9c9a63621213eaaf1dbc120a18db3c83d47",
    date: "2026-10-27"
  };

  function mb(bytes) {
    return Math.max(1, Math.round(bytes / 1048576)) + " MB";
  }

  function applyVersion(v) {
    var href = /^https?:\/\//.test(v.file) ? v.file : "downloads/" + v.file;
    document.querySelectorAll("[data-dl-link]").forEach(function (a) {
      a.setAttribute("href", href);
    });
    document.querySelectorAll("[data-size]").forEach(function (el) {
      el.textContent = "· " + mb(v.bytes);
    });
    document.querySelectorAll("[data-ver]").forEach(function (el) {
      el.textContent = "v" + v.version;
    });
    document.querySelectorAll("[data-ver-plain]").forEach(function (el) {
      el.textContent = v.version;
    });
    document.querySelectorAll("[data-date]").forEach(function (el) {
      el.textContent = v.date;
    });
    document.querySelectorAll("[data-sha-short]").forEach(function (el) {
      el.textContent = String(v.sha256).slice(0, 8) + "…";
    });
    var hashBtn = document.getElementById("hash-btn");
    if (hashBtn) {
      hashBtn.dataset.full = v.sha256;
    }
  }

  // Initial apply with verified fallback
  applyVersion(FALLBACK);

  // Hydrate with version.json if available
  fetch("downloads/version.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (manifest) {
      if (manifest && manifest.file && manifest.sha256) {
        applyVersion(manifest);
      }
    })
    .catch(function () {
      // Fallback already applied
    });

  // SHA-256 Copy Action
  var hashBtn = document.getElementById("hash-btn");
  var hashOk = document.getElementById("hash-ok");
  if (hashBtn && hashOk) {
    hashBtn.addEventListener("click", function () {
      var sha = hashBtn.dataset.full || FALLBACK.sha256;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(sha).then(showOk, fallbackCopy);
      } else {
        fallbackCopy();
      }

      function showOk() {
        hashOk.hidden = false;
        setTimeout(function () {
          hashOk.hidden = true;
        }, 2200);
      }

      function fallbackCopy() {
        var inp = document.createElement("input");
        inp.value = sha;
        inp.style.position = "fixed";
        inp.style.opacity = "0";
        document.body.appendChild(inp);
        inp.select();
        try {
          document.execCommand("copy");
          showOk();
        } catch (e) {}
        document.body.removeChild(inp);
      }
    });
  }

  // Mobile Navigation Drawer Toggle
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Interactive Studio Simulator Logic
  var studioTabs = document.querySelectorAll(".studio-tab");
  var studioSessions = document.querySelectorAll(".studio-session-item");
  var diffHeader = document.querySelector(".diff-header");
  var diffBody = document.querySelector(".diff-body");
  var diffBadge = document.querySelector(".diff-badge");
  var stepHeader = document.querySelector(".step-header");
  var toolCard = document.querySelector(".studio-card");

  // Tab switching in studio simulator
  if (studioTabs.length > 0) {
    studioTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var tabId = tab.dataset.tab;
        studioTabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");

        studioSessions.forEach(function (s) {
          if (s.dataset.tab === tabId) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });

        // Switch simulator content
        var transcript = document.querySelector(".studio-transcript");
        if (!transcript) return;

        if (tabId === "tab-ollama") {
          transcript.innerHTML = [
            '<div class="studio-msg user">',
            '  <div class="studio-bubble">Check Ollama connection and list local models</div>',
            '</div>',
            '<div class="studio-msg assistant">',
            '  <div class="studio-bubble">Connecting to local Ollama daemon at http://127.0.0.1:11434...</div>',
            '  <div class="studio-card">',
            '    <div class="studio-card-head"><span>Ollama Local Daemon</span><span class="studio-card-cmd">HTTP 200 · 42ms</span></div>',
            '    <pre class="studio-card-code">qwen2.5:7b-instruct-q4_K_M (4.7 GB) · active\nllama3.3:70b-instruct-q4_K_M (43 GB) · ready\nphi4:14b-q4_K_M (9.1 GB) · ready</pre>',
            '  </div>',
            '  <div class="studio-bubble">Ollama is running offline with zero internet traffic. Qwen 2.5 7B selected for instant reasoning with Whistle CPU edge STT.</div>',
            '</div>'
          ].join("\n");
        } else {
          // Default tab 1 content
          transcript.innerHTML = [
            '<div class="studio-msg user">',
            '  <div class="studio-bubble">Run unit tests for auth and fix any failures</div>',
            '</div>',
            '<div class="studio-msg assistant">',
            '  <div class="step-header">',
            '    <div class="step-header-left"><span>✓</span><span>4 steps completed · 1.4s</span></div>',
            '    <span>▸</span>',
            '  </div>',
            '  <div class="studio-card">',
            '    <div class="studio-card-head"><span>Terminal (PowerShell)</span><span class="studio-card-cmd">exit 0 · 1.2s</span></div>',
            '    <pre class="studio-card-code">pytest test_permissions.py -v\n[100%] test_allowed_dirs_enforcement PASSED</pre>',
            '  </div>',
            '  <div class="diff-card">',
            '    <div class="diff-header" role="button" tabindex="0">',
            '      <span class="diff-file">agentic_ai/config.py</span>',
            '      <span class="diff-badge">diff ±3 lines</span>',
            '    </div>',
            '    <div class="diff-body">',
            '      <div class="diff-line del">- verify_allowed_path(strict=False)</div>',
            '      <div class="diff-line add">+ verify_allowed_path(strict=True, fail_closed=True)</div>',
            '    </div>',
            '  </div>',
            '  <div class="studio-bubble">All 52 test suites pass green. Strict filesystem boundary enabled with fail-closed security.</div>',
            '</div>'
          ].join("\n");

          wireDiffToggle();
        }
      });
    });
  }

  function wireDiffToggle() {
    var dh = document.querySelector(".diff-header");
    var db = document.querySelector(".diff-body");
    var badge = document.querySelector(".diff-badge");
    if (dh && db) {
      dh.addEventListener("click", function () {
        if (db.style.display === "none") {
          db.style.display = "flex";
          if (badge) badge.textContent = "diff ±3 lines (hide)";
        } else {
          db.style.display = "none";
          if (badge) badge.textContent = "diff ±3 lines (expand)";
        }
      });
    }
  }
  wireDiffToggle();

})();

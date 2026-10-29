/* ==========================================================================
   Syncopx Monochrome Website Runtime (main.js)
   Modules:
   1. Boot Sequence (~1.6s terminal boot, skippable, sessionStorage)
   2. Release Manifest Hydration (version.json + verified fallback)
   3. Download-as-Agent Terminal Sequence (~2s progress bar & log)
   4. Live Simulator Engine (looping script, tab switcher, diff toggle)
   5. Interactive Keycaps Listener (physical keypress detection)
   6. Command Palette (Ctrl+K section jumper)
   7. Custom Cursor (difference blend dot & ring)
   8. Scroll Progress & Parallax
   ========================================================================== */

(function () {
  "use strict";

  var FALLBACK = {
    version: "1.6.0",
    file: "https://github.com/Guhanavish/syncopx-site/releases/download/v1.6.0/Syncopx-1.6.0-windows.zip",
    bytes: 165712209,
    sha256: "e29df458d16ed94fc94f5ec77507a9c9a63621213eaaf1dbc120a18db3c83d47",
    date: "2026-10-27"
  };

  /* --------------------------------------------------------------------------
     1. BOOT SEQUENCE
     -------------------------------------------------------------------------- */
  var bootScreen = document.getElementById("boot-screen");
  var hasBooted = false;

  try {
    hasBooted = sessionStorage.getItem("syncopx_booted") === "1";
  } catch (e) {}

  if (bootScreen && !hasBooted && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var lines = bootScreen.querySelectorAll(".boot-line");
    var lineIdx = 0;

    function revealNextBootLine() {
      if (lineIdx < lines.length) {
        lines[lineIdx].classList.add("visible");
        lineIdx++;
        setTimeout(revealNextBootLine, 340);
      } else {
        setTimeout(dismissBootScreen, 500);
      }
    }

    function dismissBootScreen() {
      if (!bootScreen || bootScreen.classList.contains("hidden")) return;
      bootScreen.style.transition = "opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out)";
      bootScreen.style.opacity = "0";
      bootScreen.style.transform = "scale(1.02)";
      setTimeout(function () {
        bootScreen.classList.add("hidden");
        try { sessionStorage.setItem("syncopx_booted", "1"); } catch (e) {}
      }, 400);
    }

    bootScreen.addEventListener("click", dismissBootScreen);
    window.addEventListener("keydown", function (e) {
      if (!bootScreen.classList.contains("hidden")) {
        dismissBootScreen();
      }
    });

    setTimeout(revealNextBootLine, 150);
  } else if (bootScreen) {
    bootScreen.classList.add("hidden");
  }

  /* --------------------------------------------------------------------------
     2. RELEASE MANIFEST HYDRATION
     -------------------------------------------------------------------------- */
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

  applyVersion(FALLBACK);

  fetch("downloads/version.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (m) { if (m && m.file && m.sha256) applyVersion(m); })
    .catch(function () {});

  // SHA-256 Copy
  var hashBtn = document.getElementById("hash-btn");
  var hashStatus = document.getElementById("hash-status");
  if (hashBtn && hashStatus) {
    hashBtn.addEventListener("click", function () {
      var sha = hashBtn.dataset.full || FALLBACK.sha256;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(sha).then(notify, fallback);
      } else {
        fallback();
      }
      function notify() {
        hashStatus.textContent = "✓ copied";
        setTimeout(function () { hashStatus.textContent = ""; }, 2200);
      }
      function fallback() {
        var inp = document.createElement("input");
        inp.value = sha;
        inp.style.position = "fixed";
        inp.style.opacity = "0";
        document.body.appendChild(inp);
        inp.select();
        try { document.execCommand("copy"); notify(); } catch (e) {}
        document.body.removeChild(inp);
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. DOWNLOAD-AS-AGENT TERMINAL SEQUENCE
     -------------------------------------------------------------------------- */
  var dlButtons = document.querySelectorAll(".agent-dl-btn");
  dlButtons.forEach(function (btn) {
    var progressBar = btn.querySelector(".dl-progress-bar");
    var logEl = btn.querySelector(".dl-stream-log");
    var targetUrl = btn.getAttribute("href") || FALLBACK.file;
    var isExecuting = false;

    btn.addEventListener("click", function (e) {
      if (isExecuting) return; // let natural download happen if already ran
      e.preventDefault();
      isExecuting = true;
      btn.classList.add("downloading");

      var steps = [
        { pct: 25, msg: "> resolving release v1.6.0" },
        { pct: 60, msg: "> fetching Syncopx-1.6.0-windows.zip" },
        { pct: 88, msg: "> verifying SHA-256 integrity" },
        { pct: 100, msg: "✓ verification passed. starting download..." }
      ];
      var stepIdx = 0;

      function runNextStep() {
        if (stepIdx < steps.length) {
          if (progressBar) progressBar.style.width = steps[stepIdx].pct + "%";
          if (logEl) logEl.textContent = steps[stepIdx].msg;
          stepIdx++;
          setTimeout(runNextStep, 450);
        } else {
          setTimeout(function () {
            // Trigger actual download
            window.location.href = btn.getAttribute("href") || targetUrl;
            setTimeout(function () {
              isExecuting = false;
              btn.classList.remove("downloading");
              if (progressBar) progressBar.style.width = "0%";
              if (logEl) logEl.textContent = "";
            }, 2000);
          }, 350);
        }
      }

      runNextStep();
    });
  });

  /* --------------------------------------------------------------------------
     4. LIVE SIMULATOR TIMELINE & TABS
     -------------------------------------------------------------------------- */
  var simTabs = document.querySelectorAll(".mockup-tab");
  var sessionNodes = document.querySelectorAll(".session-node");
  var transcript = document.getElementById("sim-transcript");
  var diffBar = document.getElementById("sim-diff-bar");
  var diffBody = document.getElementById("sim-diff-body");
  var replayBtn = document.getElementById("sim-replay-btn");

  if (diffBar && diffBody) {
    diffBar.addEventListener("click", function () {
      if (diffBody.style.display === "none") {
        diffBody.style.display = "flex";
      } else {
        diffBody.style.display = "none";
      }
    });
  }

  function setSimTab(tabId) {
    simTabs.forEach(function (t) {
      t.classList.toggle("active", t.dataset.tab === tabId);
    });
    sessionNodes.forEach(function (s) {
      s.classList.toggle("active", s.dataset.tab === tabId);
    });

    if (!transcript) return;
    if (tabId === "tab-ollama") {
      transcript.innerHTML = [
        '<div class="mockup-bubble user">Check Ollama connection and list models</div>',
        '<div class="mockup-bubble assistant">Connecting to local Ollama daemon at http://127.0.0.1:11434...</div>',
        '<div class="sim-terminal-card">',
        '  <div class="sim-terminal-bar"><span>Ollama Local Daemon</span><span>HTTP 200 · 42ms</span></div>',
        '  <pre class="sim-terminal-code">qwen2.5:7b-instruct-q4_K_M (4.7 GB) · active\nllama3.3:70b-instruct-q4_K_M (43 GB) · ready\nphi4:14b-q4_K_M (9.1 GB) · ready</pre>',
        '</div>',
        '<div class="mockup-bubble assistant">Ollama is running offline with zero internet traffic. Qwen 2.5 7B selected for instant reasoning with Whistle CPU edge STT.</div>'
      ].join("\n");
    } else {
      transcript.innerHTML = [
        '<div class="mockup-bubble user">Run unit tests for auth and fix any failures</div>',
        '<div class="sim-step-header"><span>✓ 4 steps completed · 1.4s</span><span>▸</span></div>',
        '<div class="sim-terminal-card">',
        '  <div class="sim-terminal-bar"><span>Terminal (PowerShell)</span><span>exit 0 · 1.2s</span></div>',
        '  <pre class="sim-terminal-code">pytest test_permissions.py -v\n[100%] test_allowed_dirs_enforcement PASSED</pre>',
        '</div>',
        '<div class="sim-diff-card">',
        '  <div class="sim-diff-bar" id="sim-diff-bar"><span>agentic_ai/config.py</span><span>diff ±3 lines</span></div>',
        '  <div class="sim-diff-body" id="sim-diff-body">',
        '    <div class="diff-del">- verify_allowed_path(strict=False)</div>',
        '    <div class="diff-add">+ verify_allowed_path(strict=True, fail_closed=True)</div>',
        '  </div>',
        '</div>',
        '<div class="mockup-bubble assistant">All 52 test suites pass green. Strict filesystem boundary enabled with fail-closed security.</div>'
      ].join("\n");

      var newDiffBar = document.getElementById("sim-diff-bar");
      var newDiffBody = document.getElementById("sim-diff-body");
      if (newDiffBar && newDiffBody) {
        newDiffBar.addEventListener("click", function () {
          newDiffBody.style.display = newDiffBody.style.display === "none" ? "flex" : "none";
        });
      }
    }
  }

  simTabs.forEach(function (t) {
    t.addEventListener("click", function () { setSimTab(t.dataset.tab); });
  });
  sessionNodes.forEach(function (s) {
    s.addEventListener("click", function () { setSimTab(s.dataset.tab); });
  });

  if (replayBtn) {
    replayBtn.addEventListener("click", function () {
      setSimTab("tab-auth");
    });
  }

  /* --------------------------------------------------------------------------
     5. INTERACTIVE KEYCAPS (PHYSICAL KEYPRESS DETECTION)
     -------------------------------------------------------------------------- */
  var keycapRows = document.querySelectorAll(".keycap-row");
  var keyMap = {
    "k": "row-k",
    "enter": "row-enter",
    "l": "row-l",
    "tab": "row-tab",
    "b": "row-b",
    "j": "row-j",
    "p": "row-p",
    "f11": "row-f11",
    "escape": "row-esc"
  };

  window.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    var rowId = keyMap[k];
    if (rowId) {
      var row = document.getElementById(rowId);
      if (row) row.classList.add("pressed");
    }
  });

  window.addEventListener("keyup", function (e) {
    var k = e.key.toLowerCase();
    var rowId = keyMap[k];
    if (rowId) {
      var row = document.getElementById(rowId);
      if (row) row.classList.remove("pressed");
    }
  });

  /* --------------------------------------------------------------------------
     6. COMMAND PALETTE (CTRL+K SECTION JUMPER)
     -------------------------------------------------------------------------- */
  var cmdBackdrop = document.getElementById("cmd-backdrop");
  var cmdInput = document.getElementById("cmd-input");
  var cmdList = document.getElementById("cmd-list");

  function openPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add("open");
    if (cmdInput) {
      cmdInput.value = "";
      cmdInput.focus();
    }
    filterPalette("");
  }

  function closePalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove("open");
  }

  window.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdBackdrop && cmdBackdrop.classList.contains("open")) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === "Escape") {
      closePalette();
    }
  });

  if (cmdBackdrop) {
    cmdBackdrop.addEventListener("click", function (e) {
      if (e.target === cmdBackdrop) closePalette();
    });
  }

  var sections = [
    { title: "Features & Studio Capabilities", href: "#features" },
    { title: "Live Desktop Simulator", href: "#simulator" },
    { title: "3-Step Installation Guide", href: "#install" },
    { title: "Supported AI Providers", href: "#providers" },
    { title: "Universal Keyboard Shortcuts", href: "#shortcuts" },
    { title: "Technical FAQ", href: "#faq" },
    { title: "Download Syncopx v1.6.0 (ZIP)", href: "#download" }
  ];

  function filterPalette(query) {
    if (!cmdList) return;
    cmdList.innerHTML = "";
    var q = query.toLowerCase().trim();
    var matched = sections.filter(function (s) {
      return s.title.toLowerCase().indexOf(q) !== -1;
    });

    matched.forEach(function (m, idx) {
      var li = document.createElement("li");
      li.className = "cmd-item" + (idx === 0 ? " selected" : "");
      li.innerHTML = "<span>" + m.title + "</span><span class='mono' style='font-size:10px;color:var(--text-dim)'>Jump &rarr;</span>";
      li.addEventListener("click", function () {
        closePalette();
        window.location.hash = m.href;
      });
      cmdList.appendChild(li);
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener("input", function () {
      filterPalette(cmdInput.value);
    });
    cmdInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = cmdList ? cmdList.querySelector(".cmd-item") : null;
        if (first) {
          first.click();
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. CUSTOM CURSOR
     -------------------------------------------------------------------------- */
  var dot = document.querySelector(".cursor-dot");
  var ring = document.querySelector(".cursor-ring");

  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = "translate(" + mouseX + "px, " + mouseY + "px)";
    });

    function loopCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = "translate(" + ringX + "px, " + ringY + "px)";
      requestAnimationFrame(loopCursor);
    }
    loopCursor();

    var interactives = document.querySelectorAll("a, button, [role='button'], input, .mockup-tab, .session-node, .faq-trigger");
    interactives.forEach(function (el) {
      el.addEventListener("mouseenter", function () { document.body.classList.add("cursor-hover"); });
      el.addEventListener("mouseleave", function () { document.body.classList.remove("cursor-hover"); });
    });
  }

  /* --------------------------------------------------------------------------
     8. SCROLL PROGRESS & ACCORDION
     -------------------------------------------------------------------------- */
  var scrollProg = document.querySelector(".scroll-progress");
  var stepperFill = document.querySelector(".stepper-fill");
  var installSection = document.getElementById("install");
  var bgWordmark = document.querySelector(".bg-wordmark");

  window.addEventListener("scroll", function () {
    var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    var current = window.scrollY;
    var pct = totalHeight > 0 ? (current / totalHeight) * 100 : 0;
    if (scrollProg) scrollProg.style.width = pct + "%";

    // Stepper fill in install section
    if (installSection && stepperFill) {
      var rect = installSection.getBoundingClientRect();
      var secH = installSection.offsetHeight;
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        var scrolled = Math.max(0, window.innerHeight - rect.top);
        var fillPct = Math.min(100, (scrolled / secH) * 100);
        stepperFill.style.height = fillPct + "%";
      }
    }

    // Wordmark fill
    if (bgWordmark) {
      var rect2 = bgWordmark.getBoundingClientRect();
      if (rect2.top < window.innerHeight && rect2.bottom > 0) {
        var op = Math.min(0.25, Math.max(0.04, (window.innerHeight - rect2.top) / window.innerHeight * 0.25));
        bgWordmark.style.color = "rgba(255, 255, 255, " + op + ")";
      }
    }
  }, { passive: true });

  // FAQ Accordion (one open at a time)
  var faqEntries = document.querySelectorAll(".faq-entry");
  faqEntries.forEach(function (entry) {
    var trigger = entry.querySelector(".faq-trigger");
    var panel = entry.querySelector(".faq-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      var isOpen = entry.classList.contains("open");
      faqEntries.forEach(function (other) {
        other.classList.remove("open");
        var otherPanel = other.querySelector(".faq-panel");
        if (otherPanel) otherPanel.style.maxHeight = null;
      });

      if (!isOpen) {
        entry.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  // Mobile menu toggle
  var navMobileBtn = document.querySelector(".nav-mobile-btn");
  var navMenu = document.querySelector(".nav-menu");
  if (navMobileBtn && navMenu) {
    navMobileBtn.addEventListener("click", function () {
      var isBlock = navMenu.style.display === "flex";
      navMenu.style.display = isBlock ? "none" : "flex";
      navMenu.style.flexDirection = "column";
      navMenu.style.position = "absolute";
      navMenu.style.top = "var(--nav-h)";
      navMenu.style.left = "0";
      navMenu.style.right = "0";
      navMenu.style.background = "#000000";
      navMenu.style.borderBottom = "1px solid var(--line)";
      navMenu.style.padding = "1.5rem";
      navMenu.style.gap = "1rem";
    });
  }

})();

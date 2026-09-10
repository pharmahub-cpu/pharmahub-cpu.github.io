/* ============================================================================
   simulation-kit.js — Shared chrome for simulators.

   A simulator is an independent web application. This file gives it the
   platform header (back link, title, theme toggle, "Mark complete") without
   the simulator having to know anything about the rest of the site.

   USAGE — inside /simulations/<your-sim>/index.html:

     <link rel="stylesheet" href="../../css/sim.css">
     ...
     <header class="sim-header" id="sim-header"></header>
     ...
     <script src="../../js/resources.js"></script>
     <script src="../../js/progress.js"></script>
     <script src="../../js/simulation-kit.js"></script>
     <script>
       SimKit.init({
         id: "paracetamol-assay",         // must match the id in resources.js
         title: "Assay of Paracetamol",
         subject: "Pharmaceutical Analysis",
         depth: 2                          // folders deep from the site root
       });
     </script>

   `depth` is how many folders down the simulator sits:
     /instruments/uv-vis/index.html            -> depth 2
     /simulations/paracetamol-assay/index.html -> depth 2
   ========================================================================== */

const SimKit = (() => {
  let cfg = { id: "", title: "Simulation", subject: "", depth: 2 };

  function root() {
    return "../".repeat(cfg.depth);
  }

  function applyStoredTheme() {
    try {
      const t = localStorage.getItem("edutech.theme");
      if (t) document.documentElement.setAttribute("data-theme", t);
    } catch (e) {}
  }

  function toggleTheme() {
    const cur =
      document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("edutech.theme", next);
    } catch (e) {}
  }

  function buildHeader() {
    const host = document.getElementById("sim-header");
    if (!host) return;

    const back = document.createElement("a");
    back.className = "sim-back";
    back.href = root() + "library.html";
    back.textContent = "← Library";

    const titles = document.createElement("div");
    titles.className = "sim-titles";
    const h1 = document.createElement("h1");
    h1.textContent = cfg.title;
    const sub = document.createElement("small");
    sub.textContent = cfg.subject;
    titles.append(h1, sub);

    const done = document.createElement("button");
    done.type = "button";
    done.className = "btn-check";
    const refresh = () => {
      const isDone =
        typeof Progress !== "undefined" && Progress.get(cfg.id) === "completed";
      done.textContent = isDone ? "✓ Completed" : "Mark complete";
      done.classList.toggle("is-done", isDone);
      done.setAttribute("aria-pressed", isDone ? "true" : "false");
    };
    done.addEventListener("click", () => {
      if (typeof Progress === "undefined") return;
      if (Progress.get(cfg.id) === "completed") Progress.markStarted(cfg.id);
      else Progress.markCompleted(cfg.id);
      refresh();
    });
    refresh();

    const theme = document.createElement("button");
    theme.type = "button";
    theme.className = "sim-theme";
    theme.setAttribute("aria-label", "Toggle dark mode");
    theme.title = "Toggle dark mode";
    theme.innerHTML =
      '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor"/></svg>';
    theme.addEventListener("click", toggleTheme);

    const inner = document.createElement("div");
    inner.className = "sim-wrap sim-header-inner";
    inner.append(back, titles, done, theme);
    host.appendChild(inner);
  }

  return {
    init(options) {
      cfg = Object.assign(cfg, options || {});
      applyStoredTheme();
      document.title = cfg.title;
      if (typeof Progress !== "undefined" && cfg.id) Progress.markStarted(cfg.id);
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildHeader);
      } else {
        buildHeader();
      }
    },

    /* Handy numeric helpers simulators tend to need. */
    round: (n, dp = 3) => Number(n.toFixed(dp)),
    noise: (magnitude) => (Math.random() - 0.5) * 2 * magnitude,

    /* Least-squares fit through points [{x,y}] -> {m, c, r2} */
    linearFit(points) {
      const n = points.length;
      if (n < 2) return { m: 0, c: 0, r2: 0 };
      const sx = points.reduce((a, p) => a + p.x, 0);
      const sy = points.reduce((a, p) => a + p.y, 0);
      const sxy = points.reduce((a, p) => a + p.x * p.y, 0);
      const sxx = points.reduce((a, p) => a + p.x * p.x, 0);
      const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
      const c = (sy - m * sx) / n;
      const my = sy / n;
      const ssTot = points.reduce((a, p) => a + (p.y - my) ** 2, 0);
      const ssRes = points.reduce((a, p) => a + (p.y - (m * p.x + c)) ** 2, 0);
      return { m, c, r2: ssTot ? 1 - ssRes / ssTot : 1 };
    },
  };
})();

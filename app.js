/* ============================================================================
   app.js — Rendering engine.

   Reads SITE / SUBJECTS / TYPES from site-config.js and RESOURCES from
   resources.js, then builds every dynamic part of the site:

     - site header and footer (so a rebrand needs one edit, not twenty)
     - resource cards, with the right action buttons for each type
     - live search across title, subject, category, type and tags
     - subject / type / availability filters
     - homepage counts, featured row and progress panel

   You should not need to edit this file to add content.
   ========================================================================== */

/* ------------------------------- helpers -------------------------------- */

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === null || v === undefined || v === false) return;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v === true ? "" : v);
  });
  (Array.isArray(children) ? children : [children])
    .filter(Boolean)
    .forEach((c) => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return node;
}

function typeDef(type) {
  return (
    TYPES[type] || {
      label: type,
      plural: type,
      icon: "📁",
      group: "Other",
      accent: "doc",
      actions: [{ mode: "open", label: "Open", primary: true }],
    }
  );
}

/* Resolve a registry URL (written relative to the site root) from any page.
   Root pages use it as-is; a page in a subfolder gets the right number of
   "../" prefixes. Keeps the registry simple: always write "./..." paths. */
function resolveUrl(url) {
  if (!url) return null;
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("/")) return url;
  const depth = window.SITE_DEPTH || 0;
  return "../".repeat(depth) + url.replace(/^\.\//, "");
}

/* -------------------------------- layout -------------------------------- */

const NAV = [
  { label: "Home", href: "index.html" },
  { label: "Library", href: "library.html" },
  { label: "Simulations", href: "library.html?type=Simulations" },
  { label: "Notes", href: "library.html?type=Notes" },
  { label: "About", href: "about.html" },
];

function renderLayout() {
  document.title = document.title
    ? `${document.title} · ${SITE.name}`
    : SITE.name;

  const here = location.pathname.split("/").pop() || "index.html";

  const header = document.getElementById("site-header");
  if (header) {
    header.appendChild(
      el("div", { class: "wrap header-inner" }, [
        el("a", { class: "brand", href: resolveUrl("./index.html") }, [
          el("span", { class: "brand-mark", "aria-hidden": "true", text: SITE.mark || "⚗" }),
          el("span", { class: "brand-text" }, [
            el("strong", { text: SITE.name }),
            el("small", { text: SITE.parentBrand }),
          ]),
        ]),
        el(
          "nav",
          { class: "nav", "aria-label": "Main" },
          NAV.map((item) =>
            el("a", {
              href: resolveUrl("./" + item.href),
              text: item.label,
              class: item.href.split("?")[0] === here ? "active" : null,
            })
          )
        ),
        el("button", {
          class: "theme-toggle",
          type: "button",
          "aria-label": "Toggle dark mode",
          title: "Toggle dark mode",
          html: THEME_ICON,
          onclick: toggleTheme,
        }),
      ])
    );
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.appendChild(
      el("div", { class: "wrap footer-inner" }, [
        el("div", {}, [
          el("strong", { text: SITE.name }),
          el("p", { class: "muted", text: SITE.footerNote }),
        ]),
        el("div", { class: "footer-links" }, [
          el("a", { href: `mailto:${SITE.contactEmail}`, text: SITE.contactEmail }),
          el("a", {
            href: SITE.parentSite,
            target: "_blank",
            rel: "noopener",
            text: SITE.parentSite.replace(/^https?:\/\//, ""),
          }),
        ]),
      ])
    );
  }
}

/* --------------------------------- theme -------------------------------- */

/* Inline SVG rather than an emoji or a box-drawing glyph, so the icon looks
   identical on every device regardless of installed fonts. */
const THEME_ICON =
  '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
  '<path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor"/></svg>';

function applyStoredTheme() {
  let t = null;
  try {
    t = localStorage.getItem("edutech.theme");
  } catch (e) {}
  if (t) document.documentElement.setAttribute("data-theme", t);
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

/* --------------------------------- cards -------------------------------- */

function buildCard(r) {
  const def = typeDef(r.type);
  const available = r.status !== "coming-soon";
  const state = Progress.get(r.id);

  /* action buttons */
  const actions = def.actions.map((a) => {
    if (!available) {
      return el("button", {
        class: "btn " + (a.primary ? "btn-primary" : "btn-ghost"),
        type: "button",
        disabled: true,
        "aria-disabled": "true",
        text: a.label,
        title: "This resource has not been published yet",
      });
    }
    const href = resolveUrl(r.url);
    const attrs = {
      class: "btn " + (a.primary ? "btn-primary" : "btn-ghost"),
      href,
      text: a.label,
    };
    if (a.mode === "download") {
      attrs.download = "";
    } else {
      attrs.target = "_blank";
      attrs.rel = "noopener";
    }
    if (a.mode === "launch") {
      attrs.onclick = () => Progress.markStarted(r.id);
    }
    return el("a", attrs);
  });

  /* progress toggle, only for things a student works through */
  if (available && (r.type === "simulation" || r.type === "quiz" || r.type === "html-note")) {
    const done = state === "completed";
    actions.push(
      el("button", {
        class: "btn btn-check" + (done ? " is-done" : ""),
        type: "button",
        text: done ? "✓ Done" : "Mark done",
        "aria-pressed": done ? "true" : "false",
        onclick: (e) => {
          if (Progress.get(r.id) === "completed") {
            Progress.markStarted(r.id);
          } else {
            Progress.markCompleted(r.id);
          }
          rerenderAll();
        },
      })
    );
  }

  const meta = [
    el("span", { class: "chip chip-subject", text: r.subject }),
    el("span", { class: "chip", text: r.category }),
    r.level ? el("span", { class: "chip chip-soft", text: r.level }) : null,
    r.duration ? el("span", { class: "chip chip-soft", text: r.duration }) : null,
  ].filter(Boolean);

  return el(
    "article",
    {
      class:
        "card accent-" +
        def.accent +
        (available ? "" : " card-soon") +
        (state === "completed" ? " card-done" : ""),
      "data-id": r.id,
    },
    [
      el("div", { class: "card-top" }, [
        el("span", { class: "card-icon", "aria-hidden": "true", text: def.icon }),
        el("span", { class: "card-type", text: def.label }),
        available
          ? state === "completed"
            ? el("span", { class: "status status-done", text: "Completed" })
            : null
          : el("span", { class: "status status-soon", text: STATUS_LABELS["coming-soon"] }),
      ]),
      el("h3", { class: "card-title", text: r.title }),
      el("p", { class: "card-desc", text: r.description }),
      el("div", { class: "card-meta" }, meta),
      el("div", { class: "card-actions" }, actions),
    ]
  );
}

/* -------------------------------- catalogue ----------------------------- */

const state = { q: "", subject: "All", type: "All", status: "All" };

function matches(r) {
  if (state.subject !== "All" && r.subject !== state.subject) return false;
  if (state.type !== "All" && typeDef(r.type).group !== state.type) return false;
  if (state.status !== "All" && (r.status || "available") !== state.status) return false;

  const q = state.q.trim().toLowerCase();
  if (!q) return true;
  const def = typeDef(r.type);
  const haystack = [
    r.title,
    r.description,
    r.subject,
    r.category,
    r.type,
    def.label,
    def.group,
    ...(r.tags || []),
  ]
    .join(" ")
    .toLowerCase();
  // every whitespace-separated term must appear somewhere
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

function typeGroups() {
  const present = new Set(RESOURCES.map((r) => typeDef(r.type).group));
  const ordered = TYPE_GROUP_ORDER.filter((g) => present.has(g));
  [...present].forEach((g) => {
    if (!ordered.includes(g)) ordered.push(g);
  });
  return ordered;
}

function buildFilterRow(label, key, options) {
  return el("div", { class: "filter-row" }, [
    el("span", { class: "filter-label", text: label }),
    el(
      "div",
      { class: "filter-chips", role: "group", "aria-label": label },
      options.map((opt) =>
        el("button", {
          type: "button",
          class: "fchip" + (state[key] === opt.value ? " is-on" : ""),
          text: opt.label,
          onclick: () => {
            state[key] = opt.value;
            syncUrl();
            renderCatalogue();
          },
        })
      )
    ),
  ]);
}

function syncUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.subject !== "All") p.set("subject", state.subject);
  if (state.type !== "All") p.set("type", state.type);
  if (state.status !== "All") p.set("status", state.status);
  const qs = p.toString();
  history.replaceState(null, "", qs ? "?" + qs : location.pathname);
}

function readUrl() {
  const p = new URLSearchParams(location.search);
  state.q = p.get("q") || "";
  state.subject = p.get("subject") || "All";
  state.type = p.get("type") || "All";
  state.status = p.get("status") || "All";
}

function renderCatalogue() {
  const filtersHost = document.getElementById("filters");
  const grid = document.getElementById("resource-grid");
  const countHost = document.getElementById("result-count");
  if (!grid) return;

  if (filtersHost) {
    filtersHost.innerHTML = "";
    filtersHost.appendChild(
      buildFilterRow("Subject", "subject", [
        { label: "All", value: "All" },
        ...SUBJECTS.map((s) => ({ label: s, value: s })),
      ])
    );
    filtersHost.appendChild(
      buildFilterRow("Type", "type", [
        { label: "All", value: "All" },
        ...typeGroups().map((g) => ({ label: g, value: g })),
      ])
    );
    filtersHost.appendChild(
      buildFilterRow("Availability", "status", [
        { label: "All", value: "All" },
        { label: "Available", value: "available" },
        { label: "Coming Soon", value: "coming-soon" },
      ])
    );
  }

  const results = RESOURCES.filter(matches);
  grid.innerHTML = "";

  if (countHost) {
    const total = RESOURCES.length;
    countHost.textContent =
      results.length === total
        ? `${total} resource${total === 1 ? "" : "s"}`
        : `${results.length} of ${total} resources`;
  }

  if (!results.length) {
    grid.appendChild(
      el("div", { class: "empty" }, [
        el("p", { class: "empty-title", text: "Nothing matches that yet." }),
        el("p", {
          class: "muted",
          text:
            "Try a broader search, or clear the filters. New resources are added regularly.",
        }),
        el("button", {
          class: "btn btn-ghost",
          type: "button",
          text: "Clear filters",
          onclick: () => {
            state.q = "";
            state.subject = "All";
            state.type = "All";
            state.status = "All";
            const box = document.getElementById("search");
            if (box) box.value = "";
            syncUrl();
            renderCatalogue();
          },
        }),
      ])
    );
    return;
  }

  results.forEach((r) => grid.appendChild(buildCard(r)));
}

/* -------------------------------- homepage ------------------------------ */

function renderHome() {
  const statsHost = document.getElementById("stats");
  if (statsHost) {
    const avail = RESOURCES.filter((r) => r.status !== "coming-soon");
    const byGroup = {};
    avail.forEach((r) => {
      const g = typeDef(r.type).group;
      byGroup[g] = (byGroup[g] || 0) + 1;
    });
    const cells = [
      { n: avail.length, label: "Resources available" },
      { n: byGroup["Simulations"] || 0, label: "Simulations" },
      { n: (byGroup["Notes"] || 0) + (byGroup["Documents"] || 0), label: "Notes & documents" },
      {
        n: RESOURCES.filter((r) => r.status === "coming-soon").length,
        label: "Coming soon",
      },
    ];
    statsHost.innerHTML = "";
    cells.forEach((c) =>
      statsHost.appendChild(
        el("div", { class: "stat" }, [
          el("span", { class: "stat-n", text: String(c.n) }),
          el("span", { class: "stat-l", text: c.label }),
        ])
      )
    );
  }

  const featuredHost = document.getElementById("featured-grid");
  if (featuredHost) {
    // Featured = flagged entries, else the newest available ones.
    let picks = RESOURCES.filter((r) => r.featured && r.status !== "coming-soon");
    if (!picks.length) {
      picks = RESOURCES.filter((r) => r.status !== "coming-soon")
        .slice()
        .sort((a, b) => (b.added || "").localeCompare(a.added || ""))
        .slice(0, 3);
    }
    featuredHost.innerHTML = "";
    if (picks.length) {
      picks.forEach((r) => featuredHost.appendChild(buildCard(r)));
    } else {
      featuredHost.appendChild(
        el("div", { class: "empty" }, [
          el("p", { class: "empty-title", text: "No resources published yet." }),
          el("p", {
            class: "muted",
            text: "Add an entry to js/resources.js and it will appear here.",
          }),
        ])
      );
    }
  }

  const soonHost = document.getElementById("soon-grid");
  if (soonHost) {
    const soon = RESOURCES.filter((r) => r.status === "coming-soon").slice(0, 6);
    const section = document.getElementById("soon-section");
    if (!soon.length && section) {
      section.hidden = true;
    } else {
      soonHost.innerHTML = "";
      soon.forEach((r) => soonHost.appendChild(buildCard(r)));
    }
  }

  renderProgressPanel();
}

function renderProgressPanel() {
  const host = document.getElementById("progress-panel");
  if (!host) return;
  const s = Progress.summary();
  host.innerHTML = "";

  if (!s.total) {
    host.hidden = true;
    return;
  }
  host.hidden = false;

  host.appendChild(
    el("div", { class: "progress-head" }, [
      el("h2", { text: "Your progress" }),
      el("span", {
        class: "muted",
        text: `${s.completed} of ${s.total} completed`,
      }),
    ])
  );
  host.appendChild(
    el("div", { class: "bar", role: "progressbar", "aria-valuenow": String(s.percent), "aria-valuemin": "0", "aria-valuemax": "100" }, [
      el("span", { class: "bar-fill", style: `width:${s.percent}%` }),
    ])
  );
  host.appendChild(
    el("p", { class: "muted small" }, [
      s.completed
        ? `${s.percent}% done. Progress is stored in this browser only.`
        : "Mark a resource as done and it will show up here. Progress is stored in this browser only.",
      s.completed
        ? el("button", {
            class: "linkish",
            type: "button",
            text: "Reset",
            onclick: () => {
              Progress.reset();
              rerenderAll();
            },
          })
        : null,
    ])
  );
}

/* --------------------------------- boot --------------------------------- */

function rerenderAll() {
  renderCatalogue();
  renderHome();
}

function boot() {
  applyStoredTheme();
  renderLayout();

  const search = document.getElementById("search");
  if (search) {
    readUrl();
    search.value = state.q;
    search.addEventListener("input", (e) => {
      state.q = e.target.value;
      syncUrl();
      renderCatalogue();
    });
  } else {
    readUrl();
  }

  renderCatalogue();
  renderHome();
}

document.addEventListener("DOMContentLoaded", boot);

/* ============================================================================
   progress.js — Lightweight, private, per-browser progress tracking.

   No accounts, no server, no database. Everything lives in the student's own
   browser via localStorage. If they clear site data it resets, which is fine
   for a study aid.

   Public API (also used by simulators via simulation-kit.js):
     Progress.markStarted(id)
     Progress.markCompleted(id)
     Progress.get(id)         -> "completed" | "started" | null
     Progress.summary()       -> { started, completed, total, percent }
     Progress.reset()
   ========================================================================== */

const Progress = (() => {
  const KEY = "edutech.progress.v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* private mode / storage disabled — progress simply won't persist */
    }
  }

  function set(id, state) {
    if (!id) return;
    const data = load();
    // never downgrade completed -> started
    if (data[id] && data[id].state === "completed" && state === "started") return;
    data[id] = { state, at: Date.now() };
    save(data);
    document.dispatchEvent(new CustomEvent("progress:changed", { detail: { id, state } }));
  }

  return {
    markStarted: (id) => set(id, "started"),
    markCompleted: (id) => set(id, "completed"),

    get(id) {
      const rec = load()[id];
      return rec ? rec.state : null;
    },

    summary() {
      const data = load();
      const trackable =
        typeof RESOURCES !== "undefined"
          ? RESOURCES.filter((r) => r.status === "available")
          : [];
      const ids = new Set(trackable.map((r) => r.id));
      let started = 0;
      let completed = 0;
      Object.keys(data).forEach((id) => {
        if (!ids.has(id)) return;
        if (data[id].state === "completed") completed++;
        else if (data[id].state === "started") started++;
      });
      const total = trackable.length;
      return {
        started,
        completed,
        total,
        percent: total ? Math.round((completed / total) * 100) : 0,
      };
    },

    reset() {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
      document.dispatchEvent(new CustomEvent("progress:changed", { detail: {} }));
    },
  };
})();

/* ============================================================================
   site-config.js — Platform identity, taxonomy and resource-type behaviour.

   THIS IS THE ONLY FILE YOU EDIT TO REBRAND THE PLATFORM.
   Change SITE.name below and every page, tab title and footer follows.

   You will rarely need to touch anything else in this file. The two places
   you might, later on:
     - SUBJECTS   → add a new subject when you start covering a new syllabus
     - TYPES      → add a new resource type (e.g. "podcast", "case-study")
   ========================================================================== */

const SITE = {
  name: "Pharma Hub",                   // <-- rename the platform here
  shortName: "Pharma Hub",
  mark: "Ph",                           // the two-letter logo mark
  parentBrand: "Edutech",
  tagline: "Virtual pharmacy laboratory, notes and study resources",
  description:
    "Interactive instrument simulations, virtual experiments, notes, " +
    "presentations and practice questions for pharmacy students.",
  contactEmail: "edutechservices1122@gmail.com",
  parentSite: "https://edutechservice.in",

  // Shown on the homepage hero. Purely cosmetic.
  heroKicker: "Learn by doing",

  // Footer line.
  footerNote: "Built for pharmacy students. Content added continuously.",
};

/* ---------------------------------------------------------------------------
   SUBJECTS
   The value is what you put in a resource's `subject` field.
   Adding a subject here makes it appear in the filter bar automatically.
   --------------------------------------------------------------------------- */
const SUBJECTS = [
  "Pharmaceutical Analysis",
  "Pharmaceutical Chemistry",
  "Pharmaceutics",
  "Pharmacology",
  "Instrumentation",
];

/* ---------------------------------------------------------------------------
   TYPES
   Each resource `type` maps to one entry here. The entry decides:
     label   — how the type is named in the UI and the filter bar
     icon    — the glyph drawn on the card
     group   — how the type is bucketed in the "Type" filter
     actions — which buttons the card gets, and what each does

   Action modes:
     "open"     → opens url in a new tab (browser handles PDFs, HTML, video)
     "download" → triggers a file download of url
     "launch"   → opens url in a new tab, and marks the resource as started
                  for progress tracking

   To support a brand-new format later, add a TYPES entry. Nothing else in
   the codebase needs to change.
   --------------------------------------------------------------------------- */
const TYPES = {
  simulation: {
    label: "Simulation",
    plural: "Simulations",
    icon: "⚗",
    group: "Simulations",
    accent: "sim",
    actions: [{ mode: "launch", label: "Launch Simulation", primary: true }],
  },
  "html-note": {
    label: "HTML Notes",
    plural: "HTML Notes",
    icon: "📖",
    group: "Notes",
    accent: "note",
    actions: [{ mode: "open", label: "Read Online", primary: true }],
  },
  pdf: {
    label: "PDF",
    plural: "Notes",
    icon: "📄",
    group: "Notes",
    accent: "note",
    // PDFs open reliably in the browser's built-in viewer, so both actions work.
    actions: [
      { mode: "open", label: "View PDF", primary: true },
      { mode: "download", label: "Download" },
    ],
  },
  ppt: {
    label: "PPT",
    plural: "Presentations",
    icon: "📊",
    group: "Presentations",
    accent: "deck",
    // No reliable in-browser viewer for Office files on static hosting,
    // so we offer download only rather than a broken "View" button.
    actions: [{ mode: "download", label: "Download Presentation", primary: true }],
  },
  pptx: {
    label: "PPTX",
    plural: "Presentations",
    icon: "📊",
    group: "Presentations",
    accent: "deck",
    actions: [{ mode: "download", label: "Download Presentation", primary: true }],
  },
  doc: {
    label: "DOC",
    plural: "Documents",
    icon: "📝",
    group: "Documents",
    accent: "doc",
    actions: [{ mode: "download", label: "Download Notes", primary: true }],
  },
  docx: {
    label: "DOCX",
    plural: "Documents",
    icon: "📝",
    group: "Documents",
    accent: "doc",
    actions: [{ mode: "download", label: "Download Notes", primary: true }],
  },
  video: {
    label: "Video",
    plural: "Videos",
    icon: "▶",
    group: "Videos",
    accent: "video",
    actions: [{ mode: "open", label: "Watch Video", primary: true }],
  },
  quiz: {
    label: "Quiz",
    plural: "Quizzes",
    icon: "✓",
    group: "Quizzes",
    accent: "quiz",
    actions: [{ mode: "launch", label: "Start Quiz", primary: true }],
  },
  viva: {
    label: "Viva",
    plural: "Viva Questions",
    icon: "💬",
    group: "Viva",
    accent: "viva",
    actions: [{ mode: "open", label: "Open Viva Questions", primary: true }],
  },
};

/* Order the "Type" filter chips appear in. Groups not listed fall to the end. */
const TYPE_GROUP_ORDER = [
  "Simulations",
  "Notes",
  "Presentations",
  "Documents",
  "Videos",
  "Quizzes",
  "Viva",
];

const STATUS_LABELS = {
  available: "Available",
  "coming-soon": "Coming Soon",
};

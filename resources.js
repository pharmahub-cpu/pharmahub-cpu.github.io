/* ============================================================================
   resources.js — THE CENTRAL RESOURCE REGISTRY

   This is the only file you edit when you add a resource to the platform.
   Upload the file to the repository, add one entry below, commit. Done.
   The homepage and library page rebuild themselves from this array.

   FLAT LAYOUT: every file in this project sits at the top level of the
   repository — no folders. That makes uploading to GitHub foolproof: drag
   everything in at once and nothing can land in the wrong place.

   ---------------------------------------------------------------------------
   ENTRY SHAPE
   ---------------------------------------------------------------------------
   {
     id:          "unique-slug",          // required, must be unique
     title:       "Assay of Paracetamol", // required
     description: "One or two lines.",    // required
     type:        "simulation",           // required, a key from TYPES in site-config.js
                                          //   simulation | html-note | pdf | ppt | pptx
                                          //   doc | docx | video | quiz | viva
     subject:     "Pharmaceutical Analysis", // required, from SUBJECTS in site-config.js
     category:    "Virtual Experiment",   // required, free text — your own grouping
     url:         "./paracetamol-assay.html",  // required IF status is "available"
     status:      "available",            // "available" | "coming-soon"

     // ---- all optional ----
     featured:    true,                   // pin to the homepage "Featured" row
     added:       "2026-09-10",           // ISO date, used for "Recently added"
     tags:        ["uv", "spectroscopy"], // extra words the search should match
     duration:    "20 min",               // shown on the card
     level:       "B.Pharm 2nd Year",     // shown on the card
   }

   ---------------------------------------------------------------------------
   RULES
   ---------------------------------------------------------------------------
   1. A "coming-soon" entry must NOT have a url. Leave it out entirely.
      The card still shows, with its action button disabled. No fake links.
   2. A url is just "./" plus the filename, because everything is top level.
      Filenames are case-sensitive on GitHub Pages — "UV-Notes.pdf" and
      "uv-notes.pdf" are different files.
   3. Keep the original file format. Never convert a PDF/PPTX/DOCX to something
      else just to display it — link to the real file.
   4. Adding an entry is enough. Do not edit index.html or library.html.
   5. Give uploads descriptive filenames, since there are no folders to
      organise them: "uv-visible-spectroscopy-notes.pdf", not "notes1.pdf".

   See ADDING-RESOURCES.md for copy-paste snippets per type.
   ========================================================================== */

const RESOURCES = [
     /* ===================== AVAILABLE NOW ===================== */

   {
          id: "uv-vis-spectrophotometer",
          title: "UV-Visible Spectrophotometer",
          description:
                   "Guided virtual laboratory for instrument operation and handling — " +
                   "step-by-step procedure, observation tables, precautions and an " +
                   "end-of-session quiz.",
          type: "simulation",
          subject: "Pharmaceutical Analysis",
          category: "Virtual Instrument",
          url: "./uv-vis/",
          status: "available",
          featured: true,
          added: "2026-09-10",
          level: "B.Pharm / D.Pharm",
          duration: "30 min",
          tags: ["uv", "visible", "spectroscopy", "absorbance", "lambda max", "beer lambert"],
   },

   {
          id: "paracetamol-assay",
          title: "Assay of Paracetamol",
          description:
                   "Complete virtual assay of paracetamol tablets by UV-Visible " +
                   "spectrophotometry — standard preparation, calibration curve, sample " +
                   "measurement and percentage-purity calculation.",
          type: "simulation",
          subject: "Pharmaceutical Analysis",
          category: "Virtual Experiment",
          url: "./paracetamol-assay/",
          status: "available",
          featured: true,
          added: "2026-09-10",
          level: "B.Pharm 2nd Year",
          duration: "25 min",
          tags: ["paracetamol", "acetaminophen", "assay", "uv", "calibration curve"],
   },

     /* ===================== COMING SOON =====================
        Visible on the site, button disabled, no URL. Delete the
        `status` line and add a `url` when the resource goes live. */

   {
          id: "ibuprofen-assay",
          title: "Assay of Ibuprofen",
          description: "Interactive UV-Visible assay of ibuprofen tablets.",
          type: "simulation",
          subject: "Pharmaceutical Analysis",
          category: "Virtual Experiment",
          status: "coming-soon",
          tags: ["ibuprofen", "assay", "uv"],
   },
   {
          id: "chloramphenicol-assay",
          title: "Assay of Chloramphenicol",
          description: "Interactive UV-Visible assay of chloramphenicol.",
          type: "simulation",
          subject: "Pharmaceutical Analysis",
          category: "Virtual Experiment",
          status: "coming-soon",
          tags: ["chloramphenicol", "assay", "uv"],
   },
   {
          id: "tlc",
          title: "Thin Layer Chromatography (TLC)",
          description:
                   "Virtual TLC bench — spot the plate, develop in a chamber, visualise " +
                   "and calculate Rf values.",
          type: "simulation",
          subject: "Pharmaceutical Analysis",
          category: "Virtual Experiment",
          status: "coming-soon",
          tags: ["tlc", "chromatography", "rf"],
   },
   {
          id: "hplc",
          title: "HPLC System",
          description:
                   "Virtual high-performance liquid chromatography system with mobile " +
                   "phase selection, injection and chromatogram interpretation.",
          type: "simulation",
          subject: "Instrumentation",
          category: "Virtual Instrument",
          status: "coming-soon",
          tags: ["hplc", "chromatography", "retention time"],
   },
   {
          id: "electrophoresis",
          title: "Electrophoresis",
          description:
                   "Virtual gel electrophoresis — load wells, run the gel and interpret " +
                   "band migration.",
          type: "simulation",
          subject: "Instrumentation",
          category: "Virtual Experiment",
          status: "coming-soon",
          tags: ["electrophoresis", "gel", "migration"],
   },

     /* Placeholders showing how each non-simulation type appears.
        Delete these once you upload the real files, or fill in a url. */

   {
          id: "uv-visible-spectroscopy-notes",
          title: "UV-Visible Spectroscopy — Notes",
          description:
                   "Principle, instrumentation, Beer-Lambert law, deviations and " +
                   "pharmaceutical applications.",
          type: "pdf",
          subject: "Pharmaceutical Analysis",
          category: "Study Notes",
          status: "coming-soon",
          tags: ["uv", "spectroscopy", "beer lambert"],
   },
   {
          id: "uv-visible-spectroscopy-ppt",
          title: "UV-Visible Spectroscopy — Presentation",
          description: "Slide deck covering the full UV-Vis unit.",
          type: "pptx",
          subject: "Pharmaceutical Analysis",
          category: "Lecture Slides",
          status: "coming-soon",
          tags: ["uv", "spectroscopy", "slides"],
   },
   {
          id: "uv-vis-viva",
          title: "UV-Visible Spectroscopy — Viva Questions",
          description: "Frequently asked practical examination questions with answers.",
          type: "viva",
          subject: "Pharmaceutical Analysis",
          category: "Examination Practice",
          status: "coming-soon",
          tags: ["uv", "viva", "oral exam"],
   },
   ];

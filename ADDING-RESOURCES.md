# Adding a resource — copy-paste reference

Every resource is one object in the array inside [`resources.js`](resources.js).
Upload the file, copy the matching block below, change the values, paste it into
the array, commit.

Nothing else needs editing. Not the homepage, not the library page.

Everything lives at the top level of the repository, so a `url` is always just
`"./"` plus the filename.

---

## The fields

| Field | Required | What it does |
|---|---|---|
| `id` | yes | Unique slug. Used for progress tracking — keep it stable once published. |
| `title` | yes | Card heading. |
| `description` | yes | One or two lines under the heading. Also searched. |
| `type` | yes | Decides the icon and the action buttons. See below. |
| `subject` | yes | Must match an entry in `SUBJECTS` in `site-config.js`. Drives the Subject filter. |
| `category` | yes | Free text — your own grouping, e.g. "Virtual Experiment", "Study Notes". Shown and searched. |
| `url` | if available | `"./filename"`. **Omit entirely for `coming-soon`.** |
| `status` | no | `"available"` (default) or `"coming-soon"`. |
| `featured` | no | `true` pins it to the homepage Featured row. |
| `added` | no | `"YYYY-MM-DD"`. Picks the newest items when nothing is featured. |
| `tags` | no | Extra search words, e.g. `["uv", "beer lambert"]`. |
| `duration` | no | e.g. `"20 min"`. Shown as a chip. |
| `level` | no | e.g. `"B.Pharm 2nd Year"`. Shown as a chip. |

---

## PDF notes

```js
{
  id: "chromatography-notes",
  title: "Chromatography — Notes",
  description: "Classification, theory of separation and pharmaceutical applications.",
  type: "pdf",
  subject: "Pharmaceutical Analysis",
  category: "Study Notes",
  url: "./chromatography-notes.pdf",
  status: "available",
  added: "2026-09-15"
}
```

**View PDF** (browser's own viewer) and **Download**.

---

## PowerPoint presentation

```js
{
  id: "hplc-presentation",
  title: "HPLC — Presentation",
  description: "Instrumentation, columns, detectors and method development.",
  type: "pptx",
  subject: "Instrumentation",
  category: "Lecture Slides",
  url: "./hplc-presentation.pptx",
  status: "available"
}
```

Use `"ppt"` for old-format files. **Download Presentation** only — static
hosting cannot display Office files reliably, so there is deliberately no
"View" button that would fail.

---

## Word document

```js
{
  id: "pa-practical-notes",
  title: "Pharmaceutical Analysis — Practical Notes",
  description: "Complete practical record with procedures and observation tables.",
  type: "docx",
  subject: "Pharmaceutical Analysis",
  category: "Practical Record",
  url: "./pa-practical-notes.docx",
  status: "available"
}
```

Use `"doc"` for old-format files. **Download Notes**.

---

## HTML notes

```js
{
  id: "uv-vis-html-notes",
  title: "UV-Visible Spectroscopy — Read Online",
  description: "Full notes with diagrams, readable directly in the browser.",
  type: "html-note",
  subject: "Pharmaceutical Analysis",
  category: "Study Notes",
  url: "./uv-vis-html-notes.html",
  status: "available"
}
```

**Read Online**. HTML notes are progress-trackable, so students can mark them
done.

---

## Simulation

```js
{
  id: "tlc",
  title: "Thin Layer Chromatography",
  description: "Spot the plate, develop in a chamber and calculate Rf values.",
  type: "simulation",
  subject: "Pharmaceutical Analysis",
  category: "Virtual Experiment",
  url: "./tlc.html",
  status: "available",
  level: "B.Pharm 2nd Year",
  duration: "20 min"
}
```

To build one: download `template-simulation.html`, rename it `tlc.html`, edit
the `SimKit.init({ id: "tlc", ... })` block near the bottom, write the
experiment, upload it. The `id` **must** match the registry entry or progress
tracking won't work.

---

## Video

Videos are linked, not hosted. Use the normal watch URL.

```js
{
  id: "uv-vis-video",
  title: "UV-Visible Spectroscopy — Video Lecture",
  description: "Recorded lecture covering the full unit.",
  type: "video",
  subject: "Pharmaceutical Analysis",
  category: "Video Lecture",
  url: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  status: "available",
  duration: "32 min"
}
```

---

## Quiz

Build a quiz like a simulation — its own HTML file.

```js
{
  id: "uv-vis-mcq",
  title: "UV-Visible Spectroscopy — MCQ Practice",
  description: "25 multiple-choice questions with instant feedback.",
  type: "quiz",
  subject: "Pharmaceutical Analysis",
  category: "Examination Practice",
  url: "./uv-vis-mcq.html",
  status: "available"
}
```

---

## Viva questions

Either an HTML page or a PDF.

```js
{
  id: "uv-vis-viva",
  title: "UV-Visible Spectroscopy — Viva Questions",
  description: "Frequently asked practical examination questions with answers.",
  type: "viva",
  subject: "Pharmaceutical Analysis",
  category: "Examination Practice",
  url: "./uv-vis-viva.html",
  status: "available"
}
```

---

## Coming Soon

Announce something before it exists. **No `url` field at all** — never a
placeholder or a link that 404s.

```js
{
  id: "electrophoresis",
  title: "Electrophoresis",
  description: "Load wells, run the gel and interpret band migration.",
  type: "simulation",
  subject: "Instrumentation",
  category: "Virtual Experiment",
  status: "coming-soon"
}
```

When it goes live: delete the `status` line, add the `url`.

---

## Adding a new subject

In `site-config.js`, add to `SUBJECTS`:

```js
const SUBJECTS = [
  "Pharmaceutical Analysis",
  "Pharmaceutical Chemistry",
  "Pharmaceutics",
  "Pharmacology",
  "Instrumentation",
  "Pharmacognosy",          // ← new
];
```

The filter chip appears by itself.

---

## Adding a brand-new resource type

Only needed for a format not listed above — say audio. In `site-config.js`, add
to `TYPES`:

```js
audio: {
  label: "Audio",
  plural: "Audio",
  icon: "🎧",
  group: "Videos",                 // which filter chip it sits under
  accent: "video",                 // sim | note | deck | doc | video | quiz | viva
  actions: [{ mode: "open", label: "Listen", primary: true }]
},
```

`mode` is one of:

- `"open"` — opens the URL in a new tab
- `"download"` — downloads the file
- `"launch"` — opens in a new tab and records that the student started it

A type can have more than one action, as `pdf` does.

---

## Checklist before you commit

- [ ] The file is uploaded and the `url` matches its name **exactly** —
      filenames are case-sensitive on GitHub Pages.
- [ ] `id` is unique and not already used by another entry.
- [ ] `subject` is spelled exactly as it appears in `SUBJECTS`.
- [ ] A `coming-soon` entry has **no** `url`.
- [ ] The file still has valid JavaScript — one missing comma stops the whole
      page rendering. If the site goes blank after an edit, that's almost always
      the cause: check the last entry you added.

# Pharma Hub

A content-ready learning platform for pharmacy students: virtual instruments,
virtual experiments, notes, presentations, documents, videos, quizzes and viva
questions.

The site is **the platform, not the content**. It ships with two working
simulations and is built so that adding hundreds more resources later never
requires redesigning a page.

Static site on GitHub Pages. No database, no build step, no dependencies.

---

## Flat layout — why every file is at the top level

There are no folders in this repository. Every file sits at the root.

That is deliberate. GitHub's web uploader only keeps folder structure when you
drag folders in; if you pick files through the "choose your files" dialog it
throws the folders away and everything lands at the root anyway — silently
breaking the site. With a flat layout there is nothing to break: select all the
files, drop them in, done.

The trade-off is that filenames carry the organisation instead of folders. So
name uploads descriptively — `uv-visible-spectroscopy-notes.pdf`, not
`notes1.pdf`.

If you later move to GitHub Desktop or a code editor, folders can be
reintroduced; only the `url` values in `resources.js` and the `<link>`/`<script>`
tags at the top of each HTML page would need updating.

---

## Adding a resource

```
Upload the file to the repository
        ↓
Add one entry to resources.js
        ↓
Commit
        ↓
GitHub Pages redeploys automatically
        ↓
The resource appears on the site
```

**You never edit `index.html` or `library.html`.** Cards, counts, search results
and filters are all generated from `resources.js`.

Copy-paste snippets for every file type: [`ADDING-RESOURCES.md`](ADDING-RESOURCES.md)

### Example

Upload `chromatography-notes.pdf`, then add to `resources.js`:

```js
{
  id: "chromatography-notes",
  title: "Chromatography — Notes",
  description: "Classification, theory of separation and applications.",
  type: "pdf",
  subject: "Pharmaceutical Analysis",
  category: "Study Notes",
  url: "./chromatography-notes.pdf",
  status: "available"
}
```

Commit. The card appears with **View PDF** and **Download** buttons.

---

## The files

| File | What it is |
|---|---|
| `index.html` | Homepage — generated from the registry |
| `library.html` | Full searchable, filterable catalogue |
| `about.html` | About page |
| `404.html` | Not-found page |
| `resources.js` | **THE REGISTRY.** The only file you edit to add content. |
| `site-config.js` | Brand name, subjects, resource-type behaviour |
| `app.js` | Rendering, search, filters |
| `progress.js` | Per-browser progress tracking |
| `simulation-kit.js` | Shared header and helpers for simulations |
| `style.css` | Platform styling |
| `sim.css` | Simulation styling |
| `uv-vis/index.html` | UV-Visible spectrophotometer simulation |
| `paracetamol-assay/index.html` | Paracetamol assay simulation |
| `template-simulation.html` | Starting point for a new simulation |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

`template-simulation.html` never appears on the site, because nothing is listed
unless it has an entry in `resources.js`.

---

## Resource types supported

| `type` | Card shows |
|---|---|
| `simulation` | Launch Simulation |
| `html-note` | Read Online |
| `pdf` | View PDF · Download |
| `ppt` / `pptx` | Download Presentation |
| `doc` / `docx` | Download Notes |
| `video` | Watch Video (external link, e.g. YouTube) |
| `quiz` | Start Quiz |
| `viva` | Open Viva Questions |

**Files are never converted.** A PDF stays a PDF, a PPTX stays a PPTX. The
platform organises and links to them; it does not transform them.

PowerPoint and Word get a download button only. Static hosting cannot display
Office files reliably in a browser, and a broken "View" button is worse than no
button.

---

## Coming Soon resources

To announce something before it exists, add the entry with **no `url` at all**:

```js
{
  id: "hplc",
  title: "HPLC System",
  description: "Virtual HPLC with mobile phase selection and chromatograms.",
  type: "simulation",
  subject: "Instrumentation",
  category: "Virtual Instrument",
  status: "coming-soon"
}
```

The card shows with a **Coming Soon** badge and a disabled button. When it's
ready, delete the `status` line and add the `url`. Never invent a URL for
something that doesn't exist yet.

---

## Rebranding

Site name, logo mark, tagline, contact email and footer all come from the top of
`site-config.js`. Change it there and every page follows.

The same file holds `SUBJECTS` (add one and it appears in the filter bar) and
`TYPES` (add a format, with its icon and buttons, without touching anything
else).

---

## Publishing on GitHub Pages

1. Create a repository named `<your-username>.github.io`, public, with no README.
2. Click **uploading an existing file**, select all the files from this folder,
   drop them in, and **Commit changes**.
3. **Settings → Pages** → Source: *Deploy from a branch* → branch `main`,
   folder `/ (root)` → **Save**.
4. Wait a minute, then open `https://<your-username>.github.io/`

To add a resource later: **Add file → Upload files**, drop the PDF in, commit.
Then open `resources.js`, click the pencil icon, add the entry, commit.

**Custom domain.** To serve the site at your own domain, add a file named
`CNAME` containing just the domain name, and point a DNS record at GitHub Pages.

---

## Progress tracking

Students can mark simulations, quizzes and HTML notes as done. Progress lives in
`localStorage` in their own browser — no accounts, no server, nothing sent
anywhere. It resets if they clear site data and doesn't follow them to another
device. That is deliberate: it keeps the platform completely static.

---

## Growing later

- The homepage never contains hand-written resource cards, so 500 resources
  render exactly like 2.
- Subjects and types are data, not markup.
- If a CMS or backend is wanted later, `resources.js` becomes an API response —
  `RESOURCES` is just an array, and `app.js` doesn't care where it came from.

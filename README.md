# Mai Ly — Portfolio

A single-page portfolio + web CV. Static HTML/CSS/JS — no build step, no dependencies.
Layout: two columns, a sticky identity column (name, contact, section links) and the CV record on the right.
One typeface (Schibsted Grotesk from Google Fonts), one accent colour, light/dark mode.

```
portfolio/
├── index.html              ← all content (edit text/projects here)
├── assets/css/styles.css   ← design system & layout
├── assets/js/main.js        ← theme toggle, section highlight
├── Mai-Ly-CV.pdf            ← downloadable CV (regenerate after edits)
├── .nojekyll               ← tells GitHub Pages to serve files as-is
└── README.md
```

## Preview locally

```bash
cd portfolio
python3 -m http.server 8080
# open http://localhost:8080
```

## Download CV as PDF
**Download CV (PDF)** links to `Mai-Ly-CV.pdf` in the repo root. That file is the print version of
`index.html` (see the `@media print` block in `styles.css`, about 3 A4 pages). Regenerate it after editing content:

```bash
python3 -m http.server 8765 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --virtual-time-budget=5000 --print-to-pdf=Mai-Ly-CV.pdf http://localhost:8765/
```

## What to edit before publishing
Open `index.html` and update:
- **Contact links** in the left column (email, GitHub, LinkedIn).
- **Availability** line under the intro, if you want to change it.
- Any project wording you'd like to tune.

---

## Deploy to GitHub Pages

You do **not** need any special "deploy key" or secret for a public GitHub Pages site.
GitHub Pages serves public repos for free. You only need a way to *push* the code. Pick one:

### Option A — let Claude push for you (recommended)
1. Install GitHub CLI (one time): `brew install gh`
2. In the Claude prompt, log in interactively by typing:
   ```
   ! gh auth login
   ```
   Choose **GitHub.com → HTTPS → login with a browser**. This stores credentials locally;
   you never paste a token into chat.
3. Tell Claude to continue — it will create a public repo, push this folder, and enable Pages.

Your site will be live at: `https://<your-username>.github.io/<repo-name>/`
(or `https://<your-username>.github.io/` if the repo is named `<your-username>.github.io`).

### Option B — do it yourself in the terminal
```bash
cd portfolio
git init -b main
git add .
git commit -m "Portfolio site"

# create the repo on github.com first (Public), then:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**
Wait ~1 minute; the public URL appears at the top of that Pages page.

### Tip: a personalised URL
Name the repo exactly `<your-username>.github.io` and the site is served at
`https://<your-username>.github.io/` (no sub-path). All asset links here are **relative**, so it
works at either URL with no changes.

> Note: a *PAT (Personal Access Token)* is only needed if you want a non-interactive push without
> `gh`. The browser login in Option A is simpler and safer.

# The Simulation Semester

A static website about PHIL 115: Philosophical Ideas (Widener University, Spring 2026): an intro philosophy course taught as a fourteen-week story, co-written with Claude and illustrated with Google Gemini.

- `index.html`: the overview (the idea, how it was built, the season, cast, AI slips, assignments, advice for colleagues)
- `episodes.html`: all fourteen episodes with their comic pages
- `assets/`: stylesheet, script, and web-optimized images (WebP)

No build step, no dependencies. Fonts load from Google Fonts.

## Preview locally

```
python -m http.server 8115
```

Then open http://localhost:8115.

## Publish on GitHub Pages

**Publish this `website` folder as its own repository.** The parent course folder contains student submissions and grades and must never be pushed.

1. On GitHub, create a new empty public repository (for example `simulation-semester`).
2. From inside this `website` folder:

   ```
   git init
   git add .
   git commit -m "The Simulation Semester site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/simulation-semester.git
   git push -u origin main
   ```

3. In the repository on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. After a minute the site is live at `https://YOUR-USERNAME.github.io/simulation-semester/`.

### Custom domain

The site is served at **https://simulation-semester.tomwilk.net**. DNS for tomwilk.net is at Bluehost, which has a CNAME record `simulation-semester` → `wilkth01.github.io`, and the `CNAME` file in this repo tells GitHub Pages to answer for that name. Don't delete the `CNAME` file.

Social-preview tags (`og:image`) in both HTML files use the full custom-domain URL.

## Editing

- Copy lives directly in `index.html`; edit it like any HTML file.
- Episode summaries, questions, readings, and assignment details for the season cards are in the `epData` JSON block near the end of the season section in `index.html`, and the cards themselves sit just above it.
- Episode text in `episodes.html` came from the Canvas module pages used in the course.

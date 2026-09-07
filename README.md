# Architecture is a team sport

An interactive presentation for the JEM-id Dev Cafe 2026 talk on **Architectural Katas + C4**: practising
software architecture as a team by having subgroups draw C1, C2 and C3 diagrams for a kata, with feedback
rounds in between. It is a web application, not a slide deck: an ordered track of 23 pages, each with a
presentation-style hero and an interactive part, plus deep-dive pages for the nine architecture styles of
*Fundamentals of Software Architecture, 2nd ed.* and a library of ten classic katas.

Live site: <https://vroegop.github.io/SoftwareArchitectureKatasTalk/>

## Run it

```bash
npm install
npm run dev        # http://localhost:5173/SoftwareArchitectureKatasTalk/
npm run build      # static site in dist/ (includes the 404.html fallback for GitHub Pages)
npm run preview    # serve the build on http://localhost:4173/SoftwareArchitectureKatasTalk/
```

The app makes no network requests at runtime, so `npm run preview` on the presenter laptop works without
venue Wi-Fi. The QR code on the title and closing pages always points at the public site.

## Present it

A clicker only has forward and back, so both are step-aware. Forward first gives the stage the room it needs
(the hero collapses to a title bar when the interactive part does not fit on the screen), then walks the page's
steps (persona, tabs, reveals, phases), then moves to the next page. The nine style deep-dives are part of the
walk after the gallery; the kata pages are not. Open the help panel (`?`) and press a clicker button to see
which key it sends.

| Key | Action |
|---|---|
| `PgDn` `→` `Space` `Enter` | forward: room for the stage, next step, next page |
| `PgUp` `←` `Backspace` | back: previous step, expand the hero, previous page in its final state |
| `Shift + →` / `Shift + ←` | jump a whole page, ignoring steps |
| `↓` | dive into the kata pages under the library |
| `↑` `Esc` | back to the parent page, or close a panel |
| `T` | table of contents with the run-of-show minutes |
| `N` | speaker notes (a side drawer, hidden by default) |
| `C` | round timer: presets for the C1 round, feedback, C2 round; keeps running across pages and reloads |
| `H` | collapse the hero so the interactive part gets the whole stage |
| `D` | theme: dark (projector), light (phones), system |
| `F` `F5` / `B` `.` / `?` | fullscreen / blank screen / key map, clicker test and settings |

Rehearsal bookmarks: widget state such as the selected persona, tab, matrix sort and compared styles lives in
the URL (`/star-ratings?compare=microservices,event-driven&sort=scalability`).

## Deploy it

`.github/workflows/deploy.yml` builds, tests and deploys to GitHub Pages on every push to `main`, and can be
run by hand from the Actions tab (`workflow_dispatch`) for any branch. One-time repository setting:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Change the content

Everything the audience reads is typed data under `src/content/`; no React knowledge needed.

| File | What |
|---|---|
| `main-pages.ts` | the 23 main pages: hero copy, speaker notes, minute markers |
| `styles/*.ts` | the nine styles: text, topology diagram, star ratings (`// VERIFY` against the book) |
| `katas.ts` | the kata library (Ted Neward / Neal Ford, attributed and linked) |
| `example/*.ts` | the Westhaven Automated Terminal case: kata card, C1/C2/C3, ADR, seed risks, decision data |
| `why.ts`, `shared-language.ts`, `katas-intro.ts`, `c4.ts`, `session.ts`, `laws.ts`, `characteristics-extra.ts`, `live.ts`, `playbook.ts`, `story.ts` | copy for the interactive parts |
| `references.ts`, `site.ts`, `timers.ts` | references, site metadata (author, canonical URL), timer presets |

Placeholders marked `[PLACEHOLDER]` (the story page, contact details) are meant to be filled in before the talk.

Diagrams are data too (`DiagramSpec` in `src/content/types.ts`): nodes with a kind, position and size in a
1000-wide coordinate space, and labelled edges. `src/diagrams/DiagramRenderer.tsx` renders them as
theme-aware SVG.

## Verify it

```bash
npm run check        # lint, typecheck, unit tests, build
npm run e2e          # Playwright: keyboard and clicker walks, overlays, timer and sticky persistence, deep links, no-scroll fit at 1080p
npm run screenshots  # every page at 1920×1080 dark and the main pages at phone size, light → e2e/screenshots/
```

## Credits and licence

Code and original content: MIT (see `LICENSE`). The architecture styles, characteristics and star ratings
follow *Fundamentals of Software Architecture, 2nd ed.* (Mark Richards and Neal Ford, O'Reilly); the C4
model is by Simon Brown (c4model.com); risk storming is by Simon Brown (riskstorming.com); the classic katas
were created by Ted Neward and are published by Neal Ford at nealford.com/katas, and are reproduced here in
lightly paraphrased form with attribution. The Westhaven Automated Terminal case is fictional.

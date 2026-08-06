# Personal site — issues & TODO (audit 2026-05-01)

Sources verified: Google Scholar profile (`dX3xKGsAAAAJ`), IOP Science DOI page, OpenAlex, IEEE Xplore, counterapi.dev live behaviour.

---

## P0 — Credibility (fix before anything else)

- [x] **Protective Coatings paper authorship was misrepresented.** Site listed `A. S. Ani, C. V. Srinivasa.`; the real author order on IOP is `C V Srinivasa, Allamaprabhu S Ani, B M Jyothi Prasad`. Now corrected to put Srinivasa first, you second, Jyothi Prasad third, with a "second author" disclosure note. **Confirm whether you want this paper kept at all** — if "the paper that doesn't actually belong to me" was this one (because you weren't the first author / weren't the principal contributor), say so and I'll remove it entirely.
- [x] **IEEE neural-operator paper REMOVED.** User confirmed 2026-05-01 that "Application of Neural Operators to the Phase Field Modeling of Brittle Fractures" (IEEE doc 10770952) is not his paper. Removed from `index.html` papers list. Memory updated so it never gets re-added.
- [x] **EFM publication date inconsistency.** Site now uses the ScienceDirect issue date everywhere: `2026-02-07` in JSON-LD and `Vol 332, Art 111778, 2026` in prose.
- [x] **EFM "verified" stamp was stale.** Changed the wording to `(screenshot captured 2026-04-30)` so the page no longer implies a fresh live re-check.

## P0 — Bugs

- [x] **Upvote button was broken.** counterapi v1 returns a `301 Moved Permanently` (without an `Access-Control-Allow-Origin` header) when the URL is missing a trailing slash. Browsers refuse to follow that redirect on a CORS request, so every fetch failed silently and the count stayed at "—". Fixed by appending `/` to all four endpoints (`…/visits/`, `…/visits/up/`, `…/<key>/`, `…/<key>/up/`) in `site.js`. Verified the corrected URL returns 200 + count.
- [x] **Live citation tracker added.** Uses [OpenAlex](https://openalex.org) (CORS-friendly, no auth, daily 100k call quota with the `mailto=` polite-pool). Shows `cited Nx · OpenAlex` next to indexed papers, cached in localStorage for 24 h. EFM review (W4416918453) and Protective Coatings (W3137675205) are wired up. The IEEE 2024 and aluminum-fatigue papers aren't in OpenAlex yet — they fall back to "not yet indexed · Scholar" with a link to your profile.

## P1 — Content / accuracy

- [x] **Citation source of truth.** Keep OpenAlex as the live displayed citation source rather than a manual Scholar override. Checked 2026-06-23: OpenAlex reports 3 citations for `W4416918453`; the site fetches OpenAlex live and labels the source.
- [x] **`assets/me.jpg` `alt` text** expanded to "Headshot of Allamaprabhu Ani, smiling, brown background" for better screen-reader context.
- [x] **EFM "first comprehensive review"** echo reduced. The About section now says "a widely read review of ML for fracture mechanics"; the stronger "field's first comprehensive review" phrasing remains only in the Papers section.
- [ ] **Bragspace dates** — "2026 Worshipful Company… Yeoman status" plus "2026 SST Dean's Award" both labelled 2026. The Tin Plate award was March, the Dean's was around April. If the section starts to fill up, distinguish month or quarter.
- [ ] **EPFL visit framing** — site says "in 2025 I spent some time at EPFL". That's vague; if it was a specific period (e.g., "summer 2025, six weeks"), it sounds more credible.

## P1 — JSON-LD (currently inconsistent with prose)

- [x] `ScholarlyArticle.datePublished` is `2026-02-07`, matching the ScienceDirect issue date for EFM Vol 332.
- [ ] `ScholarlyArticle.author` order — fine for the EFM paper. But Schema.org `author` array order should reflect the byline, so confirm: `Ani, Nakka, Subhash, Molinari, Ponnusami` is correct (it matches the EFM PDF cover).
- [ ] Add a second `ScholarlyArticle` block for the Protective Coatings paper if you keep it, with the **correct** author order (Srinivasa first). Otherwise remove the link.

## P2 — Performance / SEO

- [x] Added `<meta name="author" content="Allamaprabhu Ani">` via `_layouts/default.html` as a fallback for non-Google crawlers.
- [ ] Hero image `me.jpg` is 33 KB — fine. Phoenix favicon should be a 32×32 PNG plus a 180×180 apple-touch-icon for iOS home-screen pinning.
- [ ] `proof-img` (EFM screenshot) — confirm it's <800 KB. If larger, downscale to ~1200 px wide.
- [ ] Add `<link rel="canonical">` per page (jekyll-seo-tag should emit this; verify in dev).
- [ ] Sitemap and robots.txt — confirm `Sitemap:` line in robots.txt points to `/sitemap.xml`.

## P2 — UX / accessibility

- [ ] Custom site cursor: confirm focus rings still appear on Tab navigation (the cursor is decorative, but a keyboard user shouldn't lose the visible focus indicator).
- [ ] Landing-gate "click on me" caption — works, but on mobile (no hover) the photo is the only entry. Confirm the touch target is ≥44 px.
- [ ] Bucket upvote arrows: tab order. Ensure each `.upvote` button is reachable and Enter/Space activates it.
- [ ] Theme toggle: persist user choice across sessions (looks like it does via localStorage `theme` — confirm).
- [ ] `data-bg`, `data-accent`, `data-cursor` cycling on refresh — confirm `prefers-reduced-motion` users get a static, calm default.

## P3 — Nice-to-haves

- [ ] **Citation tracker enhancements**: currently OpenAlex-only. Could add a Scholar fallback via `serpapi` (paid) or the unofficial `scholarly` library (server-side, not browser). Not urgent — OpenAlex is the right primary source for an academic profile.
- [ ] **Tutorials section** — five placeholders, no real notebooks. Either ship one real notebook or hide the section until you do.
- [ ] **Blog post count** — only two posts. The "latest from the blog" block looks thin. Either drop the limit to "show latest 1" until there are 5+ posts, or commit to a monthly cadence.
- [ ] **`recommend` section** has 5 sites — three of them (Beltoforion, Jay Alammar, DrSimulate) are ML/sim community staples. Adding 2-3 fracture-specific sites would differentiate it from a generic "links page".
- [ ] **OpenGraph image** — set a custom `og:image` to your headshot or a research render so social shares look intentional.

## P3 — Deferred / open questions

- [ ] **Is the IEEE paper "yours" enough?** You're listed in the byline (per memory: with Nakka, Subhash, Ponnusami). If you want to drop it because you weren't the lead, say so. Otherwise the link to IEEE Xplore is now correct.
- [ ] **Aluminum fatigue paper coauthors** — only listed as "A. S. Ani, A. B. Deoghare." Per Scholar that's right. Confirm.
- [ ] **MechCADemy** — flagged in user master profile as **NOT yours**. Site doesn't reference it; good. Don't add it.

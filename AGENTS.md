# Intelios website

Static site (Astro → `dist/`) deployed to Cloudflare Pages. The design is a
Windows 8 Metro Start screen: flat square tiles, horizontal tile groups, light
typography, no gradients, no rounded corners, no shadows.

## Commands

- `npm run dev` — dev server (port 4323; override with `--port`).
- `npm run build` — static build to `dist/`. Fetches latest GitHub releases
  for public repos at build time (see below).
- `npm run check` — `astro check` type checking.
- `npm run preview` — serve the built site.

## Design rules (do not break)

- Flat solid colours only. No gradients, shadows, border-radius, or glass.
- Selawik (SIL OFL, self-hosted in `public/fonts/`) is the typeface — it is
  the Segoe UI stand-in. Large, light-weight headings; small body text.
- No slogans, taglines, or marketing phrases anywhere.
- `prefers-reduced-motion` must disable tile flips, fly-in, and tilt.
- Tile colours come from each app's own accent colour (see `src/apps/*.ts`).
- Layout is a horizontal canvas (`overflow-x` on `.start-canvas`/`.pano`)
  that collapses to a vertical stack under 700px.

## Adding a new app

1. Create `src/apps/<slug>.ts` exporting an `AppDefinition` (see
   `src/lib/app-schema.ts` for the schema).
2. Register it in `src/apps/index.ts` (the `apps` array) and add a
   `{ kind: 'app', app }` entry to the `Apps` tile group.
3. Drop assets in `src/assets/apps/<slug>/`: `icon.png` (or `.svg` —
   resolved automatically by `getIcon`) and screenshots in `shots/`
   (`1.png`, `2.png`, …). `astro:assets` generates optimized derivatives
   for the gallery, the live-tile faces, and the icon; the first
   screenshot becomes a tile face automatically.
4. If the app has a public GitHub repo with releases, set `github` —
   version, date, assets, and release notes are fetched at build time.
   `download.kind`: `'assets'` (per-platform binaries), `'source-zip'`
   (tag zipball), or `'none'`.

## Release data flow

- `src/lib/github.ts` fetches `releases/latest` per repo during
  `astro build`. Uses `GITHUB_TOKEN` env if present; unauthenticated
  (60 req/hr) is fine for 3 repos.
- On success it writes `src/lib/release-cache.json`; on failure it falls
  back to the cached entry, so deploys never break on API errors.
- **Rebuild on release**: create a Cloudflare Pages deploy hook, store it
  as `CLOUDFLARE_DEPLOY_HOOK` in each app repo, and add
  `docs/release-hook.yml` there as a workflow. `nightly-rebuild.yml` in
  this repo is the safety net.

## Cloudflare Pages settings

- Build command: `npm run build`
- Output: `dist`
- Node version: 20+ (set `NODE_VERSION` env if needed)
- Optional: `GITHUB_TOKEN` env var for authenticated API calls.

## Fonts

Selawik woff files are from fonts.cdnfonts.com (SIL OFL licensed font by
Microsoft, source at github.com/microsoft/Selawik). Weights: 300, 350
(semilight), 400, 600.

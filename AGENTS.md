# Intelios website

Static site (Astro → `dist/`) deployed to GitHub Pages from the repo
`Intelios/Intelios.github.io` — the user-site repo, so it serves at the
root https://intelios.github.io with no `base` path. The design is a
Windows 8 Metro Start screen: flat square tiles, horizontal tile groups, light
typography, no gradients, no rounded corners, no shadows.

## Commands

- `npm run dev` — dev server (port 4323; override with `--port`).
- `npm run build` — static build to `dist/`. Fetches latest GitHub releases
  for public repos at build time (see below).
- `npm run check` — `astro check` type checking.
- `npm run preview` — serve the built site.
- Deploys happen in CI (`.github/workflows/deploy.yml`) on push to `main`.

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
  `astro build`. Uses `GITHUB_TOKEN` env if present (CI passes the
  Actions-provided token automatically); unauthenticated (60 req/hr) is
  fine for 3 repos.
- On success it writes `src/lib/release-cache.json`; on failure it falls
  back to the cached entry, so deploys never break on API errors.
- **Rebuild on release**: add `docs/release-hook.yml` as a workflow in each
  app repo. It sends a `repository_dispatch` event (`rebuild`) to this
  repo, which triggers `deploy.yml`. Requires a fine-grained PAT
  (Contents: read/write on this repo only) stored as `SITE_REBUILD_TOKEN`
  in the app repo. The daily cron in `deploy.yml` is the safety net.

## GitHub Pages settings

- Repo Settings → Pages → Source must be **GitHub Actions**. Deploys go
  through `.github/workflows/deploy.yml` (`withastro/action@v3` builds,
  `actions/deploy-pages@v4` publishes).
- The workflow runs on push to `main`, on the daily `17 5 * * *` cron
  (refreshes release data), on manual dispatch, and on the `rebuild`
  `repository_dispatch` event sent by app repos.
- Node version is set via the action's `node-version` input (24, matching
  local dev — Astro 7 requires Node >= 22.12). The
  Actions-provided `GITHUB_TOKEN` is passed to the build, so GitHub API
  calls are authenticated.
- Served at https://intelios.github.io — the repo name is the user-site
  name, so the site lives at the root and no `base` path is needed.
- GitHub Pages does not support custom headers (`public/_headers` is
  gone); assets are cached ~10 minutes by default.

## Fonts

Selawik woff files are from fonts.cdnfonts.com (SIL OFL licensed font by
Microsoft, source at github.com/microsoft/Selawik). Weights: 300, 350
(semilight), 400, 600.

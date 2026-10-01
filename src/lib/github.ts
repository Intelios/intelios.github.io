import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Platform, ReleaseAsset, ReleaseBuild, ReleaseInfo } from './app-schema';

interface CacheEntry extends ReleaseInfo {
  fetchedAt: string;
}

type ReleaseCache = Record<string, CacheEntry>;

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  html_url: string;
  zipball_url: string;
  body?: string;
  draft: boolean;
  prerelease: boolean;
  assets: { name: string; browser_download_url: string; size: number }[];
}

const cachePath = join(process.cwd(), 'src', 'lib', 'release-cache.json');

function readCache(): ReleaseCache {
  if (!existsSync(cachePath)) return {};
  try {
    return JSON.parse(readFileSync(cachePath, 'utf-8')) as ReleaseCache;
  } catch {
    return {};
  }
}

let cache: ReleaseCache = readCache();
let cacheDirty = false;

const platformOrder: Platform[] = ['macos', 'windows', 'linux'];

/** Installer extensions only, so updater bundles, signatures and checksums are skipped. */
function platformFor(name: string): Platform | null {
  const n = name.toLowerCase();
  if (/\.(dmg|pkg)$/.test(n)) return 'macos';
  if (/\.(exe|msi|msix)$/.test(n)) return 'windows';
  if (/\.(appimage|deb|rpm|flatpak)$/.test(n)) return 'linux';
  return null;
}

/** The first installer for each platform, in platformOrder. */
function installers(release: GitHubRelease): ReleaseAsset[] {
  const byPlatform = new Map<Platform, ReleaseAsset>();
  for (const a of release.assets) {
    const platform = platformFor(a.name);
    if (platform && !byPlatform.has(platform)) {
      byPlatform.set(platform, { name: a.name, url: a.browser_download_url, size: a.size, platform });
    }
  }
  return platformOrder.flatMap((p) => byPlatform.get(p) ?? []);
}

/** Fetch the latest GitHub release for a repo at build time, plus the newest
 *  release that has installers attached (not every release is built).
 *  Uses GITHUB_TOKEN when set. On failure, falls back to the
 *  committed release-cache.json entry (or null if none). */
export async function getLatestRelease(owner: string, repo: string): Promise<ReleaseInfo | null> {
  const key = `${owner}/${repo}`;
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'intelios-site-build',
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${key}/releases?per_page=100`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status} for ${key}`);
    const releases = ((await res.json()) as GitHubRelease[]).filter((r) => !r.draft && !r.prerelease);
    const latest = releases[0];
    if (!latest) throw new Error(`no published releases for ${key}`);

    let build: ReleaseBuild | undefined;
    for (const r of releases) {
      const assets = installers(r);
      if (assets.length > 0) {
        build = { version: r.tag_name, assets };
        break;
      }
    }

    const info: ReleaseInfo = {
      version: latest.tag_name,
      date: latest.published_at.slice(0, 10),
      htmlUrl: latest.html_url,
      zipballUrl: latest.zipball_url,
      notes: latest.body ?? '',
      build,
    };

    cache = { ...cache, [key]: { ...info, fetchedAt: new Date().toISOString() } };
    cacheDirty = true;
    return info;
  } catch (err) {
    const cached = cache[key];
    if (cached) {
      console.warn(`[github] ${key}: fetch failed (${String(err)}), using cached release ${cached.version}`);
      return cached;
    }
    console.warn(`[github] ${key}: fetch failed (${String(err)}), no cache available`);
    return null;
  }
}

/** Persist refreshed entries back into the committed cache file. */
export function flushReleaseCache(): void {
  if (!cacheDirty) return;
  writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n');
}

export async function getReleasesFor(apps: { github?: { owner: string; repo: string } }[]): Promise<Map<string, ReleaseInfo>> {
  const map = new Map<string, ReleaseInfo>();
  for (const app of apps) {
    if (!app.github) continue;
    const key = `${app.github.owner}/${app.github.repo}`;
    const info = await getLatestRelease(app.github.owner, app.github.repo);
    if (info) map.set(key, info);
  }
  flushReleaseCache();
  return map;
}

export function releaseKey(app: { github?: { owner: string; repo: string } }): string | null {
  return app.github ? `${app.github.owner}/${app.github.repo}` : null;
}

export function formatSize(bytes: number): string {
  if (bytes >= 1 << 30) return `${(bytes / (1 << 30)).toFixed(1)} GB`;
  if (bytes >= 1 << 20) return `${(bytes / (1 << 20)).toFixed(1)} MB`;
  if (bytes >= 1 << 10) return `${Math.round(bytes / (1 << 10))} KB`;
  return `${bytes} B`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export const platformLabel: Record<Platform, string> = {
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
};

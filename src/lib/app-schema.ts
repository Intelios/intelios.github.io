export type Platform = 'macos' | 'windows' | 'linux';
export type TileSize = 'small' | 'medium' | 'wide' | 'large';
export type AppStatus = 'released' | 'in-development';

export interface FeatureTile {
  title: string;
  detail?: string;
}

export type DownloadSpec =
  | { kind: 'assets'; note?: string }
  | { kind: 'source-zip'; label?: string; note?: string }
  | { kind: 'none'; note?: string };

export interface AppDefinition {
  slug: string;
  name: string;
  /** Flat tile colour. */
  color: string;
  /** Accent for the app's hub page; defaults to `color` — override when the tile colour is too dark to read as an accent. */
  pageAccent?: string;
  /** Text colour on the tile colour. */
  text: 'light' | 'dark';
  tile: TileSize;
  /** Inline SVG path data (24x24 stroke grid) used when no icon image exists
   *  (icons are resolved by convention from src/assets/apps/<slug>/icon.*). */
  glyph?: string;
  description: string;
  status: AppStatus;
  statusNote?: string;
  platforms: Platform[];
  license?: string;
  github?: { owner: string; repo: string };
  download: DownloadSpec;
  features: FeatureTile[];
}

export interface LinkTile {
  kind: 'link';
  name: string;
  color: string;
  text: 'light' | 'dark';
  tile: TileSize;
  href: string;
  glyph?: string;
  /** Render the glyph with fill instead of stroke (e.g. the GitHub mark). */
  glyphFill?: boolean;
  external?: boolean;
}

export type StartTile = { kind: 'app'; app: AppDefinition } | LinkTile;

export interface TileGroup {
  name: string;
  tiles: StartTile[];
}

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
  platform: Platform | 'other';
}

export interface ReleaseInfo {
  version: string;
  date: string;
  htmlUrl: string;
  zipballUrl: string;
  notes: string;
  assets: ReleaseAsset[];
}

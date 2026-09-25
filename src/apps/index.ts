import type { AppDefinition, TileGroup } from '../lib/app-schema';
import { mediaLogger } from './media-logger';
import { wackChatter } from './wackchatter';
import { wackCode } from './wackcode';
import { tokenTrail } from './tokentrail';

export const apps: AppDefinition[] = [mediaLogger, wackChatter, wackCode, tokenTrail];

export const appsBySlug = new Map(apps.map((app) => [app.slug, app]));

const githubGlyph =
  'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z';

const infoGlyph = 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM10 11h4v7h-4v-7Z';

export const groups: TileGroup[] = [
  {
    name: 'Apps',
    tiles: [
      { kind: 'app', app: mediaLogger },
      { kind: 'app', app: wackChatter },
      { kind: 'app', app: tokenTrail },
      { kind: 'app', app: wackCode },
    ],
  },
  {
    name: 'More',
    tiles: [
      {
        kind: 'link',
        name: 'GitHub',
        color: '#2b3137',
        text: 'light',
        tile: 'medium',
        href: 'https://github.com/Intelios',
        glyph: githubGlyph,
        glyphFill: true,
        external: true,
      },
      {
        kind: 'link',
        name: 'About',
        color: '#0078d7',
        text: 'light',
        tile: 'medium',
        href: '/about',
        glyph: infoGlyph,
        glyphFill: true,
      },
    ],
  },
];

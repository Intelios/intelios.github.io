import type { AppDefinition } from '../lib/app-schema';

export const mediaLogger: AppDefinition = {
  slug: 'media-logger',
  name: 'Media Logger',
  color: '#5E35B1',
  text: 'light',
  tile: 'wide',
  description:
    'A desktop media journal for people who want more than a watchlist. Track what you finish, rate it, save artwork locally, organize it into collections, crown yearly winners, plan what\u2019s next with a backlog, and explore your library through filters, profiles, deep stats, and animated year-in-review slideshows. Everything lives in a local SQLite database \u2014 no account, no cloud, no ads.',
  status: 'released',
  platforms: ['macos', 'windows'],
  license: 'Source available',
  github: { owner: 'Intelios', repo: 'Media-Logger' },
  download: {
    kind: 'source-zip',
    note: 'Desktop app built from source. Requires Node.js, Rust, and the Tauri prerequisites \u2014 see the README for build instructions.',
  },
  features: [
    { title: 'Dashboard', detail: 'Totals, average rating, a featured pick, recent completions, and On This Day.' },
    { title: 'Year View', detail: 'Browse any year as a focused shelf with presets and filters.' },
    { title: 'Search', detail: 'The whole collection, filtered by type, platform, and people at once.' },
    { title: 'Stats', detail: 'Charts, a completion heatmap, score trends, and top genres as rearrangeable widgets.' },
    { title: 'Profiles', detail: 'Studios, artists, authors, and franchises become navigable hubs.' },
    { title: 'Collections', detail: 'Hand-picked shelves with drag-and-drop ordering and named Eras.' },
    { title: 'Awards', detail: 'Yearly award categories with templates and a winner history.' },
    { title: 'Backlog', detail: 'Planning and in-progress lanes for what\u2019s next.' },
    { title: 'Review', detail: 'Animated year-in-review slideshows for any year or month.' },
    { title: 'AI Access', detail: 'An optional local, read-only MCP server for AI clients on the same machine.' },
  ],
};

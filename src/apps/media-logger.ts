import type { AppDefinition } from '../lib/app-schema';

export const mediaLogger: AppDefinition = {
  slug: 'media-logger',
  name: 'Media Logger',
  color: '#5E35B1',
  text: 'light',
  tile: 'wide',
  description:
    'This is a media logging application covering various genres and the project I\'ve worked on the longest. It\'s something I personally use every single day to track the shows I watch, the games I play and the things I intend to watch in the future. It\'s got stats, collections, profiles auto-generated for you and so much more. I really am proud of this project, so I hope you\'ll give it a try and love it as much as I do. Everything is offline, and the few parts of the app that do connect online are all optional.',
  status: 'released',
  platforms: ['macos', 'windows'],
  license: 'Source available',
  github: { owner: 'Intelios', repo: 'Media-Logger' },
  download: {
    kind: 'assets',
    note: 'The macOS build is for Apple Silicon and isn\u2019t notarized: if macOS blocks the first launch, open System Settings \u203a Privacy & Security and choose Open Anyway. Windows may show a SmartScreen prompt; choose More info \u203a Run anyway. Building from source requires Node.js, Rust, and the Tauri prerequisites; see the README.',
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

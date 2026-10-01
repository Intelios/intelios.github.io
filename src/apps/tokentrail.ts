import type { AppDefinition } from '../lib/app-schema';

export const tokenTrail: AppDefinition = {
  slug: 'tokentrail',
  name: 'TokenTrail',
  color: '#ff4d00',
  text: 'light',
  tile: 'medium',
  description:
    'One dashboard for all the AI tokens you use across supported apps. TokenTrail reads the usage logs your AI tools already write on your machine and turns them into data you can visualise, so you can happily clear those tools\' cache files and not worry about losing your usage information, as TokenTrail keeps its own copy, safe and secure from cache wipes. TokenTrail supports countless apps. Free to use & fully open source.',
  status: 'released',
  platforms: ['macos', 'windows'],
  license: 'MIT',
  github: { owner: 'Intelios', repo: 'TokenTrail' },
  download: {
    kind: 'assets',
    note: 'The macOS build is for Apple Silicon and isn\u2019t notarized: if macOS blocks the first launch, open System Settings \u203a Privacy & Security and choose Open Anyway. Windows may show a SmartScreen prompt; choose More info \u203a Run anyway. Building from source requires Bun and Rust; see the README.',
  },
  features: [
    { title: 'Overview', detail: 'Totals, sessions, active-day streak, cache hit rate, and spend at a glance.' },
    { title: 'Models & Families', detail: 'Usage and cost broken down per model or model family.' },
    { title: 'Trends', detail: 'How your usage moves day to day.' },
    { title: 'Projects', detail: 'Which projects consume the most tokens.' },
    { title: 'Activity', detail: 'A live feed of recent sessions as they sync in.' },
    { title: 'Supported tools', detail: 'Codex, Claude Code, Devin CLI, OpenCode, Gemini CLI, WackChatter, and more.' },
    { title: 'Private by design', detail: 'Local only, read-only access to harness files, exportable data.' },
  ],
};

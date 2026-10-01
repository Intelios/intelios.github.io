import type { AppDefinition } from '../lib/app-schema';

const terminalGlyph = 'M4 17l6-5-6-5M12 19h8';

export const wackCode: AppDefinition = {
  slug: 'wackcode',
  name: 'WackCode',
  color: '#14160f',
  pageAccent: '#c2ee4a',
  text: 'light',
  pageAccentText: 'dark',
  tile: 'wide',
  glyph: terminalGlyph,
  description:
    'A local macOS desktop interface for the Pi coding agent, built with Tauri, React, and Rust. Named connections and subscription sign-in, concurrent task workers, persistent sessions, optional Git worktrees, and a full Changes panel for reviewing, commenting, committing, and opening pull requests, with a polished UI on top of a proven harness.',
  status: 'released',
  platforms: ['macos'],
  license: 'AGPL-3.0',
  github: { owner: 'Intelios', repo: 'wackcode' },
  download: {
    kind: 'assets',
    note: 'For Apple Silicon Macs on macOS 12 or later. The app isn\u2019t notarized: if macOS blocks the first launch, open System Settings \u203a Privacy & Security and choose Open Anyway. Building from source requires Rust, Xcode Command Line Tools, Node.js 24, and pnpm; see the README.',
  },
  features: [
    { title: 'Pi harness', detail: 'A trusted coding agent under the hood, with persistent session trees.' },
    { title: 'Connections', detail: 'OpenAI-compatible endpoints plus subscription sign-in for Codex, Copilot, and more.' },
    { title: 'Steering', detail: 'Enter steers a running agent; Alt-Enter queues for after the run.' },
    { title: 'Plan mode', detail: 'Read-only planning with approval, plus Ultra Plan interviews.' },
    { title: 'Changes panel', detail: 'Staged and working-tree diffs, hunk discard, inline comments, commit, push, PR.' },
    { title: 'Checkpoints', detail: 'File snapshots before every prompt, restorable and undoable.' },
    { title: 'Sub-agents', detail: 'Scout, Reviewer, and Worker roles with their own context windows.' },
    { title: 'Skills & MCP', detail: 'Agent Skills standard plus stdio and HTTP MCP servers.' },
    { title: 'Fork & rewind', detail: 'Retry, edit, rewind, and fork conversations as session trees.' },
    { title: 'Themes', detail: 'Preset and custom themes, background images, and Liquid Glass.' },
  ],
};

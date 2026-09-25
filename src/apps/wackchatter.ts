import type { AppDefinition } from '../lib/app-schema';

const messagesGlyph =
  'M21 11.5a8.4 8.4 0 0 1-9 8.3 9 9 0 0 1-3.7-.8L3 21l1.9-4.6A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z';

export const wackChatter: AppDefinition = {
  slug: 'wackchatter',
  name: 'WackChatter',
  color: '#c2ee4a',
  text: 'dark',
  tile: 'wide',
  glyph: messagesGlyph,
  description:
    'A chat frontend for cloud LLMs with character cards, lorebooks, personas, and long-term story memory, running locally in your browser. Uses your own API keys; nothing is sent anywhere except the model you pick. Your existing SillyTavern character cards and presets work here without conversion.',
  status: 'released',
  platforms: ['macos', 'windows', 'linux'],
  license: 'AGPL-3.0',
  github: { owner: 'Intelios', repo: 'wackchatter' },
  download: {
    kind: 'source-zip',
    note: 'Requires Bun. Unzip, run start.sh (Start.bat on Windows) \u2014 the launcher handles dependencies, builds the app, and opens your browser.',
  },
  features: [
    { title: 'Chat', detail: 'Multiple chats per character, swipes, branching, regenerate, and a restorable trash bin.' },
    { title: 'Characters', detail: 'SillyTavern-compatible V1/V2/V3 cards, folders, PNG and JSON import/export.' },
    { title: 'Character Creator Studio', detail: 'Full card editor with live token counts, a context budget meter, and real-time linting.' },
    { title: 'Character Co-Creator', detail: 'An AI design partner that drafts fields you file into the card with one click.' },
    { title: 'Prompt Manager', detail: 'Reorder prompts, depth injections, and marker prompts with a real tokenizer.' },
    { title: 'Lorebooks', detail: 'World Info books with a full activation engine \u2014 keywords, regex, budget, groups.' },
    { title: 'Memory Nexus', detail: 'Tracks characters, places, events, and relationships with a graph view.' },
    { title: 'Model Arena', detail: 'Blind side-by-side comparisons between models.' },
    { title: 'Guided Generations', detail: 'Steer replies with one-shot or per-chat guides.' },
    { title: 'Personas', detail: 'Personas with avatars, bound per-chat, remembered per message.' },
  ],
};

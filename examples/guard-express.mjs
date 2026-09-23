import { createMockServer, guard } from '../dist/index.js';

const server = createMockServer(
  {
    tools: [
      {
        name: 'read_note',
        description: 'Reads a note by id.',
        inputSchema: { type: 'object', properties: { id: { type: 'string' } } },
      },
      {
        name: 'delete_everything',
        description: 'Dangerous tool, blocked by guard.',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  },
  {
    read_note: (args) => `note:${String(args.id ?? 'default')}`,
    delete_everything: () => 'never runs',
  },
);

const safe = guard(server, {
  timeoutMs: 3000,
  allowTools: ['read_note'],
  maxBytes: 64 * 1024,
});

console.log((await safe.callTool('read_note', { id: '42' })).content[0]?.text);

try {
  await safe.callTool('delete_everything', {});
} catch (err) {
  console.log('blocked as expected:', err instanceof Error ? err.message : err);
}

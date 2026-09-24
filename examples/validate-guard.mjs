// Full chain: validate args -> guarded call -> redacted output.
import { createMockServer, guard, validateArgs } from '../dist/index.js';

const tools = [
  {
    name: 'read_note',
    description: 'Reads a note by id.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string', minLength: 1 } },
    },
  },
];

const mock = createMockServer(
  { tools },
  { read_note: (args) => `note ${String(args.id)} — contact bob@example.com` },
);

const tool = tools[0];
const bad = validateArgs(tool, {});
console.log('invalid blocked:', bad.valid, JSON.stringify(bad.failures));

const good = validateArgs(tool, { id: '42' });
console.log('valid:', good.valid);

const safe = guard(mock, { timeoutMs: 3000, allowTools: ['read_note'], redact: true });
const res = await safe.callTool('read_note', { id: '42' });
console.log('guarded+redacted:', res.content[0]?.text);

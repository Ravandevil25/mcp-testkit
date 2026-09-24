// SDK compat: feed real SDK tool definitions into the testkit.
// Pattern (no hard dep): extract { name, description, inputSchema }
// from your @modelcontextprotocol/sdk Server and validate them here.
import { contractTest, validateArgs } from '../dist/index.js';

// Example: what your SDK server's listTools handler returns.
const sdkTools = [
  {
    name: 'get_time',
    description: 'Returns the current time.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'read_note',
    description: 'Reads a note by id.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string' } },
    },
  },
];

const report = await contractTest({ tools: sdkTools });
console.log('contract passed:', report.passed);
if (!report.passed) console.log(report.failures);

const good = validateArgs(sdkTools[1], { id: '42' });
console.log('valid args:', good.valid);

const bad = validateArgs(sdkTools[1], {});
console.log('invalid args:', bad.valid, JSON.stringify(bad.failures));

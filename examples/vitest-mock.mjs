import { contractTest, createMockServer, guard } from '../dist/index.js';

const mock = createMockServer(
  {
    tools: [
      {
        name: 'get_time',
        description: 'Returns the current time.',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  },
  { get_time: () => new Date().toISOString() },
);

const report = await contractTest(mock.definition);
console.log('contract passed:', report.passed);

const res = await mock.callTool('get_time', {});
console.log('mock result:', res.content[0]?.text);

const safe = guard(mock, { timeoutMs: 2000, allowTools: ['get_time'] });
const guarded = await safe.callTool('get_time', {});
console.log('guarded result:', guarded.content[0]?.text);

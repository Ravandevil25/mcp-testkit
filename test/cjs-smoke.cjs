// CJS smoke test: verifies the dual-format require() entrypoint.
// Run after build: node test/cjs-smoke.cjs
const assert = require('node:assert/strict');

async function main() {
  const { createMockServer, contractTest, validateArgs, guard } = require('../dist/index.cjs');

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
    { get_time: () => 'noon' },
  );
  const res = await mock.callTool('get_time', {});
  assert.equal(res.content[0].text, 'noon');

  const report = await contractTest(mock.definition);
  assert.equal(report.passed, true);

  const v = validateArgs(mock.definition.tools[0], {});
  assert.equal(v.valid, true);

  const safe = guard(mock, { allowTools: ['get_time'] });
  const g = await safe.callTool('get_time', {});
  assert.equal(g.content[0].text, 'noon');

  console.log('cjs smoke: OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

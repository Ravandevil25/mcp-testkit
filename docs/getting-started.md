# Getting Started

## Install

```bash
npm install mcp-works
```

Works with ESM (`import`) and CommonJS (`require('mcp-works')`). Node 20+.

## 5-minute quickstart

```ts
import { contractTest, createMockServer, guard, validateArgs } from 'mcp-works';

const mock = createMockServer(
  { tools: [{ name: 'get_time', description: 'Returns time.', inputSchema: { type: 'object', properties: {} } }] },
  { get_time: () => new Date().toISOString() },
);

const report = await contractTest(mock.definition);
console.log(report.passed); // true

const safe = guard(mock, { timeoutMs: 5000, allowTools: ['get_time'], redact: true });
const res = await safe.callTool('get_time', {});
console.log(res.content[0]?.text);
```

## Honest scope

Definition-level testing layer, companion to the official MCP SDK.
Transport (stdio/SSE, protocol messages) stays with the SDK.

# mcp-testkit

Mock, contract-test and guard MCP (Model Context Protocol) tool servers in Vitest with zero hassle.

[![npm version](https://img.shields.io/npm/v/mcp-testkit)](https://www.npmjs.com/package/mcp-testkit)
[![CI](https://github.com/Ravandevil25/mcp-testkit/actions/workflows/test.yml/badge.svg)](https://github.com/Ravandevil25/mcp-testkit/actions)
[![license](https://img.shields.io/npm/l/mcp-testkit)](./LICENSE)

The official MCP SDK ships transport but no testing story. `mcp-testkit` fills that gap with three small tools: an in-process mock server, a contract checker, and a safety guard.

## Install in 15 seconds

```bash
npm install mcp-testkit
```

```ts
import { contractTest, createMockServer, guard } from 'mcp-testkit';

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
console.log(report.passed); // true

const safe = guard(mock, { timeoutMs: 5000, allowTools: ['get_time'] });
const res = await safe.callTool('get_time', {});
console.log(res.content[0]?.text);
```

## Before / after

| Hand-rolled | With mcp-testkit |
|---|---|
| Spin up a real server per test (slow, flaky) | `createMockServer` in-process, 2 lines |
| Wrong input crashes the agent at runtime | `contractTest` catches missing description/schema upfront |
| Agent calls the wrong tool or hangs | `guard` allowlists tools, enforces timeout + output cap |

## API

### `createMockServer(definition, handlers, options?)`
In-process mock. `callTool` returns `{ content, isError }` — unknown tools and thrown handler errors come back as `isError: true` instead of crashing. `options.latencyMs` simulates slow tools. Respects `AbortSignal`.

### `contractTest(definition)`
Returns `{ passed, failures[] }`. Checks: tools array shape, non-empty name/description, `inputSchema` object with `type: 'object'`, unique names.

### `guard(server, options?)`
Wraps a server with `{ timeoutMs = 5000, allowTools?, maxBytes = 1MB }`. Denied tools throw `TOOL_DENIED`, slow tools throw `TIMEOUT`, oversized output throws `OUTPUT_TOO_LARGE`. All errors are `McpTestkitError` with a `.code`.

## Examples

```bash
node examples/vitest-mock.mjs
node examples/guard-express.mjs
```

## Roadmap

- v0.2: `npm create` scaffolder, PII-scan guard option
- v0.3: OTel tracing, registry audit metadata

## License

MIT

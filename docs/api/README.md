**mcp-works**

***

# mcp-works

Mock, contract-test, validate and guard MCP (Model Context Protocol) tool servers in Vitest with zero hassle.

[![npm version](https://img.shields.io/npm/v/mcp-works)](https://www.npmjs.com/package/mcp-works)
[![docs](https://img.shields.io/badge/docs-mcp--works-blue)](https://ravandevil25.github.io/mcp-works/)
[![CI](https://github.com/Ravandevil25/mcp-works/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/Ravandevil25/mcp-works/actions)
[![license](https://img.shields.io/npm/l/mcp-works)](./LICENSE)

📚 **Full docs: https://ravandevil25.github.io/mcp-works/** — guides, API reference, migration, FAQ.

The official MCP SDK ships transport but no testing story. `mcp-works` fills that gap with four small tools: an in-process mock server, a contract checker, an arg validator, and a safety guard.

## Install in 15 seconds

```bash
npm install mcp-works
```

```ts
import { contractTest, createMockServer, guard, validateArgs } from 'mcp-works';

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

| Hand-rolled | With mcp-works |
|---|---|
| Spin up a real server per test (slow, flaky) | `createMockServer` in-process, 2 lines |
| Wrong input crashes the agent at runtime | `contractTest` catches missing description/schema upfront |
| Agent calls the wrong tool or hangs | `guard` allowlists tools, enforces timeout + output cap |

## API

### `createMockServer(definition, handlers, options?)`
In-process mock. `callTool` returns `{ content, isError }` — unknown tools and thrown handler errors come back as `isError: true` instead of crashing. `options.latencyMs` simulates slow tools. Respects `AbortSignal`.

### `contractTest(definition)`
Returns `{ passed, failures[] }`. Checks: tools array shape, non-empty name/description, `inputSchema` object with `type: 'object'`, unique names.

### `validateArgs(tool, args)`
Zero-dependency runtime check of args against the tool's `inputSchema`. Returns `{ valid, failures[] }` with dotted paths (`filter.tag`, `tags[1]`). Checks: `required`, `type` (string/number/integer/boolean/array/object), `enum`, string constraints (`minLength`, `maxLength`, `pattern`), number constraints (`minimum`, `maximum`), arrays (`items` type, `minItems`, `maxItems`), and nested objects.

```ts
const check = validateArgs(tool, { id: '42' });
if (!check.valid) console.log(check.failures);
```

### `guard(server, options?)`
Wraps any server with a `callTool` method (mocks, SDK adapters — not just `createMockServer` output).

| Option | Default | Meaning |
|---|---|---|
| `timeoutMs` | `5000` | Abort slow calls; throws `TIMEOUT` |
| `allowTools` | all | Deny-list everything else; throws `TOOL_DENIED` |
| `maxBytes` | `1048576` (1MB) | Cap output size; throws `OUTPUT_TOO_LARGE` |
| `redact` | off | `true` = redact emails, API keys, card-like numbers; `RegExp[]` = custom patterns (replaced with `[redacted]`) |

All errors are `McpWorksError` with a `.code` (`TOOL_DENIED`, `TIMEOUT`, `OUTPUT_TOO_LARGE`, `ABORTED`, `INVALID_TOOL`). `McpTestkitError` remains as a deprecated alias.

## Migrating from `@sauravsk2507/mcp-testkit`
```bash
npm uninstall @sauravsk2507/mcp-testkit && npm install mcp-works
```
Then replace the import specifier: `@sauravsk2507/mcp-testkit` → `mcp-works`. API is identical; optionally rename `McpTestkitError` → `McpWorksError`.

## Examples

```bash
node examples/vitest-mock.mjs
node examples/guard-express.mjs
node examples/sdk-compat.mjs
```

## Roadmap

- v0.3: PII-redact guard option, richer `validateArgs` (arrays, string/number constraints), `McpWorksError` branding
- v0.4: `npm create` scaffolder, OTel tracing, registry audit metadata

## FAQ

**Does this replace the official MCP SDK?**
No. The SDK owns transport (stdio/SSE, protocol messages). This package owns the testing layer: mock, contract checks, arg validation, guard.

**How do I use it with a real SDK server?**
Pull the tool definitions out of your SDK `Server` and feed them to `contractTest` / `validateArgs`. See `examples/sdk-compat.mjs`.

**Does it work with plain Node test runner or Jest?**
Yes. Only the docs use Vitest. `createMockServer`, `contractTest`, `validateArgs` and `guard` are plain async functions with zero runtime deps.

**How do I import from CommonJS?**
`const { createMockServer } = require('mcp-works');` — dual ESM+CJS, verified by `attw` and a CJS smoke test in CI.

**How do I catch guard errors?**
All guard errors are `McpTestkitError` with a `.code`: `TOOL_DENIED`, `TIMEOUT`, `OUTPUT_TOO_LARGE`. Switch on `code` for retries.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `contractTest` passes but bad args crash at runtime | Contract checks shape, not values | Add `validateArgs(tool, args)` before `callTool` |
| `TIMEOUT` on every call | `timeoutMs` lower than handler latency | Raise `timeoutMs` or pass an `AbortSignal` with a longer deadline |
| `OUTPUT_TOO_LARGE` | Default 1MB cap exceeded | Set `maxBytes` explicitly |
| Types resolve to ESM under `require` | Stale 0.1.0 install | Upgrade to latest; `require` types ship as `.d.cts` |

## License

MIT

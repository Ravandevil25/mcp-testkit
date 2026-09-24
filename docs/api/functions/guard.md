[**mcp-works**](../README.md)

***

[mcp-works](../globals.md) / guard

# Function: guard()

> **guard**(`server`, `options?`): [`GuardedServer`](../interfaces/GuardedServer.md)

Defined in: [src/guard.ts:67](https://github.com/Ravandevil25/mcp-works/blob/995f170a537e87f84d640086caf06c46fb45f7f0/src/guard.ts#L67)

Wrap any `{ callTool }` server with safety rails: tool allowlist, timeout,
output-size cap, and optional PII redaction.

## Parameters

### server

[`CallableServer`](../interfaces/CallableServer.md)

Any server exposing `callTool` (mocks, SDK adapters).

### options?

[`GuardOptions`](../interfaces/GuardOptions.md)

`timeoutMs` (default 5000), `allowTools`, `maxBytes`
(default 1MB), `redact` (`true` for default PII patterns or custom `RegExp[]`).

## Returns

[`GuardedServer`](../interfaces/GuardedServer.md)

Guarded server with the same `callTool` shape.

## Throws

[McpWorksError](../classes/McpWorksError.md) `TOOL_DENIED` for blocked tools,
`TIMEOUT` for slow calls, `OUTPUT_TOO_LARGE` for oversized output.

## Example

```ts
const safe = guard(server, { timeoutMs: 3000, allowTools: ['read_note'], redact: true });
```

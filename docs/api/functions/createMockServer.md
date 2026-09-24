[**mcp-works**](../README.md)

***

[mcp-works](../globals.md) / createMockServer

# Function: createMockServer()

> **createMockServer**(`def`, `handlers`, `options?`): [`MockServer`](../interfaces/MockServer.md)

Defined in: [src/mock.ts:40](https://github.com/Ravandevil25/mcp-works/blob/6ad34f97ce33eb04f1f7179eccc7ba8994d2d3d6/src/mock.ts#L40)

Create an in-process mock MCP server for tests. No live server needed.

## Parameters

### def

[`ServerDefinition`](../interfaces/ServerDefinition.md)

Server definition with tool list.

### handlers

`Record`\<`string`, [`ToolHandler`](../type-aliases/ToolHandler.md)\>

Handler per tool name; thrown errors become `isError` results.

### options?

[`MockOptions`](../interfaces/MockOptions.md)

Optional latency simulation (`latencyMs`).

## Returns

[`MockServer`](../interfaces/MockServer.md)

Mock server with `listTools` and `callTool`.

## Throws

[McpWorksError](../classes/McpWorksError.md) with code `INVALID_TOOL` if a tool name is empty.

## Example

```ts
const mock = createMockServer({ tools }, { get_time: () => 'noon' });
const res = await mock.callTool('get_time', {});
```

[**mcp-works**](../README.md)

***

[mcp-works](../globals.md) / validateArgs

# Function: validateArgs()

> **validateArgs**(`tool`, `args`): [`ArgReport`](../interfaces/ArgReport.md)

Defined in: [src/validate.ts:113](https://github.com/Ravandevil25/mcp-works/blob/995f170a537e87f84d640086caf06c46fb45f7f0/src/validate.ts#L113)

Validate args against a tool's `inputSchema` at runtime. Zero dependencies.
Checks `required`, `type`, `enum`, string/number constraints, arrays, and
nested objects (dotted paths like `filter.tag`, `tags[1]`).

## Parameters

### tool

[`ToolDefinition`](../interfaces/ToolDefinition.md)

Tool definition carrying `inputSchema`.

### args

`unknown`

Args to validate (must be an object).

## Returns

[`ArgReport`](../interfaces/ArgReport.md)

`{ valid, failures[] }` — each failure has `path` and `message`.

## Example

```ts
const check = validateArgs(tool, { id: '42' });
if (!check.valid) console.log(check.failures);
```

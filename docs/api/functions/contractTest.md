[**mcp-works**](../README.md)

***

[mcp-works](../globals.md) / contractTest

# Function: contractTest()

> **contractTest**(`def`): `Promise`\<[`ContractReport`](../interfaces/ContractReport.md)\>

Defined in: [src/contract.ts:25](https://github.com/Ravandevil25/mcp-works/blob/995f170a537e87f84d640086caf06c46fb45f7f0/src/contract.ts#L25)

Check a server definition for contract errors without running anything.
Verifies tools-array shape, non-empty unique names, non-empty
descriptions, and object `inputSchema` per tool.

## Parameters

### def

[`ServerDefinition`](../interfaces/ServerDefinition.md)

Server definition to check.

## Returns

`Promise`\<[`ContractReport`](../interfaces/ContractReport.md)\>

`{ passed, failures[] }` — each failure has `tool`, `check`, `message`.

## Example

```ts
const report = await contractTest(mock.definition);
if (!report.passed) console.log(report.failures);
```

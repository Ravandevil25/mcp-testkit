[**mcp-works**](../README.md)

***

[mcp-works](../globals.md) / MockServer

# Interface: MockServer

Defined in: [src/mock.ts:11](https://github.com/Ravandevil25/mcp-works/blob/995f170a537e87f84d640086caf06c46fb45f7f0/src/mock.ts#L11)

## Extends

- [`CallableServer`](CallableServer.md)

## Properties

### definition

> `readonly` **definition**: [`ServerDefinition`](ServerDefinition.md)

Defined in: [src/mock.ts:12](https://github.com/Ravandevil25/mcp-works/blob/995f170a537e87f84d640086caf06c46fb45f7f0/src/mock.ts#L12)

## Methods

### callTool()

> **callTool**(`name`, `args?`, `signal?`): `Promise`\<[`CallResult`](CallResult.md)\>

Defined in: [src/types.ts:44](https://github.com/Ravandevil25/mcp-works/blob/995f170a537e87f84d640086caf06c46fb45f7f0/src/types.ts#L44)

#### Parameters

##### name

`string`

##### args?

`Record`\<`string`, `unknown`\>

##### signal?

`AbortSignal`

#### Returns

`Promise`\<[`CallResult`](CallResult.md)\>

#### Inherited from

[`CallableServer`](CallableServer.md).[`callTool`](CallableServer.md#calltool)

***

### listTools()

> **listTools**(): [`ToolDefinition`](ToolDefinition.md)[]

Defined in: [src/mock.ts:13](https://github.com/Ravandevil25/mcp-works/blob/995f170a537e87f84d640086caf06c46fb45f7f0/src/mock.ts#L13)

#### Returns

[`ToolDefinition`](ToolDefinition.md)[]

[**mcp-works**](../README.md)

***

[mcp-works](../globals.md) / CallableServer

# Interface: CallableServer

Defined in: [src/types.ts:43](https://github.com/Ravandevil25/mcp-works/blob/6ad34f97ce33eb04f1f7179eccc7ba8994d2d3d6/src/types.ts#L43)

## Extended by

- [`MockServer`](MockServer.md)

## Methods

### callTool()

> **callTool**(`name`, `args?`, `signal?`): `Promise`\<[`CallResult`](CallResult.md)\>

Defined in: [src/types.ts:44](https://github.com/Ravandevil25/mcp-works/blob/6ad34f97ce33eb04f1f7179eccc7ba8994d2d3d6/src/types.ts#L44)

#### Parameters

##### name

`string`

##### args?

`Record`\<`string`, `unknown`\>

##### signal?

`AbortSignal`

#### Returns

`Promise`\<[`CallResult`](CallResult.md)\>

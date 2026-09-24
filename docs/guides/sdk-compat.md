# SDK Compat

The official SDK owns transport. Feed its tool definitions into the testkit:

```ts
import { contractTest, validateArgs } from 'mcp-works';

// What your SDK server's listTools handler returns:
const sdkTools = [{ name: 'read_note', description: '...', inputSchema: {...} }];

const report = await contractTest({ tools: sdkTools });
const check = validateArgs(sdkTools[0], { id: '42' });
```

Runnable pattern: `node examples/sdk-compat.mjs`.
`guard()` accepts any `{ callTool }` object, so SDK adapters can be wrapped too.

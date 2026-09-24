# FAQ

**Does this replace the official MCP SDK?**
No. The SDK owns transport (stdio/SSE, protocol messages). This package owns the testing layer.

**Does it work without Vitest?**
Yes — plain async functions, zero runtime deps. Works with Jest and `node:test`.

**How do I import from CommonJS?**
`const { createMockServer } = require('mcp-works');` — dual ESM+CJS, verified by `attw` and CI smoke test.

**How do I catch guard errors?**
All errors are `McpWorksError` with `.code`: `TOOL_DENIED`, `TIMEOUT`, `OUTPUT_TOO_LARGE`, `ABORTED`, `INVALID_TOOL`. Switch on `code` for retries.

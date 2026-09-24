# Migration from @sauravsk2507/mcp-testkit

```bash
npm uninstall @sauravsk2507/mcp-testkit && npm install mcp-works
```

Replace the import specifier: `@sauravsk2507/mcp-testkit` → `mcp-works`.
API is identical. Optionally rename `McpTestkitError` → `McpWorksError`
(the old name remains as a deprecated alias).

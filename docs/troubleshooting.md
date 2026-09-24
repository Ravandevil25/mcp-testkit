# Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `contractTest` passes but bad args crash at runtime | Contract checks shape, not values | Add `validateArgs(tool, args)` before `callTool` |
| `TIMEOUT` on every call | `timeoutMs` lower than handler latency | Raise `timeoutMs` or pass an `AbortSignal` |
| `OUTPUT_TOO_LARGE` | Default 1MB cap exceeded | Set `maxBytes` explicitly |
| Email/keys visible in output | Redaction off by default | Set `redact: true` or custom `RegExp[]` |
| Types resolve to ESM under `require` | Stale install | Upgrade; `require` types ship as `.d.cts` |

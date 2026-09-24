# Launch assets — @sauravsk2507/mcp-testkit 0.1.1

## 1. r/node showcase post

Title: `Show: mcp-testkit — mock + contract-test + guard for MCP servers in Vitest`

Body:
> I kept hand-rolling the same three things for every MCP server: an
> in-process mock so tests don't need a live server, a contract check
> (description? schema? unique names?), and a guard so agents can't call
> the wrong tool or hang forever.
>
> So I packaged it: `@sauravsk2507/mcp-testkit`
>
> ```ts
> import { contractTest, createMockServer, guard } from '@sauravsk2507/mcp-testkit';
> const mock = createMockServer({ tools }, handlers);
> await contractTest(mock.definition); // { passed, failures[] }
> const safe = guard(mock, { timeoutMs: 5000, allowTools: ['get_time'] });
> ```
>
> - dual ESM+CJS, strict TS, 15 tests green, attw clean, provenance-signed
> - repo: https://github.com/Ravandevil25/mcp-testkit
> - Feedback wanted: what guard rule do you need next — PII-scan, rate-limit, or OTel?

## 2. X thread (5 posts)

1. Every MCP server I test needs the same 3 things: a mock, a contract check, and a guard. I got tired of rewriting them.
2. So I shipped `@sauravsk2507/mcp-testkit`: `createMockServer` for Vitest (2 lines, no live server), `contractTest` (catches missing schema/description), `guard` (allowlist + timeout + output cap).
3. Before: spin up a real server per test, agent crashes on bad input, wrong tool runs free. After: 3 calls, typed errors with codes (TOOL_DENIED / TIMEOUT / OUTPUT_TOO_LARGE).
4. `npm i @sauravsk2507/mcp-testkit` — ESM+CJS, strict TS, 15/15 tests, provenance-signed, CI green on Node 20/22 x ubuntu/windows.
5. Repo + examples: https://github.com/Ravandevil25/mcp-testkit — what guard rule should I add next?

## 3. dev.to tutorial outline

Title: `Testing MCP servers in 10 minutes (mock + contract + guard)`

1. The problem: SDK gives transport, no testing story (mock/contract/guard hand-rolled).
2. Step 1: `createMockServer` — 2-line Vitest mock, latency + abort demo.
3. Step 2: `contractTest` — break a schema on purpose, show the failure report.
4. Step 3: `guard` — block a dangerous tool, timeout a slow one, cap output.
5. CI + provenance: why signed publishes matter for agent tooling.
6. Link repo + npm + roadmap (PII-scan, scaffolder), ask for guard-rule votes.

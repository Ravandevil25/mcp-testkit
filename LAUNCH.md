# Launch assets — mcp-works 0.1.1

## 1. r/node showcase post

Title: `Show: mcp-works — mock + contract-test + guard for MCP servers in Vitest`

Body:
> I kept hand-rolling the same three things for every MCP server: an
> in-process mock so tests don't need a live server, a contract check
> (description? schema? unique names?), and a guard so agents can't call
> the wrong tool or hang forever.
>
> So I packaged it: `mcp-works`
>
> ```ts
> import { contractTest, createMockServer, guard } from 'mcp-works';
> const mock = createMockServer({ tools }, handlers);
> await contractTest(mock.definition); // { passed, failures[] }
> const safe = guard(mock, { timeoutMs: 5000, allowTools: ['get_time'] });
> ```
>
> - dual ESM+CJS, strict TS, 15 tests green, attw clean, provenance-signed
> - repo: https://github.com/Ravandevil25/mcp-works
> - Feedback wanted: what guard rule do you need next — PII-scan, rate-limit, or OTel?

## 2. X thread (5 posts)

1. Every MCP server I test needs the same 3 things: a mock, a contract check, and a guard. I got tired of rewriting them.
2. So I shipped `mcp-works`: `createMockServer` for Vitest (2 lines, no live server), `contractTest` (catches missing schema/description), `guard` (allowlist + timeout + output cap).
3. Before: spin up a real server per test, agent crashes on bad input, wrong tool runs free. After: 3 calls, typed errors with codes (TOOL_DENIED / TIMEOUT / OUTPUT_TOO_LARGE).
4. `npm i mcp-works` — ESM+CJS, strict TS, 15/15 tests, provenance-signed, CI green on Node 20/22 x ubuntu/windows.
5. Repo + examples: https://github.com/Ravandevil25/mcp-works — what guard rule should I add next?

## 3. dev.to tutorial outline

Title: `Testing MCP servers in 10 minutes (mock + contract + guard)`

1. The problem: SDK gives transport, no testing story (mock/contract/guard hand-rolled).
2. Step 1: `createMockServer` — 2-line Vitest mock, latency + abort demo.
3. Step 2: `contractTest` — break a schema on purpose, show the failure report.
4. Step 3: `guard` — block a dangerous tool, timeout a slow one, cap output.
5. CI + provenance: why signed publishes matter for agent tooling.
6. Link repo + npm + roadmap (PII-scan, scaffolder), ask for guard-rule votes.

## 4. Downstream outreach (5 high-intent targets)

1. `modelcontextprotocol/servers` Discussions (90.6k stars, README says reference servers are "not production-ready")
   Angle: offer mcp-works as the community testing layer for reference impls.
   Message: "I built mcp-works — mock + contract-test + guard for MCP servers (Vitest, 3 calls). Happy to PR a contract test for one reference server (e.g. time/filesystem) to show the pattern. Interested?"

2. `modelcontextprotocol/typescript-sdk` repo
   Angle: SDK is transport-only; testkit is the companion layer, zero overlap.
   Message: "Would you accept a docs/example PR showing contractTest + guard against the SDK client? Package: mcp-works, ESM+CJS, provenance-signed."

3. `mcp-framework` (npm, 217k/mo, single maintainer, no scaffolder tests)
   Angle: add generated contract test to their server template.
   Message: "Your template + my contractTest = every scaffolded server ships tested. Want a PR adding it to the generator?"

4. Awesome-MCP lists (ADDITIONAL.md-linked collections, awesome MCP server lists)
   Angle: no Testing section exists anywhere — be the first entry.
   Message: PR titled "Add Testing section: mcp-works (mock + contract + guard)".

5. r/node showcase + X thread + Nodeiflux #showcase (assets in sections 1-2 above)
   Angle: highest-intent devs, post Tue-Thu AM US with the 5-line demo, ask "what guard rule next?" to harvest v0.2 features.

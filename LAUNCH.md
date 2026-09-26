# Launch assets — mcp-works 0.4.0

## 1. r/node showcase post

Title: `Show: mcp-works — mock + contract-test + validate + guard for MCP servers`

Body:
> I kept hand-rolling the same four things for every MCP server: an
> in-process mock so tests don't need a live server, a contract check
> (description? schema? unique names?), arg validation (required? types?
> constraints?), and a guard so agents can't call the wrong tool, hang
> forever, or leak PII.
>
> So I packaged it: `mcp-works`
>
> ```ts
> import { contractTest, createMockServer, guard, validateArgs } from 'mcp-works';
> const mock = createMockServer({ tools }, handlers);
> await contractTest(mock.definition); // { passed, failures[] }
> validateArgs(tool, args); // { valid, failures[] } — zero-dep
> const safe = guard(mock, { timeoutMs: 5000, allowTools: ['get_time'], redact: true });
> ```
>
> Honest scope: definition-level testing layer, companion to the official
> SDK (transport stays with the SDK). Zero runtime deps, dual ESM+CJS,
> strict TS, 35 tests green, attw clean, provenance-signed.
> Docs: https://ravandevil25.github.io/mcp-works/
> - repo: https://github.com/Ravandevil25/mcp-works

## 2. X thread (5 posts)

1. Every MCP server I test needs the same 4 things: a mock, a contract check, arg validation, and a guard. I got tired of rewriting them.
2. So I shipped `mcp-works`: `createMockServer` (2 lines, no live server), `contractTest` (missing schema/description), `validateArgs` (required/types/enum/constraints, zero-dep), `guard` (allowlist + timeout + output cap + PII redact).
3. Before: spin up a real server per test, agent crashes on bad input, wrong tool runs free. After: 4 calls, typed errors with codes (TOOL_DENIED / TIMEOUT / OUTPUT_TOO_LARGE).
4. `npm i mcp-works` — zero runtime deps, ESM+CJS, strict TS, 35/35 tests, 98% coverage, provenance-signed, CI green on Node 20/22 x ubuntu/windows. Modern toolchain (vitest 5, eslint 10). Docs: https://ravandevil25.github.io/mcp-works/
5. Repo + examples: https://github.com/Ravandevil25/mcp-works — honest scope: definition-level testing layer, SDK companion.

## 3. dev.to tutorial outline

Title: `Testing MCP servers in 10 minutes (mock + contract + validate + guard)`

1. The problem: SDK gives transport, no testing story (mock/contract/validate/guard hand-rolled).
2. Step 1: `createMockServer` — 2-line Vitest mock, latency + abort demo.
3. Step 2: `contractTest` — break a schema on purpose, show the failure report.
4. Step 3: `validateArgs` — required/types/constraints with zero deps, dotted failure paths.
5. Step 4: `guard` — block a dangerous tool, timeout a slow one, cap output, redact PII.
6. CI + provenance: why signed publishes matter for agent tooling.
7. Link docs site + repo + npm + roadmap (scaffolder, rate-limit), ask for v0.5 votes.

## 4. Downstream outreach (5 high-intent targets)

1. `modelcontextprotocol/servers` Discussions (90.6k stars, README says reference servers are "not production-ready")
   Angle: offer mcp-works as the community testing layer for reference impls.
   Message: "I built mcp-works — mock + contract-test + validate + guard for MCP servers (zero-dep, 4 calls). Happy to PR a contract test for one reference server (e.g. time/filesystem) to show the pattern. Interested?"

2. `modelcontextprotocol/typescript-sdk` repo
   Angle: SDK is transport-only; testkit is the companion layer, zero overlap.
   Message: "Would you accept a docs/example PR showing contractTest + guard against the SDK client? Package: mcp-works, ESM+CJS, provenance-signed."

3. `mcp-framework` (npm, 217k/mo, single maintainer, no scaffolder tests)
   Angle: add generated contract test to their server template.
   Message: "Your template + my contractTest = every scaffolded server ships tested. Want a PR adding it to the generator?"

4. Awesome-MCP lists (ADDITIONAL.md-linked collections, awesome MCP server lists)
   Angle: no Testing section exists anywhere — be the first entry.
   Message: PR titled "Add Testing section: mcp-works (mock + contract + validate + guard)".

5. r/node showcase + X thread + Nodeiflux #showcase (assets in sections 1-2 above)
   Angle: highest-intent devs, post Tue-Thu AM US with the 5-line demo, ask "what guard rule next?" to harvest v0.5 features.

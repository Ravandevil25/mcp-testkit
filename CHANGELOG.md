# Changelog

## 0.4.0
- `deps`: vitest 2 → 5 (+ @vitest/coverage-v8 5), eslint 9 → 10 (+ @eslint/js), actions/checkout + setup-node v4 → v7
- `docs`: VitePress site live (guides, API ref, migration, FAQ), TypeDoc TSDoc coverage on all public exports, SUPPORT.md with SLA
- `chore`: generated output gitignored (coverage, vitepress dist/cache); TypeScript 7 deferred until typedoc supports it
- No API changes — drop-in upgrade from 0.3.x.

## 0.3.0
- `validateArgs`: string constraints (minLength/maxLength/pattern), number constraints (minimum/maximum), arrays (items/minItems/maxItems)
- `guard`: accepts any `{ callTool }` server (SDK adapters wrappable); `redact` option (default PII patterns or custom RegExp[])
- `errors`: new `McpWorksError`; `McpTestkitError` kept as deprecated alias
- `fix`: TextEncoder byte length (edge/bundler safe); circular-safe handler stringify
- `quality`: eslint flat config, v8 coverage 98% with thresholds, typechecked tests, lint+coverage in CI
- `docs`: options tables, migration guide, FAQ/Troubleshooting, SDK-compat + validate-guard examples
- `rebrand`: package renamed to `mcp-works` (unscoped, clean name). Same API, zero breaking changes.
- Migrating from `@sauravsk2507/mcp-works`: `npm install mcp-works` — imports change from `@sauravsk2507/mcp-works` to `mcp-works`.

## 0.2.0
- `validateArgs(tool, args)`: zero-dep runtime arg validation — required, type, enum, nested objects with dotted paths
- `examples/sdk-compat.mjs`: pattern for feeding real SDK tool definitions into contractTest/validateArgs
- `docs`: scoped badges, FAQ, Troubleshooting table
- `repo`: CONTRIBUTING, Code of Conduct, issue templates, Dependabot, topics, branch protection
- `ci`: CJS smoke test + SDK-compat example run in matrix

## 0.1.1
- `ci`: audit gate now checks production deps only (dev-only findings non-blocking)
- `ci`: publish workflow hardened for OIDC trusted publishing (npm latest, no cache)
- `docs`: README install/import use scoped name `mcp-works`

## 0.1.0
- `createMockServer`: in-process mock with latency + abort support
- `contractTest`: description/schema/unique-name checks
- `guard`: timeout + allowlist + output-size cap

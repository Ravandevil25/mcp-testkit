# Contributing

## One rule
One feature = one PR. Keep diffs small and reviewable.

## Setup
```bash
npm ci
npx tsc --noEmit
npx vitest run
npm run build
node test/cjs-smoke.cjs
```

## PR checklist
- [ ] Tests added/updated (`npx vitest run` green)
- [ ] `npx tsc --noEmit` clean
- [ ] README updated if API changed
- [ ] CHANGELOG entry added
- [ ] No new runtime dependencies (zero-dep core; discuss first)

## Releases
Maintainer only: bump via `npm version <patch|minor|major>`, push tag `vX.Y.Z`.
GitHub Actions publishes to npm via OIDC trusted publishing with provenance.

# CI Guide

Gate PRs on contract + tests. Example (GitHub Actions):

```yaml
- run: npm ci
- run: npm run typecheck
- run: npm run lint
- run: npm run test:coverage
- run: npm run build
```

Fail the build when `contractTest(...).passed === false` by running it
inside your test files — no extra tooling needed.

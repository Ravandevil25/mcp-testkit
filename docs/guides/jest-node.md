# Jest / Node Guide

No Vitest needed. All functions are plain async with zero runtime deps.

```ts
// node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockServer, validateArgs } from 'mcp-works';

test('validates args', () => {
  const check = validateArgs(tool, { id: '42' });
  assert.equal(check.valid, true);
});
```

Jest works the same way — `describe/it/expect` map 1:1.

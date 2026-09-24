# Vitest Guide

```ts
import { describe, expect, it } from 'vitest';
import { createMockServer, contractTest } from 'mcp-works';

describe('time server', () => {
  it('passes contract', async () => {
    const mock = createMockServer({ tools }, handlers);
    expect((await contractTest(mock.definition)).passed).toBe(true);
  });

  it('calls the tool', async () => {
    const mock = createMockServer({ tools }, handlers);
    const res = await mock.callTool('get_time', {});
    expect(res.isError).toBeUndefined();
  });

  it('times out slow tools', async () => {
    const slow = createMockServer({ tools }, handlers, { latencyMs: 500 });
    const safe = guard(slow, { timeoutMs: 50 });
    await expect(safe.callTool('get_time', {})).rejects.toMatchObject({ code: 'TIMEOUT' });
  });
});
```

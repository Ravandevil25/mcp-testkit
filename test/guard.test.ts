import { describe, expect, it } from 'vitest';
import { guard } from '../src/guard.js';
import { createMockServer } from '../src/mock.js';
import { McpTestkitError } from '../src/types.js';

const def = {
  tools: [
    {
      name: 'get_time',
      description: 'Returns the current time.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'danger',
      description: 'Dangerous tool.',
      inputSchema: { type: 'object', properties: {} },
    },
  ],
};

function server(handlers: Record<string, () => unknown>, latencyMs = 0) {
  return createMockServer(def, handlers, { latencyMs });
}

describe('guard', () => {
  it('passes allowed calls through', async () => {
    const safe = guard(server({ get_time: () => 'noon', danger: () => 'x' }), {
      allowTools: ['get_time'],
    });
    const res = await safe.callTool('get_time', {});
    expect(res.content[0]?.text).toBe('noon');
  });

  it('denies tools outside the allowlist', async () => {
    const safe = guard(server({ get_time: () => 'noon', danger: () => 'x' }), {
      allowTools: ['get_time'],
    });
    await expect(safe.callTool('danger', {})).rejects.toBeInstanceOf(
      McpTestkitError,
    );
  });

  it('times out slow tools', async () => {
    const safe = guard(
      server({ get_time: () => 'noon', danger: () => 'x' }, 200),
      { timeoutMs: 20 },
    );
    await expect(safe.callTool('get_time', {})).rejects.toMatchObject({
      code: 'TIMEOUT',
    });
  });

  it('blocks oversized output', async () => {
    const safe = guard(server({ get_time: () => 'x'.repeat(100), danger: () => 'x' }), {
      maxBytes: 10,
    });
    await expect(safe.callTool('get_time', {})).rejects.toMatchObject({
      code: 'OUTPUT_TOO_LARGE',
    });
  });
});

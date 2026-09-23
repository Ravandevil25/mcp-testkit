import { describe, expect, it } from 'vitest';
import { createMockServer } from '../src/mock.js';
import { McpTestkitError } from '../src/types.js';

const def = {
  tools: [
    {
      name: 'get_time',
      description: 'Returns the current time.',
      inputSchema: { type: 'object', properties: {} },
    },
  ],
};

describe('createMockServer', () => {
  it('lists tools', () => {
    const mock = createMockServer(def, { get_time: () => 'noon' });
    expect(mock.listTools()).toHaveLength(1);
    expect(mock.listTools()[0]?.name).toBe('get_time');
  });

  it('calls a handler and returns text', async () => {
    const mock = createMockServer(def, { get_time: () => 'noon' });
    const res = await mock.callTool('get_time', {});
    expect(res.isError).toBeUndefined();
    expect(res.content[0]?.text).toBe('noon');
  });

  it('stringifies object results', async () => {
    const mock = createMockServer(def, { get_time: () => ({ h: 12 }) });
    const res = await mock.callTool('get_time', {});
    expect(res.content[0]?.text).toBe('{"h":12}');
  });

  it('returns isError for unknown tools', async () => {
    const mock = createMockServer(def, { get_time: () => 'noon' });
    const res = await mock.callTool('nope', {});
    expect(res.isError).toBe(true);
  });

  it('returns isError when a handler throws', async () => {
    const mock = createMockServer(def, {
      get_time: () => {
        throw new Error('boom');
      },
    });
    const res = await mock.callTool('get_time', {});
    expect(res.isError).toBe(true);
    expect(res.content[0]?.text).toBe('boom');
  });

  it('respects abort signals', async () => {
    const mock = createMockServer(def, { get_time: () => 'noon' });
    const controller = new AbortController();
    controller.abort();
    await expect(mock.callTool('get_time', {}, controller.signal)).rejects.toBeInstanceOf(
      McpTestkitError,
    );
  });

  it('rejects empty tool names', () => {
    expect(() =>
      createMockServer(
        { tools: [{ name: '', description: 'x', inputSchema: {} }] },
        {},
      ),
    ).toThrow(McpTestkitError);
  });
});

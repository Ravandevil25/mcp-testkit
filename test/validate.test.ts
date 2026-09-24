import { describe, expect, it } from 'vitest';
import { validateArgs } from '../src/validate.js';

const tool = {
  name: 'read_note',
  description: 'Reads a note.',
  inputSchema: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
      limit: { type: 'integer' },
      mode: { enum: ['fast', 'slow'] },
      filter: {
        type: 'object',
        required: ['tag'],
        properties: { tag: { type: 'string' } },
      },
    },
  },
};

describe('validateArgs', () => {
  it('passes valid args', () => {
    const r = validateArgs(tool, { id: '42', limit: 3, mode: 'fast' });
    expect(r.valid).toBe(true);
    expect(r.failures).toHaveLength(0);
  });

  it('fails missing required', () => {
    const r = validateArgs(tool, { limit: 3 });
    expect(r.valid).toBe(false);
    expect(r.failures.some((f) => f.path === 'id')).toBe(true);
  });

  it('fails wrong type and bad enum', () => {
    const r = validateArgs(tool, { id: 42, mode: 'warp' });
    expect(r.valid).toBe(false);
    expect(r.failures.length).toBe(2);
  });

  it('fails nested required', () => {
    const r = validateArgs(tool, { id: 'a', filter: {} });
    expect(r.valid).toBe(false);
    expect(r.failures.some((f) => f.path === 'filter.tag')).toBe(true);
  });

  it('rejects non-object args', () => {
    const r = validateArgs(tool, 'nope');
    expect(r.valid).toBe(false);
  });
});

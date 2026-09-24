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

  it('validates all primitive types', () => {
    const t = {
      name: 't',
      description: 'd',
      inputSchema: {
        type: 'object',
        properties: {
          s: { type: 'string' },
          n: { type: 'number' },
          i: { type: 'integer' },
          b: { type: 'boolean' },
          a: { type: 'array' },
          o: { type: 'object' },
        },
      },
    };
    expect(validateArgs(t, { s: 'x', n: 1.5, i: 2, b: true, a: [], o: {} }).valid).toBe(true);
    const r = validateArgs(t, { s: 1, n: NaN, i: 1.5, b: 0, a: {}, o: [] });
    expect(r.valid).toBe(false);
    expect(r.failures).toHaveLength(6);
  });

  it('handles missing schema gracefully', () => {
    const r = validateArgs({ name: 'x', description: 'd', inputSchema: {} }, {});
    expect(r.valid).toBe(true);
  });

  it('flags non-integer floats', () => {
    const r = validateArgs(tool, { id: 'a', limit: 1.5 });
    expect(r.failures.some((f) => f.path === 'limit')).toBe(true);
  });

  it('checks string constraints', () => {
    const t = {
      name: 't',
      description: 'd',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', minLength: 3, maxLength: 5, pattern: '^[A-Z]+$' },
        },
      },
    };
    expect(validateArgs(t, { code: 'ABC' }).valid).toBe(true);
    expect(validateArgs(t, { code: 'AB' }).failures.length).toBe(1);
    expect(validateArgs(t, { code: 'ABCDEF' }).failures.length).toBe(1);
    expect(validateArgs(t, { code: 'abc' }).failures.length).toBe(1);
  });

  it('checks number constraints', () => {
    const t = {
      name: 't',
      description: 'd',
      inputSchema: {
        type: 'object',
        properties: { age: { type: 'integer', minimum: 0, maximum: 150 } },
      },
    };
    expect(validateArgs(t, { age: 30 }).valid).toBe(true);
    expect(validateArgs(t, { age: -1 }).failures.length).toBe(1);
    expect(validateArgs(t, { age: 200 }).failures.length).toBe(1);
  });

  it('checks array items and size', () => {
    const t = {
      name: 't',
      description: 'd',
      inputSchema: {
        type: 'object',
        properties: {
          tags: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 },
        },
      },
    };
    expect(validateArgs(t, { tags: ['a', 'b'] }).valid).toBe(true);
    const bad = validateArgs(t, { tags: ['a', 1] });
    expect(bad.failures.some((f) => f.path === 'tags[1]')).toBe(true);
    expect(validateArgs(t, { tags: [] }).failures.length).toBe(1);
    expect(validateArgs(t, { tags: ['a', 'b', 'c', 'd'] }).failures.length).toBe(1);
  });

  it('ignores invalid pattern without crashing', () => {
    const t = {
      name: 't',
      description: 'd',
      inputSchema: {
        type: 'object',
        properties: { s: { type: 'string', pattern: '([' } },
      },
    };
    expect(validateArgs(t, { s: 'x' }).valid).toBe(true);
  });
});

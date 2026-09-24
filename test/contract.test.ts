import { describe, expect, it } from 'vitest';
import { contractTest } from '../src/contract.js';

describe('contractTest', () => {
  it('passes a valid definition', async () => {
    const report = await contractTest({
      tools: [
        {
          name: 'get_time',
          description: 'Returns the current time.',
          inputSchema: { type: 'object', properties: {} },
        },
      ],
    });
    expect(report.passed).toBe(true);
    expect(report.failures).toHaveLength(0);
  });

  it('fails missing description and schema', async () => {
    const report = await contractTest({
      tools: [{ name: 'bad', description: '', inputSchema: {} }],
    });
    expect(report.passed).toBe(false);
    expect(report.failures.length).toBeGreaterThan(0);
  });

  it('fails duplicate tool names', async () => {
    const tool = {
      name: 'dup',
      description: 'x',
      inputSchema: { type: 'object' },
    };
    const report = await contractTest({ tools: [tool, { ...tool }] });
    expect(report.passed).toBe(false);
    expect(report.failures.some((f) => f.check === 'unique')).toBe(true);
  });

  it('fails a non-object definition', async () => {
    const report = await contractTest({ tools: 'nope' } as never);
    expect(report.passed).toBe(false);
  });

  it('fails non-object tool entries and bad schema type', async () => {
    const report = await contractTest({
      tools: [
        'nope' as never,
        { name: 'ok-but-wrong-schema', description: 'd', inputSchema: { type: 'array' } },
        { name: '', description: '', inputSchema: 'bad' } as never,
      ],
    });
    expect(report.passed).toBe(false);
    expect(report.failures.some((f) => f.check === 'shape')).toBe(true);
    expect(report.failures.some((f) => f.check === 'inputSchema')).toBe(true);
    expect(report.failures.some((f) => f.check === 'name')).toBe(true);
  });
});

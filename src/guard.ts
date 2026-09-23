import type { MockServer } from './mock.js';
import {
  McpTestkitError,
  type CallResult,
  type GuardOptions,
} from './types.js';

export interface GuardedServer {
  callTool(
    name: string,
    args?: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<CallResult>;
}

function byteLength(text: string): number {
  return Buffer.byteLength(text, 'utf8');
}

export function guard(server: MockServer, options?: GuardOptions): GuardedServer {
  const timeoutMs = options?.timeoutMs ?? 5000;
  const allowTools = options?.allowTools;
  const maxBytes = options?.maxBytes ?? 1024 * 1024;

  async function callTool(
    name: string,
    args: Record<string, unknown> = {},
    signal?: AbortSignal,
  ): Promise<CallResult> {
    if (allowTools && !allowTools.includes(name)) {
      throw new McpTestkitError(
        'TOOL_DENIED',
        `Tool not allowed by guard: ${name}.`,
      );
    }
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });
    const timer = setTimeout(
      () => controller.abort(),
      timeoutMs,
    );
    try {
      const result = await server.callTool(name, args, controller.signal);
      const size = result.content.reduce(
        (sum, part) => sum + byteLength(part.text),
        0,
      );
      if (size > maxBytes) {
        throw new McpTestkitError(
          'OUTPUT_TOO_LARGE',
          `Tool ${name} output ${size} bytes exceeds ${maxBytes} byte limit.`,
        );
      }
      return result;
    } catch (err) {
      if (err instanceof McpTestkitError && err.code === 'ABORTED') {
        throw new McpTestkitError(
          'TIMEOUT',
          `Tool ${name} timed out after ${timeoutMs}ms.`,
        );
      }
      throw err;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
  }

  return { callTool };
}

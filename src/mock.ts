import {
  McpWorksError,
  type CallableServer,
  type CallResult,
  type MockOptions,
  type ServerDefinition,
  type ToolDefinition,
  type ToolHandler,
} from './types.js';

export interface MockServer extends CallableServer {
  readonly definition: ServerDefinition;
  listTools(): ToolDefinition[];
}

function toText(value: unknown): string {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Create an in-process mock MCP server for tests. No live server needed.
 *
 * @param def - Server definition with tool list.
 * @param handlers - Handler per tool name; thrown errors become `isError` results.
 * @param options - Optional latency simulation (`latencyMs`).
 * @returns Mock server with `listTools` and `callTool`.
 * @throws {@link McpWorksError} with code `INVALID_TOOL` if a tool name is empty.
 *
 * @example
 * ```ts
 * const mock = createMockServer({ tools }, { get_time: () => 'noon' });
 * const res = await mock.callTool('get_time', {});
 * ```
 */
export function createMockServer(
  def: ServerDefinition,
  handlers: Record<string, ToolHandler>,
  options?: MockOptions,
): MockServer {
  const tools = [...def.tools];
  const latencyMs = options?.latencyMs ?? 0;

  for (const tool of tools) {
    if (typeof tool.name !== 'string' || tool.name.length === 0) {
      throw new McpWorksError(
        'INVALID_TOOL',
        'Every tool needs a non-empty name.',
      );
    }
  }

  async function callTool(
    name: string,
    args: Record<string, unknown> = {},
    signal?: AbortSignal,
  ): Promise<CallResult> {
    const tool = tools.find((t) => t.name === name);
    if (!tool) {
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }
    const handler = handlers[name];
    if (!handler) {
      return {
        content: [{ type: 'text', text: `No handler for tool: ${name}` }],
        isError: true,
      };
    }
    if (signal?.aborted) {
      throw new McpWorksError('ABORTED', `Call to ${name} was aborted.`);
    }
    if (latencyMs > 0) {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          signal?.removeEventListener('abort', onAbort);
          resolve();
        }, latencyMs);
        const onAbort = () => {
          clearTimeout(timer);
          reject(new McpWorksError('ABORTED', `Call to ${name} was aborted.`));
        };
        signal?.addEventListener('abort', onAbort, { once: true });
      });
    }
    try {
      const value = await handler(args, signal);
      return { content: [{ type: 'text', text: toText(value) }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { content: [{ type: 'text', text: message }], isError: true };
    }
  }

  return {
    definition: { tools },
    listTools: () => [...tools],
    callTool,
  };
}

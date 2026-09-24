import type { CallableServer } from './types.js';
import {
  McpWorksError,
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

const encoder = new TextEncoder();

const DEFAULT_PATTERNS: RegExp[] = [
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
  /\b(?:sk|xai|ghp|gho|github_pat)_[A-Za-z0-9_-]{8,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
];

const REDACTED = '[redacted]';

function toPatterns(redact: boolean | RegExp[] | undefined): RegExp[] | null {
  if (redact === true) return DEFAULT_PATTERNS.map((r) => new RegExp(r.source, r.flags));
  if (Array.isArray(redact) && redact.length > 0) return redact;
  return null;
}

function redactContent(
  content: CallResult['content'],
  patterns: RegExp[],
): CallResult['content'] {
  return content.map((part) => {
    let text = part.text;
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      text = text.replace(pattern, REDACTED);
    }
    return text === part.text ? part : { ...part, text };
  });
}

function byteLength(text: string): number {
  return encoder.encode(text).length;
}

/**
 * Wrap any `{ callTool }` server with safety rails: tool allowlist, timeout,
 * output-size cap, and optional PII redaction.
 *
 * @param server - Any server exposing `callTool` (mocks, SDK adapters).
 * @param options - `timeoutMs` (default 5000), `allowTools`, `maxBytes`
 * (default 1MB), `redact` (`true` for default PII patterns or custom `RegExp[]`).
 * @returns Guarded server with the same `callTool` shape.
 * @throws {@link McpWorksError} `TOOL_DENIED` for blocked tools,
 * `TIMEOUT` for slow calls, `OUTPUT_TOO_LARGE` for oversized output.
 *
 * @example
 * ```ts
 * const safe = guard(server, { timeoutMs: 3000, allowTools: ['read_note'], redact: true });
 * ```
 */
export function guard(server: CallableServer, options?: GuardOptions): GuardedServer {
  const timeoutMs = options?.timeoutMs ?? 5000;
  const allowTools = options?.allowTools;
  const maxBytes = options?.maxBytes ?? 1024 * 1024;
  const redactPatterns = toPatterns(options?.redact);

  async function callTool(
    name: string,
    args: Record<string, unknown> = {},
    signal?: AbortSignal,
  ): Promise<CallResult> {
    if (allowTools && !allowTools.includes(name)) {
      throw new McpWorksError(
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
      const redacted = redactPatterns ? redactContent(result.content, redactPatterns) : result.content;
      const size = redacted.reduce(
        (sum, part) => sum + byteLength(part.text),
        0,
      );
      if (size > maxBytes) {
        throw new McpWorksError(
          'OUTPUT_TOO_LARGE',
          `Tool ${name} output ${size} bytes exceeds ${maxBytes} byte limit.`,
        );
      }
      return redacted === result.content ? result : { ...result, content: redacted };
    } catch (err) {
      if (err instanceof McpWorksError && err.code === 'ABORTED') {
        throw new McpWorksError(
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

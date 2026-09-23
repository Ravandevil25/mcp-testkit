export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface CallResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export type ToolHandler = (
  args: Record<string, unknown>,
  signal?: AbortSignal,
) => unknown | Promise<unknown>;

export interface ServerDefinition {
  tools: ToolDefinition[];
}

export interface MockOptions {
  latencyMs?: number;
}

export interface ContractFailure {
  tool: string;
  check: string;
  message: string;
}

export interface ContractReport {
  passed: boolean;
  failures: ContractFailure[];
}

export interface GuardOptions {
  timeoutMs?: number;
  allowTools?: string[];
  maxBytes?: number;
}

export class McpTestkitError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'McpTestkitError';
    this.code = code;
  }
}

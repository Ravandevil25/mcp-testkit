import type {
  ContractFailure,
  ContractReport,
  ServerDefinition,
} from './types.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function contractTest(
  def: ServerDefinition,
): Promise<ContractReport> {
  const failures: ContractFailure[] = [];
  const fail = (tool: string, check: string, message: string) =>
    failures.push({ tool, check, message });

  if (!isRecord(def) || !Array.isArray(def.tools)) {
    return {
      passed: false,
      failures: [
        { tool: '*', check: 'shape', message: 'Definition needs a tools array.' },
      ],
    };
  }

  const seen = new Set<string>();
  for (const tool of def.tools) {
    const name =
      isRecord(tool) && typeof tool.name === 'string' ? tool.name : '(unnamed)';
    if (!isRecord(tool)) {
      fail(name, 'shape', 'Tool entry must be an object.');
      continue;
    }
    if (typeof tool.name !== 'string' || tool.name.length === 0) {
      fail(name, 'name', 'Tool needs a non-empty name.');
    } else if (seen.has(tool.name)) {
      fail(tool.name, 'unique', `Duplicate tool name: ${tool.name}.`);
    } else {
      seen.add(tool.name);
    }
    if (typeof tool.description !== 'string' || tool.description.length === 0) {
      fail(name, 'description', 'Tool needs a non-empty description.');
    }
    if (!isRecord(tool.inputSchema)) {
      fail(name, 'inputSchema', 'Tool needs an inputSchema object.');
    } else if (tool.inputSchema['type'] !== 'object') {
      fail(name, 'inputSchema', 'inputSchema.type should be "object".');
    }
  }

  return { passed: failures.length === 0, failures };
}

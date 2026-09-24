import type { ToolDefinition } from './types.js';

export interface ArgFailure {
  path: string;
  message: string;
}

export interface ArgReport {
  valid: boolean;
  failures: ArgFailure[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checkType(value: unknown, expected: string, path: string): ArgFailure | null {
  switch (expected) {
    case 'string':
      return typeof value === 'string'
        ? null
        : { path, message: `Expected string, got ${typeof value}.` };
    case 'number':
    case 'integer':
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return { path, message: `Expected ${expected}, got ${typeof value}.` };
      }
      if (expected === 'integer' && !Number.isInteger(value)) {
        return { path, message: 'Expected integer, got float.' };
      }
      return null;
    case 'boolean':
      return typeof value === 'boolean'
        ? null
        : { path, message: `Expected boolean, got ${typeof value}.` };
    case 'array':
      return Array.isArray(value)
        ? null
        : { path, message: `Expected array, got ${typeof value}.` };
    case 'object':
      return isRecord(value)
        ? null
        : { path, message: `Expected object, got ${Array.isArray(value) ? 'array' : typeof value}.` };
    default:
      return null;
  }
}

function checkEnum(
  value: unknown,
  allowed: unknown[],
  path: string,
): ArgFailure | null {
  if (!allowed.includes(value)) {
    return { path, message: `Value not in enum: ${JSON.stringify(allowed)}.` };
  }
  return null;
}

export function validateArgs(
  tool: ToolDefinition,
  args: unknown,
): ArgReport {
  const failures: ArgFailure[] = [];
  if (!isRecord(args)) {
    return {
      valid: false,
      failures: [{ path: '$', message: 'Args must be an object.' }],
    };
  }
  const schema = isRecord(tool.inputSchema) ? tool.inputSchema : {};
  const properties = isRecord(schema['properties'])
    ? (schema['properties'] as Record<string, unknown>)
    : {};
  const required = Array.isArray(schema['required'])
    ? (schema['required'] as unknown[]).filter((r): r is string => typeof r === 'string')
    : [];

  for (const name of required) {
    if (!(name in args) || args[name] === undefined) {
      failures.push({ path: name, message: 'Missing required property.' });
    }
  }

  for (const [name, propSchema] of Object.entries(properties)) {
    if (!(name in args) || args[name] === undefined) continue;
    if (!isRecord(propSchema)) continue;
    const value = args[name];
    if (typeof propSchema['type'] === 'string') {
      const bad = checkType(value, propSchema['type'], name);
      if (bad) failures.push(bad);
    }
    if (Array.isArray(propSchema['enum'])) {
      const bad = checkEnum(value, propSchema['enum'] as unknown[], name);
      if (bad) failures.push(bad);
    }
    if (
      propSchema['type'] === 'object' &&
      isRecord(value) &&
      isRecord(propSchema['properties'])
    ) {
      const nested = validateArgs(
        {
          name,
          description: '',
          inputSchema: propSchema as Record<string, unknown>,
        },
        value,
      );
      for (const f of nested.failures) {
        failures.push({ path: `${name}.${f.path}`, message: f.message });
      }
    }
  }

  return { valid: failures.length === 0, failures };
}

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

function checkStringConstraints(
  value: string,
  schema: Record<string, unknown>,
  path: string,
  failures: ArgFailure[],
): void {
  if (typeof schema['minLength'] === 'number' && value.length < schema['minLength']) {
    failures.push({ path, message: `Shorter than minLength ${schema['minLength']}.` });
  }
  if (typeof schema['maxLength'] === 'number' && value.length > schema['maxLength']) {
    failures.push({ path, message: `Longer than maxLength ${schema['maxLength']}.` });
  }
  if (typeof schema['pattern'] === 'string') {
    let re: RegExp | null = null;
    try {
      re = new RegExp(schema['pattern']);
    } catch {
      re = null;
    }
    if (re && !re.test(value)) {
      failures.push({ path, message: `Does not match pattern ${schema['pattern']}.` });
    }
  }
}

function checkNumberConstraints(
  value: number,
  schema: Record<string, unknown>,
  path: string,
  failures: ArgFailure[],
): void {
  if (typeof schema['minimum'] === 'number' && value < schema['minimum']) {
    failures.push({ path, message: `Below minimum ${schema['minimum']}.` });
  }
  if (typeof schema['maximum'] === 'number' && value > schema['maximum']) {
    failures.push({ path, message: `Above maximum ${schema['maximum']}.` });
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

/**
 * Validate args against a tool's `inputSchema` at runtime. Zero dependencies.
 * Checks `required`, `type`, `enum`, string/number constraints, arrays, and
 * nested objects (dotted paths like `filter.tag`, `tags[1]`).
 *
 * @param tool - Tool definition carrying `inputSchema`.
 * @param args - Args to validate (must be an object).
 * @returns `{ valid, failures[] }` — each failure has `path` and `message`.
 *
 * @example
 * ```ts
 * const check = validateArgs(tool, { id: '42' });
 * if (!check.valid) console.log(check.failures);
 * ```
 */
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
      if (bad) {
        failures.push(bad);
        continue;
      }
      if (propSchema['type'] === 'string' && typeof value === 'string') {
        checkStringConstraints(value, propSchema, name, failures);
      }
      if (
        (propSchema['type'] === 'number' || propSchema['type'] === 'integer') &&
        typeof value === 'number'
      ) {
        checkNumberConstraints(value, propSchema, name, failures);
      }
    }
    if (Array.isArray(propSchema['enum'])) {
      const bad = checkEnum(value, propSchema['enum'] as unknown[], name);
      if (bad) failures.push(bad);
    }
    if (
      propSchema['type'] === 'array' &&
      Array.isArray(value) &&
      isRecord(propSchema['items'])
    ) {
      const items = propSchema['items'] as Record<string, unknown>;
      value.forEach((item, i) => {
        if (typeof items['type'] === 'string') {
          const bad = checkType(item, items['type'], `${name}[${i}]`);
          if (bad) failures.push(bad);
        }
      });
      if (typeof propSchema['minItems'] === 'number' && value.length < propSchema['minItems']) {
        failures.push({ path: name, message: `Fewer than minItems ${propSchema['minItems']}.` });
      }
      if (typeof propSchema['maxItems'] === 'number' && value.length > propSchema['maxItems']) {
        failures.push({ path: name, message: `More than maxItems ${propSchema['maxItems']}.` });
      }
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

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const functionSource = readFileSync(
  resolve(process.cwd(), 'supabase/functions/smart-elements-ai/index.ts'),
  'utf8',
);

describe('smart-elements-ai Edge Function request contract', () => {
  it('rejects requests with more than 50 selected elements before AI execution', () => {
    expect(functionSource).toContain('selectedElements.length > 50');
    expect(functionSource).toContain('Too many selected elements (max 50)');
    expect(functionSource).toMatch(/status:\s*400/);
  });

  it('does not accept client-supplied roles in context or approval metadata', () => {
    expect(functionSource).toContain('Client-supplied roles are not accepted');
    expect(functionSource).toContain("key.toLowerCase().includes('role')");
    expect(functionSource).toContain("allowedKeys = new Set(['boardId', 'projectId', 'preferredType', 'targetType', 'humanApproval'])");
  });
});

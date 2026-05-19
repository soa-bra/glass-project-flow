/**
 * P5 — Archive spec coverage test.
 * Asserts the archive dashboard exists in APP_SPEC with all 9 categories
 * and that every componentRef inside is resolvable from BOX_KIT_REGISTRY.
 */
import { describe, it, expect } from 'vitest';
import { APP_SPEC } from '@/config/app-spec';
import { resolveBoxKitComponent } from '@/components/box-kit/registry';

const PRIMITIVE_RE = /^(DAV|IPF|ACT|MDL)-/;

function findArchive() {
  for (const w of APP_SPEC.workspaces) {
    for (const d of w.dashboards as ReadonlyArray<{ key: string; tabs: unknown[] }>) {
      if (d.key === 'archive') return d;
    }
  }
  return undefined;
}

describe('Archive spec coverage', () => {
  const archive = findArchive();

  it('archive dashboard exists in APP_SPEC', () => {
    expect(archive).toBeDefined();
  });

  it('archive has at least 9 category tabs', () => {
    expect((archive as { tabs: unknown[] }).tabs.length).toBeGreaterThanOrEqual(9);
  });

  it('all Box-Kit componentRefs in archive resolve from registry', () => {
    const missing: string[] = [];
    for (const t of (archive as { tabs: Array<{ boxes: Array<{ componentRefs?: string[] }> }> })
      .tabs) {
      for (const b of t.boxes ?? []) {
        for (const ref of b.componentRefs ?? []) {
          if (PRIMITIVE_RE.test(ref) && !resolveBoxKitComponent(ref)) {
            missing.push(ref);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });
});

/**
 * P7 — Settings spec coverage test.
 * Asserts settings dashboard exists with 13 tabs and every Box-Kit
 * componentRef resolves from registry.
 */
import { describe, it, expect } from 'vitest';
import { APP_SPEC } from '@/config/app-spec';
import { resolveBoxKitComponent } from '@/components/box-kit/registry';

const PRIMITIVE_RE = /^(DAV|IPF|ACT|MDL)-/;

function findSettings() {
  for (const w of APP_SPEC.workspaces) {
    for (const d of w.dashboards as ReadonlyArray<{ key: string; tabs: unknown[] }>) {
      if (d.key === 'settings') return d;
    }
  }
  return undefined;
}

describe('Settings spec coverage', () => {
  const settings = findSettings();

  it('settings dashboard exists in APP_SPEC', () => {
    expect(settings).toBeDefined();
  });

  it('settings has at least 13 tabs', () => {
    expect((settings as { tabs: unknown[] }).tabs.length).toBeGreaterThanOrEqual(13);
  });

  it('all Box-Kit componentRefs in settings resolve from registry', () => {
    const missing: string[] = [];
    for (const t of (settings as { tabs: Array<{ boxes: Array<{ componentRefs?: string[] }> }> })
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

/**
 * Departments workspace — spec coverage (P4)
 * Validates that every department dashboard in APP_SPEC has resolvable
 * componentRefs across boxes and popups.
 *
 * @specRef Section 6 — 12 dashboards / 94 tabs / spec-driven via TabRenderer
 */
import { describe, it, expect } from 'vitest';
import { APP_SPEC } from '@/config/app-spec';
import { BOX_KIT_REGISTRY } from '@/components/box-kit/registry';

const DEPARTMENT_KEYS = [
  'financial', 'legal', 'marketing', 'hr', 'crm', 'brand',
  'csr', 'kmpa', 'training', 'bcm', 'partnerships', 'knowledge',
];

function findDashboard(key: string) {
  for (const w of APP_SPEC.workspaces) {
    for (const d of w.dashboards as ReadonlyArray<any>) {
      if (d.key === key) return d as any;
    }
  }
  return undefined;
}

describe('Departments workspace — spec coverage (P4)', () => {
  it('all 12 department dashboards exist in APP_SPEC', () => {
    const missing = DEPARTMENT_KEYS.filter((k) => !findDashboard(k));
    expect(missing).toEqual([]);
  });

  for (const key of DEPARTMENT_KEYS) {
    it(`[${key}] every box/popup componentRef is registered`, () => {
      const d = findDashboard(key);
      expect(d).toBeDefined();
      const missing: string[] = [];
      for (const tab of d.tabs ?? []) {
        for (const box of tab.boxes ?? []) {
          for (const ref of box.componentRefs ?? []) {
            if (ref === 'BaseBox') continue;
            if (!(ref in BOX_KIT_REGISTRY)) missing.push(`box ${tab.code}/${box.ref}:${ref}`);
          }
        }
        for (const popup of tab.popups ?? []) {
          for (const ref of popup.componentRefs ?? []) {
            if (!(ref in BOX_KIT_REGISTRY)) missing.push(`popup ${tab.code}/${popup.ref}:${ref}`);
          }
        }
      }
      expect(missing).toEqual([]);
    });
  }
});

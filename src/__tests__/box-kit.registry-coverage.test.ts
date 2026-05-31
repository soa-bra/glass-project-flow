/**
 * Box-Kit registry coverage — guards that every componentRef used in the spec
 * resolves to a registered primitive. New refs in app-spec.ts must be added to
 * BOX_KIT_REGISTRY before this test will pass.
 */
import { describe, it, expect } from 'vitest';
import { APP_SPEC } from '@/config/app-spec';
import { BOX_KIT_REGISTRY } from '@/components/box-kit/registry';

const SPEC_REF_PATTERN = /^[A-Z]{3}-[A-Z]{3}-\d{2}$/;

describe('box-kit registry coverage', () => {
  it('every spec componentRef (DAV/IPF/ACT/MDL) is registered', () => {
    const used = new Set<string>();
    for (const ws of APP_SPEC.workspaces) {
      for (const d of ws.dashboards) {
        for (const t of d.tabs) {
          for (const b of t.boxes) {
            for (const ref of b.componentRefs ?? []) {
              if (SPEC_REF_PATTERN.test(ref)) used.add(ref);
            }
          }
        }
      }
    }
    const missing = [...used].filter((r) => !BOX_KIT_REGISTRY[r]);
    expect(missing).toEqual([]);
  });
});

/**
 * P7 — Full Box-Kit coverage gate.
 * Walks the entire APP_SPEC (15 dashboards / 124 tabs / 476 boxes) and
 * verifies that every primitive componentRef resolves from BOX_KIT_REGISTRY.
 * This is the master CI gate guarding against spec drift.
 */
import { describe, it, expect } from 'vitest';
import { APP_SPEC } from '@/config/app-spec';
import { resolveBoxKitComponent } from '@/components/box-kit/registry';

const PRIMITIVE_RE = /^(DAV|IPF|ACT|MDL)-/;

describe('Full APP_SPEC ↔ Box-Kit coverage', () => {
  it('every primitive componentRef across all dashboards resolves', () => {
    const missing = new Set<string>();
    for (const w of APP_SPEC.workspaces) {
      for (const d of w.dashboards as ReadonlyArray<{
        tabs: Array<{ boxes?: Array<{ componentRefs?: string[] }> }>;
      }>) {
        for (const t of d.tabs ?? []) {
          for (const b of t.boxes ?? []) {
            for (const ref of b.componentRefs ?? []) {
              if (PRIMITIVE_RE.test(ref) && !resolveBoxKitComponent(ref)) {
                missing.add(ref);
              }
            }
          }
        }
      }
    }
    expect(Array.from(missing)).toEqual([]);
  });

  it('spec counts match the locked totals (15/124/476/184)', () => {
    expect(APP_SPEC.counts).toEqual({
      dashboards: 15,
      tabs: 124,
      boxes: 476,
      popups: 184,
    });
  });
});

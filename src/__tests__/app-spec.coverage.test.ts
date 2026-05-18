/**
 * Coverage guard: app-spec must exactly match the canonical totals derived
 * from docs/specs/*.xlsx. Re-run `node scripts/generate-app-spec.mjs` after
 * any spec change.
 */
import { describe, it, expect } from 'vitest';
import { APP_SPEC, APP_SPEC_COUNTS } from '@/config/app-spec';

const EXPECTED = { dashboards: 15, tabs: 124, boxes: 476, popups: 184 } as const;

describe('app-spec coverage', () => {
  it('matches canonical totals (master-spec-ar.md)', () => {
    expect(APP_SPEC_COUNTS).toEqual(EXPECTED);
  });

  it('contains 4 workspace surfaces', () => {
    const surfaces = APP_SPEC.workspaces.map((w) => w.surface).sort();
    expect(surfaces).toEqual(['archive', 'departments', 'projects', 'settings']);
  });

  it('Departments workspace has exactly 12 dashboards', () => {
    const dept = APP_SPEC.workspaces.find((w) => w.surface === 'departments')!;
    expect(dept.dashboards).toHaveLength(12);
  });

  it('every Tab/Box/Popup ref is unique and well-formed', () => {
    const tabs = new Set<string>();
    const boxes = new Set<string>();
    const popups = new Set<string>();
    for (const ws of APP_SPEC.workspaces) {
      for (const d of ws.dashboards) {
        for (const t of d.tabs) {
          expect(tabs.has(t.ref)).toBe(false);
          tabs.add(t.ref);
          expect(t.ref.startsWith(`${d.dashboard}.`)).toBe(true);
          for (const b of t.boxes) {
            expect(boxes.has(b.ref)).toBe(false);
            boxes.add(b.ref);
            expect(b.ref.startsWith(`${t.ref}.`)).toBe(true);
          }
          for (const p of t.popups) {
            expect(popups.has(p.ref)).toBe(false);
            popups.add(p.ref);
            expect(p.ref.startsWith(`${t.ref}.`)).toBe(true);
          }
        }
      }
    }
  });
});

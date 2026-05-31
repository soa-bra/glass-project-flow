/**
 * Projects dashboard spec coverage
 * Validates that all 8 spec tabs for the "projects" dashboard resolve and
 * every box componentRef is registered in BOX_KIT_REGISTRY.
 *
 * @specRef ProjectManagementBoard (8 tabs, 29 boxes)
 */
import { describe, it, expect } from 'vitest';
import { APP_SPEC } from '@/config/app-spec';
import { BOX_KIT_REGISTRY } from '@/components/box-kit/registry';

function findDashboard(key: string) {
  for (const w of APP_SPEC.workspaces) {
    for (const d of w.dashboards as ReadonlyArray<any>) {
      if (d.key === key) return d as any;
    }
  }
  return undefined;
}

describe('Projects dashboard — spec coverage', () => {
  const dashboard = findDashboard('projects');

  it('exists in APP_SPEC with 8 tabs', () => {
    expect(dashboard).toBeDefined();
    expect(dashboard.tabs).toHaveLength(8);
  });

  it('every box componentRef is registered', () => {
    const missing: string[] = [];
    for (const tab of dashboard.tabs) {
      for (const box of tab.boxes ?? []) {
        for (const ref of box.componentRefs ?? []) {
          if (ref === 'BaseBox') continue; // wrapper, not a registry primitive
          if (!(ref in BOX_KIT_REGISTRY)) missing.push(`${tab.code}/${box.ref}:${ref}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('every popup componentRef is registered', () => {
    const missing: string[] = [];
    for (const tab of dashboard.tabs) {
      for (const popup of tab.popups ?? []) {
        for (const ref of popup.componentRefs ?? []) {
          if (!(ref in BOX_KIT_REGISTRY)) missing.push(`${tab.code}/${popup.ref}:${ref}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});

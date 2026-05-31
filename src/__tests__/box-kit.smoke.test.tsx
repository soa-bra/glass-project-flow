/**
 * Renders the first spec tab from each workspace to confirm the chain:
 * app-spec.ts → TabRenderer → BoxRenderer → registry → primitives.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TabRenderer } from '@/components/box-kit';
import { APP_SPEC } from '@/config/app-spec';

describe('Box-Kit renderer smoke', () => {
  for (const ws of APP_SPEC.workspaces) {
    const firstDash = ws.dashboards[0];
    const firstTab = firstDash?.tabs[0];
    if (!firstTab) continue;
    it(`renders first tab of ${ws.surface}/${firstDash.dashboard} without crashing`, () => {
      const { container } = render(<TabRenderer tab={firstTab} />);
      expect(container.querySelectorAll('[data-box-ref]').length).toBe(firstTab.boxes.length);
    });
  }
});

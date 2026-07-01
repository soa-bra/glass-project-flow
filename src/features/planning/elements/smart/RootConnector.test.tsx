import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConnectionAnchors } from './RootConnector';

describe('ConnectionAnchors', () => {
  it('places the root connector handle on the right side at 1/4 height (Miro style, top-3/4)', () => {
    const onStartDrag = vi.fn();

    render(
      <svg>
        <ConnectionAnchors
          elementId="selected-element"
          bounds={{ x: 120, y: 80, width: 240, height: 160 }}
          onStartDrag={onStartDrag}
        />
      </svg>,
    );

    const anchorGroup = document.querySelector('[data-anchor-element-id="selected-element"]') as SVGGElement;
    expect(anchorGroup).toHaveAttribute('data-anchor-position', 'right');
    expect(anchorGroup).toHaveAttribute('data-anchor-hit', 'true');

    // right = bounds.x + bounds.width + OFFSET_X(12), bounds.y + height * 0.25
    const expectedX = 120 + 240 + 12; // 372
    const expectedY = 80 + 160 * 0.25; // 120

    const hitArea = anchorGroup.querySelector('.connection-anchor-hit') as SVGCircleElement;
    // hit circle is centered on the shaft midpoint (anchor.x + SHAFT/2)
    expect(hitArea.getAttribute('cy')).toBe(String(expectedY));

    fireEvent.pointerDown(hitArea);

    expect(onStartDrag).toHaveBeenCalledWith({
      elementId: 'selected-element',
      x: expectedX,
      y: expectedY,
      anchorPoint: 'right',
    });
  });
});

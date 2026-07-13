import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConnectionAnchors } from './RootConnector';

describe('ConnectionAnchors', () => {
  it('places the root connector anchor at the T1/T2 boundary (y = height/6) with a one-handle gap', () => {
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

    // GAP = 8 (single selection-handle width), y = bounds.y + height/6
    const expectedX = 120 + 240 + 8; // 368
    const expectedY = 80 + 160 / 6;  // ≈ 106.666...

    const hitArea = anchorGroup.querySelector('.connection-anchor-hit') as SVGCircleElement;
    expect(Number(hitArea.getAttribute('cy'))).toBeCloseTo(expectedY, 5);

    fireEvent.pointerDown(hitArea);

    expect(onStartDrag).toHaveBeenCalledWith({
      elementId: 'selected-element',
      x: expectedX,
      y: expectedY,
      anchorPoint: 'right',
    });
  });
});

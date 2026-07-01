import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConnectionAnchors } from './RootConnector';

describe('ConnectionAnchors', () => {
  it('places the root connector handle at the top-right of the element (Miro style)', () => {
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
    expect(anchorGroup).toHaveAttribute('data-anchor-position', 'top-right');

    // top-right = bounds.x + bounds.width + OFFSET_X, bounds.y - OFFSET_Y
    const expectedX = 120 + 240 + 14; // 374
    const expectedY = 80 - 14; // 66

    const hitArea = anchorGroup.querySelector('.connection-anchor-hit') as SVGCircleElement;
    expect(hitArea).toHaveAttribute('cx', String(expectedX));
    expect(hitArea).toHaveAttribute('cy', String(expectedY));

    fireEvent.pointerDown(hitArea);

    expect(onStartDrag).toHaveBeenCalledWith({
      elementId: 'selected-element',
      x: expectedX,
      y: expectedY,
      anchorPoint: 'top-right',
    });
  });
});

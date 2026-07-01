import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConnectionAnchors } from './RootConnector';

describe('ConnectionAnchors', () => {
  it('places the root connector handle on the selected element upper side', () => {
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
    expect(anchorGroup).toHaveAttribute('data-anchor-position', 'top');

    const hitArea = anchorGroup.querySelector('.connection-anchor-hit') as SVGCircleElement;
    expect(hitArea).toHaveAttribute('cx', '240');
    expect(hitArea).toHaveAttribute('cy', '80');

    fireEvent.pointerDown(hitArea);

    expect(onStartDrag).toHaveBeenCalledWith({
      elementId: 'selected-element',
      x: 240,
      y: 80,
      anchorPoint: 'top',
    });
  });
});

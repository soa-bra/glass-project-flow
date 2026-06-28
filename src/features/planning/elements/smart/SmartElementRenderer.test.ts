import { getVisibleSmartElementTitle } from './SmartElementRenderer';
import type { CanvasSmartElement } from '@/types/canvas-elements';

const buildElement = (overrides: Partial<CanvasSmartElement> = {}): CanvasSmartElement => ({
  id: 'smart-element-1',
  type: 'smart',
  smartType: 'kanban',
  position: { x: 0, y: 0 },
  size: { width: 320, height: 240 },
  data: {},
  ...overrides,
} as CanvasSmartElement);

describe('getVisibleSmartElementTitle', () => {
  it('uses the localized smart element label when title is the raw smart type', () => {
    const title = getVisibleSmartElementTitle(
      { title: 'kanban' },
      {},
      buildElement(),
      'kanban',
    );

    expect(title).toBe('لوحة كانبان');
  });

  it('uses the localized smart element label when another title candidate is a raw smart type', () => {
    const title = getVisibleSmartElementTitle(
      { name: 'gantt' },
      {},
      buildElement({ smartType: 'gantt' }),
      'gantt',
    );

    expect(title).toBe('مخطط جانت');
  });

  it('keeps meaningful custom titles before falling back to the type label', () => {
    const title = getVisibleSmartElementTitle(
      { title: 'خطة إطلاق المنتج' },
      {},
      buildElement(),
      'kanban',
    );

    expect(title).toBe('خطة إطلاق المنتج');
  });
});

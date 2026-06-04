import { describe, expect, it } from 'vitest';
import type { CanvasElement } from '@/features/planning/domain/types/canvas.types';
import type { PlanningElement } from '@/services/central/planningBoards.service';
import { canvasToPlanningInsert, planningElementToCanvas } from './planningElementMapper';

function createPlanningElement(overrides: Partial<PlanningElement> = {}): PlanningElement {
  return {
    id: '33333333-3333-4333-8333-333333333333',
    board_id: '11111111-1111-4111-8111-111111111111',
    created_by: '22222222-2222-4222-8222-222222222222',
    element_type: 'text',
    position: { x: 10, y: 20 },
    size: { width: 120, height: 48 },
    rotation: 0,
    z_index: 3,
    content: { label: 'Layered text' },
    style: {},
    metadata: { layerId: 'layer-b' },
    locked_by: null,
    locked_at: null,
    schema_version: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
    ...overrides,
  } as PlanningElement;
}

describe('planningElementMapper layer membership', () => {
  it('restores layerId from persisted metadata', () => {
    const element = planningElementToCanvas(createPlanningElement());

    expect(element.layerId).toBe('layer-b');
  });

  it('persists layerId in metadata when saving a canvas element', () => {
    const element: CanvasElement = {
      id: '33333333-3333-4333-8333-333333333333',
      type: 'text',
      position: { x: 10, y: 20 },
      size: { width: 120, height: 48 },
      style: {},
      data: { label: 'Layered text' },
      metadata: { color: 'blue' },
      layer: 3,
      layerId: 'layer-b',
    };

    const row = canvasToPlanningInsert(
      element,
      '11111111-1111-4111-8111-111111111111',
      '22222222-2222-4222-8222-222222222222',
    );

    expect(row.metadata).toMatchObject({ color: 'blue', layerId: 'layer-b' });
  });
});

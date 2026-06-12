import { describe, expect, it } from 'vitest';
import { toPlanningConnectorLogicalRecord } from './planningConnectorAdapter';
import { isOperationalRelationshipType } from './relationshipTypes';
import type { CanvasElement } from '@/types/canvas';

describe('planning connector adapter', () => {
  it('maps root connector canvas elements to persisted smart connector records', () => {
    const element: CanvasElement = {
      id: 'connector-1',
      type: 'smart',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      style: {},
      data: {
        smartType: 'root_connector',
        startPoint: {
          elementId: 'source-1',
          x: 10,
          y: 20,
          anchorPoint: 'right',
        },
        endPoint: {
          elementId: 'target-1',
          x: 90,
          y: 20,
          anchorPoint: 'left',
        },
        connectionType: 'blocks',
        title: 'اعتماد حرج',
        color: '#111827',
        strokeWidth: 3,
        style: 'dashed',
      },
    };

    const record = toPlanningConnectorLogicalRecord(element, 'board-1');

    expect(record).toMatchObject({
      connector_element_id: 'connector-1',
      board_id: 'board-1',
      source_element_id: 'source-1',
      target_element_id: 'target-1',
      relationship_type: 'blocks',
      connector_kind: 'root_connector',
      label: 'اعتماد حرج',
    });
    expect(record?.style).toMatchObject({
      color: '#111827',
      strokeWidth: 3,
      lineStyle: 'dashed',
    });
  });

  it('prefers explicit relationshipType for connector inspector updates', () => {
    const element: CanvasElement = {
      id: 'connector-2',
      type: 'smart',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      style: {},
      data: {
        smartType: 'root_connector',
        startPoint: { elementId: 'source-1', x: 0, y: 50, anchorPoint: 'left' },
        endPoint: { elementId: 'target-1', x: 100, y: 50, anchorPoint: 'right' },
        connectionType: 'references',
        relationshipType: 'funds',
      },
    };

    expect(toPlanningConnectorLogicalRecord(element, 'board-1')?.relationship_type).toBe('funds');
  });

  it('classifies operational relationship types for data link mirroring', () => {
    expect(isOperationalRelationshipType('depends_on')).toBe(true);
    expect(isOperationalRelationshipType('blocks')).toBe(true);
    expect(isOperationalRelationshipType('funds')).toBe(true);
    expect(isOperationalRelationshipType('delivers')).toBe(true);
    expect(isOperationalRelationshipType('references')).toBe(false);
    expect(isOperationalRelationshipType('causes')).toBe(false);
  });

});

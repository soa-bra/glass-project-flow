import { describe, expect, it } from 'vitest';
import { toPlanningConnectorLogicalRecord, toPlanningConnectorLogicalRecords } from './planningConnectorAdapter';
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
        status: 'approved',
        connectorMode: 'operational',
        approvedByUser: true,
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
        connectionType: 'reference',
        relationshipType: 'funds',
        status: 'approved',
        connectorMode: 'semantic',
        approvedByUser: true,
      },
    };

    expect(toPlanningConnectorLogicalRecord(element, 'board-1')?.relationship_type).toBe('funds');
  });

  it('persists approved generic links between arbitrary smart elements', () => {
    const element: CanvasElement = {
      id: 'connector-generic-link',
      type: 'smart',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      style: {},
      data: {
        smartType: 'root_connector',
        startPoint: { elementId: 'smart-doc-1', x: 0, y: 50, anchorPoint: 'right' },
        endPoint: { elementId: 'smart-sheet-1', x: 100, y: 50, anchorPoint: 'left' },
        relationshipType: 'link',
        connectorMode: 'semantic',
        status: 'approved',
        approvedByUser: true,
        title: 'رابط سياقي',
      },
      metadata: {
        source: { entityId: 'smart-doc-1', entityType: 'planning_element' },
        target: { entityId: 'smart-sheet-1', entityType: 'planning_element' },
      },
    };

    const record = toPlanningConnectorLogicalRecord(element, 'board-1');

    expect(record).toMatchObject({
      connector_element_id: 'connector-generic-link',
      source_element_id: 'smart-doc-1',
      target_element_id: 'smart-sheet-1',
      relationship_type: 'link',
      connector_kind: 'root_connector',
      label: 'رابط سياقي',
      approvedByUser: true,
    });
    expect(record?.sourceEntityType).toBe('planning_element');
    expect(record?.targetEntityType).toBe('planning_element');
  });

  it('expands branched root connectors into sub-anchor logical records', () => {
    const element: CanvasElement = {
      id: '12345678-1234-4234-9234-123456789abc',
      type: 'smart',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      style: {},
      data: {
        smartType: 'root_connector',
        startPoint: {
          elementId: 'source-1',
          x: 0,
          y: 50,
          anchorPoint: 'right',
          subAnchor: 'source-top-output',
        },
        endPoint: { elementId: 'target-original', x: 100, y: 50, anchorPoint: 'left' },
        relationshipType: 'dependency',
        connectorMode: 'operational',
        status: 'approved',
        approvedByUser: true,
        branches: [
          {
            id: 'branch-a',
            sourceSubAnchor: 'source-top-output',
            targetSubAnchor: 'target-a-input',
            targetPoint: { elementId: 'target-a', x: 160, y: 30, anchorPoint: 'left' },
          },
          {
            id: 'branch-b',
            sourceSubAnchor: 'source-bottom-output',
            targetSubAnchor: 'target-b-input',
            targetPoint: { elementId: 'target-b', x: 160, y: 90, anchorPoint: 'left' },
          },
        ],
      },
    };

    const records = toPlanningConnectorLogicalRecords(element, 'board-1');

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      connector_element_id: '12345678-1234-4234-9234-000000000001',
      source_element_id: 'source-1',
      target_element_id: 'target-a',
      branchId: 'branch-a',
      branchIndex: 0,
    });
    expect(records[0].style).toMatchObject({
      sourceSubAnchor: 'source-top-output',
      targetSubAnchor: 'target-a-input',
    });
    expect(records[0].metadata).toMatchObject({
      branchId: 'branch-a',
      branchIndex: 0,
      sourceSubAnchor: 'source-top-output',
      targetSubAnchor: 'target-a-input',
    });
    expect(records[1]).toMatchObject({
      connector_element_id: '12345678-1234-4234-9234-000000000002',
      source_element_id: 'source-1',
      target_element_id: 'target-b',
      branchId: 'branch-b',
      branchIndex: 1,
    });
    expect(records[1].style).toMatchObject({
      sourceSubAnchor: 'source-bottom-output',
      targetSubAnchor: 'target-b-input',
    });
  });

  it('classifies operational relationship types for data link mirroring', () => {
    expect(isOperationalRelationshipType('depends_on')).toBe(true);
    expect(isOperationalRelationshipType('blocks')).toBe(true);
    expect(isOperationalRelationshipType('funds')).toBe(true);
    expect(isOperationalRelationshipType('delivers')).toBe(true);
    expect(isOperationalRelationshipType('reference')).toBe(false);
    expect(isOperationalRelationshipType('references')).toBe(false);
    expect(isOperationalRelationshipType('causes')).toBe(false);
  });

  it('keeps visual-only connectors out of logical relationship persistence', () => {
    const element: CanvasElement = {
      id: 'connector-3',
      type: 'visual_connector',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      style: { stroke: '#9CA3AF' },
      data: {
        startNodeId: 'source-1',
        endNodeId: 'target-1',
        connectorMode: 'visual',
        color: '#9CA3AF',
      },
    };

    expect(toPlanningConnectorLogicalRecord(element, 'board-1')).toBeNull();
  });

  it('requires an approved semantic relationship type before creating a logical record', () => {
    const element: CanvasElement = {
      id: 'connector-4',
      type: 'smart',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      style: {},
      data: {
        smartType: 'root_connector',
        startPoint: { elementId: 'source-1', x: 0, y: 50, anchorPoint: 'left' },
        endPoint: { elementId: 'target-1', x: 100, y: 50, anchorPoint: 'right' },
        relationshipType: 'dependency',
        connectorMode: 'semantic',
        requiresReview: true,
        isAIGenerated: true,
        approvedByUser: false,
      },
    };

    expect(toPlanningConnectorLogicalRecord(element, 'board-1')).toBeNull();
  });

});

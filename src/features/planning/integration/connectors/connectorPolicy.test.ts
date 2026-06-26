import { describe, expect, it } from 'vitest';
import {
  canCreateConnector,
  validateRelationshipType,
  type ConnectorPolicyElement,
} from './connectorPolicy';

const editableBoard = {
  canEditBoard: true,
  canCreateOperationalRelationship: true,
};

function element(overrides: Partial<ConnectorPolicyElement>): ConnectorPolicyElement {
  return {
    id: 'element-id',
    type: 'smart-element',
    smartType: 'task_card',
    canRead: true,
    canConnect: true,
    canCreateOperationalRelationship: true,
    ...overrides,
  };
}

describe('connectorPolicy', () => {
  it('allows a visual connector between readable eligible elements', () => {
    const decision = canCreateConnector({
      board: { canEditBoard: true },
      source: element({ id: 'source', type: 'component', smartType: null, canCreateOperationalRelationship: false }),
      target: element({ id: 'target', type: 'frame', smartType: null, canCreateOperationalRelationship: false }),
      relationshipType: 'references',
    });

    expect(decision.allowed).toBe(true);
  });

  it('allows current visual relationship types between arbitrary smart element types', () => {
    const decision = canCreateConnector({
      board: { canEditBoard: true },
      source: element({ id: 'vote', smartType: 'voting', canCreateOperationalRelationship: false }),
      target: element({ id: 'diagram', smartType: 'visual_diagram', canCreateOperationalRelationship: false }),
      relationshipType: 'reference',
    });

    expect(decision.allowed).toBe(true);
  });

  it('allows general link relationships between smart elements and regular components', () => {
    const decision = canCreateConnector({
      board: { canEditBoard: true },
      source: element({ id: 'brainstorm', smartType: 'brainstorming', canCreateOperationalRelationship: false }),
      target: element({ id: 'component', type: 'component', smartType: null, canCreateOperationalRelationship: false }),
      relationshipType: 'link',
    });

    expect(decision.allowed).toBe(true);
  });

  it('allows operational dependencies for all supported smart element types', () => {
    const decision = canCreateConnector({
      board: editableBoard,
      source: element({ id: 'matrix', smartType: 'decisions_matrix' }),
      target: element({ id: 'mind-map', smartType: 'mind_map' }),
      relationshipType: 'dependency',
    });

    expect(decision.allowed).toBe(true);
  });

  it('allows an operational relationship when the board and both endpoints are eligible', () => {
    const decision = canCreateConnector({
      board: editableBoard,
      source: element({ id: 'budget', smartType: 'finance_card' }),
      target: element({ id: 'project', smartType: 'project_card' }),
      relationshipType: 'funds',
    });

    expect(decision.allowed).toBe(true);
  });

  it('denies a relationship when the actor cannot edit the board', () => {
    const decision = canCreateConnector({
      board: { canEditBoard: false },
      source: element({ id: 'source' }),
      target: element({ id: 'target' }),
      relationshipType: 'references',
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain('صلاحية تعديل اللوحة');
  });

  it('denies a relationship type that is not valid between endpoint types', () => {
    const decision = validateRelationshipType({
      source: element({ id: 'task', smartType: 'task_card' }),
      target: element({ id: 'project', smartType: 'project_card' }),
      relationshipType: 'funds',
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain('غير مسموح');
  });

  it('denies self-linking attempts', () => {
    const decision = canCreateConnector({
      board: editableBoard,
      source: element({ id: 'same' }),
      target: element({ id: 'same' }),
      relationshipType: 'references',
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain('لا يمكن ربط العنصر بنفسه');
  });
});

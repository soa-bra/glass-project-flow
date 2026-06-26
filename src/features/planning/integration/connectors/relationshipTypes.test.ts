import { describe, expect, it } from 'vitest';
import { toCentralDependencyRelationshipType } from './relationshipTypes';

describe('relationshipTypes', () => {
  it('maps canonical operational relationship types to central dependency enum values', () => {
    expect(toCentralDependencyRelationshipType('dependency')).toBe('depends_on');
    expect(toCentralDependencyRelationshipType('temporal')).toBe('time');
    expect(toCentralDependencyRelationshipType('risk')).toBe('blocks');
    expect(toCentralDependencyRelationshipType('cause_effect')).toBe('causes');
    expect(toCentralDependencyRelationshipType('financial')).toBe('funds');
    expect(toCentralDependencyRelationshipType('responsibility')).toBe('delivers');
  });

  it('keeps legacy central dependency values unchanged', () => {
    expect(toCentralDependencyRelationshipType('depends_on')).toBe('depends_on');
    expect(toCentralDependencyRelationshipType('blocks')).toBe('blocks');
    expect(toCentralDependencyRelationshipType('funds')).toBe('funds');
    expect(toCentralDependencyRelationshipType('delivers')).toBe('delivers');
  });

  it('returns null for relationships that should not create central dependency rows', () => {
    expect(toCentralDependencyRelationshipType('link')).toBeNull();
    expect(toCentralDependencyRelationshipType('knowledge')).toBeNull();
    expect(toCentralDependencyRelationshipType('unknown')).toBeNull();
  });
});

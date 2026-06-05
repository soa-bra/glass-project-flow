import { describe, expect, it } from 'vitest';
import {
  areContextSmartMenuSelectionIdsPersistable,
  calculateContextSmartMenuPosition,
} from './ContextSmartMenu';

describe('calculateContextSmartMenuPosition', () => {
  it('accounts for the board frame offset when positioning selected elements', () => {
    const position = calculateContextSmartMenuPosition(
      [
        { position: { x: 10, y: 20 }, size: { width: 100, height: 50 } },
        { position: { x: 200, y: 80 }, size: { width: 80, height: 40 } },
      ],
      { zoom: 2, pan: { x: 30, y: 40 } },
      { left: 240, top: 96 },
    );

    expect(position).toEqual({ x: 560, y: 156 });
  });

  it('keeps the menu at least 60px below the board frame top', () => {
    const position = calculateContextSmartMenuPosition(
      [{ position: { x: 0, y: 0 }, size: { width: 100, height: 50 } }],
      { zoom: 1, pan: { x: 0, y: 0 } },
      { left: 10, top: 120 },
    );

    expect(position).toEqual({ x: 60, y: 180 });
  });
});

describe('areContextSmartMenuSelectionIdsPersistable', () => {
  it('accepts UUID planning element ids for executable conversion', () => {
    expect(areContextSmartMenuSelectionIdsPersistable([
      '11111111-1111-4111-8111-111111111111',
      '22222222-2222-4222-9222-222222222222',
    ])).toBe(true);
  });

  it('rejects legacy or unsaved ids before executable conversion', () => {
    expect(areContextSmartMenuSelectionIdsPersistable([
      '11111111-1111-4111-8111-111111111111',
      'legacy-note-id',
    ])).toBe(false);
  });
});

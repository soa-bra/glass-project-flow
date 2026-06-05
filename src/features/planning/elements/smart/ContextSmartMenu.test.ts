import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  areContextSmartMenuSelectionIdsPersisted,
  calculateContextSmartMenuPosition,
} from './ContextSmartMenu';

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  eq: vi.fn(),
  in: vi.fn(),
  from: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mocks.from,
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.from.mockReturnValue({ select: mocks.select });
  mocks.select.mockReturnValue({ eq: mocks.eq });
  mocks.eq.mockReturnValue({ in: mocks.in });
});

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

describe('areContextSmartMenuSelectionIdsPersisted', () => {
  const boardId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const firstId = '11111111-1111-4111-8111-111111111111';
  const secondId = '22222222-2222-4222-9222-222222222222';

  it('accepts selected ids that already exist in planning_elements', async () => {
    mocks.in.mockResolvedValue({ data: [{ id: firstId }, { id: secondId }], error: null });

    await expect(areContextSmartMenuSelectionIdsPersisted(boardId, [firstId, secondId])).resolves.toBe(true);

    expect(mocks.from).toHaveBeenCalledWith('planning_elements');
    expect(mocks.eq).toHaveBeenCalledWith('board_id', boardId);
    expect(mocks.in).toHaveBeenCalledWith('id', [firstId, secondId]);
  });

  it('rejects UUID ids that are not persisted yet', async () => {
    mocks.in.mockResolvedValue({ data: [{ id: firstId }], error: null });

    await expect(areContextSmartMenuSelectionIdsPersisted(boardId, [firstId, secondId])).resolves.toBe(false);
  });

  it('rejects legacy ids before querying persistence', async () => {
    await expect(areContextSmartMenuSelectionIdsPersisted(boardId, [firstId, 'legacy-note-id'])).resolves.toBe(false);

    expect(mocks.from).not.toHaveBeenCalled();
  });
});

import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBoardInvites } from './useBoardInvites';

const maybeSingle = vi.fn();
const order = vi.fn();
const eq = vi.fn(() => ({ eq, maybeSingle, order }));
const select = vi.fn(() => ({ eq, maybeSingle, order }));
const from = vi.fn(() => ({ select }));
const channelOn = vi.fn(() => ({ subscribe: vi.fn(() => 'channel') }));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from,
    channel: vi.fn(() => ({ on: channelOn })),
    removeChannel: vi.fn(),
    auth: { getUser: vi.fn() },
  },
}));

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }));

describe('useBoardInvites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    maybeSingle.mockResolvedValue({ data: { id: 'invite-1', board_id: 'board-1', token: 'abc123', is_active: true, expires_at: null, created_at: '2026-01-01T00:00:00Z' }, error: null });
    order.mockResolvedValue({ data: [], error: null });
  });

  it('loads an active email/share invite link and exposes its join URL for review', async () => {
    const { result } = renderHook(() => useBoardInvites({ boardId: 'board-1', isHost: false }));

    await waitFor(() => expect(result.current.activeLink?.token).toBe('abc123'));

    expect(from).toHaveBeenCalledWith('board_invite_links');
    expect(result.current.getInviteUrl()).toBe('http://localhost:3000/join/abc123');
  });
});

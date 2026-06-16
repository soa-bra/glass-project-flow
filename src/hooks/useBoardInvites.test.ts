import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBoardInvites } from './useBoardInvites';

const { fromMock, insertMock, toastErrorMock, toastSuccessMock, getUserMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  getUserMock: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getUser: getUserMock },
    from: fromMock,
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    })),
    removeChannel: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
    info: vi.fn(),
  },
}));

const createSelectQuery = (data: unknown[] = []) => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue({ data, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
});

const createInsertQuery = (result: { data?: unknown; error?: unknown }) => ({
  insert: insertMock.mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: result.data ?? null, error: result.error ?? null }),
    }),
  }),
});

describe('useBoardInvites email invites', () => {
  beforeEach(() => {
    fromMock.mockReset();
    insertMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
    getUserMock.mockReset();
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    fromMock.mockImplementation((table: string) => {
      if (table === 'board_email_invites') return createSelectQuery();
      return createSelectQuery();
    });
  });

  it('لا يستدعي Supabase insert عند إدخال إيميل غير صالح', async () => {
    const { result } = renderHook(() => useBoardInvites({ boardId: 'board-1', isHost: true }));

    await act(async () => {
      const invite = await result.current.sendEmailInvite({ email: 'not-an-email', role: 'viewer' });
      expect(invite).toBeNull();
    });

    expect(insertMock).not.toHaveBeenCalled();
    expect(toastErrorMock).toHaveBeenCalledWith('يرجى إدخال بريد إلكتروني صالح');
  });

  it('يستخدم viewer كصلاحية افتراضية في تجربة الدعوة ويحفظ الإيميل الصالح', async () => {
    const savedInvite = {
      id: 'invite-1',
      board_id: 'board-1',
      email: 'valid@example.com',
      role: 'viewer',
      status: 'pending',
      invited_by: 'user-1',
      created_at: '2026-06-15T12:00:00Z',
      accepted_at: null,
    };
    fromMock.mockImplementation((table: string) => {
      if (table === 'board_email_invites') return createInsertQuery({ data: savedInvite });
      return createSelectQuery();
    });

    const { result } = renderHook(() => useBoardInvites({ boardId: 'board-1', isHost: true }));

    await act(async () => {
      await result.current.sendEmailInvite({ email: ' Valid@Example.com ', role: 'viewer' });
    });

    expect(insertMock).toHaveBeenCalledWith({
      board_id: 'board-1',
      email: 'valid@example.com',
      role: 'viewer',
      invited_by: 'user-1',
    });
    expect(toastSuccessMock).toHaveBeenCalledWith('تم تسجيل الدعوة. يحتاج إرسال البريد الفعلي إلى تكامل بريد.');
    await waitFor(() => expect(result.current.recentEmailInvites[0]).toEqual(savedInvite));
  });

  it('يعرض رسالة خطأ عند فشل Supabase', async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === 'board_email_invites') return createInsertQuery({ error: { message: 'duplicate' } });
      return createSelectQuery();
    });

    const { result } = renderHook(() => useBoardInvites({ boardId: 'board-1', isHost: true }));

    await act(async () => {
      const invite = await result.current.sendEmailInvite({ email: 'valid@example.com', role: 'editor' });
      expect(invite).toBeNull();
    });

    expect(toastErrorMock).toHaveBeenCalledWith('فشل في حفظ الدعوة');
    expect(result.current.emailInviteError).toBe('فشل في حفظ الدعوة');
  });
});

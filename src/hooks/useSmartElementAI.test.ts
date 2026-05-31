import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSmartElementAI } from './useSmartElementAI';
import { useCollaborationStore } from '@/stores/collaborationStore';

const { invokeMock, toastErrorMock, toastSuccessMock } = vi.hoisted(() => ({
  invokeMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    })),
    functions: {
      invoke: invokeMock,
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

describe('useSmartElementAI permissions', () => {
  beforeEach(() => {
    invokeMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    useCollaborationStore.setState({
      participants: [],
      currentUserId: null,
      isHost: false,
      isConnected: false,
    });
  });

  it.each([
    {
      label: 'viewer',
      storeState: {
        currentUserId: 'viewer-user',
        isHost: false,
        participants: [{
          id: 'viewer-user',
          name: 'Viewer',
          color: '#999',
          role: 'viewer' as const,
          online: true,
          inVoiceCall: false,
          isMuted: true,
          isSpeaking: false,
        }],
      },
    },
    {
      label: 'guest',
      storeState: {
        currentUserId: null,
        isHost: false,
        participants: [],
      },
    },
  ])('blocks $label from starting generate/analyze/transform', async ({ storeState }) => {
    useCollaborationStore.setState(storeState);
    const { result } = renderHook(() => useSmartElementAI());

    await act(async () => {
      await result.current.generateElements('أنشئ خطة');
      await result.current.analyzeSelection(['element-1']);
      await result.current.transformElements(['element-1'], 'kanban');
    });

    expect(invokeMock).not.toHaveBeenCalled();
    expect(window.confirm).not.toHaveBeenCalled();
    expect(toastErrorMock).toHaveBeenCalled();
  });
});

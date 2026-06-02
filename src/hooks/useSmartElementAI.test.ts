import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSmartElementAI } from './useSmartElementAI';
import { useCollaborationStore } from '@/stores/collaborationStore';

const { invokeMock, toastErrorMock, toastInfoMock, toastSuccessMock, authUserMock } = vi.hoisted(() => ({
  invokeMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastInfoMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  authUserMock: vi.fn(),
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
    info: toastInfoMock,
    success: toastSuccessMock,
  },
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: authUserMock(),
  }),
}));

describe('useSmartElementAI permissions', () => {
  beforeEach(() => {
    invokeMock.mockReset();
    toastErrorMock.mockReset();
    toastInfoMock.mockReset();
    toastSuccessMock.mockReset();
    authUserMock.mockReset();
    authUserMock.mockReturnValue(null);
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

  it('waits for human approval before retrying a sensitive transformation', async () => {
    authUserMock.mockReturnValue({ id: 'host-user' });
    useCollaborationStore.setState({
      currentUserId: 'host-user',
      isHost: true,
      participants: [],
      isConnected: true,
    });

    const sensitivity = {
      isSensitive: true,
      score: 0.94,
      reasons: ['contains confidential planning data'],
    };
    const approvedResult = {
      elements: [],
      layout: 'grid' as const,
      summary: 'تم التحويل بعد الاعتماد',
    };

    const approvalRequiredPayload = {
      code: 'HUMAN_APPROVAL_REQUIRED',
      error: 'التحويل حساس ويتطلب موافقة بشرية',
      sensitivity,
    };
    const approvalRequiredError = Object.assign(new Error('Edge Function returned a non-2xx status code'), {
      context: {
        json: vi.fn().mockResolvedValue(approvalRequiredPayload),
        clone: vi.fn(() => ({
          json: vi.fn().mockResolvedValue(approvalRequiredPayload),
        })),
      },
    });

    invokeMock
      .mockResolvedValueOnce({
        data: null,
        error: approvalRequiredError,
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          result: approvedResult,
        },
        error: null,
      });

    const { result } = renderHook(() => useSmartElementAI());

    let transformPromise!: Promise<typeof approvedResult | null>;
    act(() => {
      transformPromise = result.current.transformElements(
        [{ id: 'element-1', title: 'Confidential roadmap' }],
        'kanban',
        'حوّلها إلى كانبان',
      );
    });

    await waitFor(() => {
      expect(invokeMock).toHaveBeenCalledTimes(1);
      expect((result.current.approvalDialog as any).props.request).toMatchObject({
        targetType: 'kanban',
        sensitivity,
      });
    });

    expect((result.current.approvalDialog as any).props.request).not.toBeNull();
    expect(window.confirm).not.toHaveBeenCalled();
    expect(invokeMock).toHaveBeenCalledTimes(1);

    let transformed: typeof approvedResult | null = null;
    await act(async () => {
      (result.current.approvalDialog as any).props.onApprove('تمت مراجعة التحويل واعتماده');
      transformed = await transformPromise;
    });

    expect(transformed).toEqual(approvedResult);
    expect(invokeMock).toHaveBeenCalledTimes(2);
    expect(invokeMock.mock.calls[1][1].body.context.humanApproval).toMatchObject({
      approved: true,
      approverId: 'host-user',
      approvalReason: 'تمت مراجعة التحويل واعتماده',
    });
    expect(window.confirm).not.toHaveBeenCalled();
    expect(toastSuccessMock).toHaveBeenCalledWith('تم تحويل العناصر بنجاح', {
      description: approvedResult.summary,
    });
  });
});

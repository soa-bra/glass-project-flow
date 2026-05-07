import { useCallback, useMemo } from 'react';
import { useCollaborationUser } from '@/hooks/useCollaborationUser';

interface UseCanvasRealtimeControllerOptions {
  boardId: string;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

export function useCanvasRealtimeController({ boardId, viewport }: UseCanvasRealtimeControllerOptions) {
  const collaborationUser = useCollaborationUser();

  const handleSyncStatusChange = useCallback((status: string) => {
    console.log('Sync status:', status);
  }, []);

  const realtimeProps = useMemo(() => ({
    boardId,
    userId: collaborationUser.id,
    userName: collaborationUser.name,
    enabled: true,
    viewport,
    onSyncStatusChange: handleSyncStatusChange,
  }), [boardId, collaborationUser.id, collaborationUser.name, handleSyncStatusChange, viewport]);

  return useMemo(() => ({
    realtimeProps,
  }), [realtimeProps]);
}

export default useCanvasRealtimeController;

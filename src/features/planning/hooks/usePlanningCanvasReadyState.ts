import { useMemo, type RefObject } from 'react';

type LoadingSource = {
  loading?: boolean;
};

type HydrationSource = {
  isHydrated?: boolean;
  hydrationStatus?: 'idle' | 'loading' | 'hydrated' | 'error' | string;
  hydrationError?: unknown;
  hydratedBoardId?: string | null;
};

type ViewportHostSize = {
  width?: number;
  height?: number;
} | null | undefined;

type UsePlanningCanvasReadyStateOptions = {
  boardId: string;
  boardRole: LoadingSource;
  sync: HydrationSource;
  aiPermissions: LoadingSource;
  viewportHostSize?: ViewportHostSize;
  canvasHostRef?: RefObject<HTMLElement | null>;
};

function hasUsableSize(size: ViewportHostSize): boolean {
  return Boolean(size && Number(size.width) > 0 && Number(size.height) > 0);
}

function hasMeasuredHost(ref?: RefObject<HTMLElement | null>): boolean {
  const host = ref?.current;
  if (!host) return false;
  return host.clientWidth > 0 && host.clientHeight > 0;
}

export function usePlanningCanvasReadyState({
  boardId,
  boardRole,
  sync,
  aiPermissions,
  viewportHostSize,
  canvasHostRef,
}: UsePlanningCanvasReadyStateOptions) {
  return useMemo(() => {
    const isRoleReady = !boardRole.loading;
    const isHydrated = sync.isHydrated === true || sync.hydrationStatus === 'hydrated';
    const isHydratedForBoard = !sync.hydratedBoardId || sync.hydratedBoardId === boardId;
    const isHydrationReady = isHydrated && isHydratedForBoard && !sync.hydrationError;
    const areAIPermissionsReady = !aiPermissions.loading;
    const isViewportReady = hasUsableSize(viewportHostSize) || hasMeasuredHost(canvasHostRef);
    const pendingReasons = [
      !isRoleReady ? 'board-role' : null,
      !isHydrationReady ? 'hydration' : null,
      !areAIPermissionsReady ? 'ai-permissions' : null,
      !isViewportReady ? 'viewport' : null,
    ].filter((reason): reason is string => Boolean(reason));

    return {
      isReady: pendingReasons.length === 0,
      isRoleReady,
      isHydrationReady,
      areAIPermissionsReady,
      isViewportReady,
      pendingReasons,
    };
  }, [
    aiPermissions.loading,
    boardId,
    boardRole.loading,
    canvasHostRef,
    sync.hydratedBoardId,
    sync.hydrationError,
    sync.hydrationStatus,
    sync.isHydrated,
    viewportHostSize,
  ]);
}

export default usePlanningCanvasReadyState;

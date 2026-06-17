import { useMemo } from 'react';

export type PlanningCanvasReadyReason =
  | 'missing-board'
  | 'board-role-loading'
  | 'ai-permissions-loading'
  | 'hydrating-elements'
  | 'hydration-error'
  | 'viewport-not-ready'
  | 'persistence-error'
  | 'ready';

export type PlanningCanvasHydrationStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'hydrated'
  | 'error';

export interface PlanningCanvasReadyInput {
  boardId: string | null;
  canEdit: boolean;
  boardRoleLoading: boolean;
  aiPermissionsLoading: boolean;
  viewportHostSize: { width: number; height: number } | null;
  hydrationStatus: PlanningCanvasHydrationStatus | string;
  hydrationError?: unknown;
  persistenceStatus: 'idle' | 'saving' | 'saved' | 'error' | string;
  realtimeStatus: 'connected' | 'disconnected' | 'connecting' | string;
}

export interface PlanningCanvasReadyState {
  isReady: boolean;
  reason: PlanningCanvasReadyReason;
  pendingReasons: PlanningCanvasReadyReason[];
  requiresManualRefreshVerification: true;
  manualRefreshVerification: string;
}

function readyState(
  reason: PlanningCanvasReadyReason,
  manualRefreshVerification: string,
): PlanningCanvasReadyState {
  return {
    isReady: reason === 'ready',
    reason,
    pendingReasons: reason === 'ready' ? [] : [reason],
    requiresManualRefreshVerification: true,
    manualRefreshVerification,
  };
}

function isViewportReady(viewportHostSize: PlanningCanvasReadyInput['viewportHostSize']): boolean {
  return Boolean(viewportHostSize && viewportHostSize.width > 0 && viewportHostSize.height > 0);
}

export function resolvePlanningCanvasReadyState(input: PlanningCanvasReadyInput): PlanningCanvasReadyState {
  if (!input.boardId) {
    return readyState(
      'missing-board',
      'افتح رابط اللوحة مباشرة بعد refresh كامل وتأكد أن إطار الكانفس يظهر بدون لوحة مختارة مسبقاً.',
    );
  }

  if (input.boardRoleLoading) {
    return readyState(
      'board-role-loading',
      'من refresh جديد، افتح اللوحة وتأكد أن الصلاحيات تنتهي من التحميل قبل ظهور أدوات التحرير.',
    );
  }

  if (input.aiPermissionsLoading) {
    return readyState(
      'ai-permissions-loading',
      'من refresh جديد، تأكد أن أذونات الذكاء الاصطناعي تنتهي من التحميل قبل ظهور أدوات AI.',
    );
  }

  if (input.hydrationStatus === 'idle' || input.hydrationStatus === 'loading') {
    return readyState(
      'hydrating-elements',
      'من refresh جديد للمتصفح، افتح اللوحة وانتظر تحميل عناصر planning_elements قبل اعتماد التذكرة.',
    );
  }

  if (input.hydrationStatus === 'error' || input.hydrationError) {
    return readyState(
      'hydration-error',
      'بعد refresh جديد، افتح اللوحة وتأكد أن فشل تحميل عناصر planning_elements يبقى ظاهراً وغير مخفي خلف الكانفس.',
    );
  }

  if (!isViewportReady(input.viewportHostSize)) {
    return readyState(
      'viewport-not-ready',
      'من refresh جديد، تأكد أن قياس مساحة الكانفس متاح قبل رسم اللوحة والأدوات.',
    );
  }

  if (input.canEdit && input.persistenceStatus === 'error') {
    return readyState(
      'persistence-error',
      'بعد refresh جديد، عدّل عنصراً على الكانفس وتأكد أن خطأ الحفظ ظاهر وقابل للمراجعة.',
    );
  }

  return readyState(
    'ready',
    'من نافذة جديدة أو refresh كامل، افتح اللوحة وتأكد أن الكانفس، الأدوات، والعناصر المحمّلة تظهر قبل الاكتفاء بأي typecheck.',
  );
}

export function usePlanningCanvasReadyState(input: PlanningCanvasReadyInput): PlanningCanvasReadyState {
  return useMemo(
    () => resolvePlanningCanvasReadyState(input),
    [
      input.boardId,
      input.canEdit,
      input.boardRoleLoading,
      input.aiPermissionsLoading,
      input.viewportHostSize?.width,
      input.viewportHostSize?.height,
      input.hydrationStatus,
      input.hydrationError,
      input.persistenceStatus,
      input.realtimeStatus,
    ],
  );
}

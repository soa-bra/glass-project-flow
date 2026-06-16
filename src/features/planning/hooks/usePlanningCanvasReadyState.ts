
export interface PlanningCanvasReadyState {
  isReady: boolean;
  reason: PlanningCanvasReadyReason;
  requiresManualRefreshVerification: true;
  manualRefreshVerification: string;
}

export function resolvePlanningCanvasReadyState(input: PlanningCanvasReadyInput): PlanningCanvasReadyState {
  if (!input.boardId) {
    return {
      isReady: false,
      reason: 'missing-board',
      requiresManualRefreshVerification: true,
      manualRefreshVerification: 'افتح رابط اللوحة مباشرة بعد refresh كامل وتأكد أن إطار الكانفس يظهر بدون لوحة مختارة مسبقاً.',
    };
  }

  if (input.hydrationStatus === 'idle' || input.hydrationStatus === 'loading') {
    return {
      isReady: false,
      reason: 'hydrating-elements',
      requiresManualRefreshVerification: true,
      manualRefreshVerification: 'من refresh جديد للمتصفح، افتح اللوحة وانتظر تحميل عناصر planning_elements قبل اعتماد التذكرة.',
    };
  }

  if (input.canEdit && input.persistenceStatus === 'error') {
    return {
      isReady: false,
      reason: 'persistence-error',
      requiresManualRefreshVerification: true,
      manualRefreshVerification: 'بعد refresh جديد، عدّل عنصراً على الكانفس وتأكد أن خطأ الحفظ ظاهر وقابل للمراجعة.',
    };
  }

  return {
    isReady: true,
    reason: 'ready',
    requiresManualRefreshVerification: true,
    manualRefreshVerification: 'من نافذة جديدة أو refresh كامل، افتح اللوحة وتأكد أن الكانفس، الأدوات، والعناصر المحمّلة تظهر قبل الاكتفاء بأي typecheck.',
  };
}

export function usePlanningCanvasReadyState(input: PlanningCanvasReadyInput): PlanningCanvasReadyState {
  return useMemo(
    () => resolvePlanningCanvasReadyState(input),
    [input.boardId, input.canEdit, input.hydrationStatus, input.persistenceStatus, input.realtimeStatus],
  );
}
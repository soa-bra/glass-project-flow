import { useMemo } from "react";
import { useCollaborationStore } from "@/stores/collaborationStore";
import { CanvasRole, useCurrentBoardRole } from "./useCurrentBoardRole";

export type CanvasAIPermissionScope = "generate" | "analyze" | "transform";

export interface CanvasAIPermissionState {
  role: CanvasRole;
  userId: string | null;
  loading: boolean;
  trustedSession: boolean;
  canUseAI: boolean;
  denialReason: string | null;
}

interface ResolveCanvasAIPermissionsInput {
  role: CanvasRole;
  userId?: string | null;
  loading?: boolean;
  trustedSession?: boolean;
}

export const CANVAS_AI_DENIAL_REASONS = {
  loading: "يتم التحقق من صلاحيات الذكاء الاصطناعي...",
  untrustedSession: "لا يمكن استخدام الذكاء الاصطناعي لأن الجلسة غير موثوقة.",
  guest: "لا يمكن للضيف استخدام أدوات الذكاء الاصطناعي على اللوحة.",
  viewer: "دور المشاهد لا يملك صلاحية استخدام أدوات الذكاء الاصطناعي.",
} as const;

export function resolveCanvasAIPermissions({
  role,
  userId = null,
  loading = false,
  trustedSession,
}: ResolveCanvasAIPermissionsInput): CanvasAIPermissionState {
  const normalizedUserId = userId && userId !== "anonymous-user" ? userId : null;
  const isTrustedSession = trustedSession ?? Boolean(normalizedUserId);

  if (loading) {
    return {
      role,
      userId: normalizedUserId,
      loading: true,
      trustedSession: isTrustedSession,
      canUseAI: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.loading,
    };
  }

  if (role === "guest") {
    return {
      role,
      userId: normalizedUserId,
      loading: false,
      trustedSession: isTrustedSession,
      canUseAI: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.guest,
    };
  }

  if (role === "viewer") {
    return {
      role,
      userId: normalizedUserId,
      loading: false,
      trustedSession: isTrustedSession,
      canUseAI: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.viewer,
    };
  }

  if (!isTrustedSession) {
    return {
      role,
      userId: normalizedUserId,
      loading: false,
      trustedSession: false,
      canUseAI: false,
      denialReason: CANVAS_AI_DENIAL_REASONS.untrustedSession,
    };
  }

  return {
    role,
    userId: normalizedUserId,
    loading: false,
    trustedSession: isTrustedSession,
    canUseAI: true,
    denialReason: null,
  };
}

function getCollaborationRole(): CanvasRole {
  const { currentUserId, isHost, participants } = useCollaborationStore.getState();

  if (!currentUserId || currentUserId === "anonymous-user") return "guest";
  if (isHost) return "host";

  return participants.find((participant) => participant.id === currentUserId)?.role ?? "viewer";
}

export function getCanvasAIPermissions(): CanvasAIPermissionState {
  const { currentUserId } = useCollaborationStore.getState();

  return resolveCanvasAIPermissions({
    role: getCollaborationRole(),
    userId: currentUserId,
  });
}

export function useCanvasAIPermissions(boardId?: string | null): CanvasAIPermissionState {
  const boardRole = useCurrentBoardRole(boardId);
  const currentUserId = useCollaborationStore((state) => state.currentUserId);
  const isHost = useCollaborationStore((state) => state.isHost);
  const participants = useCollaborationStore((state) => state.participants);

  const collaborationRole = useMemo<CanvasRole>(() => {
    if (!currentUserId || currentUserId === "anonymous-user") return "guest";
    if (isHost) return "host";
    return participants.find((participant) => participant.id === currentUserId)?.role ?? "viewer";
  }, [currentUserId, isHost, participants]);

  return useMemo(() => {
    const hasBoardRole = Boolean(boardId) && !boardRole.loading;
    const role = hasBoardRole ? boardRole.role : collaborationRole;
    const userId = hasBoardRole ? boardRole.userId : currentUserId;

    return resolveCanvasAIPermissions({
      role,
      userId,
      loading: Boolean(boardId) && boardRole.loading,
    });
  }, [boardId, boardRole.loading, boardRole.role, boardRole.userId, collaborationRole, currentUserId]);
}

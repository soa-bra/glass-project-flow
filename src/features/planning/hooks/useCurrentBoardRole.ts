/**
 * useCurrentBoardRole — Resolves the active user's role on a planning board.
 *
 * Planning boards use board-scoped user_roles plus owner fallback. This hook
 * returns:
 *   - 'host'   when the user owns the board or has an owner-like board role
 *   - 'editor' when the user has a board role that can write
 *   - 'viewer' when the user can only read
 *   - 'guest'  when not authenticated or explicitly guest
 *
 * Used by canvas command gateways and UI components that need to disable
 * mutating actions (Smart Doc creation, AI assist, etc.) for non-editors.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type CanvasRole = "host" | "editor" | "viewer" | "guest";
type AppRole = Database["public"]["Enums"]["app_role"];

interface State {
  role: CanvasRole;
  userId: string | null;
  loading: boolean;
}

const HOST_ROLES = new Set<AppRole>(["owner"]);
const EDITOR_ROLES = new Set<AppRole>([
  "department_manager",
  "project_manager",
  "release_manager",
  "qa_lead",
  "sre",
  "ai_analyst",
  "team_member",
]);

export function mapAppRoleToCanvasRole(role: AppRole | null | undefined): CanvasRole {
  if (!role || role === "guest") return "guest";
  if (HOST_ROLES.has(role)) return "host";
  if (EDITOR_ROLES.has(role)) return "editor";
  return "viewer";
}

const ROLE_RANK: Record<CanvasRole, number> = {
  guest: 0,
  viewer: 1,
  editor: 2,
  host: 3,
};

export function highestCanvasRole(...roles: CanvasRole[]): CanvasRole {
  return roles.reduce((best, role) => (
    ROLE_RANK[role] > ROLE_RANK[best] ? role : best
  ), "guest" as CanvasRole);
}

export function useCurrentBoardRole(boardId: string | null | undefined): State {
  const [state, setState] = useState<State>({
    role: "guest",
    userId: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    if (!boardId) {
      setState({ role: "guest", userId: null, loading: false });
      return;
    }

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id ?? null;
      if (!userId) {
        if (!cancelled) setState({ role: "guest", userId: null, loading: false });
        return;
      }
      const [{ data: board }, { data: boardRoles }, { data: globalRoles }] = await Promise.all([
        supabase
        .from("planning_boards")
        .select("owner_id")
        .eq("id", boardId)
          .maybeSingle(),
        supabase
          .from("user_roles")
          .select("role, expires_at, granted_at")
          .eq("user_id", userId)
          .eq("scope_type", "board")
          .eq("scope_id", boardId)
          .order("granted_at", { ascending: false }),
        supabase
          .from("user_roles")
          .select("role, expires_at, granted_at")
          .eq("user_id", userId)
          .eq("scope_type", "global")
          .is("scope_id", null)
          .order("granted_at", { ascending: false }),
      ]);

      let role: CanvasRole = board && board.owner_id === userId ? "host" : "viewer";

      const isActiveRole = (entry: { expires_at: string | null }) => {
        if (!entry.expires_at) return true;
        return new Date(entry.expires_at).getTime() > Date.now();
      };

      const activeGlobalRole = (globalRoles ?? []).find(isActiveRole);
      const activeBoardRole = (boardRoles ?? []).find(isActiveRole);

      if (role !== "host") {
        const boardScopedRole = activeBoardRole
          ? mapAppRoleToCanvasRole(activeBoardRole.role)
          : "viewer";
        const globalRole = activeGlobalRole
          ? mapAppRoleToCanvasRole(activeGlobalRole.role)
          : "viewer";
        role = highestCanvasRole(role, boardScopedRole, globalRole);
      }

      if (!cancelled) setState({ role, userId, loading: false });
    })();

    return () => {
      cancelled = true;
    };
  }, [boardId]);

  return state;
}

export function canMutateCanvas(role: CanvasRole): boolean {
  return role === "host" || role === "editor";
}

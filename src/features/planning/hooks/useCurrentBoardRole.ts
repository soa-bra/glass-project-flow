/**
 * useCurrentBoardRole — Resolves the active user's role on a planning board.
 *
 * Planning boards currently use a single-owner model (RLS enforces it). This
 * hook returns:
 *   - 'host'   when the user owns the board (or is a global owner)
 *   - 'viewer' otherwise (signed-in but no write access)
 *   - 'guest'  when not authenticated
 *
 * Used by canvas command gateways and UI components that need to disable
 * mutating actions (Smart Doc creation, AI assist, etc.) for non-editors.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CanvasRole = "host" | "editor" | "viewer" | "guest";

interface State {
  role: CanvasRole;
  userId: string | null;
  loading: boolean;
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
      const { data: board } = await supabase
        .from("planning_boards")
        .select("owner_id")
        .eq("id", boardId)
        .maybeSingle();
      const role: CanvasRole = board && board.owner_id === userId ? "host" : "viewer";
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

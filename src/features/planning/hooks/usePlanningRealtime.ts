/**
 * usePlanningRealtime — Supabase Realtime channel for a planning board (UR-005).
 *
 * Responsibilities:
 * 1. Subscribe to `postgres_changes` on `planning_elements` filtered by board.
 *    INSERT / UPDATE / DELETE events are forwarded to the supplied callbacks
 *    so the caller (canvas store) can reconcile in place.
 * 2. Maintain a Supabase Presence map of collaborators (user_id, displayName,
 *    color, cursor x/y, lastSeen). Live cursors are throttled via
 *    `broadcast` events (cheaper than Presence updates).
 *
 * Constraints from docs/CANVAS_LIMITATIONS.md:
 * - Max 25 concurrent collaborators per channel.
 * - Cursor broadcast throttled to ~30ms.
 *
 * Usage:
 *   const { peers, broadcastCursor } = usePlanningRealtime({
 *     boardId,
 *     onElementInsert, onElementUpdate, onElementDelete,
 *   });
 */
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { PlanningElement } from "@/services/central/planningBoards.service";

export interface PresencePeer {
  user_id: string;
  display_name: string;
  color: string;
  cursor?: { x: number; y: number };
  /** Element the peer is currently editing/locking, if any. */
  editing_element_id?: string | null;
  lastSeen: number;
}

interface CursorBroadcastPayload {
  user_id: string;
  x: number;
  y: number;
  t: number;
}

interface UsePlanningRealtimeOptions {
  boardId: string | null;
  selfDisplayName?: string;
  onElementInsert?: (row: PlanningElement) => void;
  onElementUpdate?: (row: PlanningElement) => void;
  onElementDelete?: (id: string) => void;
}

/** Deterministic color from a string (hashed → HSL). */
function colorFromId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 70% 50%)`;
}

const CURSOR_THROTTLE_MS = 30;

export function usePlanningRealtime({
  boardId,
  selfDisplayName,
  onElementInsert,
  onElementUpdate,
  onElementDelete,
}: UsePlanningRealtimeOptions) {
  const [peers, setPeers] = useState<Record<string, PresencePeer>>({});
  const [selfUserId, setSelfUserId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "disconnected" | "error"
  >("idle");
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const markSynced = useCallback(() => setLastSyncAt(Date.now()), []);
  const lastCursorAtRef = useRef(0);
  const selfStateRef = useRef<PresencePeer | null>(null);

  // Stable refs for change callbacks (avoid re-subscribing on each render).
  const cbRef = useRef({ onElementInsert, onElementUpdate, onElementDelete });
  useEffect(() => {
    cbRef.current = { onElementInsert, onElementUpdate, onElementDelete };
  }, [onElementInsert, onElementUpdate, onElementDelete]);

  // Resolve current user id once.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setSelfUserId(data.user?.id ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Open / tear down channel when board or user changes.
  useEffect(() => {
    if (!boardId || !selfUserId) return;

    const channel = supabase.channel(`planning:${boardId}`, {
      config: { presence: { key: selfUserId } },
    });
    channelRef.current = channel;

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "planning_elements",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => cbRef.current.onElementInsert?.(payload.new as PlanningElement),
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "planning_elements",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => cbRef.current.onElementUpdate?.(payload.new as PlanningElement),
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "planning_elements",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          const id = (payload.old as { id?: string } | null)?.id;
          if (id) cbRef.current.onElementDelete?.(id);
        },
      )
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresencePeer>();
        const next: Record<string, PresencePeer> = {};
        for (const key of Object.keys(state)) {
          const meta = state[key]?.[0];
          if (meta) next[key] = { ...meta, lastSeen: Date.now() };
        }
        setPeers(next);
      })
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        const p = payload as CursorBroadcastPayload;
        if (!p?.user_id || p.user_id === selfUserId) return;
        setPeers((prev) => {
          const existing = prev[p.user_id];
          if (!existing) return prev;
          return {
            ...prev,
            [p.user_id]: {
              ...existing,
              cursor: { x: p.x, y: p.y },
              lastSeen: p.t,
            },
          };
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const base: PresencePeer = {
            user_id: selfUserId,
            display_name: selfDisplayName ?? "متعاون",
            color: colorFromId(selfUserId),
            editing_element_id: null,
            lastSeen: Date.now(),
          };
          selfStateRef.current = base;
          await channel.track(base);
        }
      });

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
      selfStateRef.current = null;
      setPeers({});
    };
  }, [boardId, selfUserId, selfDisplayName]);

  /** Throttled cursor broadcast (call from pointermove). */
  const broadcastCursor = useCallback((x: number, y: number) => {
    const ch = channelRef.current;
    if (!ch || !selfUserId) return;
    const now = Date.now();
    if (now - lastCursorAtRef.current < CURSOR_THROTTLE_MS) return;
    lastCursorAtRef.current = now;
    void ch.send({
      type: "broadcast",
      event: "cursor",
      payload: { user_id: selfUserId, x, y, t: now } satisfies CursorBroadcastPayload,
    });
  }, [selfUserId]);

  /** Patch self presence (e.g. which element is being edited). */
  const updateSelfPresence = useCallback(
    async (patch: Partial<Pick<PresencePeer, "editing_element_id">>) => {
      const ch = channelRef.current;
      const base = selfStateRef.current;
      if (!ch || !base) return;
      const next: PresencePeer = { ...base, ...patch, lastSeen: Date.now() };
      selfStateRef.current = next;
      await ch.track(next);
    },
    [],
  );

  const peerList = useMemo(
    () => Object.values(peers).filter((p) => p.user_id !== selfUserId),
    [peers, selfUserId],
  );

  return {
    peers: peerList,
    peersById: peers,
    selfUserId,
    broadcastCursor,
    updateSelfPresence,
    isConnected: !!channelRef.current,
  };
}

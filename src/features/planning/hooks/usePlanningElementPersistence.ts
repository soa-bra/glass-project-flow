import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlanningBoardsService } from "@/services/central";
import { usePlanningStore } from "@/features/planning/state/store";
import { canvasToPlanningInsert } from "@/features/planning/state/planningElementMapper";
import type { CanvasElement } from "@/types/canvas";

const SAVE_DEBOUNCE_MS = 700;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function stableElementSignature(elements: CanvasElement[]): string {
  return JSON.stringify(
    elements
      .filter((element) => UUID_RE.test(element.id))
      .map((element) => ({
        id: element.id,
        type: element.type,
        position: element.position,
        size: element.size,
        rotation: element.rotation,
        layer: element.layer,
        data: element.data,
        content: element.content,
        style: element.style,
        metadata: element.metadata,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
}

async function upsertSmartDocsForElements(
  boardId: string,
  userId: string,
  elements: CanvasElement[],
): Promise<void> {
  const smartDocElements = elements
    .filter((element) => {
      const smartType = element.data?.smartType ?? element.metadata?.smartType;
      return smartType === "interactive_sheet" || smartType === "smart_text_doc";
    });

  const rows = smartDocElements.map((element) => ({
      board_id: boardId,
      element_id: element.id,
      title:
        (typeof element.data?.title === "string" && element.data.title) ||
        (element.data?.smartType === "interactive_sheet" ? "جدول تفاعلي" : "مستند نصي ذكي"),
      content: (element.data ?? {}) as Record<string, unknown>,
      status: "draft",
      metadata: {
        source: "planning-canvas",
        smartType: element.data?.smartType ?? element.metadata?.smartType,
      },
      created_by: userId,
    }));

  if (rows.length === 0) return;

  const { error } = await supabase
    .from("smart_docs" as any)
    .upsert(rows as any, { onConflict: "element_id" });

  if (error) {
    console.warn("[usePlanningElementPersistence] Failed to upsert smart_docs", error);
  }

  const docIds = smartDocElements.map((element) => element.id);
  const { error: deleteLinksError } = await supabase
    .from("data_links" as any)
    .delete()
    .eq("board_id", boardId)
    .in("target_element_id", docIds)
    .eq("link_kind", "reference");

  if (deleteLinksError) {
    console.warn("[usePlanningElementPersistence] Failed to refresh smart doc links", deleteLinksError);
    return;
  }

  const linkRows = smartDocElements.flatMap((element) => {
    const data = (element.data ?? {}) as Record<string, unknown>;
    const metadata = (element.metadata ?? {}) as Record<string, unknown>;
    const rawSourceIds = data.sourceElementIds ?? metadata.sourceElementIds;
    const sourceElementIds = Array.isArray(rawSourceIds)
      ? rawSourceIds.filter((sourceId): sourceId is string => typeof sourceId === "string" && UUID_RE.test(sourceId))
      : [];

    return sourceElementIds.map((sourceElementId) => ({
      board_id: boardId,
      created_by: userId,
      source_element_id: sourceElementId,
      target_element_id: element.id,
      link_kind: "reference",
      label: "canvas.document.linked",
      mapping: {
        source: "selected-canvas-elements",
        target: element.data?.smartType ?? element.metadata?.smartType,
      },
      metadata: {
        event: "canvas.document.linked",
        source: "planning-canvas",
      },
    }));
  });

  if (linkRows.length === 0) return;

  const { error: linksError } = await supabase.from("data_links" as any).insert(linkRows as any);

  if (linksError) {
    console.warn("[usePlanningElementPersistence] Failed to insert smart doc links", linksError);
  }

  const { error: auditError } = await supabase.from("audit_events" as any).insert(
    linkRows.map((link) => ({
      action: "canvas.document.linked",
      actor_id: userId,
      decision: "allowed",
      resource_type: "planning_element",
      resource_id: link.target_element_id,
      scope_type: "board",
      scope_id: boardId,
      metadata: {
        ...link.metadata,
        link,
      },
    })) as any,
  );

  if (auditError) {
    console.warn("[usePlanningElementPersistence] Failed to audit smart doc links", auditError);
  }
}

export function usePlanningElementPersistence(boardId: string | null, enabled = true): void {
  const userIdRef = useRef<string | null>(null);
  const lastPersistedSignatureRef = useRef<string>("");
  const lastElementIdsRef = useRef<Set<string>>(new Set());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) userIdRef.current = data.user?.id ?? null;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!boardId || !enabled) return;

    const initialElements = usePlanningStore.getState().elements;
    lastPersistedSignatureRef.current = stableElementSignature(initialElements);
    lastElementIdsRef.current = new Set(
      initialElements.filter((element) => UUID_RE.test(element.id)).map((element) => element.id),
    );

    const unsubscribe = usePlanningStore.subscribe((state) => {
      const elements = state.elements;
      const signature = stableElementSignature(elements);
      if (signature === lastPersistedSignatureRef.current) return;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        const userId = userIdRef.current;
        if (!userId) return;

        const currentElements = usePlanningStore.getState().elements;
        const currentPersistable = currentElements.filter((element) => UUID_RE.test(element.id));
        const currentIds = new Set(currentPersistable.map((element) => element.id));
        const deletedIds = [...lastElementIdsRef.current].filter((id) => !currentIds.has(id));

        try {
          await Promise.all(deletedIds.map((id) => PlanningBoardsService.deletePlanningElement(id)));
          await PlanningBoardsService.upsertPlanningElements(
            currentPersistable.map((element) => canvasToPlanningInsert(element, boardId, userId)),
          );
          await upsertSmartDocsForElements(boardId, userId, currentPersistable);

          lastElementIdsRef.current = currentIds;
          lastPersistedSignatureRef.current = stableElementSignature(currentElements);
        } catch (error) {
          console.error("[usePlanningElementPersistence] Failed to persist planning elements", error);
        }
      }, SAVE_DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [boardId, enabled]);
}

export default usePlanningElementPersistence;

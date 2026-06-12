import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlanningBoardsService } from "@/services/central";
import { usePlanningStore } from "@/features/planning/state/store";
import { canvasToPlanningInsert } from "@/features/planning/state/planningElementMapper";
import { isPlanningElementId } from "@/features/planning/state/createPlanningElementId";
import type { CanvasElement } from "@/types/canvas";
import type { Database, Json } from "@/integrations/supabase/types";

const SAVE_DEBOUNCE_MS = 700;
type SmartDocInsert = Database["public"]["Tables"]["smart_docs"]["Insert"];
type DataLinkInsert = Database["public"]["Tables"]["data_links"]["Insert"];
type AuditEventInsert = Database["public"]["Tables"]["audit_events"]["Insert"];

export type PlanningElementPersistenceStatus =
  | "disabled"
  | "idle"
  | "pending"
  | "saving"
  | "saved"
  | "error";

export type PlanningElementPersistenceState = {
  status: PlanningElementPersistenceStatus;
  error: string | null;
  lastPersistedAt: Date | null;
};

function stableElementSignature(elements: CanvasElement[]): string {
  return JSON.stringify(
    elements
      .filter((element) => isPlanningElementId(element.id))
      .map((element) => ({
        id: element.id,
        type: element.type,
        position: element.position,
        size: element.size,
        rotation: element.rotation,
        layer: element.layer,
        layerId: element.layerId,
        data: element.data,
        content: element.content,
        style: element.style,
        metadata: element.metadata,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown planning element persistence error";
}

function asPlainRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readSmartDocSourceElementIds(element: CanvasElement): string[] {
  const data = asPlainRecord(element.data);
  const dataMeta = asPlainRecord(data.meta);
  const metadata = asPlainRecord(element.metadata);
  const rawSourceIds = data.sourceElementIds ?? dataMeta.sourceElementIds ?? metadata.sourceElementIds;

  return Array.isArray(rawSourceIds)
    ? rawSourceIds.filter((sourceId): sourceId is string => isPlanningElementId(sourceId))
    : [];
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

  const rows: SmartDocInsert[] = smartDocElements.map((element) => {
    const sourceElementIds = readSmartDocSourceElementIds(element);

    return {
      board_id: boardId,
      element_id: element.id,
      title:
        (typeof element.data?.title === "string" && element.data.title) ||
        (element.data?.smartType === "interactive_sheet" ? "جدول تفاعلي" : "مستند نصي ذكي"),
      content: (element.data ?? {}) as Json,
      status: "draft",
      source_element_ids: sourceElementIds,
      metadata: {
        source: "planning-canvas",
        smartType: element.data?.smartType ?? element.metadata?.smartType,
        sourceElementIds,
        sourceElementCount: sourceElementIds.length,
      } as Json,
      created_by: userId,
    };
  });

  if (rows.length === 0) return;

  const { error } = await supabase
    .from("smart_docs")
    .upsert(rows, { onConflict: "element_id" });

  if (error) {
    throw new Error(`Failed to upsert smart_docs: ${error.message}`);
  }

  const docIds = smartDocElements.map((element) => element.id);
  const { error: deleteLinksError } = await supabase
    .from("data_links")
    .delete()
    .eq("board_id", boardId)
    .in("target_element_id", docIds)
    .eq("link_kind", "reference");

  if (deleteLinksError) {
    throw new Error(`Failed to refresh smart doc links: ${deleteLinksError.message}`);
  }

  const linkRows: DataLinkInsert[] = smartDocElements.flatMap((element) => {
    const sourceElementIds = readSmartDocSourceElementIds(element);

    return sourceElementIds.map((sourceElementId) => ({
      board_id: boardId,
      created_by: userId,
      source_element_id: sourceElementId,
      target_element_id: element.id,
      source_type: "planning_element",
      source_id: sourceElementId,
      target_type: "smart_doc",
      target_id: element.id,
      link_kind: "reference",
      relation_type: "reference",
      sync_type: "document_generation",
      label: "canvas.document.linked",
      mapping: {
        source: "selected-canvas-elements",
        target: element.data?.smartType ?? element.metadata?.smartType,
      } as Json,
      fields_map: {
        source: "selected-canvas-elements",
        target: element.data?.smartType ?? element.metadata?.smartType,
      } as Json,
      metadata: {
        event: "canvas.document.linked",
        source: "planning-canvas",
      } as Json,
    }));
  });

  if (linkRows.length === 0) return;

  const { error: linksError } = await supabase.from("data_links").insert(linkRows);

  if (linksError) {
    throw new Error(`Failed to insert smart doc links: ${linksError.message}`);
  }

  const auditRows: AuditEventInsert[] = linkRows.map((link) => ({
      action: "canvas.document.linked",
      actor_id: userId,
      decision: "allowed",
      resource_type: "planning_element",
      resource_id: link.target_element_id,
      scope_type: "board",
      scope_id: boardId,
      metadata: {
        ...((link.metadata ?? {}) as Record<string, unknown>),
        link,
      } as unknown as Json,
    }));
  const { error: auditError } = await supabase.from("audit_events").insert(auditRows);

  if (auditError) {
    throw new Error(`Failed to audit smart doc links: ${auditError.message}`);
  }
}

export function usePlanningElementPersistence(
  boardId: string | null,
  enabled = true,
): PlanningElementPersistenceState {
  const userIdRef = useRef<string | null>(null);
  const lastPersistedSignatureRef = useRef<string>("");
  const lastElementIdsRef = useRef<Set<string>>(new Set());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [persistenceState, setPersistenceState] = useState<PlanningElementPersistenceState>({
    status: boardId && enabled ? "idle" : "disabled",
    error: null,
    lastPersistedAt: null,
  });

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
    if (!boardId || !enabled) {
      setPersistenceState((current) => ({
        ...current,
        status: "disabled",
        error: null,
      }));
      return;
    }

    setPersistenceState((current) => ({
      ...current,
      status: "idle",
      error: null,
    }));

    const initialElements = usePlanningStore.getState().elements;
    lastPersistedSignatureRef.current = stableElementSignature(initialElements);
    lastElementIdsRef.current = new Set(
      initialElements.filter((element) => isPlanningElementId(element.id)).map((element) => element.id),
    );

    const unsubscribe = usePlanningStore.subscribe((state) => {
      const elements = state.elements;
      const signature = stableElementSignature(elements);
      if (signature === lastPersistedSignatureRef.current) return;

      setPersistenceState((current) => ({
        ...current,
        status: "pending",
        error: null,
      }));

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        const userId = userIdRef.current;
        if (!userId) {
          setPersistenceState((current) => ({
            ...current,
            status: "error",
            error: "Cannot persist planning elements without an authenticated user",
          }));
          return;
        }

        setPersistenceState((current) => ({
          ...current,
          status: "saving",
          error: null,
        }));

        const currentElements = usePlanningStore.getState().elements;
        const currentPersistable = currentElements.filter((element) => isPlanningElementId(element.id));
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
          setPersistenceState({
            status: "saved",
            error: null,
            lastPersistedAt: new Date(),
          });
        } catch (error) {
          console.error("[usePlanningElementPersistence] Failed to persist planning elements", error);
          setPersistenceState((current) => ({
            ...current,
            status: "error",
            error: getErrorMessage(error),
          }));
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

  return persistenceState;
}

export default usePlanningElementPersistence;
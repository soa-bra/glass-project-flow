import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlanningBoardsService } from "@/services/central";
import { usePlanningStore } from "@/features/planning/state/store";
import { canvasToPlanningInsert } from "@/features/planning/state/planningElementMapper";
import { isPlanningElementId } from "@/features/planning/state/createPlanningElementId";
import { useInteractionStore } from "@/stores/interactionStore";
import type { CanvasElement } from "@/types/canvas";
import type { Database, Json } from "@/integrations/supabase/types";

const SAVE_DEBOUNCE_MS = 1200;
const SIGNATURE_THROTTLE_MS = 200;
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

function stableSingleElementSignature(element: CanvasElement): string {
  return JSON.stringify({
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
  });
}

function stableElementSignature(elements: CanvasElement[]): string {
  return JSON.stringify(
    elements
      .filter((element) => isPlanningElementId(element.id))
      .map((element) => ({ id: element.id, signature: stableSingleElementSignature(element) }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
}

function stableElementSignatureMap(elements: CanvasElement[]): Map<string, string> {
  return new Map(
    elements
      .filter((element) => isPlanningElementId(element.id))
      .map((element) => [element.id, stableSingleElementSignature(element)]),
  );
}

function getSmartDocElementSignature(element: CanvasElement): string | null {
  const smartType = element.data?.smartType ?? element.metadata?.smartType;
  if (smartType !== "interactive_sheet" && smartType !== "smart_text_doc") return null;

  return JSON.stringify({
    id: element.id,
    smartType,
    title: element.data?.title,
    data: element.data,
    sourceElementIds: readSmartDocSourceElementIds(element),
    metadataSourceElementIds: asPlainRecord(element.metadata).sourceElementIds,
  });
}

function stableSmartDocSignature(elements: CanvasElement[]): string {
  return JSON.stringify(
    elements
      .map(getSmartDocElementSignature)
      .filter((signature): signature is string => Boolean(signature))
      .sort(),
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

function getPersistableElements(): CanvasElement[] {
  return usePlanningStore.getState().elements.filter((element) => isPlanningElementId(element.id));
}

function getDeletedPersistedIds(lastElementIds: Set<string>, currentElements: CanvasElement[]): string[] {
  const currentIds = new Set(currentElements.map((element) => element.id));
  return [...lastElementIds].filter((id) => !currentIds.has(id));
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
  const lastElementSignaturesRef = useRef<Map<string, string>>(new Map());
  const lastSmartDocSignatureRef = useRef<string>("");
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
    lastElementSignaturesRef.current = stableElementSignatureMap(initialElements);
    lastSmartDocSignatureRef.current = stableSmartDocSignature(initialElements);
    lastElementIdsRef.current = new Set(
      initialElements.filter((element) => isPlanningElementId(element.id)).map((element) => element.id),
    );

    const persistDeletedElements = async (deletedIds: string[]): Promise<void> => {
      if (deletedIds.length === 0) return;
      await Promise.all(deletedIds.map((id) => PlanningBoardsService.deletePlanningElement(id)));
      usePlanningStore.getState().acknowledgeDeletedElements(deletedIds);
    };

    let lastSignatureCheckAt = 0;
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    let lastSelectionKey = usePlanningStore.getState().selectedElementIds.join(",");

    const evaluateAndSchedule = () => {
      throttleTimer = null;
      lastSignatureCheckAt = Date.now();
      const elements = usePlanningStore.getState().elements;
      const signature = stableElementSignature(elements);
      if (signature === lastPersistedSignatureRef.current) return;

      setPersistenceState((current) => ({
        ...current,
        status: "pending",
        error: null,
      }));

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(runSave, SAVE_DEBOUNCE_MS);
    };

    const runSave = async () => {
        if (useInteractionStore.getState().localMutatingElementIds.length > 0) {
          saveTimerRef.current = setTimeout(() => {
            usePlanningStore.setState((current) => ({ elements: current.elements }));
          }, SAVE_DEBOUNCE_MS);
          return;
        }

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
        const currentSignatureMap = stableElementSignatureMap(currentPersistable);
        const changedPersistable = currentPersistable.filter(
          (element) => lastElementSignaturesRef.current.get(element.id) !== currentSignatureMap.get(element.id),
        );
        const currentIds = new Set(currentPersistable.map((element) => element.id));
        const deletedIds = [...lastElementIdsRef.current].filter((id) => !currentIds.has(id));
        const nextSmartDocSignature = stableSmartDocSignature(currentPersistable);
        const smartDocsChanged = nextSmartDocSignature !== lastSmartDocSignatureRef.current;

        if (changedPersistable.length === 0 && deletedIds.length === 0 && !smartDocsChanged) {
          lastPersistedSignatureRef.current = stableElementSignature(currentElements);
          setPersistenceState({
            status: "saved",
            error: null,
            lastPersistedAt: new Date(),
          });
          return;
        }

        try {
          await persistDeletedElements(deletedIds);
          const savedRows = (await PlanningBoardsService.upsertPlanningElements(
            changedPersistable.map((element) => canvasToPlanningInsert(element, boardId, userId)),
          )) ?? [];
          if (smartDocsChanged) {
            await upsertSmartDocsForElements(boardId, userId, currentPersistable);
          }

          if (savedRows.length > 0) {
            const savedMeta = new Map(savedRows.map((row) => [row.id, row]));
            usePlanningStore.setState((state) => ({
              elements: state.elements.map((element) => {
                const row = savedMeta.get(element.id);
                if (!row) return element;
                return {
                  ...element,
                  locked: false,
                  lockedBy: row.locked_by ?? null,
                  lockedAt: row.locked_at ?? null,
                  updatedAt: row.updated_at,
                } as CanvasElement;
              }),
            }));
          }

          lastElementIdsRef.current = currentIds;
          lastElementSignaturesRef.current = currentSignatureMap;
          lastPersistedSignatureRef.current = stableElementSignature(currentElements);
          lastSmartDocSignatureRef.current = nextSmartDocSignature;
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
    };

    const unsubscribe = usePlanningStore.subscribe((state) => {
      // Skip if only selection changed — selection state doesn't affect persistence.
      const selectionKey = state.selectedElementIds.join(",");
      const selectionOnlyChanged = selectionKey !== lastSelectionKey;
      lastSelectionKey = selectionKey;
      if (selectionOnlyChanged) {
        const sig = stableElementSignature(state.elements);
        if (sig === lastPersistedSignatureRef.current) return;
      }

      // Throttle signature evaluation to reduce work under rapid store updates
      // (e.g., realtime bursts, smart element re-renders).
      if (throttleTimer) return;
      const elapsed = Date.now() - lastSignatureCheckAt;
      const wait = Math.max(0, SIGNATURE_THROTTLE_MS - elapsed);
      throttleTimer = setTimeout(evaluateAndSchedule, wait);
    });

    return () => {
      unsubscribe();
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      const currentPersistable = getPersistableElements();
      const deletedIds = getDeletedPersistedIds(lastElementIdsRef.current, currentPersistable);
      if (deletedIds.length > 0) {
        void persistDeletedElements(deletedIds).catch((error) => {
          console.error("[usePlanningElementPersistence] Failed to flush deleted planning elements", error);
        });
      }
    };
  }, [boardId, enabled]);

  return persistenceState;
}

export default usePlanningElementPersistence;
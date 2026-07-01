import React, { useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useCanvasStore } from "@/stores/canvasStore";
import { useContextSmartActions } from "@/features/planning/elements/smart/useContextSmartActions";
import { useSmartElementAI } from "@/hooks/useSmartElementAI";
import { usePlanningStore } from "@/stores/planningStore";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useActiveTextEditor } from "@/features/planning/elements/text/TextEditorContext";
import {
  applyInlineFormat,
  clearEditorFormatting,
  getActiveTextFormats,
  toggleListFormat,
  toggleTextStyleFromElement,
} from "@/features/planning/elements/text/TextFormattingController";
import { useFloatingPosition, useSelectionMeta, useLayoutOperations } from "./hooks";
import {
  CommonActions,
  MindmapActions,
  VisualDiagramActions,
  TextActions,
  ImageActions,
  ElementActions,
  MultipleActions,
} from "./groups";
import {
  copyElements,
  cutElements,
  pasteElements,
  duplicateElements,
  deleteElements as deleteElementsAction,
  lockElements,
  unlockElements,
  toggleVisibility,
  bringToFront,
  bringForward,
  sendBackward,
  sendToBack,
  changeLayer,
  addNewText,
  createFrameFromSelection,
} from "./actions";
import { upsertSmartConnectors } from "@/services/central/smartConnectors.service";
import {
  isPlanningConnectorElement,
  toPlanningConnectorLogicalRecord,
  type PlanningConnectorLogicalRecord,
} from "@/features/planning/integration/connectors";
import type { SmartElementType } from "@/types/smart-elements";
import type { CanvasElement } from "@/types/canvas";
import type { TextFormatCommand } from "@/features/planning/elements/text/TextFormattingController";
import { createSmartCanvasElement } from "@/features/planning/elements/smart/factories/createTypedSmartElement";

const DEFAULT_VIEWPORT_HOST_SIZE = { width: 1280, height: 720 };
function hasNonEmptyTransformPayload(element: { title?: unknown; content?: unknown; description?: unknown; data?: unknown }): boolean {
  const hasText = [element.title, element.content, element.description].some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  if (hasText) return true;

  return !!element.data && typeof element.data === "object" && Object.keys(element.data).length > 0;
}


function readWorkflowEntityBinding(element: CanvasElement, side: "source" | "target") {
  const metadata = element.metadata ?? {};
  const data = element.data ?? {};
  const entityId = metadata.linkedEntityId ?? metadata.entityId ?? data.linkedEntityId ?? data.entityId ?? null;
  const entityType = metadata.linkedEntityType ?? metadata.entityType ?? data.linkedEntityType ?? data.entityType ?? null;
  return {
    [`${side}EntityId`]: typeof entityId === "string" ? entityId : null,
    [`${side}EntityType`]: typeof entityType === "string" ? entityType : null,
  };
}

function createWorkflowRecord(
  boardId: string,
  source: CanvasElement,
  target: CanvasElement,
  index: number,
  connectorElementId?: string,
): PlanningConnectorLogicalRecord {
  return {
    connector_element_id: connectorElementId ?? crypto.randomUUID(),
    board_id: boardId,
    source_element_id: source.id,
    target_element_id: target.id,
    relationship_type: index === 0 ? "depends_on" : "delivers",
    connector_kind: "root_connector",
    label: index === 0 ? "Workflow dependency" : "Workflow handoff",
    style: { stroke: "#3DBE8B", strokeWidth: 2 },
    metadata: {
      source: "workflow_transform",
      connectorMode: "operational",
      status: "approved",
      approvedByUser: true,
      relationshipType: index === 0 ? "depends_on" : "delivers",
      workflowGenerated: true,
      virtualConnector: !connectorElementId,
      ...readWorkflowEntityBinding(source, "source"),
      ...readWorkflowEntityBinding(target, "target"),
    },
    ...readWorkflowEntityBinding(source, "source"),
    ...readWorkflowEntityBinding(target, "target"),
    direction: "source_to_target",
    confidence: 1,
    source: "workflow_transform",
    isAIGenerated: false,
    approvedByUser: true,
  };
}

function getViewportCenterWorldPosition(
  viewport: { zoom: number; pan: { x: number; y: number } },
  viewportHostSize: { width: number; height: number } | undefined,
): { x: number; y: number } {
  const hostWidth = viewportHostSize && viewportHostSize.width > 0
    ? viewportHostSize.width
    : DEFAULT_VIEWPORT_HOST_SIZE.width;
  const hostHeight = viewportHostSize && viewportHostSize.height > 0
    ? viewportHostSize.height
    : DEFAULT_VIEWPORT_HOST_SIZE.height;

  return {
    x: (hostWidth / 2 - viewport.pan.x) / viewport.zoom,
    y: (hostHeight / 2 - viewport.pan.y) / viewport.zoom,
  };
}

interface FloatingBarProps {
  boardId?: string | null;
}

export const FloatingBar: React.FC<FloatingBarProps> = ({ boardId }) => {
  const {
    elements,
    selectedElementIds,
    clipboard,
    layers,
    viewport,
    viewportHostSize,
    updateElement,
    deleteElement,
    addElement,
    selectElement,
    editingTextId,
    groupElements,
    ungroupElements,
  } = useCanvasStore();

  const activeTextEditor = useActiveTextEditor();
  const smartActions = useContextSmartActions(boardId);
  const { isLoading: isAILoading, isTransforming, approvalDialog } = smartActions;
  const { analyzeSelection, transformElements } = useSmartElementAI(boardId);
  const [, setIsTransforming] = useState(false);
  const currentBoard = usePlanningStore((s) => s.currentBoard);
  const selectionMeta = useSelectionMeta();

  const {
    selectionType,
    selectedElements,
    firstElement,
    hasSelection,
    mindmapTreeElements,
    areElementsLocked,
    areElementsVisible,
    areElementsGrouped,
    selectionCount,
    isMindmapSelection,
  } = selectionMeta;

  const layoutOps = useLayoutOperations();
  const elementStyle = firstElement?.style || {};
  const isEditingActiveText = !!editingTextId && !!activeTextEditor && activeTextEditor.elementId === firstElement?.id;

  const isVisualDiagramSelection = useMemo(() => {
    return selectedElements.some((el) => el.type === "visual_node" || el.type === "visual_connector");
  }, [selectedElements]);

  const position = useFloatingPosition({
    activeElements: selectedElements,
    editingTextId,
    viewport,
    hasSelection,
  });

  const handleCopy = useCallback(() => {
    copyElements(selectedElementIds);
  }, [selectedElementIds]);

  const handleCut = useCallback(() => {
    cutElements(selectedElementIds);
  }, [selectedElementIds]);

  const handlePaste = useCallback(() => {
    pasteElements();
  }, []);

  const handleDuplicate = useCallback(() => {
    duplicateElements(selectedElementIds);
  }, [selectedElementIds]);

  const handleDelete = useCallback(() => {
    deleteElementsAction(selectedElementIds);
  }, [selectedElementIds]);

  const handleToggleVisibility = useCallback(() => {
    toggleVisibility(selectedElementIds, elements, areElementsVisible);
  }, [selectedElementIds, elements, areElementsVisible]);

  const handleToggleLock = useCallback(() => {
    if (areElementsLocked) unlockElements(selectedElementIds);
    else lockElements(selectedElementIds);
  }, [selectedElementIds, areElementsLocked]);

  const handleComment = useCallback(() => {
    toast.info("سيتم إضافة ميزة التعليقات قريباً");
  }, []);

  const handleChangeLayer = useCallback((layerId: string) => {
    changeLayer(selectedElementIds, layerId);
  }, [selectedElementIds]);

  const handleBringToFront = useCallback(() => {
    bringToFront(selectedElementIds);
  }, [selectedElementIds]);

  const handleBringForward = useCallback(() => {
    bringForward(selectedElementIds);
  }, [selectedElementIds]);

  const handleSendBackward = useCallback(() => {
    sendBackward(selectedElementIds);
  }, [selectedElementIds]);

  const handleSendToBack = useCallback(() => {
    sendToBack(selectedElementIds);
  }, [selectedElementIds]);

  const handleAddText = useCallback(() => {
    addNewText(getViewportCenterWorldPosition(viewport, viewportHostSize));
  }, [viewport, viewportHostSize]);

  const handleHorizontalAlign = useCallback((align: "right" | "center" | "left") => {
    layoutOps.alignHorizontally(align);
  }, [layoutOps]);

  const handleVerticalAlignMultiple = useCallback((align: "top" | "middle" | "bottom") => {
    layoutOps.alignVertically(align);
  }, [layoutOps]);

  const handleToggleGroup = useCallback(() => {
    if (selectedElementIds.length < 2 && !areElementsGrouped) {
      toast.info("حدد عنصرين أو أكثر للتجميع");
      return;
    }

    if (areElementsGrouped) {
      const groupIds = Array.from(
        new Set(
          selectedElements
            .map((element) => element.metadata?.groupId)
            .filter((groupId): groupId is string => typeof groupId === "string" && groupId.length > 0),
        ),
      );

      if (groupIds.length === 0) {
        toast.info("لا يوجد تجميع صالح لفكه");
        return;
      }

      groupIds.forEach((groupId) => {
        ungroupElements(groupId);
      });
      toast.success("تم فك التجميع");
      return;
    }

    groupElements(selectedElementIds);
    toast.success("تم التجميع");
  }, [areElementsGrouped, groupElements, selectedElementIds, selectedElements, ungroupElements]);

  const handleCreateFrame = useCallback(() => {
    const frameId = createFrameFromSelection(selectedElementIds, elements, addElement);
    if (frameId) {
      toast.success("تم إنشاء الإطار");
      selectElement(frameId);
    }
  }, [selectedElementIds, elements, addElement, selectElement]);

  const handleBgColorChange = useCallback((color: string) => {
    if (firstElement) {
      updateElement(firstElement.id, { style: { ...firstElement.style, backgroundColor: color } });
    }
  }, [firstElement, updateElement]);

  const handleStrokeColorChange = useCallback((color: string) => {
    if (firstElement) {
      updateElement(firstElement.id, { style: { ...firstElement.style, borderColor: color } });
    }
  }, [firstElement, updateElement]);

  const handleOpacityChange = useCallback((value: number[]) => {
    if (firstElement) {
      updateElement(firstElement.id, { style: { ...firstElement.style, opacity: value[0] / 100 } });
    }
  }, [firstElement, updateElement]);

  const handleStrokeWidthChange = useCallback((value: number[]) => {
    if (firstElement) {
      updateElement(firstElement.id, { style: { ...firstElement.style, borderWidth: value[0] } });
    }
  }, [firstElement, updateElement]);

  const handleImageRename = useCallback((name: string) => {
    if (firstElement) {
      updateElement(firstElement.id, { data: { ...firstElement.data, name } });
    }
  }, [firstElement, updateElement]);

  const handleCrop = useCallback(() => toast.info("سيتم إضافة ميزة الكروب قريباً"), []);
  const handleReplaceImage = useCallback(() => toast.info("سيتم إضافة ميزة تبديل الصورة قريباً"), []);
  const handleAddLink = useCallback(() => toast.info("سيتم إضافة ميزة الرابط قريباً"), []);

  const restoreEditorFocusIfNeeded = useCallback(() => {
    if (isEditingActiveText) activeTextEditor?.restoreFocus();
  }, [activeTextEditor, isEditingActiveText]);

  const handleFontFamilyChange = useCallback((value: string) => {
    restoreEditorFocusIfNeeded();
    if (firstElement) updateElement(firstElement.id, { style: { ...firstElement.style, fontFamily: value } });
  }, [firstElement, restoreEditorFocusIfNeeded, updateElement]);

  const handleFontSizeChange = useCallback((value: number) => {
    restoreEditorFocusIfNeeded();
    if (firstElement) updateElement(firstElement.id, { style: { ...firstElement.style, fontSize: value } });
  }, [firstElement, restoreEditorFocusIfNeeded, updateElement]);

  const handleFontWeightChange = useCallback((value: string) => {
    restoreEditorFocusIfNeeded();
    if (firstElement) updateElement(firstElement.id, { style: { ...firstElement.style, fontWeight: value } });
  }, [firstElement, restoreEditorFocusIfNeeded, updateElement]);

  const handleTextColorChange = useCallback((color: string) => {
    restoreEditorFocusIfNeeded();
    if (firstElement) updateElement(firstElement.id, { style: { ...firstElement.style, color } });
  }, [firstElement, restoreEditorFocusIfNeeded, updateElement]);

  const handleTextFormat = useCallback((format: string) => {
    const command = format as TextFormatCommand;

    if (isEditingActiveText && applyInlineFormat(activeTextEditor, command)) return;

    const stylePatch = toggleTextStyleFromElement(firstElement, command);
    if (firstElement && stylePatch) {
      updateElement(firstElement.id, { style: { ...firstElement.style, ...stylePatch } });
    }
  }, [activeTextEditor, firstElement, isEditingActiveText, updateElement]);

  const handleToggleList = useCallback((type: "ul" | "ol") => {
    if (isEditingActiveText && toggleListFormat(activeTextEditor, type)) return;
    toast.info("تنسيق القوائم يعمل أثناء تحرير النص فقط");
  }, [activeTextEditor, isEditingActiveText]);

  const handleTextDirection = useCallback((direction: "rtl" | "ltr") => {
    restoreEditorFocusIfNeeded();
    if (firstElement) {
      const nextAlign = direction === "rtl" ? "right" : "left";
      updateElement(firstElement.id, { style: { ...firstElement.style, direction, textAlign: nextAlign } });
    }
  }, [firstElement, restoreEditorFocusIfNeeded, updateElement]);

  const handleTextAlign = useCallback((align: string) => {
    restoreEditorFocusIfNeeded();
    if (firstElement) updateElement(firstElement.id, { style: { ...firstElement.style, textAlign: align } });
  }, [firstElement, restoreEditorFocusIfNeeded, updateElement]);

  const handleVerticalAlign = useCallback((align: string) => {
    restoreEditorFocusIfNeeded();
    if (firstElement) updateElement(firstElement.id, { style: { ...firstElement.style, alignItems: align } });
  }, [firstElement, restoreEditorFocusIfNeeded, updateElement]);

  const handleClearFormatting = useCallback(() => {
    if (isEditingActiveText && clearEditorFormatting(activeTextEditor)) return;
    if (firstElement) {
      updateElement(firstElement.id, {
        style: {
          ...firstElement.style,
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
        },
      });
    }
  }, [activeTextEditor, firstElement, isEditingActiveText, updateElement]);

  const handleQuickGenerate = useCallback(async () => {
    if (selectedElements.length === 0) return;
    setIsTransforming(true);
    try {
      const analysis = await analyzeSelection(selectedElements.map((el) => el.id));
      if (analysis) toast.success("تم تحليل التحديد بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء التحليل");
    } finally {
      setIsTransforming(false);
    }
  }, [selectedElements, analyzeSelection]);

  const handleTransform = useCallback(async (type: SmartElementType) => {
    if (selectedElements.length === 0) return;
    setIsTransforming(true);
    try {
      const result = await transformElements(selectedElements, type);
      const renderableElements = (result?.elements || []).filter(hasNonEmptyTransformPayload);

      if (renderableElements.length === 0) {
        toast.info("لم يُرجع الذكاء الاصطناعي بيانات قابلة للعرض");
        return;
      }

      const centerX = selectedElements.reduce((sum, el) => sum + (el.position?.x || 0), 0) / selectedElements.length;
      const centerY = selectedElements.reduce((sum, el) => sum + (el.position?.y || 0), 0) / selectedElements.length;

      renderableElements.forEach((element, index) => {
        addElement(createSmartCanvasElement({
          smartType: element.type || type,
          position: element.position || { x: centerX + index * 30, y: centerY + index * 30 },
          title: element.title,
          description: element.description,
          data: {
            ...(element.data || {}),
            content: element.content ?? element.data?.content,
          },
          metadata: {
            sourceElementIds: selectedElementIds,
            generatedBy: "floating-bar",
          },
        }) as CanvasElement);
      });

      toast.success(`تم التحويل إلى ${type}`);
    } catch {
      toast.error("حدث خطأ أثناء التحويل");
    } finally {
      setIsTransforming(false);
    }
  }, [addElement, selectedElementIds, selectedElements, transformElements]);

  const handleCustomTransform = useCallback(async (prompt: string) => {
    if (selectedElements.length === 0 || !prompt.trim()) return;
    setIsTransforming(true);
    try {
      await transformElements(selectedElements.map((el) => el.id), "brainstorming", prompt);
      toast.success("تم التحويل المخصص بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء التحويل");
    } finally {
      setIsTransforming(false);
    }
  }, [selectedElements, transformElements]);

  const handleWorkflowTransform = useCallback(async () => {
    if (selectedElements.length < 2) {
      toast.info("حدد عنصرين أو أكثر لإنشاء Workflow تشغيلي");
      return;
    }

    if (!currentBoard?.id) {
      toast.error("لا يمكن حفظ علاقات Workflow بدون لوحة نشطة");
      return;
    }

    const selectedIds = new Set(selectedElementIds);
    const selectedConnectors = elements.filter((element) => selectedIds.has(element.id) && isPlanningConnectorElement(element));
    const linkedConnectors = elements.filter((element) => {
      if (!isPlanningConnectorElement(element)) return false;
      const data = element.data ?? {};
      const sourceId = data.startPoint?.elementId ?? data.startNodeId;
      const targetId = data.endPoint?.elementId ?? data.endNodeId;
      return selectedIds.has(sourceId) && selectedIds.has(targetId);
    });
    const connectorRecords = [...selectedConnectors, ...linkedConnectors]
      .filter((connector, index, connectors) => connectors.findIndex((item) => item.id === connector.id) === index)
      .map((connector) => toPlanningConnectorLogicalRecord({
        ...connector,
        data: {
          ...(connector.data ?? {}),
          connectorMode: "operational",
          relationshipType: connector.data?.relationshipType ?? "depends_on",
          approvedByUser: true,
        },
        metadata: {
          ...(connector.metadata ?? {}),
          connectorMode: "operational",
          relationshipType: connector.metadata?.relationshipType ?? connector.data?.relationshipType ?? "depends_on",
          status: "approved",
          approvedByUser: true,
          source: "workflow_transform",
        },
      }, currentBoard.id))
      .filter((record): record is PlanningConnectorLogicalRecord => Boolean(record));

    const nodeElements = selectedElements.filter((element) => !isPlanningConnectorElement(element));
    const fallbackRecords = connectorRecords.length === 0
      ? nodeElements.slice(0, -1).map((source, index) => createWorkflowRecord(currentBoard.id, source, nodeElements[index + 1], index))
      : [];
    const records = connectorRecords.length > 0 ? connectorRecords : fallbackRecords;

    if (records.length === 0) {
      toast.info("حدد عنصرين مرتبطين على الأقل أو عنصرين لإنشاء Workflow تشغيلي");
      return;
    }

    setIsTransforming(true);
    try {
      await upsertSmartConnectors(records);
      toast.success(`تم حفظ ${records.length} علاقة Workflow تشغيلية`);
    } catch (error) {
      console.error("[workflow_transform] failed", error);
      toast.error("تعذر حفظ علاقات Workflow التشغيلية");
    } finally {
      setIsTransforming(false);
    }
  }, [currentBoard?.id, elements, selectedElementIds, selectedElements]);

  const handleDeleteElements = useCallback((ids: string[]) => {
    ids.forEach((id) => deleteElement(id));
  }, [deleteElement]);

  const handleUpdateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    updateElement(id, updates);
  }, [updateElement]);

  const handleAddElement = useCallback((element: Partial<CanvasElement>) => {
    addElement(element as CanvasElement);
  }, [addElement]);

  const activeFormats = useMemo(() => getActiveTextFormats(isEditingActiveText, elementStyle), [isEditingActiveText, elementStyle]);

  if (!hasSelection || selectionType === null) return <>{approvalDialog}</>;

  const overlayRoot = typeof document !== "undefined"
    ? document.getElementById("planning-floating-overlay")
    : null;

  if (!overlayRoot) return null;

  const layersList = layers.map((layer) => ({ id: layer.id, name: layer.name }));
  const currentBg = elementStyle.backgroundColor || "#ffffff";
  const currentStroke = elementStyle.borderColor || "#000000";
  const currentOpacity = (elementStyle.opacity ?? 1) * 100;
  const currentStrokeWidth = elementStyle.borderWidth ?? 1;
  const currentFontFamily = elementStyle.fontFamily || "IBM Plex Sans Arabic";
  const currentFontSize = elementStyle.fontSize ?? 14;
  const currentFontWeight = elementStyle.fontWeight || "400";
  const currentColor = elementStyle.color || "#000000";
  const currentAlign = (elementStyle.textAlign as "left" | "center" | "right" | "justify") || "right";
  const currentVerticalAlign = (elementStyle.alignItems as "flex-start" | "center" | "flex-end") || "flex-start";
  const currentDirection = (elementStyle.direction as "rtl" | "ltr") || "rtl";
  const imageName = (firstElement?.data as any)?.name || "";

  const renderContent = () => {
    if (isMindmapSelection) {
      return (
        <>
          <MindmapActions
            selectedNodeIds={selectedElementIds}
            elements={elements}
            treeElements={mindmapTreeElements}
            onUpdateElement={handleUpdateElement}
            onDeleteElements={handleDeleteElements}
            onAddElement={handleAddElement}
          />
          <Separator orientation="vertical" className="h-6 mx-1" />
          <CommonActions
            areElementsVisible={areElementsVisible}
            areElementsLocked={areElementsLocked}
            clipboardLength={clipboard.length}
            selectedCount={selectionCount}
            layers={layersList}
            isAILoading={isAILoading}
            isTransforming={isTransforming}
            onDuplicate={handleDuplicate}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onComment={handleComment}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            onAddText={handleAddText}
            onChangeLayer={handleChangeLayer}
            onBringToFront={handleBringToFront}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onSendToBack={handleSendToBack}
            onQuickGenerate={handleQuickGenerate}
            onTransform={handleTransform}
            onCustomTransform={handleCustomTransform}
            boardId={boardId}
          />
        </>
      );
    }

    if (isVisualDiagramSelection) {
      return (
        <>
          <VisualDiagramActions
            selectedNodeIds={selectedElementIds}
            elements={elements}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={deleteElement}
            onAddElement={handleAddElement}
          />
          <Separator orientation="vertical" className="h-6 mx-1" />
          <CommonActions
            areElementsVisible={areElementsVisible}
            areElementsLocked={areElementsLocked}
            clipboardLength={clipboard.length}
            selectedCount={selectionCount}
            layers={layersList}
            isAILoading={isAILoading}
            isTransforming={isTransforming}
            onDuplicate={handleDuplicate}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onComment={handleComment}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            onAddText={handleAddText}
            onChangeLayer={handleChangeLayer}
            onBringToFront={handleBringToFront}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onSendToBack={handleSendToBack}
            onQuickGenerate={handleQuickGenerate}
            onTransform={handleTransform}
            onCustomTransform={handleCustomTransform}
            boardId={boardId}
          />
        </>
      );
    }

    if (selectionType === "text") {
      return (
        <>
          <TextActions
            currentFontFamily={currentFontFamily}
            currentFontSize={currentFontSize}
            currentFontWeight={currentFontWeight}
            currentColor={currentColor}
            currentAlign={currentAlign}
            currentVerticalAlign={currentVerticalAlign}
            currentDirection={currentDirection}
            activeFormats={activeFormats}
            onFontFamilyChange={handleFontFamilyChange}
            onFontSizeChange={handleFontSizeChange}
            onFontWeightChange={handleFontWeightChange}
            onColorChange={handleTextColorChange}
            onTextFormat={handleTextFormat}
            onToggleList={handleToggleList}
            onTextDirection={handleTextDirection}
            onTextAlign={handleTextAlign}
            onVerticalAlign={handleVerticalAlign}
            onClearFormatting={handleClearFormatting}
            onAddLink={handleAddLink}
          />
          <CommonActions
            areElementsVisible={areElementsVisible}
            areElementsLocked={areElementsLocked}
            clipboardLength={clipboard.length}
            selectedCount={selectionCount}
            layers={layersList}
            isAILoading={isAILoading}
            isTransforming={isTransforming}
            onDuplicate={handleDuplicate}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onComment={handleComment}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            onAddText={handleAddText}
            onChangeLayer={handleChangeLayer}
            onBringToFront={handleBringToFront}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onSendToBack={handleSendToBack}
            onQuickGenerate={handleQuickGenerate}
            onTransform={handleTransform}
            onCustomTransform={handleCustomTransform}
            boardId={boardId}
          />
        </>
      );
    }

    if (selectionType === "image") {
      return (
        <>
          <ImageActions
            imageName={imageName}
            onImageRename={handleImageRename}
            onCrop={handleCrop}
            onReplaceImage={handleReplaceImage}
            onAddLink={handleAddLink}
          />
          <ElementActions
            currentBg={currentBg}
            currentStroke={currentStroke}
            currentOpacity={currentOpacity}
            currentStrokeWidth={currentStrokeWidth}
            onBgColorChange={handleBgColorChange}
            onStrokeColorChange={handleStrokeColorChange}
            onOpacityChange={handleOpacityChange}
            onStrokeWidthChange={handleStrokeWidthChange}
          />
          <CommonActions
            areElementsVisible={areElementsVisible}
            areElementsLocked={areElementsLocked}
            clipboardLength={clipboard.length}
            selectedCount={selectionCount}
            layers={layersList}
            isAILoading={isAILoading}
            isTransforming={isTransforming}
            onDuplicate={handleDuplicate}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onComment={handleComment}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            onAddText={handleAddText}
            onChangeLayer={handleChangeLayer}
            onBringToFront={handleBringToFront}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onSendToBack={handleSendToBack}
            onQuickGenerate={handleQuickGenerate}
            onTransform={handleTransform}
            onCustomTransform={handleCustomTransform}
            boardId={boardId}
          />
        </>
      );
    }

    if (selectionType === "multiple") {
      return (
        <>
          <MultipleActions
            selectionCount={selectionCount}
            areElementsGrouped={areElementsGrouped}
            onHorizontalAlign={handleHorizontalAlign}
            onVerticalAlignMultiple={handleVerticalAlignMultiple}
            onToggleGroup={handleToggleGroup}
            onCreateFrame={handleCreateFrame}
          />
          <CommonActions
            areElementsVisible={areElementsVisible}
            areElementsLocked={areElementsLocked}
            clipboardLength={clipboard.length}
            selectedCount={selectionCount}
            layers={layersList}
            isAILoading={isAILoading}
            isTransforming={isTransforming}
            onDuplicate={handleDuplicate}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onComment={handleComment}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            onAddText={handleAddText}
            onChangeLayer={handleChangeLayer}
            onBringToFront={handleBringToFront}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onSendToBack={handleSendToBack}
            onQuickGenerate={handleQuickGenerate}
            onTransform={handleTransform}
            onCustomTransform={handleCustomTransform}
            boardId={boardId}
          />
        </>
      );
    }

    if (selectionType === "element") {
      return (
        <>
          <ElementActions
            currentBg={currentBg}
            currentStroke={currentStroke}
            currentOpacity={currentOpacity}
            currentStrokeWidth={currentStrokeWidth}
            onBgColorChange={handleBgColorChange}
            onStrokeColorChange={handleStrokeColorChange}
            onOpacityChange={handleOpacityChange}
            onStrokeWidthChange={handleStrokeWidthChange}
          />
          <CommonActions
            areElementsVisible={areElementsVisible}
            areElementsLocked={areElementsLocked}
            clipboardLength={clipboard.length}
            selectedCount={selectionCount}
            layers={layersList}
            isAILoading={isAILoading}
            isTransforming={isTransforming}
            onDuplicate={handleDuplicate}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onComment={handleComment}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            onAddText={handleAddText}
            onChangeLayer={handleChangeLayer}
            onBringToFront={handleBringToFront}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onSendToBack={handleSendToBack}
            onQuickGenerate={handleQuickGenerate}
            onTransform={handleTransform}
            onCustomTransform={handleCustomTransform}
            boardId={boardId}
          />
        </>
      );
    }

    return (
      <CommonActions
        areElementsVisible={areElementsVisible}
        areElementsLocked={areElementsLocked}
        clipboardLength={clipboard.length}
        selectedCount={selectionCount}
        layers={layersList}
        isAILoading={isAILoading}
        isTransforming={isTransforming}
        onDuplicate={handleDuplicate}
        onToggleVisibility={handleToggleVisibility}
        onToggleLock={handleToggleLock}
        onComment={handleComment}
        onDelete={handleDelete}
        onCopy={handleCopy}
        onCut={handleCut}
        onPaste={handlePaste}
        onAddText={handleAddText}
        onChangeLayer={handleChangeLayer}
        onBringToFront={handleBringToFront}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
        onSendToBack={handleSendToBack}
        onQuickGenerate={handleQuickGenerate}
        onTransform={handleTransform}
        onCustomTransform={handleCustomTransform}
        boardId={boardId}
      />
    );
  };

  return createPortal(
    <>
      {approvalDialog}
      <AnimatePresence>
      <div
        data-floating-toolbar="true"
        className="absolute pointer-events-auto"
        style={{ left: position.x, top: position.y, zIndex: "var(--z-toolbar)", transform: "translateX(-50%)" }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-[hsl(var(--border))] bg-white shadow-[var(--shadow-glass)]"
        >
          {renderContent()}
        </motion.div>
      </div>
      </AnimatePresence>
    </>,
    overlayRoot,
  );
};

export default FloatingBar;

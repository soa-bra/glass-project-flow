/**
 * useCommonActions - Hook مشترك لجميع الإجراءات الأساسية
 * يُستخدم من جميع الأشرطة السياقية لتجنب تكرار الكود
 */

import { useCallback, useState } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { useSmartElementAI } from "@/hooks/useSmartElementAI";
import { toast } from "sonner";
import type { SmartElementType } from "@/types/smart-elements";
import type { CanvasElement } from "@/types/canvas";

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
} from "../actions";

export function useCommonActions() {
  const {
    elements,
    selectedElementIds,
    clipboard,
    layers,
    updateElement,
    deleteElement,
    addElement,
    selectElement,
  } = useCanvasStore();

  const { analyzeSelection, transformElements, isLoading: isAILoading } = useSmartElementAI();
  const [isTransforming, setIsTransforming] = useState(false);

  // === Basic actions ===
  const handleCopy = useCallback(() => copyElements(selectedElementIds), [selectedElementIds]);
  const handleCut = useCallback(() => cutElements(selectedElementIds), [selectedElementIds]);
  const handlePaste = useCallback(() => pasteElements(), []);
  const handleDuplicate = useCallback(() => duplicateElements(selectedElementIds), [selectedElementIds]);
  const handleDelete = useCallback(() => deleteElementsAction(selectedElementIds), [selectedElementIds]);

  const handleToggleVisibility = useCallback(
    (areVisible: boolean) => toggleVisibility(selectedElementIds, elements, areVisible),
    [selectedElementIds, elements]
  );

  const handleToggleLock = useCallback(
    (areLocked: boolean) => {
      if (areLocked) unlockElements(selectedElementIds);
      else lockElements(selectedElementIds);
    },
    [selectedElementIds]
  );

  const handleComment = useCallback(() => toast.info("سيتم إضافة ميزة التعليقات قريباً"), []);
  const handleChangeLayer = useCallback((layerId: string) => changeLayer(selectedElementIds, layerId), [selectedElementIds]);
  const handleBringToFront = useCallback(() => bringToFront(selectedElementIds), [selectedElementIds]);
  const handleBringForward = useCallback(() => bringForward(selectedElementIds), [selectedElementIds]);
  const handleSendBackward = useCallback(() => sendBackward(selectedElementIds), [selectedElementIds]);
  const handleSendToBack = useCallback(() => sendToBack(selectedElementIds), [selectedElementIds]);
  const handleAddText = useCallback(() => addNewText({ x: window.innerWidth / 2, y: window.innerHeight / 2 }), []);

  // === Frame ===
  const handleCreateFrame = useCallback(() => {
    const frameId = createFrameFromSelection(selectedElementIds, elements, addElement);
    if (frameId) {
      toast.success("تم إنشاء الإطار");
      selectElement(frameId);
    }
  }, [selectedElementIds, elements, addElement, selectElement]);

  // === AI Actions ===
  const handleQuickGenerate = useCallback(async () => {
    if (selectedElementIds.length === 0) return;
    setIsTransforming(true);
    try {
      const selectedEls = elements.filter((el) => selectedElementIds.includes(el.id));
      const analysis = await analyzeSelection(selectedEls.map((el) => el.id));
      if (analysis) toast.success("تم تحليل التحديد بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء التحليل");
    } finally {
      setIsTransforming(false);
    }
  }, [selectedElementIds, elements, analyzeSelection]);

  const handleTransform = useCallback(
    async (type: SmartElementType) => {
      if (selectedElementIds.length === 0) return;
      setIsTransforming(true);
      try {
        await transformElements(selectedElementIds, type);
        toast.success(`تم التحويل إلى ${type}`);
      } catch {
        toast.error("حدث خطأ أثناء التحويل");
      } finally {
        setIsTransforming(false);
      }
    },
    [selectedElementIds, transformElements]
  );

  const handleCustomTransform = useCallback(
    async (prompt: string) => {
      if (selectedElementIds.length === 0 || !prompt.trim()) return;
      setIsTransforming(true);
      try {
        await transformElements(selectedElementIds, "brainstorming", prompt);
        toast.success("تم التحويل المخصص بنجاح");
      } catch {
        toast.error("حدث خطأ أثناء التحويل");
      } finally {
        setIsTransforming(false);
      }
    },
    [selectedElementIds, transformElements]
  );

  // === Element mutation helpers ===
  const handleDeleteElements = useCallback((ids: string[]) => ids.forEach((id) => deleteElement(id)), [deleteElement]);
  const handleUpdateElement = useCallback((id: string, updates: Partial<CanvasElement>) => updateElement(id, updates), [updateElement]);
  const handleAddElement = useCallback((element: Partial<CanvasElement>) => addElement(element as CanvasElement), [addElement]);

  // Layers list
  const layersList = layers.map((l) => ({ id: l.id, name: l.name }));

  return {
    // state
    elements,
    selectedElementIds,
    clipboard,
    isAILoading,
    isTransforming,
    layersList,
    // basic
    handleCopy,
    handleCut,
    handlePaste,
    handleDuplicate,
    handleDelete,
    handleToggleVisibility,
    handleToggleLock,
    handleComment,
    handleChangeLayer,
    handleBringToFront,
    handleBringForward,
    handleSendBackward,
    handleSendToBack,
    handleAddText,
    handleCreateFrame,
    // AI
    handleQuickGenerate,
    handleTransform,
    handleCustomTransform,
    // element mutations
    handleDeleteElements,
    handleUpdateElement,
    handleAddElement,
    // raw store
    updateElement,
    deleteElement,
    addElement,
  };
}

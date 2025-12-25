/**
 * FloatingBar - الشريط الطافي المُعاد هيكلته (Orchestrator)
 * يستخدم المكونات والـ hooks المنفصلة الجديدة
 */

import React, { useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useCanvasStore } from "@/stores/canvasStore";
import { useSmartElementAI } from "@/hooks/useSmartElementAI";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// Hooks
import { useFloatingPosition, useSelectionMeta } from "./hooks";

// Groups
import { 
  CommonActions, 
  MindmapActions, 
  VisualDiagramActions 
} from "./groups";

// Actions
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
} from "./actions";

import type { SmartElementType } from "@/types/smart-elements";

/**
 * FloatingBar - المُنسق الرئيسي للشريط الطافي
 */
export const FloatingBar: React.FC = () => {
  const {
    elements,
    selectedElementIds,
    clipboard,
    layers,
    viewport,
    updateElement,
    deleteElement,
    addElement,
  } = useCanvasStore();
  
  const { analyzeSelection, transformElements, isLoading: isAILoading } = useSmartElementAI();
  const [isTransforming, setIsTransforming] = useState(false);

  // استخدام hook بيانات التحديد
  const selectionMeta = useSelectionMeta();
  
  const {
    selectionType,
    selectedElements,
    hasSelection,
    mindmapTreeElements,
    areElementsLocked,
    areElementsVisible,
    selectionCount,
    isMindmapSelection,
  } = selectionMeta;

  // التحقق من نوع visual_diagram
  const isVisualDiagramSelection = useMemo(() => {
    return selectedElements.some(el => 
      el.type === 'visual_node' || el.type === 'visual_connector'
    );
  }, [selectedElements]);

  // استخدام hook موضع الشريط
  const position = useFloatingPosition({
    activeElements: selectedElements,
    editingTextId: useCanvasStore.getState().editingTextId,
    viewport,
    hasSelection,
  });

  // === الإجراءات ===
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
    if (areElementsLocked) {
      unlockElements(selectedElementIds);
    } else {
      lockElements(selectedElementIds);
    }
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
    addNewText({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);

  // === AI Actions ===
  const handleQuickGenerate = useCallback(async () => {
    if (selectedElements.length === 0) return;
    setIsTransforming(true);
    try {
      const analysis = await analyzeSelection(selectedElements.map(el => el.id));
      if (analysis) {
        toast.success("تم تحليل التحديد بنجاح");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحليل");
    } finally {
      setIsTransforming(false);
    }
  }, [selectedElements, analyzeSelection]);

  const handleTransform = useCallback(async (type: SmartElementType) => {
    if (selectedElements.length === 0) return;
    setIsTransforming(true);
    try {
      await transformElements(selectedElements.map(el => el.id), type);
      toast.success(`تم التحويل إلى ${type}`);
    } catch (error) {
      toast.error("حدث خطأ أثناء التحويل");
    } finally {
      setIsTransforming(false);
    }
  }, [selectedElements, transformElements]);

  const handleCustomTransform = useCallback(async (prompt: string) => {
    if (selectedElements.length === 0 || !prompt.trim()) return;
    setIsTransforming(true);
    try {
      await transformElements(selectedElements.map(el => el.id), "brainstorming", prompt);
      toast.success("تم التحويل المخصص بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التحويل");
    } finally {
      setIsTransforming(false);
    }
  }, [selectedElements, transformElements]);

  // === Mindmap Actions ===
  const handleDeleteElements = useCallback((ids: string[]) => {
    ids.forEach(id => deleteElement(id));
  }, [deleteElement]);

  const handleUpdateElement = useCallback((id: string, updates: any) => {
    updateElement(id, updates);
  }, [updateElement]);

  const handleAddElement = useCallback((element: any) => {
    addElement(element);
  }, [addElement]);

  // إذا لم يكن هناك تحديد، لا تعرض شيء
  if (!hasSelection || selectionType === null) {
    return null;
  }

  // تجهيز الطبقات للقائمة
  const layersList = layers.map(layer => ({
    id: layer.id,
    name: layer.name,
  }));

  // تحديد المحتوى بناءً على نوع التحديد
  const renderContent = () => {
    // الخريطة الذهنية
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
          />
        </>
      );
    }

    // المخطط البصري
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
          />
        </>
      );
    }

    // الافتراضي: CommonActions فقط
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
      />
    );
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed flex items-center gap-1 px-2 py-1.5 rounded-xl border border-[hsl(var(--border))] bg-white shadow-[var(--shadow-glass)] pointer-events-auto"
        style={{
          left: position.x,
          top: position.y,
          zIndex: "var(--z-toolbar)",
          transform: "translateX(-50%)",
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default FloatingBar;

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
import { useFloatingPosition, useSelectionMeta, useLayoutOperations } from "./hooks";

// Groups
import { 
  CommonActions, 
  MindmapActions, 
  VisualDiagramActions,
  TextActions,
  ImageActions,
  ElementActions,
  MultipleActions,
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
  createFrameFromSelection,
} from "./actions";

import type { SmartElementType } from "@/types/smart-elements";
import type { CanvasElement } from "@/types/canvas";

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
    selectElement,
    editingTextId,
  } = useCanvasStore();
  
  const { analyzeSelection, transformElements, isLoading: isAILoading } = useSmartElementAI();
  const [isTransforming, setIsTransforming] = useState(false);

  // استخدام hook بيانات التحديد
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

  // استخدام �ook عمليات التخطيط
  const layoutOps = useLayoutOperations();

  // التحقق من نوع visual_diagram
  const isVisualDiagramSelection = useMemo(() => {
    return selectedElements.some(el => 
      el.type === 'visual_node' || el.type === 'visual_connector'
    );
  }, [selectedElements]);

  // استخدام �ook موضع الشريط
  const position = useFloatingPosition({
    activeElements: selectedElements,
    editingTextId,
    viewport,
    hasSelection,
  });

  // === الإجراءات الأساسية ===
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

  // === إجراءات التحديد المتعدد ===
  const handleHorizontalAlign = useCallback((align: "right" | "center" | "left") => {
    layoutOps.alignHorizontally(align);
  }, [layoutOps]);

  const handleVerticalAlignMultiple = useCallback((align: "top" | "middle" | "bottom") => {
    layoutOps.alignVertically(align);
  }, [layoutOps]);

  const handleToggleGroup = useCallback(() => {
    // TODO: تنفيذ التجميع/فك التجميع
    toast.info("سيتم إضافة ميزة التجميع قريباً");
  }, []);

  const handleCreateFrame = useCallback(() => {
    const frameId = createFrameFromSelection(selectedElementIds, elements, addElement);
    if (frameId) {
      toast.success("تم إنشاء الإطار");
      selectElement(frameId);
    }
  }, [selectedElementIds, elements, addElement, selectElement]);

  // === إجراءات العنصر الفردي ===
  const handleBgColorChange = useCallback((color: string) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, backgroundColor: color }
      });
    }
  }, [firstElement, updateElement]);

  const handleStrokeColorChange = useCallback((color: string) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, borderColor: color }
      });
    }
  }, [firstElement, updateElement]);

  const handleOpacityChange = useCallback((value: number[]) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, opacity: value[0] / 100 }
      });
    }
  }, [firstElement, updateElement]);

  const handleStrokeWidthChange = useCallback((value: number[]) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, borderWidth: value[0] }
      });
    }
  }, [firstElement, updateElement]);

  // === إجراءات الصورة ===
  const handleImageRename = useCallback((name: string) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        data: { ...firstElement.data, name }
      });
    }
  }, [firstElement, updateElement]);

  const handleCrop = useCallback(() => {
    toast.info("سيتم إضافة ميزة الكروب قريباً");
  }, []);

  const handleReplaceImage = useCallback(() => {
    toast.info("سيتم إضافة ميزة تبديل الصورة قريباً");
  }, []);

  const handleAddLink = useCallback(() => {
    toast.info("سيتم إضافة ميزة الرابط قريباً");
  }, []);

  // === إجراءات النص ===
  const handleFontFamilyChange = useCallback((value: string) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, fontFamily: value }
      });
    }
  }, [firstElement, updateElement]);

  const handleFontSizeChange = useCallback((value: number) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, fontSize: value }
      });
    }
  }, [firstElement, updateElement]);

  const handleFontWeightChange = useCallback((value: string) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, fontWeight: value }
      });
    }
  }, [firstElement, updateElement]);

  const handleTextColorChange = useCallback((color: string) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, color }
      });
    }
  }, [firstElement, updateElement]);

  const handleTextFormat = useCallback((format: string) => {
    // TODO: تطبيق التنسيق عبر execCommand أو عبر store
    document.execCommand(format, false);
  }, []);

  const handleToggleList = useCallback((type: "ul" | "ol") => {
    document.execCommand(type === "ul" ? "insertUnorderedList" : "insertOrderedList", false);
  }, []);

  const handleTextDirection = useCallback((direction: "rtl" | "ltr") => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, direction }
      });
    }
  }, [firstElement, updateElement]);

  const handleTextAlign = useCallback((align: string) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, textAlign: align }
      });
    }
  }, [firstElement, updateElement]);

  const handleVerticalAlign = useCallback((align: string) => {
    if (firstElement) {
      updateElement(firstElement.id, {
        style: { ...firstElement.style, alignItems: align }
      });
    }
  }, [firstElement, updateElement]);

  const handleClearFormatting = useCallback(() => {
    document.execCommand("removeFormat", false);
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
      toast.error("حدث خطӣ أثناء التحليل");
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
      toast.error("حدث خطӣ أثناء أدناء التحويل");
    } finally {
      setIsTransforming(false);
    }
  }, [selectedElements, transformElements]);

  const handleCustomTransform = useCallback(async (prompt: string) => {
    if (selectedElements.length === 0 || !prompt.trim()) return;
    setIsTransforming(true);
    try {
      await transformElements(selectedElements.map(el => el.id), "brainstorming", prompt);
      toast.success("تم التحويل المخصصب بنجاح");
    } catch (error) {
      toast.error("حدث خطأɃ ��ثناء التحويل");
    } finally {
      setIsTransforming(false);
    }
  }, [selectedElements, transformElements]);

  // === Mindmap Actions ===
  const handleDeleteElements = useCallback((ids: string[]) => {
    ids.forEach(id => deleteElement(id));
  }, [deleteElement]);

  const handleUpdateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    updateElement(id, updates);
  }, [updateElement]);

  const handleAddElement = useCallback((element: Partial<CanvasElement>) => {
    addElement(element as CanvasElement);
  }, [addElement]);

  // إذا lيك يكن هن الكتير لا تظر شيء فيإ (!hasSelection || selectionType === null) {
    return null;
  }

  // تهيئ الطبقات للقائمة
  const layersList = layers.map(layer => ({
    id: layer.id,
    name: layer.name,
  }));

  // استخراج خصائط العنصر الحالي
  const elementStyle = firstElement?.style || {};
  const currentBg = elementStyle.backgroundColor || '#ffffff';
  const currentStroke = elementStyle.borderColor || '#000000';
  const currentOpacity = (elementStyle.opacity ?? 1) * 100;
  const currentStrokeWidth = elementStyle.borderWidth ?? 1;
  const currentFontFamily = elementStyle.fontFamily || 'IBM Plex Sans Arabic';
  const currentFontSize = elementStyle.fontSize ?? 14;
  const currentFontWeight = elementStyle.fontWeight || '400';
  const currentColor = elementStyle.color || '#000000';
  const currentAlign = (elementStyle.textAlign as "
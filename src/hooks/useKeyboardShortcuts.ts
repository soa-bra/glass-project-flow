import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useGraphStore } from '@/stores/graphStore';
import { toast } from 'sonner';

export const useKeyboardShortcuts = () => {
  const {
    selectedElementIds,
    activeTool,
    setActiveTool,
    undo,
    redo,
    deleteElements,
    copyElements,
    pasteElements,
    cutElements,
    toggleGrid,
    groupElements,
    ungroupElements,
    duplicateElement,
    alignElements,
    lockElements,
    unlockElements,
    moveElements
  } = useCanvasStore();

  // ✅ حفظ الأداة السابقة للتبديل المؤقت
  const previousToolRef = useRef<string | null>(null);
  const isHoldingModifierRef = useRef(false);

  useEffect(() => {
    // ✅ Capture Phase Handler - يعمل قبل أي event handler آخر
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // ✅ الفحص الشامل 1: هل المستخدم داخل عنصر contenteditable؟
      const isInContentEditable = target.closest('[contenteditable="true"]') !== null;
      
      // ✅ الفحص الشامل 2: هل المستخدم داخل input/textarea؟
      const isInInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      // ✅ الفحص الشامل 3: هل typingMode مفعّل في أي من الـ stores؟
      const canvasTypingMode = useCanvasStore.getState().typingMode;
      const graphInteractionMode = useGraphStore.getState().interactionMode;
      const isGraphTyping = graphInteractionMode.kind === 'typing';
      
      // إذا المستخدم في وضع الكتابة بأي شكل
      const isTyping = isInContentEditable || isInInput || canvasTypingMode || isGraphTyping;
      
      if (isTyping) {
        // السماح بالكتابة العادية (أحرف، أرقام، رموز)
        if (!e.ctrlKey && !e.metaKey && e.key.length === 1) {
          return; // ✅ لا تمنع الكتابة
        }

        // السماح باختصارات تحرير النص (Ctrl+A/B/I/U/Z/C/X/V)
        const allowedCtrl = ['a', 'b', 'i', 'u', 'z', 'v', 'c', 'x'];
        if ((e.ctrlKey || e.metaKey) && allowedCtrl.includes(e.key.toLowerCase())) {
          return; // ✅ اختصارات تحرير النص مسموحة
        }
        
        // السماح بمفاتيح التنقل والتحكم
        const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
                            'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab', 'Enter', 'Shift', 'CapsLock'];
        if (controlKeys.includes(e.key)) {
          return; // ✅ مفاتيح التحكم مسموحة
        }

        // ✅ Escape يخرج من وضع الكتابة
        if (e.key === 'Escape') {
          useCanvasStore.getState().stopTyping();
          return;
        }

        // ✅ منع جميع اختصارات الأدوات أثناء الكتابة (مثل U, T, V, P, F, R, S, G)
        const toolShortcuts = ['u', 't', 'v', 'p', 'f', 'r', 's', 'g'];
        if (!e.ctrlKey && !e.metaKey && toolShortcuts.includes(e.key.toLowerCase())) {
          // لا تفعل شيئاً - لا تمنع الحدث لأنه قد يكون حرف كتابة
          return;
        }

        return; // ✅ باقي المفاتيح تُترك للـ contenteditable
      }

      // ═══════════════════════════════════════════════════════════════
      // ✅ من هنا وما بعد: المستخدم ليس في وضع الكتابة - اختصارات الأدوات تعمل
      // ═══════════════════════════════════════════════════════════════

      // ✅ التبديل المؤقت لأداة التحديد عند الضغط على Command/Ctrl
      if ((e.key === 'Meta' || e.key === 'Control') && !isHoldingModifierRef.current) {
        const currentTool = useCanvasStore.getState().activeTool;
        if (currentTool !== 'selection_tool') {
          previousToolRef.current = currentTool;
          isHoldingModifierRef.current = true;
          setActiveTool('selection_tool');
        }
        return;
      }

      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        useCanvasStore.getState().zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        useCanvasStore.getState().zoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        useCanvasStore.getState().resetViewport();
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }

      // Copy/Paste/Cut
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElementIds.length > 0) {
        e.preventDefault();
        copyElements(selectedElementIds);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteElements();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'x' && selectedElementIds.length > 0) {
        e.preventDefault();
        cutElements(selectedElementIds);
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementIds.length > 0) {
        e.preventDefault();
        selectedElementIds.forEach(id => duplicateElement(id));
      }

      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
        e.preventDefault();
        deleteElements(selectedElementIds);
      }

      // Select All (Ctrl+A)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const allElementIds = useCanvasStore.getState().elements.map(el => el.id);
        useCanvasStore.getState().selectElements(allElementIds);
      }

      // Grid toggle (G without modifiers)
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        toggleGrid();
      }

      // ═══════════════════════════════════════════════════════════════
      // ✅ Tool shortcuts - تعمل فقط خارج وضع الكتابة
      // ═══════════════════════════════════════════════════════════════
      
      if (e.key === 'v' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTool('selection_tool');
      }
      if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTool('text_tool');
      }
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTool('shapes_tool');
      }
      if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTool('smart_pen');
      }
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTool('frame_tool');
      }
      if (e.key === 'u' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTool('file_uploader');
      }
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTool('smart_element_tool');
      }

      // Group/Ungroup (Ctrl+G / Ctrl+Shift+G)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g' && !e.shiftKey && selectedElementIds.length > 1) {
        e.preventDefault();
        groupElements(selectedElementIds);
        toast.success('تم تجميع العناصر');
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'g' && selectedElementIds.length > 0) {
        e.preventDefault();
        const groupId = useCanvasStore.getState().elements.find(el => 
          selectedElementIds.includes(el.id)
        )?.metadata?.groupId;
        if (groupId) {
          ungroupElements(groupId);
          toast.success('تم فك تجميع العناصر');
        }
      }

      // Alignment shortcuts (Ctrl+Shift+Arrow)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && selectedElementIds.length > 0) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          alignElements(selectedElementIds, 'left');
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          alignElements(selectedElementIds, 'right');
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          alignElements(selectedElementIds, 'top');
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          alignElements(selectedElementIds, 'bottom');
        }
      }

      // Lock/Unlock (Ctrl+L / Ctrl+Shift+L)
      if ((e.ctrlKey || e.metaKey) && e.key === 'l' && !e.shiftKey && selectedElementIds.length > 0) {
        e.preventDefault();
        lockElements(selectedElementIds);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l' && selectedElementIds.length > 0) {
        e.preventDefault();
        unlockElements(selectedElementIds);
      }

      // Arrow keys for precise movement
      if (selectedElementIds.length > 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        let dx = 0;
        let dy = 0;
        const step = e.shiftKey ? 10 : 1;
        
        if (e.key === 'ArrowLeft') {
          dx = -step;
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          dx = step;
          e.preventDefault();
        } else if (e.key === 'ArrowUp') {
          dy = -step;
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          dy = step;
          e.preventDefault();
        }
        
        if (dx !== 0 || dy !== 0) {
          moveElements(selectedElementIds, dx, dy);
        }
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        useCanvasStore.getState().clearSelection();
        setActiveTool('selection_tool');
      }
    };

    // ✅ العودة للأداة السابقة عند إفلات Command/Ctrl
    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.key === 'Meta' || e.key === 'Control') && isHoldingModifierRef.current) {
        isHoldingModifierRef.current = false;
        if (previousToolRef.current) {
          setActiveTool(previousToolRef.current as any);
          previousToolRef.current = null;
        }
      }
    };

    // ✅ استخدام capture: true ليعمل قبل أي event handler آخر
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, [
    selectedElementIds,
    activeTool,
    setActiveTool,
    undo,
    redo,
    deleteElements,
    copyElements,
    pasteElements,
    cutElements,
    toggleGrid,
    groupElements,
    ungroupElements,
    duplicateElement,
    alignElements,
    lockElements,
    unlockElements,
    moveElements
  ]);
};

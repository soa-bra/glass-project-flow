/**
 * TextLayer - طبقة النصوص HTML فوق Canvas
 * HTML text layer overlay for canvas text editing
 * 
 * @module features/planning/elements/text/TextLayer
 */

import React, { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { TextEditor } from './TextEditor';
import { sanitizeHTML } from '@/utils/sanitize';
import type { CanvasElement } from '@/types/canvas';

interface TextLayerProps {
  /** عناصر النص للعرض - Text elements to display */
  textElements: CanvasElement[];
  /** معامل التكبير - Zoom factor */
  zoom: number;
  /** إزاحة العرض - Pan offset */
  pan: { x: number; y: number };
  /** معرف العنصر قيد التحرير - ID of element being edited */
  editingElementId: string | null;
  /** عند بدء التحرير - On start editing */
  onStartEditing: (elementId: string) => void;
  /** عند انتهاء التحرير - On stop editing */
  onStopEditing: () => void;
  /** عند تحديث المحتوى - On content update */
  onContentUpdate: (elementId: string, content: string) => void;
}

/**
 * طبقة النصوص HTML
 * Renders text editing overlays on top of canvas
 */
export const TextLayer: React.FC<TextLayerProps> = ({
  textElements,
  zoom,
  pan,
  editingElementId,
  onStartEditing,
  onStopEditing,
  onContentUpdate,
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  
  // حساب موضع العنصر على الشاشة
  const getScreenPosition = useCallback((element: CanvasElement) => {
    return {
      x: element.position.x * zoom + pan.x,
      y: element.position.y * zoom + pan.y,
      width: (element.size?.width || 200) * zoom,
      height: (element.size?.height || 40) * zoom,
    };
  }, [zoom, pan]);

  // معالجة النقر المزدوج لبدء التحرير
  const handleDoubleClick = useCallback((element: CanvasElement) => {
    if (element.locked) return;
    onStartEditing(element.id);
  }, [onStartEditing]);

  // معالجة تحديث المحتوى
  const handleUpdate = useCallback((elementId: string, content: string) => {
    onContentUpdate(elementId, sanitizeHTML(content));
  }, [onContentUpdate]);

  // معالجة إغلاق المحرر
  const handleClose = useCallback(() => {
    onStopEditing();
  }, [onStopEditing]);

  // العنصر قيد التحرير
  const editingElement = editingElementId 
    ? textElements.find(el => el.id === editingElementId) 
    : null;

  return (
    <div
      ref={layerRef}
      id="text-layer"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ 
        zIndex: 100,
        // السماح بالتفاعل فقط عند التحرير
        pointerEvents: editingElementId ? 'auto' : 'none',
      }}
    >
      {/* عرض محرر النص للعنصر قيد التحرير */}
      {editingElement && (
        <EditingOverlay
          element={editingElement}
          position={getScreenPosition(editingElement)}
          onUpdate={(content) => handleUpdate(editingElement.id, content)}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

/**
 * طبقة التحرير للعنصر النصي
 * Editing overlay for a single text element
 */
interface EditingOverlayProps {
  element: CanvasElement;
  position: { x: number; y: number; width: number; height: number };
  onUpdate: (content: string) => void;
  onClose: () => void;
}

const EditingOverlay: React.FC<EditingOverlayProps> = ({
  element,
  position,
  onUpdate,
  onClose,
}) => {
  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        minWidth: 50,
        minHeight: 24,
      }}
    >
      <TextEditor
        element={element}
        onUpdate={onUpdate}
        onClose={onClose}
      />
    </div>
  );
};

export default TextLayer;

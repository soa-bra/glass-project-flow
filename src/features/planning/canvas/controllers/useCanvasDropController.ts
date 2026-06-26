import { useCallback } from 'react';
import type { DragEvent, RefObject } from 'react';
import { toast } from 'sonner';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { canvasKernel, getContainerRect } from '@/engine/canvas/kernel/canvasKernel';
import { SmartElementTypeSchema, type SmartElementType } from '@/types/smart-elements';
import { createRenderableFileCanvasElement } from '@/features/planning/utils/fileCanvasElements';

interface UseCanvasDropControllerOptions {
  containerRef: RefObject<HTMLDivElement>;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

function normalizeSmartElementType(value: unknown): SmartElementType | null {
  const result = SmartElementTypeSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function useCanvasDropController({ containerRef, viewport }: UseCanvasDropControllerOptions) {
  const addElement = useCanvasStore((state) => state.addElement);

  const handleFileDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();

      const containerRect = getContainerRect(containerRef);
      if (!containerRect) return;
      const canvasPoint = canvasKernel.screenToWorld(e.clientX, e.clientY, viewport, containerRect);

      const smartElementData = e.dataTransfer.getData('application/smart-element');
      if (smartElementData) {
        try {
          const parsed = JSON.parse(smartElementData) as { type?: unknown; name?: unknown; data?: unknown };
          const smartType = normalizeSmartElementType(parsed.type);
          const smartName = typeof parsed.name === 'string' ? parsed.name : 'عنصر ذكي';
          const initialData = typeof parsed.data === 'object' && parsed.data !== null
            ? { title: smartName, ...parsed.data }
            : { title: smartName };

          if (!smartType) {
            toast.error('تعذر إدراج العنصر الذكي: النوع غير مدعوم');
            return;
          }

          useSmartElementsStore.getState().addSmartElement(smartType, canvasPoint, {
            ...(typeof parsed.data === 'object' && parsed.data !== null ? parsed.data : {}),
            title: smartName,
          });
          toast.success(`تم إدراج ${smartName}`);
          return;
        } catch {
          toast.error('تعذر قراءة بيانات العنصر الذكي');
          return;
        }
      }

      if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
      const file = e.dataTransfer.files[0];

      void createRenderableFileCanvasElement(file, canvasPoint)
        .then((element) => {
          addElement(element);
          toast.success(`تم إدراج الملف: ${file.name}`);
        })
        .catch((error) => {
          console.warn('[file_uploader] drop insert failed', error);
          toast.error(`تعذر إدراج الملف: ${file.name}`);
        });
    },
    [addElement, containerRef, viewport],
  );

  const handleFileDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  return { handleFileDrop, handleFileDragOver };
}

export default useCanvasDropController;

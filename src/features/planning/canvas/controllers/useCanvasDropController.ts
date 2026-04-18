import { useCallback } from 'react';
import type { DragEvent, RefObject } from 'react';
import { toast } from 'sonner';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { canvasKernel, getContainerRect } from '@/engine/canvas/kernel/canvasKernel';

interface UseCanvasDropControllerOptions {
  containerRef: RefObject<HTMLDivElement>;
  viewport: { zoom: number; pan: { x: number; y: number } };
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
          const parsed = JSON.parse(smartElementData) as { type: string; name: string };
          useSmartElementsStore.getState().addSmartElement(parsed.type, canvasPoint, { title: parsed.name });
          toast.success(`تم إدراج ${parsed.name}`);
          return;
        } catch {
          return;
        }
      }

      if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
      const file = e.dataTransfer.files[0];
      const fileUrl = URL.createObjectURL(file);

      if (file.type.startsWith('image/')) {
        addElement({
          type: 'image',
          position: canvasPoint,
          size: { width: 300, height: 200 },
          src: fileUrl,
          alt: file.name,
        });
        toast.success(`تم إدراج الصورة: ${file.name}`);
        return;
      }

      addElement({
        type: 'file',
        position: canvasPoint,
        size: { width: 250, height: 120 },
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl,
      });
      toast.success(`تم إدراج الملف: ${file.name}`);
    },
    [addElement, containerRef, viewport],
  );

  const handleFileDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  return { handleFileDrop, handleFileDragOver };
}

export default useCanvasDropController;

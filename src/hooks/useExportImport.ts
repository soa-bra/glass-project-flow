/**
 * useExportImport Hook - Sprint 9
 * Hook للتصدير والاستيراد
 */

import { useState, useCallback } from 'react';
import { exportEngine, ExportFormat, ExportOptions, ExportableElement } from '@/engine/canvas/io/exportEngine';
import { importEngine, ImportOptions, ImportResult } from '@/engine/canvas/io/importEngine';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';

interface UseExportImportOptions {
  onExportSuccess?: (filename: string) => void;
  onExportError?: (error: string) => void;
  onImportSuccess?: (result: ImportResult) => void;
  onImportError?: (error: string) => void;
}

export function useExportImport(options?: UseExportImportOptions) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lastExportFilename, setLastExportFilename] = useState<string | null>(null);

  const { elements, addElement } = useCanvasStore();

  /**
   * تحويل عناصر الـ store إلى عناصر قابلة للتصدير
   */
  const convertToExportable = useCallback((): ExportableElement[] => {
    return elements.map((el) => ({
      id: el.id,
      type: el.type,
      position: el.position,
      size: el.size,
      content: el.content,
      style: el.style,
      rotation: typeof el.rotation === 'number' ? el.rotation : 0,
      metadata: el.metadata,
    }));
  }, [elements]);

  /**
   * تصدير اللوحة
   */
  const exportCanvas = useCallback(async (
    format: ExportFormat,
    exportOptions?: Partial<ExportOptions>
  ) => {
    setIsExporting(true);

    try {
      const exportableElements = convertToExportable();
      
      if (exportableElements.length === 0) {
        toast.error('لا توجد عناصر للتصدير');
        return;
      }

      const result = await exportEngine.export(exportableElements, {
        format,
        ...exportOptions,
      });

      if (result.success) {
        setLastExportFilename(result.filename || null);
        toast.success(`تم التصدير بنجاح: ${result.filename}`);
        options?.onExportSuccess?.(result.filename || '');
      } else {
        toast.error(result.error || 'فشل التصدير');
        options?.onExportError?.(result.error || 'فشل التصدير');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير متوقع';
      toast.error(errorMessage);
      options?.onExportError?.(errorMessage);
    } finally {
      setIsExporting(false);
    }
  }, [convertToExportable, options]);

  /**
   * تصدير عناصر محددة
   */
  const exportSelectedElements = useCallback(async (
    elementIds: string[],
    format: ExportFormat,
    exportOptions?: Partial<ExportOptions>
  ) => {
    setIsExporting(true);

    try {
      const selectedElements: ExportableElement[] = elements
        .filter((el) => elementIds.includes(el.id))
        .map((el) => ({
          id: el.id,
          type: el.type,
          position: el.position,
          size: el.size,
          content: el.content,
          style: el.style,
          rotation: typeof el.rotation === 'number' ? el.rotation : 0,
          metadata: el.metadata,
        }));

      if (selectedElements.length === 0) {
        toast.error('لا توجد عناصر محددة للتصدير');
        return;
      }

      const result = await exportEngine.export(selectedElements, {
        format,
        filename: `selection-${Date.now()}`,
        ...exportOptions,
      });

      if (result.success) {
        setLastExportFilename(result.filename || null);
        toast.success(`تم تصدير ${selectedElements.length} عنصر`);
        options?.onExportSuccess?.(result.filename || '');
      } else {
        toast.error(result.error || 'فشل التصدير');
        options?.onExportError?.(result.error || 'فشل التصدير');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير متوقع';
      toast.error(errorMessage);
      options?.onExportError?.(errorMessage);
    } finally {
      setIsExporting(false);
    }
  }, [elements, options]);

  /**
   * استيراد من ملف
   */
  const importFromFile = useCallback(async (
    file: File,
    importOptions?: ImportOptions
  ) => {
    setIsImporting(true);

    try {
      // التحقق من صحة الملف
      const validation = await importEngine.validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error || 'ملف غير صالح');
        options?.onImportError?.(validation.error || 'ملف غير صالح');
        return;
      }

      const result = await importEngine.importFromFile(file, importOptions);

      if (result.success && result.elements) {
        // إضافة العناصر إلى اللوحة
        result.elements.forEach((element) => {
          addElement({
            type: element.type as 'text' | 'shape' | 'sticky_note' | 'image' | 'drawing' | 'connector' | 'template',
            position: element.position,
            size: element.size,
            content: element.content,
            style: element.style,
            rotation: element.rotation,
            metadata: element.metadata,
          });
        });

        toast.success(`تم استيراد ${result.elements.length} عنصر`);
        options?.onImportSuccess?.(result);
      } else {
        toast.error(result.error || 'فشل الاستيراد');
        options?.onImportError?.(result.error || 'فشل الاستيراد');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير متوقع';
      toast.error(errorMessage);
      options?.onImportError?.(errorMessage);
    } finally {
      setIsImporting(false);
    }
  }, [addElement, options]);

  /**
   * استيراد من نص JSON
   */
  const importFromJSON = useCallback(async (
    jsonString: string,
    importOptions?: ImportOptions
  ) => {
    setIsImporting(true);

    try {
      const result = await importEngine.importFromJSONString(jsonString, importOptions);

      if (result.success && result.elements) {
        result.elements.forEach((element) => {
          addElement({
            type: element.type as 'text' | 'shape' | 'sticky_note' | 'image' | 'drawing' | 'connector' | 'template',
            position: element.position,
            size: element.size,
            content: element.content,
            style: element.style,
            rotation: element.rotation,
            metadata: element.metadata,
          });
        });

        toast.success(`تم استيراد ${result.elements.length} عنصر`);
        options?.onImportSuccess?.(result);
      } else {
        toast.error(result.error || 'فشل الاستيراد');
        options?.onImportError?.(result.error || 'فشل الاستيراد');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير متوقع';
      toast.error(errorMessage);
      options?.onImportError?.(errorMessage);
    } finally {
      setIsImporting(false);
    }
  }, [addElement, options]);

  /**
   * فتح مربع حوار اختيار ملف للاستيراد
   */
  const openImportDialog = useCallback((importOptions?: ImportOptions) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.svg,.fig';
    input.multiple = false;

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await importFromFile(file, importOptions);
      }
    };

    input.click();
  }, [importFromFile]);

  /**
   * تصدير سريع (PDF افتراضي)
   */
  const quickExport = useCallback(async (format: ExportFormat = 'pdf') => {
    await exportCanvas(format);
  }, [exportCanvas]);

  return {
    // الحالة
    isExporting,
    isImporting,
    lastExportFilename,

    // التصدير
    exportCanvas,
    exportSelectedElements,
    quickExport,

    // الاستيراد
    importFromFile,
    importFromJSON,
    openImportDialog,

    // أدوات مساعدة
    convertToExportable,
  };
}

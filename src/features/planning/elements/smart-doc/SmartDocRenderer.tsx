import React, { useCallback } from 'react';
import type { CanvasSmartElement } from '@/types/canvas-elements';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { InteractiveSheet } from './InteractiveSheet';
import { SmartTextDoc } from './SmartTextDoc';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { SmartDocLabels, type SmartDocType } from '@/features/planning/domain/types/smart-doc.types';

interface SmartDocRendererProps {
  element: CanvasSmartElement;
  onUpdate?: (data: any) => void;
}

const ICONS: Record<SmartDocType, React.ElementType> = {
  interactive_sheet: FileSpreadsheet,
  smart_text_doc: FileText,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeInteractiveSheetForSmartStore = (data: Record<string, unknown>) => {
  const cells = isRecord(data.cells) ? data.cells : {};

  return {
    ...data,
    cells: Object.fromEntries(
      Object.entries(cells).map(([cellId, cellData]) => {
        const cell = isRecord(cellData) ? cellData : {};
        const existingFormat = isRecord(cell.format) ? cell.format : {};
        const formatType = typeof cell.format === 'string'
          ? cell.format
          : typeof existingFormat.type === 'string'
            ? existingFormat.type
            : undefined;
        const format = {
          ...existingFormat,
          ...(formatType ? { type: formatType } : {}),
          ...(typeof cell.align === 'string' ? { align: cell.align } : {}),
          ...(typeof cell.bold === 'boolean' ? { bold: cell.bold } : {}),
          ...(typeof cell.backgroundColor === 'string' ? { backgroundColor: cell.backgroundColor } : {}),
        };

        return [cellId, {
          ...cell,
          value: cell.value ?? null,
          format: Object.keys(format).length > 0 ? format : undefined,
        }];
      }),
    ),
  };
};

/**
 * SmartDocRenderer - Renderer for Smart Document elements
 * يعرض المستندات الذكية (ورقة تفاعلية، مستند نصي ذكي)
 */
export const SmartDocRenderer: React.FC<SmartDocRendererProps> = ({ 
  element, 
  onUpdate 
}) => {
  const smartType = element.smartType || element.data?.smartType;
  
  // جلب البيانات من smartElementsStore إذا كان smartElementId موجوداً
  const smartElementId = element.data?.smartElementId;
  const { getSmartElementData, updateSmartElementData } = useSmartElementsStore();
  const storedData = smartElementId ? getSmartElementData(smartElementId) : null;
  const data = storedData || element.data || {};

  const handleSmartDocUpdate = useCallback((newData: any) => {
    const nextData = { ...data, ...newData };

    if (smartElementId) {
      const smartStoreData = smartType === 'interactive_sheet'
        ? normalizeInteractiveSheetForSmartStore(nextData)
        : nextData;

      updateSmartElementData(smartElementId, smartStoreData as never);
    }

    onUpdate?.(nextData);
  }, [data, onUpdate, smartElementId, smartType, updateSmartElementData]);

  // Interactive Sheet
  if (smartType === 'interactive_sheet') {
    return (
      <InteractiveSheet 
        data={data as any} 
        onUpdate={handleSmartDocUpdate} 
      />
    );
  }

  // Smart Text Document
  if (smartType === 'smart_text_doc') {
    return (
      <SmartTextDoc 
        data={data as any} 
        onUpdate={handleSmartDocUpdate} 
      />
    );
  }

  // Fallback for unknown smart doc types
  const Icon = ICONS[smartType as SmartDocType] || FileText;
  const label = SmartDocLabels[smartType as SmartDocType] || smartType;

  return (
    <div className="w-full h-full flex items-center justify-center bg-background border border-border rounded-lg p-4" dir="rtl">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">المستند الذكي جاهز للاستخدام</p>
      </div>
    </div>
  );
};

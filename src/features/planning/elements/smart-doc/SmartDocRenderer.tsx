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

type SheetUiCell = {
  value?: string | number | boolean | null;
  formula?: string;
  format?: string | Record<string, unknown>;
  align?: 'right' | 'center' | 'left';
  bold?: boolean;
  backgroundColor?: string;
};

const normalizeInteractiveSheetData = (data: any) => {
  const cells = Object.fromEntries(
    Object.entries((data?.cells ?? {}) as Record<string, SheetUiCell>).map(([cellId, cell]) => {
      const format = typeof cell?.format === 'string'
        ? { type: cell.format }
        : (cell?.format ?? {});

      return [
        cellId,
        {
          ...cell,
          value: cell?.value ?? '',
          format: {
            ...format,
            ...(cell?.align ? { align: cell.align } : {}),
            ...(typeof cell?.bold === 'boolean' ? { bold: cell.bold } : {}),
            ...(cell?.backgroundColor ? { backgroundColor: cell.backgroundColor } : {}),
          },
        },
      ];
    }),
  );

  return {
    ...data,
    cells,
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
    const storeData = smartType === 'interactive_sheet'
      ? normalizeInteractiveSheetData(nextData)
      : nextData;

    if (smartElementId) {
      updateSmartElementData(smartElementId, storeData as never);
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
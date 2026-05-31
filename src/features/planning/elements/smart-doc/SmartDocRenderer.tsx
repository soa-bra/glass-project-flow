import React from 'react';
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
  const { getSmartElementData } = useSmartElementsStore();
  const storedData = smartElementId ? getSmartElementData(smartElementId) : null;
  const data = storedData || element.data || {};

  // Interactive Sheet
  if (smartType === 'interactive_sheet') {
    return (
      <InteractiveSheet 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Smart Text Document
  if (smartType === 'smart_text_doc') {
    return (
      <SmartTextDoc 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
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

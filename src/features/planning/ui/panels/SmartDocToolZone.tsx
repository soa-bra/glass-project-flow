import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { SmartElementType } from '@/features/planning/domain/types/smart.types';

interface SmartDocOption {
  id: SmartElementType;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  description: string;
}

const SMART_DOC_OPTIONS: SmartDocOption[] = [
  {
    id: 'interactive_sheet',
    name: 'Interactive Sheet',
    nameAr: 'ورقة تفاعلية',
    icon: <FileSpreadsheet size={24} />,
    description: 'إدارة بيانات مركبة داخل جدول تفاعلي مع دعم الصيغ',
  },
  {
    id: 'smart_text_doc',
    name: 'Smart Text Doc',
    nameAr: 'مستند نصي ذكي',
    icon: <FileText size={24} />,
    description: 'مستند نصي متقدم مع دعم التنسيق والذكاء الاصطناعي',
  },
];

const SmartDocToolZone: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<SmartDocOption | null>(null);
  const [docTitle, setDocTitle] = useState('');

  const { addSmartElement } = useSmartElementsStore();
  const { viewport } = useCanvasStore();

  const handleSelectOption = (option: SmartDocOption) => {
    setSelectedOption(option);
    setDocTitle('');
    
    // تفعيل الأداة في canvasStore
    useCanvasStore.getState().setSelectedSmartElement(option.id);
    useCanvasStore.getState().setActiveTool('smart_doc_tool');
  };

  const handleAddDocument = () => {
    if (!selectedOption) return;

    // حساب مركز الـ viewport
    const centerX = (-viewport.pan.x + window.innerWidth / 2) / viewport.zoom;
    const centerY = (-viewport.pan.y + window.innerHeight / 2) / viewport.zoom;

    const initialData: Record<string, any> = {
      title: docTitle || selectedOption.nameAr,
    };

    // إعدادات خاصة بكل نوع
    if (selectedOption.id === 'interactive_sheet') {
      initialData.rows = 10;
      initialData.columns = 5;
      initialData.enableFormulas = true;
    } else if (selectedOption.id === 'smart_text_doc') {
      initialData.content = '';
      initialData.format = 'rich';
      initialData.aiAssist = true;
    }

    addSmartElement(
      selectedOption.id,
      { x: centerX, y: centerY },
      initialData
    );

    toast.success(`تم إضافة ${selectedOption.nameAr}`);
    setSelectedOption(null);
    setDocTitle('');
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-[hsl(var(--accent-blue))]">
        <FileText size={24} />
        <h3 className="text-[16px] font-bold">المستندات الذكية</h3>
      </div>

      {/* Description */}
      <p className="text-[12px] text-[hsl(var(--ink-60))] text-center">
        اختر نوع المستند الذكي لإضافته على الكانفس
      </p>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {SMART_DOC_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectOption(option)}
            className={`group flex items-start gap-4 p-4 rounded-[16px] border-2 transition-all text-right ${
              selectedOption?.id === option.id
                ? 'border-[hsl(var(--accent-blue))] bg-[hsl(var(--accent-blue))]/5'
                : 'border-[hsl(var(--border))] hover:border-[hsl(var(--ink-30))] bg-white'
            }`}
          >
            <span className={`p-3 rounded-[12px] transition-colors ${
              selectedOption?.id === option.id 
                ? 'bg-[hsl(var(--accent-blue))] text-white' 
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink-60))]'
            }`}>
              {option.icon}
            </span>
            <div className="flex-1">
              <h4 className={`text-[14px] font-semibold mb-1 ${
                selectedOption?.id === option.id 
                  ? 'text-[hsl(var(--accent-blue))]' 
                  : 'text-[hsl(var(--ink))]'
              }`}>
                {option.nameAr}
              </h4>
              <p className="text-[11px] text-[hsl(var(--ink-60))] leading-relaxed">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Settings Panel (when option selected) */}
      {selectedOption && (
        <div className="space-y-4 p-4 bg-[hsl(var(--panel))] rounded-[16px]">
          <div className="flex items-center gap-2 text-[hsl(var(--accent-green))]">
            <Sparkles size={18} />
            <h4 className="text-[13px] font-semibold">إعدادات {selectedOption.nameAr}</h4>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
              عنوان المستند
            </label>
            <Input
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder={selectedOption.nameAr}
              className="text-right"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={handleAddDocument}
            className="w-full bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/90 text-white"
          >
            إضافة على الكانفس
          </Button>
        </div>
      )}

      {/* Instructions */}
      {!selectedOption && (
        <div className="p-4 bg-[hsl(var(--panel))] rounded-[12px] text-center">
          <p className="text-[11px] text-[hsl(var(--ink-60))]">
            انقر على أحد الخيارات أعلاه لإضافته إلى الكانفس
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartDocToolZone;

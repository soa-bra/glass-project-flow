import React, { useState } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useCanvasStore } from "@/stores/canvasStore";
import { toast } from "sonner";
import type { SmartElementType } from "@/types/smart-elements";

interface SmartDocOption {
  id: SmartElementType;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  description: string;
}

const SMART_DOC_OPTIONS: SmartDocOption[] = [
  {
    id: "interactive_sheet",
    name: "Interactive Sheet",
    nameAr: "جدول تفاعلي",
    icon: <FileSpreadsheet size={24} />,
    description: "إدارة بيانات مركبة داخل جدول تفاعلي مع دعم الصيغ",
  },
  {
    id: "smart_text_doc" as SmartElementType,
    name: "Smart Text Doc",
    nameAr: "مستند نصي ذكي",
    icon: <FileText size={24} />,
    description: "مستند نصي متقدم مع دعم التنسيق والذكاء الاصطناعي",
  },
];

const SmartDocToolZone: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<SmartDocOption | null>(null);

  const handleSelectOption = (option: SmartDocOption) => {
    setSelectedOption(option);

    // ✅ استخدام المتغير المنفصل للمستندات الذكية
    useCanvasStore.getState().setSelectedSmartDoc(option.id);
    useCanvasStore.getState().setActiveTool("smart_doc_tool");
    
    toast.info(`انقر على الكانفس لإضافة ${option.nameAr}`);
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-[hsl(var(--accent-blue))]">
        <FileText size={24} />
        <h3 className="text-[16px] font-bold">المستندات الذكية</h3>
      </div>

      {/* Description */}
      <p className="text-[12px] text-[hsl(var(--ink-60))] text-center">اختر نوع المستند الذكي لإضافته على الكانفس</p>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {SMART_DOC_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectOption(option)}
            className={`group flex items-start gap-4 p-4 rounded-[16px] border-2 transition-all text-right ${
              selectedOption?.id === option.id
                ? "border-[hsl(var(--accent-blue))] bg-[hsl(var(--accent-blue))]/5"
                : "border-[hsl(var(--border))] hover:border-[hsl(var(--ink-30))] bg-white"
            }`}
          >
            <span
              className={`p-3 rounded-[12px] transition-colors ${
                selectedOption?.id === option.id
                  ? "bg-[hsl(var(--accent-blue))] text-white"
                  : "bg-[hsl(var(--panel))] text-[hsl(var(--ink-60))]"
              }`}
            >
              {option.icon}
            </span>
            <div className="flex-1">
              <h4
                className={`text-[14px] font-semibold mb-1 ${
                  selectedOption?.id === option.id ? "text-[hsl(var(--accent-blue))]" : "text-[hsl(var(--ink))]"
                }`}
              >
                {option.nameAr}
              </h4>
              <p className="text-[11px] text-[hsl(var(--ink-60))] leading-relaxed">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="p-4 bg-[hsl(var(--panel))] rounded-[12px] text-center">
        <p className="text-[11px] text-[hsl(var(--ink-60))]">
          {selectedOption 
            ? `انقر على الكانفس لإضافة ${selectedOption.nameAr}`
            : 'انقر على أحد الخيارات أعلاه ثم انقر على الكانفس'}
        </p>
      </div>
    </div>
  );
};

export default SmartDocToolZone;

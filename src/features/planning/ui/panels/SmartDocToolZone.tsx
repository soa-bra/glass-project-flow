import React from "react";
import { FileText, FileSpreadsheet, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCanvasStore } from "@/stores/canvasStore";
import type { SmartElementType } from "@/types/smart-elements";
import {
  canMutateCanvas,
  useCurrentBoardRole,
} from "@/features/planning/hooks/useCurrentBoardRole";

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

interface SmartDocToolZoneProps {
  boardId?: string;
}

const SmartDocToolZone: React.FC<SmartDocToolZoneProps> = ({ boardId }) => {
  const { selectedSmartDoc } = useCanvasStore();
  const { role } = useCurrentBoardRole(boardId ?? null);
  const allowed = canMutateCanvas(role);

  const handleSelectOption = (option: SmartDocOption) => {
    if (!allowed) {
      toast.error("هذا الإجراء غير مصرّح لدورك على هذه اللوحة", {
        description: "يتطلب إنشاء المستندات الذكية صلاحية محرر أو مضيف.",
      });
      return;
    }
    useCanvasStore.getState().setSelectedSmartDoc(option.id);
    useCanvasStore.getState().setActiveTool("smart_doc_tool");
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-center gap-2 text-[hsl(var(--accent-blue))]">
        <FileText size={24} />
        <h3 className="text-[16px] font-bold">المستندات الذكية</h3>
      </div>

      <p className="text-[12px] text-[hsl(var(--ink-60))] text-center">
        {allowed
          ? "اختر نوع المستند ثم انقر على الكانفس لإضافته"
          : "العرض فقط — لا تملك صلاحية إنشاء المستندات على هذه اللوحة"}
      </p>

      <div className="grid grid-cols-1 gap-3">
        {SMART_DOC_OPTIONS.map((option) => {
          const isSelected = selectedSmartDoc === option.id;
          const disabled = !allowed;
          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              disabled={disabled}
              aria-disabled={disabled}
              className={`group flex items-start gap-4 p-4 rounded-[16px] border-2 transition-all text-right ${
                disabled
                  ? "opacity-50 cursor-not-allowed border-[hsl(var(--border))] bg-white"
                  : isSelected
                  ? "border-[hsl(var(--accent-blue))] bg-[hsl(var(--accent-blue))]/5"
                  : "border-[hsl(var(--border))] hover:border-[hsl(var(--ink-30))] bg-white"
              }`}
            >
              <span
                className={`p-3 rounded-[12px] transition-colors ${
                  isSelected && !disabled
                    ? "bg-[hsl(var(--accent-blue))] text-white"
                    : "bg-[hsl(var(--panel))] text-[hsl(var(--ink-60))]"
                }`}
              >
                {option.icon}
              </span>
              <div className="flex-1">
                <h4
                  className={`text-[14px] font-semibold mb-1 flex items-center gap-2 ${
                    isSelected && !disabled
                      ? "text-[hsl(var(--accent-blue))]"
                      : "text-[hsl(var(--ink))]"
                  }`}
                >
                  {option.nameAr}
                  {disabled && <Lock size={12} aria-hidden />}
                </h4>
                <p className="text-[11px] text-[hsl(var(--ink-60))] leading-relaxed">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-[hsl(var(--panel))] rounded-[12px] text-center">
        {!allowed ? (
          <p className="text-[11px] text-[hsl(var(--ink-60))] font-medium">
            غير مصرّح — صلاحية القراءة فقط
          </p>
        ) : selectedSmartDoc ? (
          <p className="text-[11px] text-[hsl(var(--accent-green))] font-medium">
            ✓ تم تحديد المستند - انقر على الكانفس لإضافته
          </p>
        ) : (
          <p className="text-[11px] text-[hsl(var(--ink-60))]">
            انقر على أحد الخيارات أعلاه ثم انقر على الكانفس
          </p>
        )}
      </div>
    </div>
  );
};

export default SmartDocToolZone;

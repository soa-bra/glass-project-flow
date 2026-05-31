import React, { useState } from "react";
import { FileText, FileSpreadsheet, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCanvasStore } from "@/stores/canvasStore";
import type { SmartDocument, SmartElementType } from "@/types/smart-elements";
import {
  canMutateCanvas,
  useCurrentBoardRole,
} from "@/features/planning/hooks/useCurrentBoardRole";
import { useSmartElementAI } from "@/hooks/useSmartElementAI";
import { PlanningBoardsService } from "@/services/central";
import { Textarea } from "@/components/ui/textarea";

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
  const { selectedSmartDoc, selectedElementIds, elements, viewport } = useCanvasStore();
  const { role } = useCurrentBoardRole(boardId ?? null);
  const allowed = canMutateCanvas(role);
  const { generateDocument, isLoading } = useSmartElementAI();
  const [reviewDraft, setReviewDraft] = useState<SmartDocument | null>(null);
  const [reviewPrompt, setReviewPrompt] = useState("");

  const selectedElements = elements.filter((element) => selectedElementIds.includes(element.id));


  const handleGenerateDocument = async () => {
    if (!allowed) {
      toast.error("هذا الإجراء غير مصرّح لدورك على هذه اللوحة");
      return;
    }
    const draft = await generateDocument(selectedElements, reviewPrompt, "summary");
    if (draft) setReviewDraft(draft);
  };

  const handleSaveReviewedDocument = async () => {
    if (!reviewDraft) return;
    const position = {
      x: 120 - viewport.pan.x / viewport.zoom,
      y: 120 - viewport.pan.y / viewport.zoom,
    };

    if (boardId) {
      try {
        const saved = await PlanningBoardsService.saveReviewedSmartDocument({
          board_id: boardId,
          document: reviewDraft,
          position,
        });
        useCanvasStore.getState().addElement({
          id: saved.id,
          type: "smart_doc",
          position,
          size: { width: 520, height: 420 },
          style: {},
          data: {
            smartType: "smart_text_doc",
            title: reviewDraft.title,
            content: reviewDraft.content,
            format: "rich",
            aiAssist: true,
            readOnly: false,
            showToolbar: true,
            sourceElementIds: reviewDraft.sourceElementIds,
            docType: reviewDraft.docType,
            generatedByAi: reviewDraft.generatedByAi,
          },
          metadata: saved.metadata as Record<string, unknown>,
        });
        toast.success("تم حفظ الوثيقة وربطها بعناصر المصدر");
        setReviewDraft(null);
        return;
      } catch (error) {
        console.error("[SmartDocToolZone] Failed to save reviewed smart document", error);
        toast.error("تعذر الحفظ في قاعدة البيانات، سيتم إضافتها محليًا على الكانفس");
      }
    }

    useCanvasStore.getState().addElement({
      type: "smart",
      smartType: "smart_text_doc",
      position,
      size: { width: 520, height: 420 },
      style: {},
      data: {
        smartType: "smart_text_doc",
        ...reviewDraft,
        format: "rich",
        aiAssist: true,
        readOnly: false,
        showToolbar: true,
      },
      metadata: {
        smartDoc: {
          storage: "canvas_local",
          sourceElementIds: reviewDraft.sourceElementIds,
          docType: reviewDraft.docType,
          generatedByAi: reviewDraft.generatedByAi,
        },
        sourceElementIds: reviewDraft.sourceElementIds,
        linkedSourceElementIds: reviewDraft.sourceElementIds,
      },
    });
    toast.success("تمت إضافة الوثيقة وربطها بعناصر المصدر");
    setReviewDraft(null);
  };
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

      <div className="rounded-[16px] border border-[hsl(var(--border))] bg-white p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="text-[13px] font-bold text-[hsl(var(--ink))]">توليد وثيقة من العناصر المحددة</h4>
            <p className="text-[11px] text-[hsl(var(--ink-60))]">
              المحدد الآن: {selectedElements.length} / 50 عنصر
            </p>
          </div>
          <button
            onClick={handleGenerateDocument}
            disabled={!allowed || isLoading || selectedElements.length === 0 || selectedElements.length > 50}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[hsl(var(--accent-blue))] px-3 py-2 text-[11px] font-bold text-white disabled:opacity-50"
          >
            <Sparkles size={14} />
            توليد
          </button>
        </div>
        <Textarea
          value={reviewPrompt}
          onChange={(event) => setReviewPrompt(event.target.value)}
          placeholder="تعليمات اختيارية للوثيقة (مثلاً: لخّص كمحضر اجتماع)..."
          className="min-h-[72px] text-xs"
        />
        {reviewDraft && (
          <div className="space-y-2 rounded-[12px] bg-[hsl(var(--panel))] p-3">
            <input
              value={reviewDraft.title}
              onChange={(event) => setReviewDraft({ ...reviewDraft, title: event.target.value })}
              className="w-full rounded-md border border-[hsl(var(--border))] px-2 py-1 text-xs font-bold"
            />
            <Textarea
              value={reviewDraft.content}
              onChange={(event) => setReviewDraft({ ...reviewDraft, content: event.target.value })}
              className="min-h-[120px] text-xs"
            />
            <button
              onClick={handleSaveReviewedDocument}
              className="w-full rounded-[10px] bg-[hsl(var(--accent-green))] px-3 py-2 text-[11px] font-bold text-white"
            >
              حفظ الوثيقة بعد المراجعة وربط المصادر
            </button>
          </div>
        )}
      </div>

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

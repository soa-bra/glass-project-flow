/**
 * CommonActions - الإجراءات المشتركة لجميع أنواع التحديد
 * المرجع الوحيد للنسخ/القص/اللصق والقائمة المنسدلة
 */

import React from "react";
import {
  Copy,
  Scissors,
  ClipboardPaste,
  Type,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MessageSquare,
  Files,
  Plus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "../components";
import { AIMenuDropdown } from "../components/AIMenuDropdown";
import type { SmartElementType } from "@/types/smart-elements";

interface Layer {
  id: string;
  name: string;
}

interface CommonActionsProps {
  // حالة العناصر
  areElementsVisible: boolean;
  areElementsLocked: boolean;
  clipboardLength: number;
  selectedCount: number;
  layers: Layer[];
  
  // AI
  isAILoading: boolean;
  isTransforming: boolean;
  
  // إجراءات أساسية
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onComment: () => void;
  onDelete: () => void;
  
  // إجراءات النسخ
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onAddText: () => void;
  
  // إجراءات الطبقات
  onChangeLayer: (layerId: string) => void;
  onBringToFront: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSendToBack: () => void;
  
  // AI
  onQuickGenerate: () => void;
  onTransform: (type: SmartElementType) => void;
  onCustomTransform: (prompt: string) => void;
  onWorkflowTransform?: () => void;
  boardId?: string | null;
}

export const CommonActions: React.FC<CommonActionsProps> = ({
  areElementsVisible,
  areElementsLocked,
  clipboardLength,
  selectedCount,
  layers,
  isAILoading,
  isTransforming,
  onDuplicate,
  onToggleVisibility,
  onToggleLock,
  onComment,
  onDelete,
  onCopy,
  onCut,
  onPaste,
  onAddText,
  onChangeLayer,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  onQuickGenerate,
  onTransform,
  onCustomTransform,
  onWorkflowTransform,
  boardId,
}) => {
  return (
    <>
      <ToolbarButton icon={<Files size={16} />} onClick={onDuplicate} title="تكرار" />
      <ToolbarButton
        icon={areElementsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
        onClick={onToggleVisibility}
        title={areElementsVisible ? "إخفاء" : "إظهار"}
        isActive={!areElementsVisible}
      />
      <ToolbarButton
        icon={areElementsLocked ? <Lock size={16} /> : <Unlock size={16} />}
        onClick={onToggleLock}
        title={areElementsLocked ? "فك القفل" : "قفل"}
        isActive={areElementsLocked}
      />
      <ToolbarButton icon={<MessageSquare size={16} />} onClick={onComment} title="ترك تعليق" />
      <ToolbarButton icon={<Trash2 size={16} />} onClick={onDelete} title="حذف" variant="destructive" />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <AIMenuDropdown
        isLoading={isAILoading || isTransforming}
        onQuickGenerate={onQuickGenerate}
        onTransform={onTransform}
        onCustomTransform={onCustomTransform}
        onWorkflowTransform={onWorkflowTransform}
        selectedCount={selectedCount}
        boardId={boardId}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))] pointer-events-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <MoreVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          dir="rtl"
          className="w-56 bg-white z-[var(--z-popover)] pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem onClick={onCopy} className="gap-3 justify-between">
            <span>نسخ</span>
            <Copy size={16} className="opacity-70 shrink-0" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCut} className="gap-3 justify-between">
            <span>قص</span>
            <Scissors size={16} className="opacity-70 shrink-0" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPaste} disabled={clipboardLength === 0} className="gap-3 justify-between">
            <span>لصق</span>
            <ClipboardPaste size={16} className="opacity-70 shrink-0" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-3 justify-between">
              <span>تغيير الطبقة</span>
              <Layers size={16} className="opacity-70 shrink-0" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent dir="rtl" className="bg-white z-[var(--z-tooltip)]">
              {layers.map((layer) => (
                <DropdownMenuItem key={layer.id} onClick={() => onChangeLayer(layer.id)} className="justify-end">
                  {layer.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onChangeLayer("new")} className="gap-3 justify-between">
                <span>طبقة جديدة</span>
                <Plus size={16} className="opacity-70 shrink-0" />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onBringToFront} className="gap-3 justify-between">
            <span>إحضار إلى الأمام</span>
            <ChevronsUp size={16} className="opacity-70 shrink-0" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBringForward} className="gap-3 justify-between">
            <span>نقل خطوة إلى الأمام</span>
            <ArrowUp size={16} className="opacity-70 shrink-0" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSendBackward} className="gap-3 justify-between">
            <span>نقل خطوة إلى الخلف</span>
            <ArrowDown size={16} className="opacity-70 shrink-0" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSendToBack} className="gap-3 justify-between">
            <span>إرسال إلى الخلف</span>
            <ChevronsDown size={16} className="opacity-70 shrink-0" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

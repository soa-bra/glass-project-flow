/**
 * MultipleActions - أزرار التحديد المتعدد
 */

import React from "react";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Group,
  Ungroup,
  Frame,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "../components";

interface MultipleActionsProps {
  selectionCount: number;
  areElementsGrouped: boolean;
  onHorizontalAlign: (align: "right" | "center" | "left") => void;
  onVerticalAlignMultiple: (align: "top" | "middle" | "bottom") => void;
  onToggleGroup: () => void;
  onCreateFrame: () => void;
}

export const MultipleActions: React.FC<MultipleActionsProps> = ({
  selectionCount,
  areElementsGrouped,
  onHorizontalAlign,
  onVerticalAlignMultiple,
  onToggleGroup,
  onCreateFrame,
}) => {
  return (
    <>
      <div className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--panel))] rounded-lg text-xs font-medium text-[hsl(var(--ink))]">
        <span>{selectionCount}</span>
        <span>عناصر محددة</span>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))]"
            title="المحاذاة الأفقية"
          >
            <AlignHorizontalJustifyCenter size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[var(--z-popover)]">
          <DropdownMenuItem onClick={() => onHorizontalAlign("right")}>
            <AlignHorizontalJustifyEnd size={14} className="ml-2" />
            محاذاة لليمين
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onHorizontalAlign("center")}>
            <AlignHorizontalJustifyCenter size={14} className="ml-2" />
            محاذاة للوسط
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onHorizontalAlign("left")}>
            <AlignHorizontalJustifyStart size={14} className="ml-2" />
            محاذاة لليسار
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))]"
            title="المحاذاة العمودية"
          >
            <AlignVerticalJustifyCenter size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[var(--z-popover)]">
          <DropdownMenuItem onClick={() => onVerticalAlignMultiple("top")}>
            <AlignVerticalJustifyStart size={14} className="ml-2" />
            محاذاة للأعلى
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onVerticalAlignMultiple("middle")}>
            <AlignVerticalJustifyCenter size={14} className="ml-2" />
            محاذاة للوسط
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onVerticalAlignMultiple("bottom")}>
            <AlignVerticalJustifyEnd size={14} className="ml-2" />
            محاذاة للأسفل
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* زر إنشاء إطار - جديد! */}
      {selectionCount >= 2 && (
        <ToolbarButton
          icon={<Frame size={16} />}
          onClick={onCreateFrame}
          title="إنشاء إطار"
        />
      )}

      <ToolbarButton
        icon={areElementsGrouped ? <Ungroup size={16} /> : <Group size={16} />}
        onClick={onToggleGroup}
        title={areElementsGrouped ? "فك التجميع" : "تجميع"}
        isActive={areElementsGrouped}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );
};

/**
 * TextActions - أزرار تحرير النص
 */

import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  ArrowRightLeft,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  RemoveFormatting,
  Link,
  Type,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ToolbarButton, ColorButton, FontFamilyDropdown, FontSizeInput, FontWeightDropdown } from "../components";

interface TextActionsProps {
  currentFontFamily: string;
  currentFontSize: number;
  currentFontWeight: string;
  currentColor: string;
  currentAlign: "left" | "center" | "right" | "justify";
  currentVerticalAlign: "flex-start" | "center" | "flex-end";
  currentDirection: "rtl" | "ltr";
  activeFormats: Record<string, boolean>;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onFontWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onTextFormat: (format: string) => void;
  onToggleList: (type: "ul" | "ol") => void;
  onTextDirection: (direction: "rtl" | "ltr") => void;
  onTextAlign: (align: string) => void;
  onVerticalAlign: (align: string) => void;
  onClearFormatting: () => void;
  onAddLink: () => void;
}

export const TextActions: React.FC<TextActionsProps> = ({
  currentFontFamily,
  currentFontSize,
  currentFontWeight,
  currentColor,
  currentAlign,
  currentVerticalAlign,
  currentDirection,
  activeFormats,
  onFontFamilyChange,
  onFontSizeChange,
  onFontWeightChange,
  onColorChange,
  onTextFormat,
  onToggleList,
  onTextDirection,
  onTextAlign,
  onVerticalAlign,
  onClearFormatting,
  onAddLink,
}) => {
  return (
    <>
      <FontFamilyDropdown value={currentFontFamily} onChange={onFontFamilyChange} />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <FontSizeInput value={currentFontSize} onChange={onFontSizeChange} />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <FontWeightDropdown value={currentFontWeight} onChange={onFontWeightChange} />

      <Separator orientation="vertical" className="h-6 mx-1" />

      <ColorButton value={currentColor} onChange={onColorChange} icon={<Type size={14} />} title="لون النص" />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* تنسيق النص */}
      <ToolbarButton
        icon={<Bold size={16} />}
        onClick={() => onTextFormat("bold")}
        title="غامق"
        isActive={activeFormats.bold}
      />
      <ToolbarButton
        icon={<Italic size={16} />}
        onClick={() => onTextFormat("italic")}
        title="مائل"
        isActive={activeFormats.italic}
      />
      <ToolbarButton
        icon={<Underline size={16} />}
        onClick={() => onTextFormat("underline")}
        title="تسطير"
        isActive={activeFormats.underline}
      />
      <ToolbarButton
        icon={<Strikethrough size={16} />}
        onClick={() => onTextFormat("strikeThrough")}
        title="يتوسطه خط"
        isActive={activeFormats.strikeThrough}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* قوائم */}
      <ToolbarButton
        icon={<List size={16} />}
        onClick={() => onToggleList("ul")}
        title="قائمة نقطية"
        isActive={activeFormats.insertUnorderedList}
      />
      <ToolbarButton
        icon={<ListOrdered size={16} />}
        onClick={() => onToggleList("ol")}
        title="قائمة مرقمة"
        isActive={activeFormats.insertOrderedList}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* اتجاه النص */}
      <ToolbarButton
        icon={<ArrowRightLeft size={16} />}
        onClick={() => onTextDirection(currentDirection === "rtl" ? "ltr" : "rtl")}
        title={currentDirection === "rtl" ? "تبديل إلى LTR" : "تبديل إلى RTL"}
        isActive={currentDirection === "ltr"}
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* محاذاة النص الأفقية */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))] pointer-events-auto"
            title="محاذاة النص"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {currentAlign === "right" && <AlignRight size={16} />}
            {currentAlign === "center" && <AlignCenter size={16} />}
            {currentAlign === "left" && <AlignLeft size={16} />}
            {currentAlign === "justify" && <AlignJustify size={16} />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white z-[var(--z-popover)] min-w-0 p-1 pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex gap-1">
            {(["right", "center", "left", "justify"] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onTextAlign(align)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]",
                  currentAlign === align && "bg-[hsl(var(--ink)/0.1)]"
                )}
              >
                {align === "right" && <AlignRight size={16} />}
                {align === "center" && <AlignCenter size={16} />}
                {align === "left" && <AlignLeft size={16} />}
                {align === "justify" && <AlignJustify size={16} />}
              </button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* المحاذاة الرأسية */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))] pointer-events-auto"
            title="المحاذاة الرأسية"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {currentVerticalAlign === "flex-start" && <AlignVerticalJustifyStart size={16} />}
            {currentVerticalAlign === "center" && <AlignVerticalJustifyCenter size={16} />}
            {currentVerticalAlign === "flex-end" && <AlignVerticalJustifyEnd size={16} />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white z-[var(--z-popover)] min-w-0 p-1 pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex gap-1">
            {(["flex-start", "center", "flex-end"] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onVerticalAlign(align)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]",
                  currentVerticalAlign === align && "bg-[hsl(var(--ink)/0.1)]"
                )}
              >
                {align === "flex-start" && <AlignVerticalJustifyStart size={16} />}
                {align === "center" && <AlignVerticalJustifyCenter size={16} />}
                {align === "flex-end" && <AlignVerticalJustifyEnd size={16} />}
              </button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <ToolbarButton icon={<RemoveFormatting size={16} />} onClick={onClearFormatting} title="إزالة التنسيق" />
      <ToolbarButton icon={<Link size={16} />} onClick={onAddLink} title="إضافة رابط" />

      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );
};

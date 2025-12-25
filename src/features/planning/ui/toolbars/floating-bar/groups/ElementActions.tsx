/**
 * ElementActions - أزرار العنصر الفردي
 */

import React from "react";
import { PaintBucket, Palette, Blend } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorButton } from "../components";

interface ElementActionsProps {
  currentBg: string;
  currentStroke: string;
  currentOpacity: number;
  currentStrokeWidth: number;
  onBgColorChange: (color: string) => void;
  onStrokeColorChange: (color: string) => void;
  onOpacityChange: (value: number[]) => void;
  onStrokeWidthChange: (value: number[]) => void;
}

export const ElementActions: React.FC<ElementActionsProps> = ({
  currentBg,
  currentStroke,
  currentOpacity,
  currentStrokeWidth,
  onBgColorChange,
  onStrokeColorChange,
  onOpacityChange,
  onStrokeWidthChange,
}) => {
  return (
    <>
      <ColorButton
        value={currentBg}
        onChange={onBgColorChange}
        icon={<PaintBucket size={14} />}
        title="لون التعبئة"
      />

      <ColorButton
        value={currentStroke}
        onChange={onStrokeColorChange}
        icon={<Palette size={14} />}
        title="لون الحد"
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Opacity & Stroke Width Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 px-2 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))] text-xs pointer-events-auto"
            title="الشفافية وسمك الحد"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Blend size={14} />
            <span className="min-w-[28px] text-center">{Math.round(currentOpacity)}%</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white z-[var(--z-popover)] p-3 w-52 pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4">
            {/* Opacity Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[hsl(var(--ink-60))]">
                <span>الشفافية</span>
                <span className="font-medium text-[hsl(var(--ink))]">{Math.round(currentOpacity)}%</span>
              </div>
              <Slider
                value={[currentOpacity]}
                onValueChange={onOpacityChange}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-[hsl(var(--ink-30))]">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <Separator className="my-1" />

            {/* Stroke Width Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[hsl(var(--ink-60))]">
                <span>سمك الحد</span>
                <span className="font-medium text-[hsl(var(--ink))]">{currentStrokeWidth}px</span>
              </div>
              <Slider
                value={[currentStrokeWidth]}
                onValueChange={onStrokeWidthChange}
                min={0}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-[hsl(var(--ink-30))]">
                <span>0</span>
                <span>10</span>
                <span>20px</span>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );
};

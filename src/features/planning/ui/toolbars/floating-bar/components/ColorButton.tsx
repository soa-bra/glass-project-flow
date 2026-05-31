/**
 * ColorButton - منتقي الألوان باستخدام ark-ui ColorPicker
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "@ark-ui/react/portal";
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import { PipetteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UTILITY_COLORS, SUPRA_COLORS } from "../constants";
import type { ColorButtonProps } from "../types";

const ColorButton: React.FC<ColorButtonProps> = ({ value, onChange, icon, title }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const safeValue = value && value !== "transparent" ? value : "#000000";

  const handleValueChange = (details: { value: any; valueAsString: string }) => {
    onChange(details.valueAsString);
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
  };

  return (
    <div
      className="relative pointer-events-auto"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <ColorPicker.Root value={parseColor(safeValue)} onValueChange={handleValueChange}>
        <ColorPicker.Control>
          <ColorPicker.Trigger className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[hsl(var(--ink)/0.1)] transition-colors cursor-pointer pointer-events-auto">
            <div className="flex flex-col items-center justify-center gap-0.5">
              {icon}
              <div
                className="w-4 h-1 rounded-sm border border-[hsl(var(--border))]"
                style={{ backgroundColor: value === "transparent" ? "transparent" : value }}
              />
            </div>
          </ColorPicker.Trigger>
        </ColorPicker.Control>

        <Portal>
          <ColorPicker.Positioner>
            <ColorPicker.Content className="bg-white border border-[hsl(var(--border))] rounded-lg p-4 shadow-lg space-y-4 z-[var(--z-popover)] w-72">
              {/* Color Area */}
              <ColorPicker.Area className="w-full h-32 rounded-md overflow-hidden relative">
                <ColorPicker.AreaBackground className="w-full h-full" />
                <ColorPicker.AreaThumb className="absolute w-4 h-4 bg-white border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2" />
              </ColorPicker.Area>

              {/* Sliders */}
              <div className="flex items-center gap-3">
                {"EyeDropper" in window && (
                  <ColorPicker.EyeDropperTrigger className="p-2 text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--panel))] transition-colors rounded-lg cursor-pointer">
                    <PipetteIcon className="w-4 h-4" />
                  </ColorPicker.EyeDropperTrigger>
                )}

                <div className="flex-1 space-y-3">
                  <ColorPicker.ChannelSlider channel="hue" className="relative w-full h-2 flex items-center">
                    <ColorPicker.ChannelSliderTrack
                      className="w-full h-2 rounded-full"
                      style={{
                        background:
                          "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
                      }}
                    />
                    <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-4 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow-md" />
                  </ColorPicker.ChannelSlider>

                  <ColorPicker.ChannelSlider channel="alpha" className="relative w-full h-2 flex items-center">
                    <ColorPicker.TransparencyGrid className="w-full h-2 rounded-full [--size:6px]" />
                    <ColorPicker.ChannelSliderTrack className="absolute w-full h-2 rounded-full" />
                    <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-4 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow-md" />
                  </ColorPicker.ChannelSlider>
                </div>
              </div>

              {/* Input */}
              <ColorPicker.ChannelInput
                channel="hex"
                className="w-full px-3 py-2 text-sm text-center border border-[hsl(var(--border))] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3DBE8B]"
              />

              {/* Presets */}
              <div className="flex gap-2 flex-wrap">
                {[...UTILITY_COLORS, ...SUPRA_COLORS].map(({ color, label }) => (
                  <button
                    key={color}
                    type="button"
                    title={label}
                    onClick={() => handlePresetClick(color)}
                    className={cn(
                      "w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform border-2",
                      value?.toLowerCase() === color.toLowerCase()
                        ? "border-[hsl(var(--ink))]"
                        : "border-[hsl(var(--border))]",
                    )}
                    style={{
                      backgroundColor: color === "transparent" ? undefined : color,
                      backgroundImage:
                        color === "transparent"
                          ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                          : undefined,
                      backgroundSize: "6px 6px",
                    }}
                  />
                ))}
              </div>
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </Portal>
        <ColorPicker.HiddenInput />
      </ColorPicker.Root>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[var(--z-tooltip)] pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorButton;

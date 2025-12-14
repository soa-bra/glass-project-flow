"use client";

import { Portal } from "@ark-ui/react/portal";
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import { PipetteIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Utility colors (Row 1)
const UTILITY_COLORS = [
  {
    color: "transparent",
    label: "شفاف",
  },
  {
    color: "#000000",
    label: "أسود",
  },
  {
    color: "#FFFFFF",
    label: "أبيض",
  },
  {
    color: "#808080",
    label: "رمادي",
  },
];

// Supra brand colors from design tokens (Row 2)
const SUPRA_COLORS = [
  {
    color: "#3DBE8B",
    label: "أخضر",
  },
  {
    color: "#F6C445",
    label: "أصفر",
  },
  {
    color: "#E5564D",
    label: "أحمر",
  },
  {
    color: "#3DA8F5",
    label: "أزرق",
  },
];
const RECENT_COLORS_KEY = "supra-recent-colors";
const MAX_RECENT_COLORS = 6;
const getRecentColors = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_COLORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
const addRecentColor = (color: string) => {
  if (typeof window === "undefined") return;
  if (color === "transparent" || !color) return;
  try {
    const recent = getRecentColors();
    const filtered = recent.filter((c) => c.toLowerCase() !== color.toLowerCase());
    const updated = [color, ...filtered].slice(0, MAX_RECENT_COLORS);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
};
interface ColorPickerInputProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
export function ColorPickerInput({ value = "#000000", onChange, className }: ColorPickerInputProps) {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  useEffect(() => {
    setRecentColors(getRecentColors());
  }, []);
  const handleValueChange = (details: { value: any; valueAsString: string }) => {
    const hex = details.valueAsString;
    if (onChange) {
      onChange(hex);
    }
    addRecentColor(hex);
    setRecentColors(getRecentColors());
  };
  const handlePresetClick = (color: string) => {
    if (onChange) {
      onChange(color);
    }
    if (color !== "transparent") {
      addRecentColor(color);
      setRecentColors(getRecentColors());
    }
  };
  const safeValue = value && value !== "transparent" ? value : "#000000";
  return (
    <div className={className}>
      <ColorPicker.Root value={parseColor(safeValue)} onValueChange={handleValueChange}>
        <div className="space-y-4">
          {/* Header with input and color swatch */}
          <div className="flex items-center gap-3">
            <ColorPicker.Control className="flex-1">
              <ColorPicker.ChannelInput
                channel="hex"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </ColorPicker.Control>
            <ColorPicker.Trigger className="w-12 h-10 rounded-md border-2 border-border overflow-hidden cursor-pointer hover:border-muted-foreground transition-colors">
              <ColorPicker.TransparencyGrid className="w-full h-full [--size:8px] opacity-50" />
              <ColorPicker.ValueSwatch className="w-full h-full" />
            </ColorPicker.Trigger>
          </div>

          {/* Color Picker Content */}
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content className="bg-background border border-border rounded-lg p-4 shadow-lg space-y-4 z-50 w-80">
                {/* Color Area */}
                <ColorPicker.Area className="w-full h-36 rounded-md overflow-hidden relative">
                  <ColorPicker.AreaBackground className="w-full h-full" />
                  <ColorPicker.AreaThumb className="absolute w-3 h-3 bg-white border-2 border-White rounded-full shadow-sm -translate-x-1/2 -translate-y-1/2" />
                </ColorPicker.Area>

                {/* Eye Dropper and Sliders */}
                <div className="flex items-center gap-3">
                  <ColorPicker.EyeDropperTrigger className="p-2 text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-colors rounded-lg">
                    <PipetteIcon className="w-4 h-4" />
                  </ColorPicker.EyeDropperTrigger>

                  <div className="flex-1 space-y-3 pr-[14px] pb-0 mb-0 mt-0 pl-[6px] pt-0">
                    {/* Hue Slider */}
                    <ColorPicker.ChannelSlider channel="hue" className="relative w-full h-2 flex items-center">
                      <ColorPicker.ChannelSliderTrack
                        className="w-full h-2 rounded-full"
                        style={{
                          background:
                            "linear-gradient(to right, #00FF00, #00FFFF, #0066FF, #0000FF, #6600FF, #FF00FF, #FF0066, #FF0000)",
                        }}
                      />
                      <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-5 bg-current rounded-full -translate-y-1/2 -translate-x-1/2 border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]" />
                    </ColorPicker.ChannelSlider>

                    {/* Alpha Slider */}
                    <ColorPicker.ChannelSlider channel="alpha" className="relative w-full h-2 flex items-center">
                      <ColorPicker.TransparencyGrid className="w-full h-2 rounded-full [--size:8px]" />
                      <ColorPicker.ChannelSliderTrack className="w-full h-2 rounded-full" />
                      <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-5 bg-current rounded-full -translate-y-1/2 -translate-x-1/2 border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]" />
                    </ColorPicker.ChannelSlider>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="flex gap-3">
                  <ColorPicker.ChannelInput
                    channel="hex"
                    className="flex-1 text-base text-center border border-border rounded-full bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent py-px px-[21px]"
                  />
                  <ColorPicker.ChannelInput
                    channel="alpha"
                    className="w-24 text-base text-center border border-border rounded-full bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent py-0 px-0"
                  />
                </div>

                {/* Row 1: Utility Colors */}
                <div className="flex justify-center gap-3">
                  {UTILITY_COLORS.map(({ color, label }) => (
                    <button
                      key={color}
                      type="button"
                      title={label}
                      onClick={() => handlePresetClick(color)}
                      className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform relative overflow-hidden"
                      style={{
                        backgroundColor: color === "transparent" ? undefined : color,
                      }}
                    >
                      {color === "transparent" && (
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundImage:
                              "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                            backgroundSize: "8px 8px",
                            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Row 2: Supra Brand Colors */}
                <div className="flex justify-center gap-3">
                  {SUPRA_COLORS.map(({ color, label }) => (
                    <button
                      key={color}
                      type="button"
                      title={label}
                      onClick={() => handlePresetClick(color)}
                      className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>

                {/* Row 3: Recent Colors */}
                {recentColors.length > 0 && (
                  <div className="flex justify-center gap-3">
                    {recentColors.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        type="button"
                        onClick={() => handlePresetClick(color)}
                        className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: color,
                        }}
                      />
                    ))}
                  </div>
                )}
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </div>
        <ColorPicker.HiddenInput />
      </ColorPicker.Root>
    </div>
  );
}

// Inline version for simple use cases (like sticky notes)
export function InlineColorPicker({ value, onChange, className }: ColorPickerInputProps) {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  useEffect(() => {
    setRecentColors(getRecentColors());
  }, []);
  const handleColorClick = (color: string) => {
    if (onChange) {
      onChange(color);
    }
    if (color !== "transparent") {
      addRecentColor(color);
      setRecentColors(getRecentColors());
    }
  };
  const allPresets = [...UTILITY_COLORS, ...SUPRA_COLORS];
  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Basic presets */}
        <div className="flex flex-wrap gap-2">
          {allPresets.map(({ color, label }) => (
            <button
              key={color}
              type="button"
              title={label}
              onClick={() => handleColorClick(color)}
              className={`w-7 h-7 rounded-md border-2 cursor-pointer hover:scale-110 transition-transform relative overflow-hidden ${value === color ? "border-foreground ring-2 ring-ring" : "border-border"}`}
              style={{
                backgroundColor: color === "transparent" ? undefined : color,
              }}
            >
              {color === "transparent" && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                    backgroundSize: "6px 6px",
                    backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Recent colors */}
        {recentColors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recentColors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                onClick={() => handleColorClick(color)}
                className={`w-7 h-7 rounded-md border-2 cursor-pointer hover:scale-110 transition-transform ${value === color ? "border-foreground ring-2 ring-ring" : "border-border"}`}
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default ColorPickerInput;

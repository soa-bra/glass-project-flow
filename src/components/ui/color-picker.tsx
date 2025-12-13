"use client";
import React from "react";
import { Portal } from "@ark-ui/react/portal";
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import { PipetteIcon } from "lucide-react";

interface ColorPickerInputProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPickerInput({ value, onChange, label }: ColorPickerInputProps) {
  const handleColorChange = (details: { valueAsString: string }) => {
    onChange(details.valueAsString);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block text-right">
          {label}
        </label>
      )}
      <ColorPicker.Root 
        value={parseColor(value)} 
        onValueChange={handleColorChange}
      >
        <div className="space-y-3">
          {/* Header with input and color swatch */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <ColorPicker.Trigger className="w-12 h-10 rounded-[10px] border-2 border-[hsl(var(--border))] overflow-hidden cursor-pointer hover:border-[hsl(var(--accent-green))] transition-colors relative">
              <ColorPicker.TransparencyGrid className="w-full h-full [--size:8px] opacity-50 absolute inset-0" />
              <ColorPicker.ValueSwatch className="w-full h-full relative" />
            </ColorPicker.Trigger>
            <ColorPicker.Control className="flex-1">
              <ColorPicker.ChannelInput
                channel="hex"
                className="w-full px-3 py-2 text-[12px] border border-[hsl(var(--border))] rounded-[10px] bg-white text-[hsl(var(--ink))] focus:outline-none focus:border-[hsl(var(--accent-green))] transition-colors text-center"
              />
            </ColorPicker.Control>
          </div>

          {/* Color Picker Content */}
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content className="bg-white border border-[hsl(var(--border))] rounded-[12px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] space-y-4 z-[100] w-72" dir="rtl">
                {/* Color Area */}
                <ColorPicker.Area className="w-full h-36 rounded-[10px] overflow-hidden relative">
                  <ColorPicker.AreaBackground className="w-full h-full" />
                  <ColorPicker.AreaThumb className="absolute w-4 h-4 bg-white border-2 border-[hsl(var(--ink))] rounded-full shadow-md -translate-x-1/2 -translate-y-1/2" />
                </ColorPicker.Area>

                {/* Eye Dropper and Sliders */}
                <div className="flex items-center gap-3 flex-row-reverse">
                  <ColorPicker.EyeDropperTrigger className="p-2 text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] border border-[hsl(var(--border))] rounded-[10px] hover:bg-[hsl(var(--panel))] transition-colors">
                    <PipetteIcon className="w-4 h-4" />
                  </ColorPicker.EyeDropperTrigger>

                  <div className="flex-1 space-y-2">
                    {/* Hue Slider */}
                    <ColorPicker.ChannelSlider
                      channel="hue"
                      className="relative w-full h-3 rounded-full overflow-hidden"
                    >
                      <ColorPicker.ChannelSliderTrack className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500" />
                      <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[hsl(var(--ink))] rounded-full shadow-md -translate-y-1/2 -translate-x-1/2" />
                    </ColorPicker.ChannelSlider>

                    {/* Alpha Slider */}
                    <ColorPicker.ChannelSlider
                      channel="alpha"
                      className="relative w-full h-3 rounded-full overflow-hidden"
                    >
                      <ColorPicker.TransparencyGrid className="w-full h-full [--size:8px]" />
                      <ColorPicker.ChannelSliderTrack className="w-full h-full" />
                      <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[hsl(var(--ink))] rounded-full shadow-md -translate-y-1/2 -translate-x-1/2" />
                    </ColorPicker.ChannelSlider>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="flex gap-2 flex-row-reverse">
                  <ColorPicker.ChannelInput
                    channel="hex"
                    className="flex-1 px-3 py-2 text-[12px] border border-[hsl(var(--border))] rounded-[10px] bg-white text-[hsl(var(--ink))] focus:outline-none focus:border-[hsl(var(--accent-green))] transition-colors text-center"
                  />
                  <ColorPicker.ChannelInput
                    channel="alpha"
                    className="w-16 px-3 py-2 text-[12px] border border-[hsl(var(--border))] rounded-[10px] bg-white text-[hsl(var(--ink))] focus:outline-none focus:border-[hsl(var(--accent-green))] transition-colors text-center"
                  />
                </div>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </div>
        <ColorPicker.HiddenInput />
      </ColorPicker.Root>
    </div>
  );
}

// Storage key for recent colors
const RECENT_COLORS_KEY = 'soabra-recent-colors';

// Get recent colors from localStorage
function getRecentColors(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_COLORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save color to recent colors
function saveRecentColor(color: string) {
  try {
    const recent = getRecentColors();
    // Remove if exists, add to front, limit to 6
    const filtered = recent.filter(c => c.toLowerCase() !== color.toLowerCase());
    const updated = [color, ...filtered].slice(0, 6);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

interface InlineColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function InlineColorPicker({ value, onChange }: InlineColorPickerProps) {
  const [recentColors, setRecentColors] = React.useState<string[]>([]);

  // Load recent colors on mount
  React.useEffect(() => {
    setRecentColors(getRecentColors());
  }, []);

  // Row 1: Basic colors (transparent, black, white, gray)
  const basicColors = [
    { color: "transparent", label: "شفاف" },
    { color: "#0B0F12", label: "أسود" },
    { color: "#FFFFFF", label: "أبيض" },
    { color: "#9CA3AF", label: "رمادي" },
  ];

  // Row 2: SoaBra brand colors from design tokens
  const brandColors = [
    "#3DBE8B", // accent green
    "#F6C445", // accent yellow
    "#E5564D", // accent red
    "#3DA8F5", // accent blue
    "#d9e7ed", // panel
    "#DADCE0", // border
  ];

  const handleColorChange = (details: { valueAsString: string }) => {
    const newColor = details.valueAsString;
    onChange(newColor);
    // Save to recent colors
    if (newColor !== "transparent") {
      saveRecentColor(newColor);
      setRecentColors(getRecentColors());
    }
  };

  const handleDirectColorClick = (color: string) => {
    onChange(color);
    if (color !== "transparent") {
      saveRecentColor(color);
      setRecentColors(getRecentColors());
    }
  };

  return (
    <ColorPicker.Root 
      value={parseColor(value === "transparent" ? "#FFFFFF" : value)} 
      onValueChange={handleColorChange}
      inline
    >
      <ColorPicker.Content className="space-y-3" dir="rtl">
        {/* Row 1: Basic Colors */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-[hsl(var(--ink-60))] font-medium">الألوان الأساسية</span>
          <div className="flex gap-2 justify-end">
            {basicColors.map(({ color, label }) => (
              <button
                key={color}
                onClick={() => handleDirectColorClick(color)}
                className={`w-9 h-9 rounded-[8px] border-2 cursor-pointer hover:scale-105 transition-transform relative ${
                  value === color ? 'border-[hsl(var(--ink))]' : 'border-[hsl(var(--border))]'
                }`}
                style={{ 
                  backgroundColor: color === "transparent" ? "transparent" : color,
                }}
                title={label}
              >
                {color === "transparent" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[2px] bg-[hsl(var(--accent-red))] rotate-45 absolute" />
                  </div>
                )}
                {value === color && color !== "transparent" && (
                  <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                    color === "#FFFFFF" || color === "#9CA3AF" ? 'text-[hsl(var(--ink))]' : 'text-white'
                  }`}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Brand Colors */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-[hsl(var(--ink-60))] font-medium">ألوان سوبرا</span>
          <div className="flex gap-2 justify-end">
            {brandColors.map((color) => (
              <button
                key={color}
                onClick={() => handleDirectColorClick(color)}
                className={`w-9 h-9 rounded-[8px] border-2 cursor-pointer hover:scale-105 transition-transform ${
                  value.toLowerCase() === color.toLowerCase() ? 'border-[hsl(var(--ink))]' : 'border-[hsl(var(--border))]'
                }`}
                style={{ backgroundColor: color }}
              >
                {value.toLowerCase() === color.toLowerCase() && (
                  <span className={`flex items-center justify-center text-xs font-bold ${
                    color === "#d9e7ed" || color === "#DADCE0" || color === "#F6C445" ? 'text-[hsl(var(--ink))]' : 'text-white'
                  }`}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Recent Colors */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-[hsl(var(--ink-60))] font-medium">الألوان الأخيرة</span>
          <div className="flex gap-2 justify-end min-h-[36px]">
            {recentColors.length > 0 ? (
              recentColors.map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  onClick={() => handleDirectColorClick(color)}
                  className={`w-9 h-9 rounded-[8px] border-2 cursor-pointer hover:scale-105 transition-transform ${
                    value.toLowerCase() === color.toLowerCase() ? 'border-[hsl(var(--ink))]' : 'border-[hsl(var(--border))]'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {value.toLowerCase() === color.toLowerCase() && (
                    <span className="flex items-center justify-center text-xs font-bold text-white">✓</span>
                  )}
                </button>
              ))
            ) : (
              <span className="text-[10px] text-[hsl(var(--ink-30))] italic">لا توجد ألوان حديثة</span>
            )}
          </div>
        </div>
      </ColorPicker.Content>
      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  );
}

export default ColorPickerInput;

"use client";
import { Portal } from "@ark-ui/react/portal";
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const RECENT_COLORS_KEY = 'supra-recent-colors';
const MAX_RECENT_COLORS = 6;

const getRecentColors = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_COLORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addRecentColor = (color: string) => {
  if (typeof window === 'undefined') return;
  if (color === 'transparent' || !color) return;
  
  try {
    const recent = getRecentColors();
    const filtered = recent.filter(c => c.toLowerCase() !== color.toLowerCase());
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

export function ColorPickerInput({ value = '#000000', onChange, className }: ColorPickerInputProps) {
  const handleValueChange = (details: { value: any; valueAsString: string }) => {
    const hex = details.valueAsString;
    if (onChange) {
      onChange(hex);
    }
    addRecentColor(hex);
  };

  const safeValue = value && value !== 'transparent' ? value : '#000000';

  return (
    <div className={className}>
      <ColorPicker.Root 
        value={parseColor(safeValue)} 
        onValueChange={handleValueChange}
      >
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
              <ColorPicker.Content className="bg-white rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 w-64 overflow-hidden">
                {/* Color Area */}
                <ColorPicker.Area className="w-full h-40 rounded-xl overflow-hidden relative mb-3">
                  <ColorPicker.AreaBackground className="w-full h-full" />
                  <ColorPicker.AreaThumb className="absolute w-4 h-4 bg-transparent border-2 border-white rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.2)] -translate-x-1/2 -translate-y-1/2" />
                </ColorPicker.Area>

                {/* Sliders */}
                <div className="space-y-2 mb-3">
                  {/* Hue Slider */}
                  <ColorPicker.ChannelSlider
                    channel="hue"
                    className="relative w-full h-3 rounded-full overflow-hidden"
                  >
                    <ColorPicker.ChannelSliderTrack className="w-full h-full rounded-full" style={{
                      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                    }} />
                    <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-4 h-4 bg-white border-2 border-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.3)] -translate-y-1/2 -translate-x-1/2" />
                  </ColorPicker.ChannelSlider>

                  {/* Alpha Slider */}
                  <ColorPicker.ChannelSlider
                    channel="alpha"
                    className="relative w-full h-3 rounded-full overflow-hidden"
                  >
                    <ColorPicker.TransparencyGrid className="w-full h-full [--size:6px] rounded-full" />
                    <ColorPicker.ChannelSliderTrack className="w-full h-full rounded-full" />
                    <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-4 h-4 bg-white border-2 border-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.3)] -translate-y-1/2 -translate-x-1/2" />
                  </ColorPicker.ChannelSlider>
                </div>

                {/* Input Fields Row */}
                <div className="flex items-center gap-2">
                  {/* Format Selector */}
                  <ColorPicker.FormatSelect className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-foreground bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors">
                    <ColorPicker.FormatTrigger className="flex items-center gap-1">
                      <span>Hex</span>
                      <ChevronDown className="w-3 h-3" />
                    </ColorPicker.FormatTrigger>
                  </ColorPicker.FormatSelect>

                  {/* Hex Input */}
                  <ColorPicker.ChannelInput
                    channel="hex"
                    className="flex-1 px-2 py-1.5 text-xs font-medium text-center border-0 bg-muted rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />

                  {/* Alpha Input */}
                  <ColorPicker.ChannelInput
                    channel="alpha"
                    className="w-14 px-2 py-1.5 text-xs font-medium text-center border-0 bg-muted rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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

// Utility colors (Row 1)
const UTILITY_COLORS = [
  { color: 'transparent', label: 'شفاف' },
  { color: '#000000', label: 'أسود' },
  { color: '#FFFFFF', label: 'أبيض' },
  { color: '#808080', label: 'رمادي' },
];

// Supra brand colors from design tokens (Row 2)
const SUPRA_COLORS = [
  { color: '#3DBE8B', label: 'أخضر' },
  { color: '#F6C445', label: 'أصفر' },
  { color: '#E5564D', label: 'أحمر' },
  { color: '#3DA8F5', label: 'أزرق' },
];

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
    if (color !== 'transparent') {
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
              className={`w-7 h-7 rounded-md border-2 cursor-pointer hover:scale-110 transition-transform relative overflow-hidden ${
                value === color ? 'border-foreground ring-2 ring-ring' : 'border-border'
              }`}
              style={{ 
                backgroundColor: color === 'transparent' ? undefined : color,
              }}
            >
              {color === 'transparent' && (
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '6px 6px',
                    backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px'
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
                className={`w-7 h-7 rounded-md border-2 cursor-pointer hover:scale-110 transition-transform ${
                  value === color ? 'border-foreground ring-2 ring-ring' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ColorPickerInput;

"use client";
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

interface InlineColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

export function InlineColorPicker({ value, onChange, presets }: InlineColorPickerProps) {
  const defaultPresets = [
    "#3B82F6",
    "#F87171", 
    "#FBBF24",
    "#E9D5FF",
    "#BBF7D0",
    "#93C5FD",
    "#FBCFE8",
    "#FEF9C3",
  ];

  const colorPresets = presets || defaultPresets;

  const handleColorChange = (details: { valueAsString: string }) => {
    onChange(details.valueAsString);
  };

  return (
    <ColorPicker.Root 
      value={parseColor(value)} 
      onValueChange={handleColorChange}
      inline
    >
      <ColorPicker.Content className="space-y-4" dir="rtl">
        {/* Color Swatches */}
        <ColorPicker.SwatchGroup className="flex flex-wrap gap-2 justify-end">
          {colorPresets.map((color) => (
            <ColorPicker.SwatchTrigger key={color} value={color}>
              <ColorPicker.Swatch
                value={color}
                className="w-10 h-10 rounded-[10px] border-2 border-[hsl(var(--border))] cursor-pointer hover:scale-105 transition-transform"
              >
                <ColorPicker.SwatchIndicator className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                  ✓
                </ColorPicker.SwatchIndicator>
              </ColorPicker.Swatch>
            </ColorPicker.SwatchTrigger>
          ))}
        </ColorPicker.SwatchGroup>
      </ColorPicker.Content>
      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  );
}

export default ColorPickerInput;

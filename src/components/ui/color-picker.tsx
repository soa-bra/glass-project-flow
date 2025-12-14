"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Range, Root, Thumb, Track } from '@radix-ui/react-slider';
import Color from 'color';
import { PipetteIcon } from 'lucide-react';
import {
  type ChangeEventHandler,
  type ComponentProps,
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createContext, useContext } from 'react';

// Store for recent colors (persisted in localStorage)
const RECENT_COLORS_KEY = 'soabra-recent-colors';
const MAX_RECENT_COLORS = 6;

const getRecentColors = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_COLORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addRecentColor = (color: string): void => {
  try {
    const recent = getRecentColors().filter(c => c !== color);
    recent.unshift(color);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(recent.slice(0, MAX_RECENT_COLORS)));
  } catch {
    // Ignore storage errors
  }
};

interface ColorPickerContextValue {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setAlpha: (alpha: number) => void;
  setMode: (mode: string) => void;
  setColorFromHex: (hex: string) => void;
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined
);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);

  if (!context) {
    throw new Error('useColorPicker must be used within a ColorPickerProvider');
  }

  return context;
};

export type ColorPickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const ColorPicker = ({
  value,
  defaultValue = '#000000',
  onChange,
  className,
  ...props
}: ColorPickerProps) => {
  const getColorValues = (colorValue: string) => {
    try {
      const color = Color(colorValue);
      return {
        hue: color.hue() || 0,
        saturation: color.saturationl() || 100,
        lightness: color.lightness() || 50,
        alpha: color.alpha() * 100
      };
    } catch {
      return { hue: 0, saturation: 100, lightness: 50, alpha: 100 };
    }
  };

  const initialValues = getColorValues(value || defaultValue);

  const [hue, setHue] = useState(initialValues.hue);
  const [saturation, setSaturation] = useState(initialValues.saturation);
  const [lightness, setLightness] = useState(initialValues.lightness);
  const [alpha, setAlpha] = useState(initialValues.alpha);
  const [mode, setMode] = useState('hex');

  const setColorFromHex = useCallback((hex: string) => {
    try {
      const color = Color(hex);
      setHue(color.hue() || 0);
      setSaturation(color.saturationl() || 100);
      setLightness(color.lightness() || 50);
      setAlpha(color.alpha() * 100);
      
      // Add to recent colors
      addRecentColor(hex);
    } catch {
      // Invalid color
    }
  }, []);

  // Track if this is initial mount or controlled update to avoid infinite loops
  const isControlledUpdate = useRef(false);
  const prevValueRef = useRef(value);

  // Update color when controlled value changes from outside
  useEffect(() => {
    if (value && value !== prevValueRef.current) {
      isControlledUpdate.current = true;
      const values = getColorValues(value);
      setHue(values.hue);
      setSaturation(values.saturation);
      setLightness(values.lightness);
      setAlpha(values.alpha);
      prevValueRef.current = value;
    }
  }, [value]);

  // Notify parent of changes (only when user interacts, not on controlled updates)
  useEffect(() => {
    if (isControlledUpdate.current) {
      isControlledUpdate.current = false;
      return;
    }
    
    if (onChange) {
      try {
        const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
        const hex = alpha < 100 
          ? color.hexa() 
          : color.hex();
        
        if (hex !== prevValueRef.current) {
          prevValueRef.current = hex;
          onChange(hex);
        }
      } catch {
        // Ignore invalid colors
      }
    }
  }, [hue, saturation, lightness, alpha, onChange]);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setAlpha,
        setMode,
        setColorFromHex,
      }}
    >
      <div className={cn('grid w-full gap-3', className)} {...props} />
    </ColorPickerContext.Provider>
  );
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = ({
  className,
  ...props
}: ColorPickerSelectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 1, y: 0 });
  const { hue, saturation, lightness, setSaturation, setLightness } = useColorPicker();

  // Sync position with saturation/lightness
  useEffect(() => {
    setPosition({
      x: saturation / 100,
      y: 1 - (lightness / 50) // Simplified mapping
    });
  }, [saturation, lightness]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));

      setPosition({ x, y });
      setSaturation(x * 100);
      setLightness((1 - y) * 50);
    },
    [isDragging, setSaturation, setLightness]
  );

  useEffect(() => {
    const handlePointerUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-[4/3] w-full cursor-crosshair rounded-[10px] overflow-hidden',
        className
      )}
      style={{
        background: `linear-gradient(0deg, rgb(0,0,0), transparent), linear-gradient(90deg, rgb(255,255,255), hsl(${hue}, 100%, 50%))`,
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
        handlePointerMove(e.nativeEvent);
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x * 100}%`,
          top: `${position.y * 100}%`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
};

export const ColorPickerHue = ({
  className,
}: { className?: string }) => {
  const { hue, setHue } = useColorPicker();

  return (
    <Root
      value={[hue]}
      max={360}
      step={1}
      className={cn('relative flex h-3 w-full touch-none', className)}
      onValueChange={([hue]) => setHue(hue)}
    >
      <Track className="relative h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Range className="absolute h-full" />
      </Track>
      <Thumb className="block h-4 w-4 rounded-full border-2 border-[hsl(var(--ink))] bg-white shadow-md -translate-y-0.5 focus-visible:outline-none" />
    </Root>
  );
};

export const ColorPickerAlpha = ({
  className,
}: { className?: string }) => {
  const { hue, alpha, setAlpha } = useColorPicker();

  return (
    <Root
      value={[alpha]}
      max={100}
      step={1}
      className={cn('relative flex h-3 w-full touch-none', className)}
      onValueChange={([alpha]) => setAlpha(alpha)}
    >
      <Track
        className="relative h-3 w-full grow rounded-full overflow-hidden"
        style={{
          background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
        }}
      >
        <div 
          className="absolute inset-0 rounded-full" 
          style={{
            background: `linear-gradient(to left, hsl(${hue}, 100%, 50%), transparent)`
          }}
        />
        <Range className="absolute h-full rounded-full bg-transparent" />
      </Track>
      <Thumb className="block h-4 w-4 rounded-full border-2 border-[hsl(var(--ink))] bg-white shadow-md -translate-y-0.5 focus-visible:outline-none" />
    </Root>
  );
};

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

export const ColorPickerEyeDropper = ({
  className,
  ...props
}: ColorPickerEyeDropperProps) => {
  const { setColorFromHex } = useColorPicker();

  const handleEyeDropper = async () => {
    try {
      // @ts-ignore - EyeDropper API is experimental
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      setColorFromHex(result.sRGBHex);
    } catch (error) {
      console.error('EyeDropper failed:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleEyeDropper}
      className={cn('shrink-0 h-8 w-8 text-[hsl(var(--ink-60))] border-[hsl(var(--border))] hover:bg-[hsl(var(--panel))]', className)}
      {...props}
    >
      <PipetteIcon size={14} />
    </Button>
  );
};

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;

const formats = ['hex', 'rgb', 'hsl'];

export const ColorPickerOutput = ({
  className,
  ...props
}: ColorPickerOutputProps) => {
  const { mode, setMode } = useColorPicker();

  return (
    <Select value={mode} onValueChange={setMode}>
      <SelectTrigger className={cn("h-7 w-16 shrink-0 text-[10px] border-[hsl(var(--border))]", className)} {...props}>
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => (
          <SelectItem key={format} value={format} className="text-[10px]">
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

type PercentageInputProps = ComponentProps<typeof Input>;

const PercentageInput = ({ className, ...props }: PercentageInputProps) => {
  return (
    <div className="relative">
      <Input
        type="text"
        {...props}
        className={cn(
          'h-7 w-12 rounded-r-[10px] rounded-l-none bg-[hsl(var(--panel))] px-2 text-[10px] shadow-none border-[hsl(var(--border))]',
          className
        )}
      />
      <span className="absolute top-1/2 left-2 -translate-y-1/2 text-[hsl(var(--ink-60))] text-[10px]">
        %
      </span>
    </div>
  );
};

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerFormat = ({
  className,
  ...props
}: ColorPickerFormatProps) => {
  const {
    hue,
    saturation,
    lightness,
    alpha,
    mode,
    setColorFromHex,
    setAlpha,
  } = useColorPicker();

  const getColor = () => {
    try {
      return Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
    } catch {
      return Color('#000000');
    }
  };
  
  const color = getColor();

  if (mode === 'hex') {
    const hex = color.hex().replace('#', '');

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      const value = event.target.value.replace('#', '');
      if (value.length >= 3) {
        setColorFromHex(`#${value}`);
      }
    };

    return (
      <div
        className={cn('relative flex items-center -space-x-px flex-row-reverse', className)}
        {...props}
      >
        <div className="relative flex-1">
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] text-[hsl(var(--ink-60))]">
            #
          </span>
          <Input
            type="text"
            value={hex}
            onChange={handleChange}
            className="h-7 rounded-l-[10px] rounded-r-none bg-[hsl(var(--panel))] pr-5 pl-2 text-[10px] shadow-none text-left border-[hsl(var(--border))]"
          />
        </div>
        <PercentageInput 
          value={Math.round(alpha)} 
          onChange={(e) => setAlpha(Number(e.target.value) || 0)}
        />
      </div>
    );
  }

  if (mode === 'rgb') {
    const rgb = color.rgb().array().map((value) => Math.round(value));

    return (
      <div
        className={cn('flex items-center -space-x-px flex-row-reverse', className)}
        {...props}
      >
        {rgb.map((value, index) => (
          <Input
            key={index}
            type="text"
            value={value}
            readOnly
            className={cn(
              'h-7 bg-[hsl(var(--panel))] px-2 text-[10px] shadow-none text-center border-[hsl(var(--border))] w-10',
              index === 0 && 'rounded-l-[10px] rounded-r-none',
              index > 0 && index < 2 && 'rounded-none',
              index === 2 && 'rounded-r-none rounded-l-none'
            )}
          />
        ))}
        <PercentageInput value={Math.round(alpha)} />
      </div>
    );
  }

  if (mode === 'hsl') {
    const hsl = [Math.round(hue), Math.round(saturation), Math.round(lightness)];

    return (
      <div
        className={cn('flex items-center -space-x-px flex-row-reverse', className)}
        {...props}
      >
        {hsl.map((value, index) => (
          <Input
            key={index}
            type="text"
            value={value}
            readOnly
            className={cn(
              'h-7 bg-[hsl(var(--panel))] px-2 text-[10px] shadow-none text-center border-[hsl(var(--border))] w-10',
              index === 0 && 'rounded-l-[10px] rounded-r-none',
              index > 0 && index < 2 && 'rounded-none',
              index === 2 && 'rounded-r-none rounded-l-none'
            )}
          />
        ))}
        <PercentageInput value={Math.round(alpha)} />
      </div>
    );
  }

  return null;
};

// Color Presets Component
export type ColorPickerPresetsProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerPresets = ({
  className,
  ...props
}: ColorPickerPresetsProps) => {
  const { setColorFromHex, setAlpha } = useColorPicker();
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    setRecentColors(getRecentColors());
  }, []);

  // Row 1: Basic colors (transparent, black, white, gray)
  const basicColors = [
    { color: 'transparent', label: 'شفاف' },
    { color: '#000000', label: 'أسود' },
    { color: '#FFFFFF', label: 'أبيض' },
    { color: '#808080', label: 'رمادي' },
  ];

  // Row 2: Supra brand colors from design tokens
  const supraBrandColors = [
    { color: '#3DBE8B', label: 'أخضر' },
    { color: '#F6C445', label: 'أصفر' },
    { color: '#E5564D', label: 'أحمر' },
    { color: '#3DA8F5', label: 'أزرق' },
  ];

  const handleColorClick = (color: string) => {
    if (color === 'transparent') {
      setAlpha(0);
    } else {
      setColorFromHex(color);
      setAlpha(100);
    }
    // Refresh recent colors
    setTimeout(() => setRecentColors(getRecentColors()), 100);
  };

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {/* Row 1: Basic Colors */}
      <div className="flex gap-1.5 justify-end">
        {basicColors.map(({ color, label }) => (
          <button
            key={color}
            type="button"
            onClick={() => handleColorClick(color)}
            className={cn(
              'w-7 h-7 rounded-[6px] border border-[hsl(var(--border))] cursor-pointer hover:scale-110 transition-transform',
              color === 'transparent' && 'bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")]'
            )}
            style={{ backgroundColor: color === 'transparent' ? undefined : color }}
            title={label}
          />
        ))}
      </div>

      {/* Row 2: Supra Brand Colors */}
      <div className="flex gap-1.5 justify-end">
        {supraBrandColors.map(({ color, label }) => (
          <button
            key={color}
            type="button"
            onClick={() => handleColorClick(color)}
            className="w-7 h-7 rounded-[6px] border border-[hsl(var(--border))] cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={label}
          />
        ))}
      </div>

      {/* Row 3: Recent Colors */}
      {recentColors.length > 0 && (
        <div className="flex gap-1.5 justify-end">
          {recentColors.slice(0, 6).map((color, index) => (
            <button
              key={`${color}-${index}`}
              type="button"
              onClick={() => handleColorClick(color)}
              className="w-7 h-7 rounded-[6px] border border-[hsl(var(--border))] cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title="لون مستخدم مسبقاً"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Wrapper component for easy integration (compatible with old API)
interface ColorPickerInputProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPickerInput({ value, onChange, label }: ColorPickerInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block text-right">
          {label}
        </label>
      )}
      <ColorPicker 
        value={value} 
        onChange={onChange}
        className="w-full rounded-[12px] border border-[hsl(var(--border))] bg-white p-3 shadow-sm"
      >
        <ColorPickerSelection />
        <div className="flex items-center gap-3 flex-row-reverse">
          <ColorPickerEyeDropper />
          <div className="flex-1 space-y-1.5">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-row-reverse">
          <ColorPickerOutput />
          <ColorPickerFormat className="flex-1" />
        </div>
        <ColorPickerPresets />
      </ColorPicker>
    </div>
  );
}

// Simple inline color picker (for sticky notes)
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

  return (
    <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
      {colorPresets.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "w-10 h-10 rounded-[10px] border-2 cursor-pointer hover:scale-105 transition-transform",
            value === color ? "border-[hsl(var(--ink))]" : "border-[hsl(var(--border))]"
          )}
          style={{ backgroundColor: color }}
        >
          {value === color && (
            <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default ColorPickerInput;

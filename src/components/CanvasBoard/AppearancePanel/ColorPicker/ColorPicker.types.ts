// Color Picker Types
export interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
  className?: string;
  showPalette?: boolean;
  showSaved?: boolean;
  showRecent?: boolean;
}

export interface ColorPaletteProps {
  colors: string[];
  onColorSelect: (color: string) => void;
  selectedColor?: string;
  className?: string;
}

export interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const PALETTE_COLORS = [
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00',
  '#00FF00', '#00FF80', '#00FFFF', '#0080FF',
  '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
  '#000000', '#404040', '#808080', '#C0C0C0',
  '#FFFFFF', '#8B4513', '#FFE4B5', '#DDA0DD',
  '#98FB98', '#F0E68C', '#87CEEB', '#DEB887'
] as const;
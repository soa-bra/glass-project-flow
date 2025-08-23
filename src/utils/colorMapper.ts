// Color Mapping Utilities for Canvas Components
// Phase 2: Inline Style to Class Conversion

export const colorToClassName = (color: string): string => {
  const colorMap: Record<string, string> = {
    '#FF0000': 'bg-[#FF0000]',
    '#FF8000': 'bg-[#FF8000]',
    '#FFFF00': 'bg-[#FFFF00]',
    '#80FF00': 'bg-[#80FF00]',
    '#00FF00': 'bg-[#00FF00]',
    '#00FF80': 'bg-[#00FF80]',
    '#00FFFF': 'bg-[#00FFFF]',
    '#0080FF': 'bg-[#0080FF]',
    '#0000FF': 'bg-[#0000FF]',
    '#8000FF': 'bg-[#8000FF]',
    '#FF00FF': 'bg-[#FF00FF]',
    '#FF0080': 'bg-[#FF0080]',
    '#000000': 'bg-[#000000]',
    '#404040': 'bg-[#404040]',
    '#808080': 'bg-[#808080]',
    '#C0C0C0': 'bg-[#C0C0C0]',
    '#FFFFFF': 'bg-[#FFFFFF]',
    '#8B4513': 'bg-[#8B4513]',
    '#FFE4B5': 'bg-[#FFE4B5]',
    '#DDA0DD': 'bg-[#DDA0DD]',
    '#98FB98': 'bg-[#98FB98]',
    '#F0E68C': 'bg-[#F0E68C]',
    '#87CEEB': 'bg-[#87CEEB]',
    '#DEB887': 'bg-[#DEB887]',
    '#f8f9fa': 'bg-[#f8f9fa]',
    '#ffffff': 'bg-[#ffffff]',
    '#fef08a': 'bg-[#fef08a]',
    '#f8fafc': 'bg-[#f8fafc]',
    '#fff3cd': 'bg-[#fff3cd]',
    '#3B82F6': 'bg-[#3B82F6]',
    '#FEF3C7': 'bg-[#FEF3C7]',
    '#aec2cf': 'bg-[#aec2cf]',
    '#d9f3a8': 'bg-[#d9f3a8]',
    '#d1e1ea': 'bg-[#d1e1ea]',
    '#D4A574': 'bg-[#D4A574]',
  };

  // Handle rgba colors
  if (color.startsWith('rgba(255,255,255,0.9)')) return 'bg-[rgba(255,255,255,0.9)]';
  if (color.startsWith('rgba(255,255,255,0.95)')) return 'bg-[rgba(255,255,255,0.95)]';
  if (color.startsWith('rgba(255, 255, 255, 0.3)')) return 'bg-[rgba(255,255,255,0.3)]';

  return colorMap[color] || `bg-[${color}]`;
};

export const generateColorClass = (color: string, opacity?: number): string => {
  if (opacity && opacity < 1) {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `bg-[rgba(${r},${g},${b},${opacity})]`;
  }
  return colorToClassName(color);
};

export const createStyleObject = (backgroundColor: string): React.CSSProperties => {
  return { backgroundColor };
};
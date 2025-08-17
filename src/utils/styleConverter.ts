// Style Converter Utilities for Canvas Components
// Converts inline styles to Tailwind classes

export const convertStyleToClasses = (style: React.CSSProperties): string => {
  const classes: string[] = [];
  
  // Background colors
  if (style.backgroundColor) {
    switch (style.backgroundColor) {
      case '#f8f9fa':
        classes.push('bg-[#f8f9fa]');
        break;
      case '#ffffff':
        classes.push('bg-white');
        break;
      case '#fef08a':
        classes.push('bg-[#fef08a]');
        break;
      case '#f8fafc':
        classes.push('bg-[#f8fafc]');
        break;
      case '#fff3cd':
        classes.push('bg-[#fff3cd]');
        break;
      case 'rgba(255,255,255,0.9)':
        classes.push('bg-white/90');
        break;
      case 'rgba(255,255,255,0.95)':
        classes.push('bg-white/95');
        break;
      default:
        classes.push(`bg-[${style.backgroundColor}]`);
    }
  }
  
  // Position
  if (style.position) {
    classes.push(`${style.position}`);
  }
  
  // Size
  if (style.width === '100%') classes.push('w-full');
  if (style.height === '100%') classes.push('h-full');
  
  // Cursor
  if (style.cursor) {
    classes.push(`cursor-${style.cursor}`);
  }
  
  // Z-index
  if (style.zIndex) {
    classes.push(`z-[${style.zIndex}]`);
  }
  
  return classes.join(' ');
};

export const getTransformClasses = (x: number, y: number): string => {
  return `translate-x-[${x}px] translate-y-[${y}px]`;
};

export const getSizeClasses = (width: number | string, height: number | string): string => {
  const w = typeof width === 'number' ? `w-[${width}px]` : 'w-full';
  const h = typeof height === 'number' ? `h-[${height}px]` : 'h-full';
  return `${w} ${h}`;
};

// Convert complete style object to Tailwind classes
export const convertCompleteStyle = (style: React.CSSProperties): string => {
  const classes: string[] = [];
  
  // Background
  if (style.backgroundColor) {
    classes.push(convertStyleToClasses({ backgroundColor: style.backgroundColor }));
  }
  
  // Border
  if (style.borderColor && style.borderWidth) {
    classes.push(`border-[${style.borderWidth}px] border-[${style.borderColor}]`);
  }
  
  // Border radius
  if (style.borderRadius) {
    classes.push(`rounded-[${style.borderRadius}px]`);
  }
  
  // Font properties
  if (style.fontSize) {
    classes.push(`text-[${style.fontSize}px]`);
  }
  
  if (style.fontWeight) {
    const fontWeightMap: Record<string, string> = {
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      'normal': 'font-normal',
      'medium': 'font-medium',
      'semibold': 'font-semibold',
      'bold': 'font-bold',
    };
    classes.push(fontWeightMap[style.fontWeight.toString()] || `font-[${style.fontWeight}]`);
  }
  
  // Box shadow
  if (style.boxShadow) {
    classes.push(`shadow-[${style.boxShadow}]`);
  }
  
  // Text color (fill property for Canvas elements)
  if ((style as any).fill) {
    classes.push(`text-[${(style as any).fill}]`);
  }
  
  return classes.filter(Boolean).join(' ');
};

// Generate dynamic positioning classes for Canvas elements
export const generateCanvasElementClasses = (
  position: { x: number; y: number },
  size: { width: number; height: number },
  additionalStyle?: React.CSSProperties
): string => {
  const positionClasses = `absolute left-[${position.x}px] top-[${position.y}px]`;
  const sizeClasses = getSizeClasses(size.width, size.height);
  const styleClasses = additionalStyle ? convertCompleteStyle(additionalStyle) : '';
  
  return `${positionClasses} ${sizeClasses} ${styleClasses}`.trim();
};
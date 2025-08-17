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
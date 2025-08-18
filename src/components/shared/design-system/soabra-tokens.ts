// SoaBra Design Tokens v1.2.5 - Core System Constants
// هذا الملف يحتوي على التوكنز الأساسية لنظام تصميم سوبرا

export const SOABRA_TOKENS = {
  // الألوان الأساسية
  COLORS: {
    INK: '#000000',
    INK_70: 'rgba(0,0,0,0.7)',
    INK_40: 'rgba(0,0,0,0.4)',
    INK_20: 'rgba(0,0,0,0.2)',
    WHITE: '#FFFFFF',
    
    // خلفيات التطبيق
    APP_BG: '#F1F5F9',
    PANEL_BG: '#F8F9FA',
    CARD_BG: '#FFFFFF',
    BORDER: '#DADCE0',
    
    // ألوان العلامة التجارية
    BRAND: {
      MINT: '#BDEED3',
      SKY: '#A4E2F6',
      LILAC: '#D9D2FE',
      ROSE: '#F1B5B9',
      AMBER: '#FBE2AA',
    },
    
    // ألوان خاصة
    MUTED_BLUE: '#D1E1EA',
    TODO_MUTED: '#DFECF2',
    
    // خلفيات مخصصة للكروت
    PROJECT_CARD_BG: '#F1F5F9',
    TASK_CARD_BG: '#F8F9FA',
    PROJECT_COLUMN_BG: '#EBEFF2',
    TASK_LIST_BG: '#EAECEF',
  },

  // المقاسات والمسافات
  SPACING: {
    XS: '4px',
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '24px',
    XXL: '32px',
  },

  // نصف الأقطار
  RADIUS: {
    CARD_TOP: '24px',
    CARD_BOTTOM: '6px',
    PANEL: '18px',
    CHIP: '9999px',
    ICON_CONTAINER: '9999px',
  },

  // أحجام الأيقونات
  ICON_SIZES: [24, 28, 32] as const,
  HIT_AREA_MIN: 40,

  // الظلال
  SHADOWS: {
    CARD: [
      '0 1px 1px rgba(0,0,0,0.02)',
      '0 8px 24px rgba(0,0,0,0.06)'
    ],
    PANEL: [
      '0 1px 1px rgba(15,23,42,0.02)',
      '0 10px 24px rgba(15,23,42,0.06)'
    ],
    BOX: [
      '0 1px 1px rgba(0,0,0,0.02)',
      '0 4px 12px rgba(0,0,0,0.06)'
    ],
  },

  // حالات المشاريع
  PROJECT_STATUS: {
    'In Progress': '#BDEED3',
    'Late': '#FBE2AA',
    'Treating': '#D9D2FE',
    'Stopped': '#F1B5B9',
    'To Do': '#A4E2F6',
  },

  // حالات المهام
  TASK_STATUS: {
    'Done': '#BDEED3',
    'In Progress': '#A4E2F6',
    'Late': '#FBE2AA',
    'Treating': '#D9D2FE',
    'Stopped': '#F1B5B9',
    'To Do': '#DFECF2',
  },

  // أولويات المهام
  TASK_PRIORITY: {
    'urgent-important': '#F1B5B9',
    'urgent-not-important': '#A4E2F6',
    'not-urgent-important': '#FBE2AA',
    'not-urgent-not-important': '#D9D2FE',
  },

  // النوافذ المنبثقة (Modals)
  MODAL: {
    OVERLAY: 'rgba(0,0,0,0.2)',
    BACKGROUND: 'rgba(255,255,255,0.4)',
    BORDER: 'rgba(255,255,255,0.2)',
    BACKDROP_BLUR: '20px',
    SHADOW: '0 25px 50px -12px rgba(0,0,0,0.25)',
    RADIUS: '24px',
    Z_INDEX: 10000,
  },

  // الطباعة
  TYPOGRAPHY: {
    FONT_FAMILY: 'IBM Plex Sans Arabic, sans-serif',
    SIZES: {
      DISPLAY_L: '40px',
      DISPLAY_M: '32px',
      TITLE: '20px',
      SUBTITLE: '16px',
      BODY: '14px',
      LABEL: '12px',
    },
    WEIGHTS: {
      REGULAR: 400,
      MEDIUM: 500,
      SEMIBOLD: 600,
      BOLD: 700,
    },
  },
} as const;

// دوال مساعدة لبناء الفئات CSS
export const buildSurfaceClasses = (type: 'app' | 'panel' | 'card' | 'box' | 'project-card' | 'task-card') => {
  const baseClasses = 'border border-[var(--sb-border)]';
  
  switch (type) {
    case 'app':
      return 'bg-[var(--sb-app-bg)] min-h-screen';
    case 'panel':
      return `bg-[var(--sb-panel-bg)] ${baseClasses} shadow-[var(--sb-shadow-strong)] rounded-[18px]`;
    case 'card':
      return `bg-[var(--sb-card-bg)] ${baseClasses} shadow-[var(--sb-shadow-soft)] rounded-t-[24px] rounded-b-[6px]`;
    case 'box':
      return `bg-[var(--sb-box-bg)] ${baseClasses} shadow-[var(--sb-shadow-soft)] rounded-lg`;
    case 'project-card':
      return `bg-[var(--sb-project-card-bg)] ${baseClasses} shadow-[var(--sb-shadow-soft)] rounded-t-[24px] rounded-b-[6px]`;
    case 'task-card':
      return `bg-[var(--sb-task-card-bg)] ${baseClasses} shadow-[var(--sb-shadow-soft)] rounded-t-[24px] rounded-b-[6px]`;
    default:
      return baseClasses;
  }
};

export const buildCapsuleClasses = (
  variant: 'in-card' | 'in-box-outline' | 'in-box-solid' | 'in-box-brand',
  brandColor?: 'mint' | 'sky' | 'lilac' | 'rose' | 'amber'
) => {
  const baseClasses = 'rounded-full px-3 py-1 text-sm font-medium inline-flex items-center justify-center';
  
  switch (variant) {
    case 'in-card':
      return `${baseClasses} bg-white text-black border border-[#DADCE0]`;
    case 'in-box-outline':
      return `${baseClasses} bg-transparent text-black border border-black`;
    case 'in-box-solid':
      return `${baseClasses} bg-black text-white`;
    case 'in-box-brand':
      const brandBg = brandColor ? SOABRA_TOKENS.COLORS.BRAND[brandColor.toUpperCase() as keyof typeof SOABRA_TOKENS.COLORS.BRAND] : SOABRA_TOKENS.COLORS.BRAND.MINT;
      return `${baseClasses} text-black` + ` bg-[${brandBg}]`;
    default:
      return baseClasses;
  }
};

export const buildModalClasses = () => ({
  overlay: 'fixed inset-0 bg-[var(--sb-modal-scrim)] z-[9998]',
  surface: 'backdrop-blur-[20px] bg-[rgba(255,255,255,0.4)] border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[24px] z-[9999]',
  closeButton: 'w-8 h-8 rounded-full bg-transparent border border-black text-black hover:bg-black/5 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none',
});

export const buildIconClasses = (size: 24 | 28 | 32 = 24) => 
  `w-${size === 24 ? '6' : size === 28 ? '7' : '8'} h-${size === 24 ? '6' : size === 28 ? '7' : '8'} rounded-full border border-black bg-transparent p-1 text-black`;

export const buildTypographyClasses = (variant: 'title' | 'subtitle' | 'body' | 'label') => {
  const baseClasses = 'font-arabic text-black';
  
  switch (variant) {
    case 'title':
      return `${baseClasses} text-xl font-bold leading-[1.3]`;
    case 'subtitle':
      return `${baseClasses} text-base font-semibold`;
    case 'body':
      return `${baseClasses} text-sm font-normal`;
    case 'label':
      return `${baseClasses} text-xs font-medium`;
    default:
      return baseClasses;
  }
};
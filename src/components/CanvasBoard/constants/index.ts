import { 
  MousePointer, 
  Type, 
  Square, 
  StickyNote, 
  MessageCircle, 
  Upload, 
  Calendar, 
  GitBranch, 
  Lightbulb, 
  Target,
  Palette,
  Move,
  ZoomIn,
  Hand,
  Layers,
  Users,
  Bot,
  Wand2,
  Layout,
  Brain,
  Sparkles,
  FileImage,
  Link,
  Grid3x3,
  CircleDot
} from 'lucide-react';

import { Tool, PlanningMode, CanvasTheme } from '../types/index';

export const CANVAS_TOOLS: Tool[] = [
  // Basic Tools
  {
    id: 'select',
    label: 'تحديد',
    icon: MousePointer,
    category: 'basic',
    shortcut: 'V',
    description: 'أداة التحديد والتحرك'
  },
  {
    id: 'hand',
    label: 'يد',
    icon: Hand,
    category: 'navigation',
    shortcut: 'H',
    description: 'تحريك الكانفاس'
  },
  {
    id: 'zoom',
    label: 'تكبير',
    icon: ZoomIn,
    category: 'navigation',
    shortcut: 'Z',
    description: 'أداة التكبير والتصغير'
  },

  // Content Tools
  {
    id: 'text',
    label: 'نص',
    icon: Type,
    category: 'content',
    shortcut: 'T',
    description: 'إضافة نصوص'
  },
  {
    id: 'shape',
    label: 'أشكال',
    icon: Square,
    category: 'content',
    shortcut: 'S',
    description: 'رسم الأشكال الهندسية',
    subTools: [
      { id: 'rectangle', label: 'مستطيل', icon: Square, category: 'content' },
      { id: 'circle', label: 'دائرة', icon: CircleDot, category: 'content' },
      { id: 'triangle', label: 'مثلث', icon: Target, category: 'content' }
    ]
  },
  {
    id: 'sticky',
    label: 'ملاحظة لاصقة',
    icon: StickyNote,
    category: 'content',
    shortcut: 'N',
    description: 'إضافة ملاحظات لاصقة'
  },
  {
    id: 'comment',
    label: 'تعليق',
    icon: MessageCircle,
    category: 'collaboration',
    shortcut: 'C',
    description: 'إضافة تعليقات'
  },

  // File Tools
  {
    id: 'upload',
    label: 'رفع ملف',
    icon: Upload,
    category: 'file',
    description: 'رفع الملفات والصور'
  },
  {
    id: 'image',
    label: 'صورة',
    icon: FileImage,
    category: 'file',
    description: 'إدراج الصور'
  },

  // Smart Tools
  {
    id: 'smart-pen',
    label: 'قلم ذكي',
    icon: Wand2,
    category: 'smart',
    description: 'رسم ذكي مع التعرف على الأشكال'
  },
  {
    id: 'smart-element',
    label: 'عنصر ذكي',
    icon: Brain,
    category: 'smart',
    description: 'إنشاء عناصر ذكية'
  },
  {
    id: 'ai-assistant',
    label: 'مساعد ذكي',
    icon: Bot,
    category: 'ai',
    description: 'مساعد الذكاء الاصطناعي'
  },

  // Project Tools
  {
    id: 'timeline',
    label: 'خط زمني',
    icon: Calendar,
    category: 'project',
    description: 'إنشاء الجداول الزمنية'
  },
  {
    id: 'mindmap',
    label: 'خريطة ذهنية',
    icon: GitBranch,
    category: 'project',
    description: 'إنشاء الخرائط الذهنية'
  },
  {
    id: 'brainstorm',
    label: 'عصف ذهني',
    icon: Lightbulb,
    category: 'project',
    description: 'جلسات العصف الذهني'
  },
  {
    id: 'connector',
    label: 'رابط',
    icon: Link,
    category: 'content',
    description: 'ربط العناصر'
  }
];

export const PLANNING_MODES: PlanningMode[] = [
  {
    id: 'brainstorm',
    label: 'عصف ذهني',
    icon: Lightbulb
  },
  {
    id: 'organize',
    label: 'تنظيم الأفكار',
    icon: Layout
  },
  {
    id: 'prioritize',
    label: 'ترتيب الأولويات',
    icon: Target
  },
  {
    id: 'collaborate',
    label: 'تعاون',
    icon: Users
  },
  {
    id: 'present',
    label: 'عرض',
    icon: Sparkles
  }
];

export const DEFAULT_COLORS = [
  'bg-yellow-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-pink-200',
  'bg-purple-200',
  'bg-orange-200',
  'bg-red-200',
  'bg-indigo-200',
  'bg-gray-200'
];

export const CANVAS_THEMES: CanvasTheme[] = [
  {
    id: 'default',
    name: 'الافتراضي',
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      accent: 'hsl(var(--accent))',
      background: 'hsl(var(--background))',
      surface: 'hsl(var(--card))',
      text: 'hsl(var(--foreground))'
    },
    typography: {
      fontFamily: 'var(--font-family)',
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem'
      }
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24
    }
  },
  {
    id: 'dark',
    name: 'داكن',
    colors: {
      primary: 'hsl(210 40% 98%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 84%)',
      background: 'hsl(222.2 84% 4.9%)',
      surface: 'hsl(222.2 84% 4.9%)',
      text: 'hsl(210 40% 98%)'
    },
    typography: {
      fontFamily: 'var(--font-family)',
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem'
      }
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24
    }
  },
  {
    id: 'creative',
    name: 'إبداعي',
    colors: {
      primary: 'hsl(280 100% 70%)',
      secondary: 'hsl(340 100% 75%)',
      accent: 'hsl(60 100% 80%)',
      background: 'hsl(320 100% 98%)',
      surface: 'hsl(320 50% 96%)',
      text: 'hsl(280 50% 20%)'
    },
    typography: {
      fontFamily: 'var(--font-family)',
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem'
      }
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24
    }
  }
];

export const PANEL_POSITIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom'
} as const;

export const ELEMENT_TYPES = {
  TEXT: 'text',
  SHAPE: 'shape',
  STICKY: 'sticky',
  COMMENT: 'comment',
  UPLOAD: 'upload',
  TIMELINE: 'timeline',
  MINDMAP: 'mindmap',
  SMART: 'smart',
  BRAINSTORM: 'brainstorm',
  ROOT: 'root',
  MOODBOARD: 'moodboard',
  LINE: 'line',
  IMAGE: 'image',
  FILE: 'file',
  CONNECTOR: 'connector'
} as const;

export const COLLABORATION_ROLES = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ADMIN: 'admin'
} as const;

export const CANVAS_SHORTCUTS = {
  SELECT: 'v',
  HAND: 'h',
  ZOOM: 'z',
  TEXT: 't',
  SHAPE: 's',
  STICKY: 'n',
  COMMENT: 'c',
  UNDO: 'ctrl+z',
  REDO: 'ctrl+y',
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  DELETE: 'delete',
  DUPLICATE: 'ctrl+d',
  GROUP: 'ctrl+g',
  UNGROUP: 'ctrl+shift+g'
} as const;

export const GRID_SIZES = [10, 20, 25, 50] as const;

export const ZOOM_LEVELS = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4] as const;
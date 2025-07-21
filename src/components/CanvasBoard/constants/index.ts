
import { 
  MousePointer, 
  Pen, 
  Type, 
  Square, 
  Sparkles, 
  ZoomIn, 
  Move, 
  Upload, 
  MessageSquare 
} from 'lucide-react';

export const MAIN_TOOLBAR_TOOLS = [
  {
    id: 'select',
    icon: MousePointer,
    label: 'تحديد',
    shortcut: 'V',
    description: 'تحديد وتحريك العناصر'
  },
  {
    id: 'smart-pen',
    icon: Pen,
    label: 'القلم الذكي',
    shortcut: 'P',
    description: 'الرسم بالقلم الذكي'
  },
  {
    id: 'text',
    icon: Type,
    label: 'نص',
    shortcut: 'T',
    description: 'إضافة نص'
  },
  {
    id: 'shape',
    icon: Square,
    label: 'شكل',
    shortcut: 'S',
    description: 'رسم الأشكال'
  },
  {
    id: 'smart-element',
    icon: Sparkles,
    label: 'عنصر ذكي',
    shortcut: 'E',
    description: 'إضافة عناصر ذكية'
  },
  {
    id: 'zoom',
    icon: ZoomIn,
    label: 'تكبير',
    shortcut: 'Z',
    description: 'تكبير وتصغير'
  },
  {
    id: 'hand',
    icon: Move,
    label: 'يد',
    shortcut: 'H',
    description: 'تحريك اللوحة'
  },
  {
    id: 'upload',
    icon: Upload,
    label: 'رفع',
    shortcut: 'U',
    description: 'رفع ملفات'
  },
  {
    id: 'comment',
    icon: MessageSquare,
    label: 'تعليق',
    shortcut: 'C',
    description: 'إضافة تعليقات'
  }
];

export const CANVAS_SHORTCUTS = {
  'KeyV': 'select',
  'KeyP': 'smart-pen',
  'KeyT': 'text',
  'KeyS': 'shape',
  'KeyE': 'smart-element',
  'KeyZ': 'zoom',
  'KeyH': 'hand',
  'KeyU': 'upload',
  'KeyC': 'comment'
};

export const CANVAS_COLORS = {
  primary: '#96d8d0',
  secondary: '#a4e2f6',
  accent: '#bdeed3',
  warning: '#fbe2aa',
  danger: '#f1b5b9',
  purple: '#e1d4f1',
  background: '#f2f9fb',
  border: '#d1e1ea',
  text: '#000000'
};

export const ELEMENT_TYPES = {
  TEXT: 'text',
  SHAPE: 'shape',
  IMAGE: 'image',
  LINE: 'line',
  ARROW: 'arrow',
  STICKY_NOTE: 'sticky-note',
  COMMENT: 'comment',
  SMART_ELEMENT: 'smart-element'
};

export const LAYER_DEFAULTS = {
  DEFAULT_LAYER: {
    id: 'default-layer',
    name: 'الطبقة الافتراضية',
    visible: true,
    locked: false,
    elements: []
  }
};

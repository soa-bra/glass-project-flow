
import { 
  MousePointer, Pen, ZoomIn, Hand, File, Upload, 
  MessageSquare, Type, Shapes, Sparkles, Clock, GitBranch, Layout,
  Grid3X3, RotateCcw, RotateCw, Save, FolderOpen, Copy, Layers,
  Lightbulb, Target, Rocket
} from 'lucide-react';
import { Tool } from './types';

// أدوات شريط الأدوات الرئيسي (أسفل) - بالترتيب المطلوب
export const MAIN_TOOLBAR_TOOLS: Tool[] = [
  { id: 'select', label: 'تحديد', icon: MousePointer, category: 'basic', shortcut: 'V' },
  { id: 'smart-pen', label: 'القلم الذكي', icon: Pen, category: 'basic', shortcut: 'P' },
  { id: 'zoom', label: 'زوم', icon: ZoomIn, category: 'basic', shortcut: 'Z' },
  { id: 'hand', label: 'كف', icon: Hand, category: 'navigation', shortcut: 'H' },
  { id: 'upload', label: 'رفع مرفق', icon: Upload, category: 'file', shortcut: 'U' },
  { id: 'comment', label: 'تعليق', icon: MessageSquare, category: 'collaboration', shortcut: 'C' },
  { id: 'text', label: 'نص', icon: Type, category: 'content', shortcut: 'T' },
  { id: 'shape', label: 'شكل', icon: Shapes, category: 'content', shortcut: 'R' },
  { id: 'smart-element', label: 'عنصر ذكي', icon: Sparkles, category: 'smart', shortcut: 'S' }
];

// أدوات شريط الأدوات العلوي
export const TOP_TOOLBAR_TOOLS = {
  history: {
    undo: { id: 'undo', label: 'تراجع', icon: RotateCcw },
    redo: { id: 'redo', label: 'إعادة', icon: RotateCw },
    history: { id: 'history', label: 'سجل العمليات', icon: Copy }
  },
  file: {
    new: { id: 'new', label: 'جديد', icon: File },
    save: { id: 'save', label: 'حفظ/تصدير', icon: Save },
    copy: { id: 'copy', label: 'إنشاء نسخة', icon: Copy },
    open: { id: 'open', label: 'فتح', icon: FolderOpen }
  },
  grid: {
    toggle: { id: 'grid-toggle', label: 'إظهار/إخفاء الشبكة', icon: Grid3X3 },
    snap: { id: 'grid-snap', label: 'المحاذاة التلقائية', icon: Target },
    size: { id: 'grid-size', label: 'حجم الشبكة', icon: Grid3X3 },
    shape: { id: 'grid-shape', label: 'شكل الشبكة', icon: Shapes }
  },
  smartProject: {
    generate: { id: 'smart-project-gen', label: 'توليد المشاريع الذكية', icon: Rocket }
  }
};

// العناصر الذكية
export const SMART_ELEMENTS = [
  { id: 'root', label: 'الجذر', icon: GitBranch, description: 'أداة للربط بين العناصر' },
  { id: 'brainstorm', label: 'محرك العصف الذهني', icon: Lightbulb, description: 'عمود دردشة مخصص للعصف الذهني' },
  { id: 'timeline', label: 'الخط الزمني', icon: Clock, description: 'إضافة خط زمني أو مخططات جانت' },
  { id: 'mindmap', label: 'الخرائط الذهنية', icon: Target, description: 'رسم الخرائط الذهنية يدوياً أو بالذكاء الاصطناعي' },
  { id: 'moodboard', label: 'مودبورد ذكية', icon: Layout, description: 'جمع عناصر وتوليد الروابط بينها' }
];

// خيارات القلم الذكي
export const SMART_PEN_MODES = [
  { id: 'smart-draw', label: 'الرسم الذكي', description: 'تحويل الأشكال إلى أشكال هندسية' },
  { id: 'root-connector', label: 'الجذر', description: 'ربط العناصر ببعضها' },
  { id: 'auto-group', label: 'التجميع التلقائي', description: 'تجميع العناصر المحاطة' },
  { id: 'eraser', label: 'المسح', description: 'حذف العناصر بالرسم فوقها' }
];

// خيارات الزوم
export const ZOOM_OPTIONS = [
  { value: '50', label: '50%' },
  { value: '70', label: '70%' },
  { value: '90', label: '90%' },
  { value: '100', label: '100%' },
  { value: '120', label: '120%' },
  { value: '140', label: '140%' },
  { value: '150', label: '150%' },
  { value: 'fit', label: 'ملاءمة' }
];

// أشكال الشبكة
export const GRID_SHAPES = [
  { id: 'dots', label: 'نقط' },
  { id: 'squares', label: 'مربعات' },
  { id: 'diamonds', label: 'معينات' },
  { id: 'hexagon', label: 'خلية نحل' }
];

// أحجام الشبكة
export const GRID_SIZES = [
  { value: 10, label: '10px' },
  { value: 20, label: '20px' },
  { value: 30, label: '30px' },
  { value: 40, label: '40px' },
  { value: 50, label: '50px' }
];

// للتوافق مع الملفات الموجودة
export const CANVAS_TOOLS = MAIN_TOOLBAR_TOOLS;

export const ELEMENT_COLORS = [
  'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
  'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-orange-200'
];

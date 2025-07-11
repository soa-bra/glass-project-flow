import { 
  Undo2, 
  Redo2, 
  History, 
  FileText, 
  Save, 
  Copy, 
  FolderOpen,
  Grid3x3,
  Magnet,
  Sparkles
} from 'lucide-react';

export const TOP_TOOLBAR_TOOLS = {
  history: {
    undo: { icon: Undo2, label: 'تراجع' },
    redo: { icon: Redo2, label: 'إعادة' },
    history: { icon: History, label: 'سجل العمليات' }
  },
  file: {
    new: { icon: FileText, label: 'جديد' },
    save: { icon: Save, label: 'حفظ' },
    copy: { icon: Copy, label: 'نسخ' },
    open: { icon: FolderOpen, label: 'فتح' }
  },
  grid: {
    toggle: { icon: Grid3x3, label: 'شبكة' },
    snap: { icon: Magnet, label: 'محاذاة' }
  },
  smartProject: {
    generate: { icon: Sparkles, label: 'مشروع ذكي' }
  }
};

export const GRID_SHAPES = [
  { id: 'dots', label: 'نقاط' },
  { id: 'lines', label: 'خطوط' },
  { id: 'squares', label: 'مربعات' }
];

export const GRID_SIZES = [
  { value: 10, label: 'صغير (10px)' },
  { value: 20, label: 'متوسط (20px)' },
  { value: 25, label: 'كبير (25px)' },
  { value: 50, label: 'كبير جداً (50px)' }
];

export const MAIN_TOOLBAR_TOOLS = [
  'select',
  'smart-pen', 
  'zoom',
  'hand',
  'upload',
  'comment',
  'text',
  'shape',
  'smart-element'
];
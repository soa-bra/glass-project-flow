
import { 
  MousePointer, 
  Edit3, 
  ZoomIn, 
  Hand, 
  Upload, 
  MessageCircle, 
  Type, 
  Square, 
  Sparkles,
  Undo,
  Redo,
  History,
  File,
  Save,
  Copy,
  FolderOpen,
  Grid,
  Magnet,
  Zap
} from 'lucide-react';

export const MAIN_TOOLBAR_TOOLS = [
  { id: 'select', icon: MousePointer, label: 'تحديد' },
  { id: 'smart-pen', icon: Edit3, label: 'القلم الذكي' },
  { id: 'zoom', icon: ZoomIn, label: 'تكبير' },
  { id: 'hand', icon: Hand, label: 'يد' },
  { id: 'upload', icon: Upload, label: 'رفع' },
  { id: 'comment', icon: MessageCircle, label: 'تعليق' },
  { id: 'text', icon: Type, label: 'نص' },
  { id: 'shape', icon: Square, label: 'شكل' },
  { id: 'smart-element', icon: Sparkles, label: 'عنصر ذكي' }
];

export const TOP_TOOLBAR_TOOLS = {
  history: {
    undo: { icon: Undo, label: 'تراجع' },
    redo: { icon: Redo, label: 'إعادة' },
    history: { icon: History, label: 'السجل' }
  },
  file: {
    new: { icon: File, label: 'جديد' },
    save: { icon: Save, label: 'حفظ' },
    copy: { icon: Copy, label: 'نسخ' },
    open: { icon: FolderOpen, label: 'فتح' }
  },
  grid: {
    toggle: { icon: Grid, label: 'شبكة' },
    snap: { icon: Magnet, label: 'محاذاة' }
  },
  smartProject: {
    generate: { icon: Zap, label: 'مشروع ذكي' }
  }
};

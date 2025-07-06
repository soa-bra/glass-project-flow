import { 
  MousePointer, Copy, ZoomIn, Hand, File, Target, Upload, 
  MessageSquare, Type, Shapes, Lightbulb, Clock, GitBranch, Layout
} from 'lucide-react';
import { Tool } from './types';

export const CANVAS_TOOLS: Tool[] = [
  { id: 'select', label: 'تحديد', icon: MousePointer, category: 'basic' },
  { id: 'repeat', label: 'تكرار', icon: Copy, category: 'basic' },
  { id: 'zoom', label: 'زوم', icon: ZoomIn, category: 'basic' },
  { id: 'hand', label: 'كف', icon: Hand, category: 'basic' },
  { id: 'file', label: 'ملف', icon: File, category: 'file' },
  { id: 'project-convert', label: 'تحويل لمشروع', icon: Target, category: 'smart' },
  { id: 'upload', label: 'رفع ملف', icon: Upload, category: 'file' },
  { id: 'comment', label: 'تعليق', icon: MessageSquare, category: 'basic' },
  { id: 'text', label: 'نص', icon: Type, category: 'basic' },
  { id: 'shape', label: 'شكل', icon: Shapes, category: 'basic' },
  { id: 'smart-element', label: 'عنصر ذكي', icon: Lightbulb, category: 'smart' }
];

export const SMART_ELEMENTS = [
  { id: 'brainstorm', label: 'محرك العصف الذهني', icon: Lightbulb },
  { id: 'root', label: 'الجذر', icon: GitBranch },
  { id: 'timeline', label: 'الخط الزمني', icon: Clock },
  { id: 'mindmap', label: 'الخرائط الذهنية', icon: Target },
  { id: 'moodboard', label: 'مودبورد ذكية', icon: Layout }
];

export const ZOOM_OPTIONS = [
  { value: '50', label: '50%' },
  { value: '75', label: '75%' },
  { value: '100', label: '100%' },
  { value: '125', label: '125%' },
  { value: '150', label: '150%' },
  { value: 'fit', label: 'ملاءمة' }
];

export const ELEMENT_COLORS = [
  'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200'
];
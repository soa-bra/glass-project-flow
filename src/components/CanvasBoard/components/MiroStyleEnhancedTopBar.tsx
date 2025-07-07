import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Undo2, 
  Redo2, 
  RotateCcw,
  FileText,
  Save,
  Copy,
  FolderOpen,
  Grid3X3,
  AlignVerticalJustifyStart,
  Settings,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface MiroStyleEnhancedTopBarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onFileAction: (action: string) => void;
  onGridToggle: () => void;
  onSmartProjectGenerator: () => void;
  showGrid: boolean;
  snapEnabled: boolean;
  onSnapToggle: () => void;
}

export const MiroStyleEnhancedTopBar: React.FC<MiroStyleEnhancedTopBarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onFileAction,
  onGridToggle,
  onSmartProjectGenerator,
  showGrid,
  snapEnabled,
  onSnapToggle
}) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex items-center space-x-2 rtl:space-x-reverse px-4 py-2"
           style={{ width: '40vw' }}>
        
        {/* History Controls */}
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!canUndo}
            onClick={onUndo}
            className="disabled:opacity-50 hover:bg-blue-50"
            title="تراجع"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50" title="سجل العمليات">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem disabled className="text-xs text-gray-500">
                آخر العمليات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">
                إضافة عنصر نص
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                تحريك العنصر
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                تغيير حجم الشكل
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!canRedo}
            onClick={onRedo}
            className="disabled:opacity-50 hover:bg-blue-50"
            title="إعادة"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* File Operations */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50" title="ملف">
                <FileText className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onFileAction('new')}>
                <FileText className="w-4 h-4 ml-2" />
                جديد
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFileAction('save')}>
                <Save className="w-4 h-4 ml-2" />
                حفظ/تصدير
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFileAction('copy')}>
                <Copy className="w-4 h-4 ml-2" />
                إنشاء نسخة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFileAction('open')}>
                <FolderOpen className="w-4 h-4 ml-2" />
                فتح
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Grid Controls */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-blue-50 ${showGrid ? 'bg-blue-100 text-blue-600' : ''}`}
                title="شبكة"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={onGridToggle}>
                <Grid3X3 className="w-4 h-4 ml-2" />
                {showGrid ? 'إخفاء الشبكة' : 'إظهار الشبكة'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSnapToggle}>
                <AlignVerticalJustifyStart className="w-4 h-4 ml-2" />
                {snapEnabled ? 'تعطيل المحاذاة' : 'تفعيل المحاذاة'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-xs text-gray-500">
                حجم الشبكة (بكسل)
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">20px</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">24px ✓</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">30px</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-xs text-gray-500">
                شكل الشبكة
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">نقط ✓</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">مربعات</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">معينات</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">خلية نحل</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Smart Project Generator */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSmartProjectGenerator}
            className="hover:bg-purple-50 text-purple-600"
            title="مولد المشاريع الذكية"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TOP_TOOLBAR_TOOLS, GRID_SHAPES, GRID_SIZES } from '../constants';
import { ChevronDown } from 'lucide-react';

interface NewTopToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onNew: () => void;
  onOpen: () => void;
  onCopy: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  snapEnabled: boolean;
  onSnapToggle: () => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  gridShape: string;
  onGridShapeChange: (shape: string) => void;
  onSmartProjectGenerate: () => void;
}

const NewTopToolbar: React.FC<NewTopToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onNew,
  onOpen,
  onCopy,
  showGrid,
  onGridToggle,
  snapEnabled,
  onSnapToggle,
  gridSize,
  onGridSizeChange,
  gridShape,
  onGridShapeChange,
  onSmartProjectGenerate
}) => {
  const [recentActions, setRecentActions] = useState<string[]>([
    'إضافة نص',
    'تحريك عنصر',
    'إنشاء شكل',
    'تغيير اللون'
  ]);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/95 backdrop-blur-lg shadow-sm border border-gray-200/50 rounded-[20px]">
        <CardContent className="flex items-center justify-center gap-4 px-4 py-2">
          {/* أدوات سجل العمليات */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-10 w-10 rounded-xl"
              title="تراجع"
            >
              <TOP_TOOLBAR_TOOLS.history.undo.icon className="w-4 h-4" />
            </Button>
              
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-10 w-10 rounded-xl"
              title="إعادة"
            >
              <TOP_TOOLBAR_TOOLS.history.redo.icon className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-xl"
                  title="سجل العمليات"
                >
                  <TOP_TOOLBAR_TOOLS.history.history.icon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-arabic">
                {recentActions.map((action, index) => (
                  <DropdownMenuItem key={index}>
                    {action}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator orientation="vertical" className="h-6 bg-gray-300" />

          {/* أدوات الملف */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 rounded-xl gap-1"
                  title="ملف"
                >
                  <TOP_TOOLBAR_TOOLS.file.new.icon className="w-4 h-4" />
                  <span className="text-xs font-arabic">ملف</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-arabic">
                <DropdownMenuItem onClick={onNew}>
                  <TOP_TOOLBAR_TOOLS.file.new.icon className="w-4 h-4 mr-2" />
                  جديد
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSave}>
                  <TOP_TOOLBAR_TOOLS.file.save.icon className="w-4 h-4 mr-2" />
                  حفظ/تصدير
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCopy}>
                  <TOP_TOOLBAR_TOOLS.file.copy.icon className="w-4 h-4 mr-2" />
                  إنشاء نسخة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpen}>
                  <TOP_TOOLBAR_TOOLS.file.open.icon className="w-4 h-4 mr-2" />
                  فتح
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* أدوات الشبكة */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 rounded-xl gap-1"
                  title="شبكة"
                >
                  <TOP_TOOLBAR_TOOLS.grid.toggle.icon className="w-4 h-4" />
                  <span className="text-xs font-arabic">شبكة</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-arabic">
                <DropdownMenuItem onClick={onGridToggle}>
                  <TOP_TOOLBAR_TOOLS.grid.toggle.icon className="w-4 h-4 mr-2" />
                  {showGrid ? 'إخفاء الشبكة' : 'إظهار الشبكة'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSnapToggle}>
                  <TOP_TOOLBAR_TOOLS.grid.snap.icon className="w-4 h-4 mr-2" />
                  {snapEnabled ? 'تعطيل المحاذاة' : 'تفعيل المحاذاة'}
                </DropdownMenuItem>
                
                {/* حجم الشبكة */}
                <div className="px-2 py-1 text-xs text-gray-500">حجم الشبكة:</div>
                {GRID_SIZES.map((size) => (
                  <DropdownMenuItem
                    key={size.value}
                    onClick={() => onGridSizeChange(size.value)}
                    className={gridSize === size.value ? 'bg-blue-50' : ''}
                  >
                    {size.label}
                  </DropdownMenuItem>
                ))}
                
                {/* شكل الشبكة */}
                <div className="px-2 py-1 text-xs text-gray-500">شكل الشبكة:</div>
                {GRID_SHAPES.map((shape) => (
                  <DropdownMenuItem
                    key={shape.id}
                    onClick={() => onGridShapeChange(shape.id)}
                    className={gridShape === shape.id ? 'bg-blue-50' : ''}
                  >
                    {shape.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator orientation="vertical" className="h-6 bg-gray-300" />

          {/* توليد المشاريع الذكية */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSmartProjectGenerate}
            className="h-10 px-3 rounded-xl gap-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
            title="توليد المشاريع الذكية"
          >
            <TOP_TOOLBAR_TOOLS.smartProject.generate.icon className="w-4 h-4" />
            <span className="text-xs font-arabic">مشروع ذكي</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTopToolbar;
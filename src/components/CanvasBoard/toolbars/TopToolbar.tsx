/**
 * @fileoverview Top Toolbar with history, file operations, and smart project generation
 * @author AI Assistant
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Undo, 
  Redo, 
  History, 
  FileText, 
  Save, 
  FolderOpen, 
  Copy,
  Grid,
  Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onOpen: () => void;
  onNew: () => void;
  onDuplicate: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onGenerateProject: () => void;
  canUndo: boolean;
  canRedo: boolean;
  gridVisible: boolean;
  snapEnabled: boolean;
}

/**
 * Top Toolbar Component
 * Provides main canvas operations and smart features
 */
const TopToolbar: React.FC<TopToolbarProps> = ({
  onUndo,
  onRedo,
  onSave,
  onOpen,
  onNew,
  onDuplicate,
  onToggleGrid,
  onToggleSnap,
  onGenerateProject,
  canUndo,
  canRedo,
  gridVisible,
  snapEnabled
}) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2 p-3 bg-white border-b border-gray-200 glass-section">
      {/* History Section */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="تراجع (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              title="آخر 10 عمليات (Ctrl+Alt+H)"
            >
              <History className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>إضافة عنصر جديد</DropdownMenuItem>
            <DropdownMenuItem>تغيير اللون</DropdownMenuItem>
            <DropdownMenuItem>نقل العنصر</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="إعادة (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* File Operations */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              ملف
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onNew}>
              جديد (Ctrl+N)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              حفظ/تصدير (Ctrl+S)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              إنشاء نسخة (Ctrl+D)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpen}>
              <FolderOpen className="w-4 h-4 mr-2" />
              فتح (Ctrl+O)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid Tools */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Grid className="w-4 h-4 mr-2" />
              الشبكة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onToggleGrid}>
              {gridVisible ? 'إخفاء الشبكة' : 'إظهار الشبكة'} (G)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleSnap}>
              {snapEnabled ? 'إلغاء المحاذاة' : 'تفعيل المحاذاة'} (Ctrl+G)
            </DropdownMenuItem>
            <DropdownMenuItem>حجم الشبكة: 16px</DropdownMenuItem>
            <DropdownMenuItem>شكل الشبكة: نقاط</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Smart Project Generation */}
      <div className="flex items-center gap-1 px-2">
        <Button
          variant="default"
          size="sm"
          onClick={onGenerateProject}
          title="تحويل إلى مشروع (Ctrl+P)"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Zap className="w-4 h-4 mr-2" />
          تحويل إلى مشروع
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;
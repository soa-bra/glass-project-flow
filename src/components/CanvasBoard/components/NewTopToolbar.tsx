
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  Undo, 
  Redo, 
  Save, 
  FileText, 
  FolderOpen, 
  Copy, 
  Grid, 
  Magnet, 
  Sparkles,
  Settings,
  Share2,
  Download
} from 'lucide-react';

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
  return (
    <TooltipProvider>
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="bg-white/95 backdrop-blur-lg shadow-sm border border-gray-200/50 rounded-[24px]">
          <CardContent className="flex items-center gap-2 p-3">
            {/* File Operations */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                    onClick={onNew}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">مشروع جديد</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                    onClick={onOpen}
                  >
                    <FolderOpen className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">فتح مشروع</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                    onClick={onSave}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">حفظ (Ctrl+S)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* History Operations */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                    onClick={onUndo}
                    disabled={!canUndo}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">تراجع (Ctrl+Z)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                    onClick={onRedo}
                    disabled={!canRedo}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">إعادة (Ctrl+Y)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                    onClick={onCopy}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">نسخ (Ctrl+C)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Grid and Snap Tools */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showGrid ? "default" : "ghost"}
                    size="sm"
                    className={`h-10 w-10 rounded-xl ${showGrid ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                    onClick={onGridToggle}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">إظهار الشبكة</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={snapEnabled ? "default" : "ghost"}
                    size="sm"
                    className={`h-10 w-10 rounded-xl ${snapEnabled ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                    onClick={onSnapToggle}
                  >
                    <Magnet className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">الالتصاق للشبكة</p>
                </TooltipContent>
              </Tooltip>
              
              {showGrid && (
                <Badge variant="outline" className="text-xs px-2 py-1 rounded-lg">
                  {gridSize}px
                </Badge>
              )}
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* AI Tools */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-3 rounded-xl hover:bg-gray-100 font-arabic"
                    onClick={onSmartProjectGenerate}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    مولد ذكي
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">تحويل اللوحة إلى مشروع ذكي</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Additional Actions */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">مشاركة</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">تصدير</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">الإعدادات</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default NewTopToolbar;

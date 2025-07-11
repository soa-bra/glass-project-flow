
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Undo2, 
  Redo2, 
  Save, 
  FileText, 
  FolderOpen, 
  Copy, 
  Grid3X3, 
  Magnet,
  Settings,
  Sparkles
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

export const NewTopToolbar: React.FC<NewTopToolbarProps> = ({
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
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-lg shadow-lg border z-40 animate-fade-in">
      <div className="flex items-center gap-1 p-2">
        {/* File Operations */}
        <Button variant="ghost" size="sm" onClick={onNew}>
          <FileText className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onOpen}>
          <FolderOpen className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onSave}>
          <Save className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* History */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onUndo}
          disabled={!canUndo}
          className="disabled:opacity-50"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRedo}
          disabled={!canRedo}
          className="disabled:opacity-50"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Edit */}
        <Button variant="ghost" size="sm" onClick={onCopy}>
          <Copy className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Grid & Snap */}
        <Button 
          variant={showGrid ? "default" : "ghost"} 
          size="sm" 
          onClick={onGridToggle}
          className="relative"
        >
          <Grid3X3 className="w-4 h-4" />
          {showGrid && (
            <Badge variant="secondary" className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs">
              {gridSize}
            </Badge>
          )}
        </Button>
        
        <Button 
          variant={snapEnabled ? "default" : "ghost"} 
          size="sm" 
          onClick={onSnapToggle}
        >
          <Magnet className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Smart Features */}
        <Button variant="ghost" size="sm" onClick={onSmartProjectGenerate}>
          <Sparkles className="w-4 h-4 text-blue-600" />
        </Button>
        
        {/* Settings */}
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default NewTopToolbar;

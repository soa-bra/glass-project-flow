import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Share2, 
  MessageCircle, 
  Undo, 
  Redo, 
  FileText, 
  Grid3X3, 
  Sparkles 
} from 'lucide-react';

export const TopToolbar: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        {/* Board Name */}
        <div className="px-3 py-1 text-sm font-medium text-foreground">
          لوحة التخطيط الجديدة
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* History Controls */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* File Operations */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Grid Controls */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Grid3X3 className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* AI Generator */}
        <Button variant="ghost" size="sm" className="flex items-center gap-2 h-8 px-3">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs">مولد ذكي</span>
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Comments */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MessageCircle className="h-4 w-4" />
        </Button>
        
        {/* Share */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
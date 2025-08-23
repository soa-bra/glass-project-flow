import React from 'react';
import { useToolsStore } from '../../../store/tools.store';
import { useCanvasStore } from '../../../store/canvas.store';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const Inspector: React.FC = () => {
  const { activeTool } = useToolsStore();
  const { selectedElementIds } = useCanvasStore();
  
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (isCollapsed) {
    return (
      <div className="w-8 bg-card border-l border-border flex items-start pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">الخصائص</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-3">
        {selectedElementIds.length > 0 ? (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">
              محدد: {selectedElementIds.length} عنصر
            </div>
            {/* Selection Panel Content */}
            <div className="space-y-2">
              <div className="text-sm font-medium">التحكم في العنصر</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  نسخ
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  حذف
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm mt-8">
            حدد عنصر لعرض خصائصه
          </div>
        )}
        
        {/* Tool-specific panels will be implemented in Phase 2 */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-xs text-muted-foreground">
            الأداة النشطة: {activeTool}
          </div>
        </div>
      </div>
    </div>
  );
};
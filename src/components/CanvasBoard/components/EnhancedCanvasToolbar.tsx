import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer, 
  Type, 
  StickyNote, 
  Square, 
  Circle,
  Workflow,
  MessageSquare,
  Copy,
  Zap,
  GitBranch,
  Terminal,
  Network,
  Activity,
  Settings,
  Save,
  Undo,
  Redo
} from 'lucide-react';

interface EnhancedCanvasToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
}

export const EnhancedCanvasToolbar: React.FC<EnhancedCanvasToolbarProps> = ({
  selectedTool,
  onToolSelect,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave
}) => {
  const toolGroups = [
    {
      name: 'التحديد والتفاعل',
      tools: [
        { id: 'select', icon: MousePointer, label: 'تحديد', color: 'hover:bg-blue-50' }
      ]
    },
    {
      name: 'الأدوات الأساسية',
      tools: [
        { id: 'text', icon: Type, label: 'نص', color: 'hover:bg-green-50' },
        { id: 'sticky', icon: StickyNote, label: 'ملاحظة', color: 'hover:bg-yellow-50' },
        { id: 'shape', icon: Square, label: 'شكل', color: 'hover:bg-purple-50' },
        { id: 'circle', icon: Circle, label: 'دائرة', color: 'hover:bg-pink-50' }
      ]
    },
    {
      name: 'أدوات متقدمة',
      tools: [
        { id: 'flowchart', icon: Workflow, label: 'مخطط انسيابي', color: 'hover:bg-indigo-50' },
        { id: 'annotation', icon: MessageSquare, label: 'تعليق', color: 'hover:bg-orange-50' },
        { id: 'repeat', icon: Copy, label: 'تكرار', color: 'hover:bg-teal-50' }
      ]
    },
    {
      name: 'الذكاء الاصطناعي',
      tools: [
        { id: 'brainstorm', icon: Zap, label: 'عصف ذهني', color: 'hover:bg-amber-50' },
        { id: 'smart-project', icon: GitBranch, label: 'مشروع ذكي', color: 'hover:bg-emerald-50' },
        { id: 'ai-console', icon: Terminal, label: 'وحدة التحكم', color: 'hover:bg-slate-50' },
        { id: 'mindmap', icon: Network, label: 'خريطة ذهنية', color: 'hover:bg-violet-50' },
        { id: 'smart-connections', icon: Network, label: 'اتصالات ذكية', color: 'hover:bg-cyan-50' }
      ]
    },
    {
      name: 'التعاون والمراقبة',
      tools: [
        { id: 'live-feed', icon: Activity, label: 'التحديثات المباشرة', color: 'hover:bg-red-50' }
      ]
    },
    {
      name: 'الإعدادات',
      tools: [
        { id: 'canvas-settings', icon: Settings, label: 'إعدادات الكانفس', color: 'hover:bg-gray-50' }
      ]
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* أزرار التحكم */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0"
            title="تراجع"
          >
            <Undo className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0"
            title="إعادة"
          >
            <Redo className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="h-8 w-8 p-0"
            title="حفظ"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* مجموعات الأدوات */}
        {toolGroups.map((group, groupIndex) => (
          <React.Fragment key={group.name}>
            <div className="flex items-center gap-1">
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;
                
                return (
                  <Button
                    key={tool.id}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onToolSelect(tool.id)}
                    className={`h-8 w-8 p-0 ${!isSelected ? tool.color : ''}`}
                    title={tool.label}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
            
            {groupIndex < toolGroups.length - 1 && (
              <Separator orientation="vertical" className="h-6" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* اسم الأداة المحددة */}
      {selectedTool && (
        <div className="mt-2 text-xs text-gray-600 font-arabic">
          الأداة الحالية: {toolGroups
            .flatMap(g => g.tools)
            .find(t => t.id === selectedTool)?.label || selectedTool}
        </div>
      )}
    </div>
  );
};
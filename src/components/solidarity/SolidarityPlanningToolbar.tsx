// Solidarity Planning Toolbar - Enhanced toolbar with solidarity-specific tools
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer2, 
  Hand, 
  Users, 
  Calendar,
  Target,
  DollarSign,
  MapPin,
  Clock,
  Heart,
  Lightbulb,
  Workflow,
  Save,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid
} from 'lucide-react';

interface SolidarityPlanningToolbarProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onSolidarityToolClick: (tool: string) => void;
  onSaveClick: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  zoom: number;
  showGrid?: boolean;
  onGridToggle?: () => void;
  'data-test-id'?: string;
}

const SolidarityPlanningToolbar: React.FC<SolidarityPlanningToolbarProps> = ({
  selectedTool,
  onToolChange,
  onSolidarityToolClick,
  onSaveClick,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  zoom,
  showGrid = true,
  onGridToggle,
  'data-test-id': testId
}) => {
  const basicTools = [
    { id: 'select', icon: MousePointer2, label: 'تحديد', shortcut: 'S' },
    { id: 'pan', icon: Hand, label: 'سحب', shortcut: 'H' },
  ];

  const solidarityTools = [
    { id: 'team-management', icon: Users, label: 'إدارة الفرق', color: 'text-blue-600' },
    { id: 'timeline', icon: Calendar, label: 'الجدولة الزمنية', color: 'text-green-600' },
    { id: 'goals', icon: Target, label: 'الأهداف', color: 'text-red-600' },
    { id: 'budget', icon: DollarSign, label: 'الميزانية', color: 'text-yellow-600' },
    { id: 'location', icon: MapPin, label: 'المواقع', color: 'text-purple-600' },
    { id: 'milestones', icon: Clock, label: 'المعالم', color: 'text-indigo-600' },
    { id: 'impact', icon: Heart, label: 'الأثر الاجتماعي', color: 'text-pink-600' },
    { id: 'innovation', icon: Lightbulb, label: 'الابتكار', color: 'text-orange-600' },
  ];

  return (
    <div 
      className="flex items-center gap-2 p-3 bg-background/95 backdrop-blur-sm border-b"
      data-test-id={testId}
    >
      {/* Basic Selection Tools */}
      <div className="flex items-center gap-1">
        {basicTools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="flex items-center gap-2"
            title={`${tool.label} (${tool.shortcut})`}
            data-test-id={`btn-tool-${tool.id}`}
          >
            <tool.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tool.label}</span>
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Solidarity Planning Tools */}
      <div className="flex items-center gap-1 flex-wrap">
        {solidarityTools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSolidarityToolClick(tool.id)}
            className="flex items-center gap-2"
            title={tool.label}
            data-test-id={`btn-solidarity-${tool.id}`}
          >
            <tool.icon className={`w-4 h-4 ${tool.color}`} />
            <span className="hidden lg:inline text-xs">{tool.label}</span>
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Project Workflow */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSolidarityToolClick('workflow')}
        className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
        title="سير العمل التضامني"
        data-test-id="btn-solidarity-workflow"
      >
        <Workflow className="w-4 h-4" />
        <span className="hidden sm:inline">سير العمل</span>
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Grid Toggle */}
      <Button
        variant={showGrid ? "default" : "outline"}
        size="sm"
        onClick={onGridToggle}
        className="flex items-center gap-2"
        title="إظهار/إخفاء الشبكة"
        data-test-id="btn-grid-toggle"
      >
        <Grid className="w-4 h-4" />
        <span className="hidden sm:inline">شبكة</span>
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          title="تصغير"
          data-test-id="btn-zoom-out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <Badge variant="outline" className="px-2 py-1 font-mono">
          {Math.round(zoom * 100)}%
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          title="تكبير"
          data-test-id="btn-zoom-in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomReset}
          title="إعادة تعيين التكبير"
          data-test-id="btn-zoom-reset"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="mr-auto flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveClick}
          className="flex items-center gap-2"
          title="حفظ المشروع التضامني (Ctrl+S)"
          data-test-id="btn-save"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">حفظ</span>
        </Button>
      </div>
    </div>
  );
};

export default SolidarityPlanningToolbar;
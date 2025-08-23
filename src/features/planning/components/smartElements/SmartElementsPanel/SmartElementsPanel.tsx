import React from 'react';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/BaseBadge';
import { SmartElementType, SmartElementTemplate } from '../../../types/smartElements.types';
import { useCanvasStore } from '../../../store/canvas.store';
import { nanoid } from 'nanoid';
import { 
  Brain, 
  LayoutGrid, 
  Vote, 
  Lightbulb, 
  Clock, 
  BarChart3, 
  Grid3x3, 
  GitBranch 
} from 'lucide-react';

const smartElementTemplates: SmartElementTemplate[] = [
  // Collaboration Elements
  {
    type: 'thinking_board',
    name: 'Thinking Board',
    nameAr: 'لوحة التفكير',
    icon: 'brain',
    category: 'collaboration',
    description: 'Collect and organize ideas around a central concept',
    descriptionAr: 'تجميع وتنظيم الأفكار حول مفهوم مركزي',
    defaultSize: { width: 400, height: 300 },
    defaultData: {
      concept: 'مفهوم جديد',
      backgroundColor: 'hsl(var(--card))',
      elements: [],
      tags: []
    }
  },
  {
    type: 'kanban_board',
    name: 'Kanban Board',
    nameAr: 'لوحة كانبان',
    icon: 'layout-grid',
    category: 'collaboration',
    description: 'Organize tasks in columns by status',
    descriptionAr: 'تنظيم المهام في أعمدة حسب الحالة',
    defaultSize: { width: 600, height: 400 },
    defaultData: {
      columns: [
        { id: 'todo', title: 'للعمل', items: [] },
        { id: 'progress', title: 'في التقدم', items: [] },
        { id: 'done', title: 'مكتمل', items: [] }
      ],
      allowDragDrop: true
    }
  },
  {
    type: 'voting',
    name: 'Voting System',
    nameAr: 'نظام التصويت',
    icon: 'vote',
    category: 'collaboration',
    description: 'Collect votes and make group decisions',
    descriptionAr: 'جمع الأصوات واتخاذ القرارات الجماعية',
    defaultSize: { width: 400, height: 350 },
    defaultData: {
      question: 'ما هو الخيار الأفضل؟',
      options: [
        { id: 'opt1', title: 'الخيار الأول', votes: 0, voters: [] },
        { id: 'opt2', title: 'الخيار الثاني', votes: 0, voters: [] }
      ],
      maxVotesPerUser: 1,
      isActive: false,
      allowMultiple: false
    }
  },
  {
    type: 'brainstorming',
    name: 'Brainstorming Session',
    nameAr: 'جلسة عصف ذهني',
    icon: 'lightbulb',
    category: 'collaboration',
    description: 'Generate and collect ideas collaboratively',
    descriptionAr: 'توليد وجمع الأفكار بشكل تعاوني',
    defaultSize: { width: 500, height: 400 },
    defaultData: {
      topic: 'موضوع العصف الذهني',
      mode: 'collaborative',
      ideas: [],
      isActive: false
    }
  },

  // Planning Elements
  {
    type: 'timeline',
    name: 'Timeline',
    nameAr: 'الخط الزمني',
    icon: 'clock',
    category: 'planning',
    description: 'Visualize events and milestones over time',
    descriptionAr: 'عرض الأحداث والمعالم عبر الزمن',
    defaultSize: { width: 500, height: 300 },
    defaultData: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      events: [],
      timeUnit: 'week',
      showGrid: true
    }
  },
  {
    type: 'gantt_chart',
    name: 'Gantt Chart',
    nameAr: 'مخطط جانت',
    icon: 'bar-chart-3',
    category: 'planning',
    description: 'Plan and track project tasks and dependencies',
    descriptionAr: 'تخطيط ومتابعة مهام المشروع والتبعيات',
    defaultSize: { width: 600, height: 400 },
    defaultData: {
      tasks: [],
      timeUnit: 'week',
      showCriticalPath: true,
      showDependencies: true
    }
  },
  {
    type: 'decision_matrix',
    name: 'Decision Matrix',
    nameAr: 'مصفوفة القرار',
    icon: 'grid-3x3',
    category: 'analysis',
    description: 'Evaluate options against multiple criteria',
    descriptionAr: 'تقييم الخيارات مقابل معايير متعددة',
    defaultSize: { width: 500, height: 350 },
    defaultData: {
      criteria: [],
      options: [],
      scoringMethod: 'numeric',
      autoCalculate: true
    }
  },
  {
    type: 'mind_map',
    name: 'Mind Map',
    nameAr: 'خريطة ذهنية',
    icon: 'git-branch',
    category: 'analysis',
    description: 'Create visual maps of connected ideas',
    descriptionAr: 'إنشاء خرائط بصرية للأفكار المترابطة',
    defaultSize: { width: 500, height: 400 },
    defaultData: {
      rootNode: {
        id: 'root',
        text: 'الفكرة الرئيسية',
        x: 250,
        y: 200,
        children: [],
        level: 0
      },
      layout: 'radial',
      autoLayout: true,
      showConnections: true
    }
  }
];

export const SmartElementsPanel: React.FC = () => {
  const { addElement } = useCanvasStore();

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      'brain': Brain,
      'layout-grid': LayoutGrid,
      'vote': Vote,
      'lightbulb': Lightbulb,
      'clock': Clock,
      'bar-chart-3': BarChart3,
      'grid-3x3': Grid3x3,
      'git-branch': GitBranch
    };
    return icons[iconName] || Brain;
  };

  const handleAddElement = (template: SmartElementTemplate) => {
    const element = {
      id: nanoid(),
      type: 'smart_element',
      position: { x: 100, y: 100 },
      size: template.defaultSize,
      style: {
        fill: 'hsl(var(--card))',
        stroke: 'hsl(var(--border))',
        strokeWidth: 1
      },
      data: {
        smartType: template.type,
        ...template.defaultData
      },
      createdBy: 'current_user',
      updatedAt: Date.now()
    };

    addElement(element);
  };

  const collaborationElements = smartElementTemplates.filter(t => t.category === 'collaboration');
  const planningElements = smartElementTemplates.filter(t => t.category === 'planning');
  const analysisElements = smartElementTemplates.filter(t => t.category === 'analysis');

  const renderElementGroup = (title: string, elements: SmartElementTemplate[]) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <Badge variant="secondary" className="text-xs">{elements.length}</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {elements.map((template) => {
          const IconComponent = getIcon(template.icon);
          
          return (
            <Button
              key={template.type}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent"
              onClick={() => handleAddElement(template)}
            >
              <IconComponent className="h-6 w-6 text-primary" />
              <div className="text-center">
                <div className="text-xs font-medium">{template.nameAr}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-tight">
                  {template.descriptionAr}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <ToolPanelContainer title="العناصر الذكية">
      <div className="space-y-6">
        <div className="text-sm text-muted-foreground">
          اختر عنصرًا ذكيًا لإضافته إلى اللوحة
        </div>
        
        {renderElementGroup('التعاون', collaborationElements)}
        {renderElementGroup('التخطيط', planningElements)}
        {renderElementGroup('التحليل', analysisElements)}
        
        <div className="text-xs text-muted-foreground pt-4 border-t">
          <div className="font-medium mb-1">نصائح:</div>
          <div>• انقر على العنصر لإضافته</div>
          <div>• اسحب العناصر لإعادة ترتيبها</div>
          <div>• استخدم لوحة التفكير لتجميع الأفكار</div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};
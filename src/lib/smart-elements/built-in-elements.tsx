import React from 'react';
import { 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  CheckSquare, 
  Timer, 
  Target,
  Users,
  TrendingUp,
  Brain,
  Lightbulb
} from 'lucide-react';
import { SmartElementDefinition, smartElementsRegistry } from './smart-elements-registry';
import { CanvasNode } from '../canvas/types';

// Think Board Element
const ThinkBoardElement: SmartElementDefinition = {
  type: 'think_board',
  name: 'Think Board',
  icon: <Brain className="w-4 h-4" />,
  category: 'basic',
  defaultState: {
    size: { width: 300, height: 200 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'أفكار جديدة',
      items: [],
      maxItems: 10
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'العنوان',
        default: 'أفكار جديدة'
      },
      maxItems: {
        type: 'number',
        title: 'الحد الأقصى للعناصر',
        default: 10,
        minimum: 1,
        maximum: 50
      },
      allowDuplicates: {
        type: 'boolean',
        title: 'السماح بالتكرار',
        default: false
      }
    },
    required: ['title']
  },
  renderer: (node, context) => (
    <div className="w-full h-full bg-card border border-border rounded-lg p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">{node.metadata?.title}</h3>
      </div>
      <div className="space-y-2">
        {(node.metadata?.items || []).map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
            <Lightbulb className="w-3 h-3 text-accent-yellow flex-shrink-0" />
            <span className="truncate">{item}</span>
          </div>
        ))}
        {(!node.metadata?.items || node.metadata.items.length === 0) && (
          <div className="text-muted-foreground text-xs text-center py-4">
            انقر مرتين لإضافة أفكار
          </div>
        )}
      </div>
    </div>
  ),
  behaviors: {
    onDoubleClick: (node) => {
      console.log('Opening think board editor for:', node.id);
    }
  }
};

// Kanban Element
const KanbanElement: SmartElementDefinition = {
  type: 'kanban',
  name: 'Kanban',
  icon: <CheckSquare className="w-4 h-4" />,
  category: 'project',
  defaultState: {
    size: { width: 400, height: 300 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'لوحة المهام',
      columns: [
        { id: 'todo', title: 'قائمة المهام', items: [] },
        { id: 'progress', title: 'قيد التنفيذ', items: [] },
        { id: 'done', title: 'مكتملة', items: [] }
      ]
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان اللوحة',
        default: 'لوحة المهام'
      },
      showProgress: {
        type: 'boolean',
        title: 'إظهار شريط التقدم',
        default: true
      },
      maxTasksPerColumn: {
        type: 'number',
        title: 'الحد الأقصى للمهام في العمود',
        default: 20,
        minimum: 5,
        maximum: 100
      }
    },
    required: ['title']
  },
  renderer: (node, context) => (
    <div className="w-full h-full bg-card border border-border rounded-lg p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <CheckSquare className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">{node.metadata?.title}</h3>
      </div>
      <div className="flex gap-2 h-[calc(100%-3rem)] overflow-x-auto">
        {(node.metadata?.columns || []).map((column: any) => (
          <div key={column.id} className="flex-1 min-w-[100px] bg-muted rounded p-2">
            <h4 className="text-xs font-medium mb-2 truncate">{column.title}</h4>
            <div className="space-y-1">
              {(column.items || []).slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="bg-card p-1 rounded text-xs truncate">
                  {item.title || item}
                </div>
              ))}
              {(column.items || []).length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{column.items.length - 3} أخرى
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

// Timeline Element
const TimelineElement: SmartElementDefinition = {
  type: 'timeline',
  name: 'Timeline',
  icon: <Timer className="w-4 h-4" />,
  category: 'project',
  defaultState: {
    size: { width: 350, height: 250 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'الجدول الزمني',
      events: [],
      showDates: true,
      orientation: 'vertical'
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان الجدول الزمني',
        default: 'الجدول الزمني'
      },
      orientation: {
        type: 'string',
        title: 'الاتجاه',
        enum: ['vertical', 'horizontal'],
        enumNames: ['عمودي', 'أفقي'],
        default: 'vertical'
      },
      showDates: {
        type: 'boolean',
        title: 'إظهار التواريخ',
        default: true
      },
      maxEvents: {
        type: 'number',
        title: 'الحد الأقصى للأحداث',
        default: 10,
        minimum: 1,
        maximum: 50
      }
    },
    required: ['title']
  },
  renderer: (node, context) => (
    <div className="w-full h-full bg-card border border-border rounded-lg p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">{node.metadata?.title}</h3>
      </div>
      <div className="relative h-[calc(100%-3rem)] overflow-y-auto">
        {(!node.metadata?.events || node.metadata.events.length === 0) ? (
          <div className="text-muted-foreground text-xs text-center py-8">
            انقر مرتين لإضافة أحداث
          </div>
        ) : (
          <div className="space-y-3">
            {(node.metadata.events || []).slice(0, 4).map((event: any, index: number) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{event.title || `حدث ${index + 1}`}</div>
                  {node.metadata?.showDates && event.date && (
                    <div className="text-xs text-muted-foreground">{event.date}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
};

// Finance Dashboard Element
const FinanceElement: SmartElementDefinition = {
  type: 'finance_dashboard',
  name: 'Finance',
  icon: <TrendingUp className="w-4 h-4" />,
  category: 'finance',
  defaultState: {
    size: { width: 300, height: 200 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'لوحة المالية',
      budget: 100000,
      spent: 45000,
      currency: 'SAR',
      showProgress: true
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'العنوان',
        default: 'لوحة المالية'
      },
      budget: {
        type: 'number',
        title: 'الميزانية الإجمالية',
        default: 100000,
        minimum: 0
      },
      spent: {
        type: 'number',
        title: 'المبلغ المنفق',
        default: 0,
        minimum: 0
      },
      currency: {
        type: 'string',
        title: 'العملة',
        enum: ['SAR', 'USD', 'EUR'],
        enumNames: ['ريال سعودي', 'دولار أمريكي', 'يورو'],
        default: 'SAR'
      },
      showProgress: {
        type: 'boolean',
        title: 'إظهار شريط التقدم',
        default: true
      }
    },
    required: ['title', 'budget']
  },
  renderer: (node, context) => {
    const budget = node.metadata?.budget || 0;
    const spent = node.metadata?.spent || 0;
    const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
    const currency = node.metadata?.currency || 'SAR';
    
    return (
      <div className="w-full h-full bg-card border border-border rounded-lg p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm">{node.metadata?.title}</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">الميزانية</div>
              <div className="font-semibold">{budget.toLocaleString()} {currency}</div>
            </div>
            <div>
              <div className="text-muted-foreground">المنفق</div>
              <div className="font-semibold">{spent.toLocaleString()} {currency}</div>
            </div>
          </div>
          {node.metadata?.showProgress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>التقدم</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    percentage > 90 ? 'bg-destructive' : 
                    percentage > 70 ? 'bg-yellow-500' : 'bg-primary'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

// CRM Element
const CRMElement: SmartElementDefinition = {
  type: 'crm_dashboard',
  name: 'CRM',
  icon: <Users className="w-4 h-4" />,
  category: 'social',
  defaultState: {
    size: { width: 280, height: 180 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'إدارة العملاء',
      totalClients: 0,
      activeClients: 0,
      newThisMonth: 0
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'العنوان',
        default: 'إدارة العملاء'
      },
      showGrowthRate: {
        type: 'boolean',
        title: 'إظهار معدل النمو',
        default: true
      },
      displayMode: {
        type: 'string',
        title: 'نمط العرض',
        enum: ['summary', 'detailed'],
        enumNames: ['ملخص', 'مفصل'],
        default: 'summary'
      }
    },
    required: ['title']
  },
  renderer: (node, context) => (
    <div className="w-full h-full bg-card border border-border rounded-lg p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">{node.metadata?.title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted rounded p-2">
          <div className="text-muted-foreground">إجمالي العملاء</div>
          <div className="text-lg font-bold">{node.metadata?.totalClients || 0}</div>
        </div>
        <div className="bg-muted rounded p-2">
          <div className="text-muted-foreground">النشطون</div>
          <div className="text-lg font-bold text-green-600">{node.metadata?.activeClients || 0}</div>
        </div>
        <div className="bg-muted rounded p-2 col-span-2">
          <div className="text-muted-foreground">جديد هذا الشهر</div>
          <div className="text-lg font-bold text-blue-600">{node.metadata?.newThisMonth || 0}</div>
        </div>
      </div>
    </div>
  )
};

// Register all built-in elements
export function registerBuiltInSmartElements() {
  try {
    smartElementsRegistry.registerSmartElement(ThinkBoardElement);
    smartElementsRegistry.registerSmartElement(KanbanElement);
    smartElementsRegistry.registerSmartElement(TimelineElement);
    smartElementsRegistry.registerSmartElement(FinanceElement);
    smartElementsRegistry.registerSmartElement(CRMElement);
    
    console.log('✅ Built-in smart elements registered successfully');
  } catch (error) {
    console.error('❌ Failed to register built-in smart elements:', error);
  }
}
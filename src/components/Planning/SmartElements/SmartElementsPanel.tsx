import React from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';

interface SmartElement {
  id: string;
  name: string;
  smartType: string;
  icon: string;
  defaultData: any;
}

const smartElements: SmartElement[] = [
  { 
    id: 'thinking_board', 
    name: 'Think Board', 
    smartType: 'thinking_board',
    icon: '🧠',
    defaultData: { items: [], tags: [] }
  },
  { 
    id: 'kanban', 
    name: 'Kanban', 
    smartType: 'kanban',
    icon: '📋',
    defaultData: { columns: [
      { id: '1', title: 'قيد الانتظار', cards: [] },
      { id: '2', title: 'قيد التنفيذ', cards: [] },
      { id: '3', title: 'مكتمل', cards: [] }
    ] }
  },
  { 
    id: 'voting', 
    name: 'Voting', 
    smartType: 'voting',
    icon: '🗳️',
    defaultData: { question: 'سؤال التصويت', options: [], totalVotes: 0 }
  },
  { 
    id: 'brainstorming', 
    name: 'Brainstorm', 
    smartType: 'brainstorming',
    icon: '💡',
    defaultData: { mode: 'collaborative', ideas: [] }
  },
  { 
    id: 'timeline', 
    name: 'Timeline', 
    smartType: 'timeline',
    icon: '📅',
    defaultData: { unit: 'month', items: [] }
  },
  { 
    id: 'decisions_matrix', 
    name: 'Decision Matrix', 
    smartType: 'decisions_matrix',
    icon: '📊',
    defaultData: { criteria: [], options: [] }
  },
  { 
    id: 'gantt', 
    name: 'Gantt', 
    smartType: 'gantt',
    icon: '📈',
    defaultData: { tasks: [], dependencies: [] }
  },
  { 
    id: 'interactive_sheet', 
    name: 'Spreadsheet', 
    smartType: 'interactive_sheet',
    icon: '📑',
    defaultData: { rows: 10, cols: 10, cells: {} }
  },
  { 
    id: 'mind_map', 
    name: 'Mindmap', 
    smartType: 'mind_map',
    icon: '🗺️',
    defaultData: { root: { id: '1', label: 'العنوان', children: [] } }
  },
  { 
    id: 'project_card', 
    name: 'Project Cards', 
    smartType: 'project_card',
    icon: '📁',
    defaultData: { title: 'مشروع جديد', status: 'active', progress: 0 }
  },
  { 
    id: 'finance_card', 
    name: 'Finance', 
    smartType: 'finance_card',
    icon: '💰',
    defaultData: { budget: 0, spent: 0, currency: 'SAR' }
  },
  { 
    id: 'csr_card', 
    name: 'CSR', 
    smartType: 'csr_card',
    icon: '🌱',
    defaultData: { initiative: 'مبادرة جديدة', impact: [] }
  },
  { 
    id: 'crm_card', 
    name: 'CRM', 
    smartType: 'crm_card',
    icon: '👥',
    defaultData: { client: 'عميل جديد', interactions: [] }
  },
  { 
    id: 'root_connector', 
    name: 'Root Linker', 
    smartType: 'root_connector',
    icon: '🔗',
    defaultData: { title: 'رابط', description: '', start: null, end: null }
  },
];

export default function SmartElementsPanel() {
  const { addElement, selectedElementIds, setSelectedSmartElement, selectedSmartElement } = useCanvasStore();

  const handleAddElement = (element: SmartElement) => {
    // تعيين العنصر الذكي المختار وتفعيل أداة العناصر الذكية
    setSelectedSmartElement(element.smartType);
    toast.success(`تم اختيار ${element.name}. انقر على الكانفاس لإضافته.`);
  };

  return (
    <div className="p-4">
      <div className="font-semibold text-[hsl(var(--ink))] mb-3">
        العناصر الذكية
      </div>
      
      <div className="grid grid-cols-6 gap-2 mb-4">
        {smartElements.map((element) => (
          <button
            key={element.id}
            onClick={() => handleAddElement(element)}
            className="h-16 flex flex-col items-center justify-center gap-1 p-2 
              bg-white hover:bg-[hsl(var(--panel))] border border-[hsl(var(--border))] 
              rounded-lg transition-colors text-xs"
            title={element.name}
          >
            <span className="text-2xl">{element.icon}</span>
            <span className="text-[10px] text-[hsl(var(--ink-60))] truncate w-full text-center">
              {element.name}
            </span>
          </button>
        ))}
      </div>
      
      <div className="border border-[hsl(var(--border))] rounded-lg p-3 bg-white">
        <div className="text-xs text-[hsl(var(--ink-60))] mb-2">
          إعدادات العنصر المحدد
        </div>
        {selectedElementIds.length > 0 ? (
          <div className="text-sm text-[hsl(var(--ink))]">
            عدد العناصر المحددة: {selectedElementIds.length}
          </div>
        ) : (
          <div className="text-sm text-[hsl(var(--ink-60))]">
            لم يتم تحديد أي عنصر
          </div>
        )}
      </div>
    </div>
  );
}

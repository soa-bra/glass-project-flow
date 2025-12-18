import React from 'react';
import type { CanvasSmartElement } from '@/types/canvas-elements';
import { SmartElementLabels } from '@/types/smart-elements';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { KanbanBoard } from './KanbanBoard';
import { ThinkingBoard } from './ThinkingBoard';
import { VotingBoard } from './VotingBoard';
import { BrainstormingBoard } from './BrainstormingBoard';
import { TimelineView } from './TimelineView';
import { DecisionsMatrix } from './DecisionsMatrix';
import { GanttChart } from './GanttChart';
import { MindMap } from './MindMap';
import { InteractiveSheet } from './InteractiveSheet';
import { ProjectCard } from './ProjectCard';
import { FinanceCard } from './FinanceCard';
import { CsrCard } from './CsrCard';
import { CrmCard } from './CrmCard';
import { RootConnectorDisplay } from './RootConnectorDisplay';
import { 
  Brain, Kanban, Vote, Lightbulb, Calendar, Grid3X3, 
  BarChart3, Table, GitBranch, FolderKanban, Wallet,
  HeartHandshake, Users, Link2 
} from 'lucide-react';

interface SmartElementRendererProps {
  element: CanvasSmartElement;
  onUpdate?: (data: any) => void;
}

const ICONS: Record<string, React.ElementType> = {
  thinking_board: Brain,
  kanban: Kanban,
  voting: Vote,
  brainstorming: Lightbulb,
  timeline: Calendar,
  decisions_matrix: Grid3X3,
  gantt: BarChart3,
  interactive_sheet: Table,
  mind_map: GitBranch,
  project_card: FolderKanban,
  finance_card: Wallet,
  csr_card: HeartHandshake,
  crm_card: Users,
  root_connector: Link2,
};

export const SmartElementRenderer: React.FC<SmartElementRendererProps> = ({ 
  element, 
  onUpdate 
}) => {
  // ✅ توحيد البحث عن smartType في كلا المكانين
  const smartType = element.smartType || element.data?.smartType;
  
  // ✅ جلب البيانات من smartElementsStore إذا كان smartElementId موجوداً
  const smartElementId = element.data?.smartElementId;
  const { getSmartElementData } = useSmartElementsStore();
  const storedData = smartElementId ? getSmartElementData(smartElementId) : null;
  const data = storedData || element.data || {};

  // ThinkingBoard
  if (smartType === 'thinking_board') {
    return (
      <ThinkingBoard 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Kanban Board
  if (smartType === 'kanban') {
    return (
      <KanbanBoard 
        initialColumns={data.columns as any} 
        onUpdate={(columns) => onUpdate?.({ ...data, columns })} 
      />
    );
  }

  // Voting Board
  if (smartType === 'voting') {
    return (
      <VotingBoard 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Brainstorming Board
  if (smartType === 'brainstorming') {
    return (
      <BrainstormingBoard 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Timeline View
  if (smartType === 'timeline') {
    return (
      <TimelineView 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Decisions Matrix
  if (smartType === 'decisions_matrix') {
    return (
      <DecisionsMatrix 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Gantt Chart
  if (smartType === 'gantt') {
    return (
      <GanttChart 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Mind Map
  if (smartType === 'mind_map') {
    return (
      <MindMap 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Interactive Sheet
  if (smartType === 'interactive_sheet') {
    return (
      <InteractiveSheet 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Project Card
  if (smartType === 'project_card') {
    return (
      <ProjectCard 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Finance Card
  if (smartType === 'finance_card') {
    return (
      <FinanceCard 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // CSR Card
  if (smartType === 'csr_card') {
    return (
      <CsrCard 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // CRM Card
  if (smartType === 'crm_card') {
    return (
      <CrmCard 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })} 
      />
    );
  }

  // Root Connector (SVG-based)
  if (smartType === 'root_connector') {
    return (
      <RootConnectorDisplay 
        data={data as any} 
        onUpdate={(newData) => onUpdate?.({ ...data, ...newData })}
      />
    );
  }

  // Placeholder for other types
  const Icon = ICONS[smartType] || Brain;
  const label = SmartElementLabels[smartType as keyof typeof SmartElementLabels] || smartType;

  return (
    <div className="w-full h-full flex items-center justify-center bg-background border border-border rounded-lg p-4" dir="rtl">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">العنصر الذكي جاهز للاستخدام</p>
      </div>
    </div>
  );
};

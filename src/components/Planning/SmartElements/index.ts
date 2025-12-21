/**
 * @deprecated Use import from '@/features/planning/elements/smart' instead
 * This folder is kept for backward compatibility
 */

// Re-export all smart elements
export { SmartElementRenderer } from '@/features/planning/elements/smart';
export { SmartCommandBar, useSmartCommandBar } from '@/features/planning/elements/smart';
export { ContextSmartMenu } from '@/features/planning/elements/smart';

export { KanbanBoard } from '@/features/planning/elements/smart';
export { ThinkingBoard } from '@/features/planning/elements/smart';
export { VotingBoard } from '@/features/planning/elements/smart';
export { BrainstormingBoard } from '@/features/planning/elements/smart';

export { GanttChart } from '@/features/planning/elements/smart';
export { TimelineView } from '@/features/planning/elements/smart';
export { MindMap } from '@/features/planning/elements/smart';
export { VisualDiagram } from '@/features/planning/elements/smart';
export { InteractiveSheet } from '@/features/planning/elements/smart';
export { DecisionsMatrix } from '@/features/planning/elements/smart';

export { ProjectCard } from '@/features/planning/elements/smart';
export { FinanceCard } from '@/features/planning/elements/smart';
export { CsrCard } from '@/features/planning/elements/smart';
export { CrmCard } from '@/features/planning/elements/smart';

export { RootConnector } from '@/features/planning/elements/smart';
export { RootConnectorDisplay } from '@/features/planning/elements/smart';
export { SmartConnectorManager, useSmartConnectors } from '@/features/planning/elements/smart';

export { LayoutToolbar } from '@/features/planning/elements/smart';
export { LayoutManager } from '@/features/planning/elements/smart';
export type { LayoutNode, LayoutEdge, ForceConfig, SnapConfig, AlignmentGuide } from '@/features/planning/elements/smart';
export { ForceDirectedLayout, DEFAULT_FORCE_CONFIG, DEFAULT_SNAP_CONFIG } from '@/features/planning/elements/smart';

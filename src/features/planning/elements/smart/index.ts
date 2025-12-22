/**
 * Smart Elements - Barrel Export
 * @module features/planning/elements/smart
 */

// Core Components
export { SmartElementRenderer } from './SmartElementRenderer';
export { SmartCommandBar, useSmartCommandBar } from './SmartCommandBar';
export { default as ContextSmartMenu } from './ContextSmartMenu';

// Boards
export { KanbanBoard } from './KanbanBoard';
export { ThinkingBoard } from './ThinkingBoard';
export { VotingBoard } from './VotingBoard';
export { BrainstormingBoard } from './BrainstormingBoard';

// Charts & Visualizations
export { GanttChart } from './GanttChart';
export { TimelineView } from './TimelineView';
export { MindMap } from './MindMap';
export { VisualDiagram } from './VisualDiagram';
export { InteractiveSheet } from './InteractiveSheet';
export { DecisionsMatrix } from './DecisionsMatrix';

// Cards
export { ProjectCard as SmartProjectCard } from './SmartProjectCard';
export { FinanceCard } from './FinanceCard';
export { CsrCard } from './CsrCard';
export { CrmCard } from './CrmCard';

// Connectors
export { RootConnector } from './RootConnector';
export { RootConnectorDisplay } from './RootConnectorDisplay';
export { SmartConnectorManager, useSmartConnectors } from './SmartConnectorManager';

// Layout - Types
export type { 
  LayoutNode,
  LayoutEdge,
  ForceConfig,
  SnapConfig,
  AlignmentGuide,
} from './LayoutEngine';

// Layout - Classes and Functions
export { 
  ForceDirectedLayout,
  DEFAULT_FORCE_CONFIG,
  DEFAULT_SNAP_CONFIG,
} from './LayoutEngine';
export { default as LayoutManager } from './LayoutEngine';
export { LayoutToolbar } from './LayoutToolbar';

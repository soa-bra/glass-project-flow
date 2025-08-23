export type SmartElementType = 
  | 'thinking_board'
  | 'kanban_board'
  | 'voting'
  | 'brainstorming'
  | 'timeline'
  | 'gantt_chart'
  | 'decision_matrix'
  | 'mind_map';

export interface SmartElementBase {
  id: string;
  type: SmartElementType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: Record<string, any>;
  style: Record<string, any>;
  locked?: boolean;
  visible?: boolean;
  createdBy?: string;
  updatedAt?: number;
}

// Thinking Board
export interface ThinkingBoardData {
  concept: string;
  backgroundColor: string;
  elements: string[]; // IDs of elements inside this board
  tags: string[];
}

export interface ThinkingBoard extends SmartElementBase {
  type: 'thinking_board';
  data: ThinkingBoardData;
}

// Kanban Board
export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  items: KanbanItem[];
}

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
}

export interface KanbanBoardData {
  columns: KanbanColumn[];
  allowDragDrop: boolean;
}

export interface KanbanBoard extends SmartElementBase {
  type: 'kanban_board';
  data: KanbanBoardData;
}

// Voting System
export interface VotingOption {
  id: string;
  title: string;
  votes: number;
  voters: string[];
}

export interface VotingData {
  question: string;
  options: VotingOption[];
  maxVotesPerUser: number;
  isActive: boolean;
  startTime?: number;
  endTime?: number;
  allowMultiple: boolean;
}

export interface VotingElement extends SmartElementBase {
  type: 'voting';
  data: VotingData;
}

// Brainstorming Session
export interface BrainstormingIdea {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  category?: string;
  votes?: number;
}

export interface BrainstormingData {
  topic: string;
  mode: 'collaborative' | 'silent' | 'rapid' | 'branching';
  ideas: BrainstormingIdea[];
  isActive: boolean;
  duration?: number;
  maxIdeasPerUser?: number;
}

export interface BrainstormingSession extends SmartElementBase {
  type: 'brainstorming';
  data: BrainstormingData;
}

// Timeline
export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  elementId?: string; // Reference to canvas element
  category?: string;
  color?: string;
}

export interface TimelineData {
  startDate: string;
  endDate: string;
  events: TimelineEvent[];
  timeUnit: 'day' | 'week' | 'month' | 'year';
  showGrid: boolean;
}

export interface Timeline extends SmartElementBase {
  type: 'timeline';
  data: TimelineData;
}

// Gantt Chart
export interface GanttTask {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  dependencies: string[];
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  color?: string;
}

export interface GanttData {
  tasks: GanttTask[];
  timeUnit: 'day' | 'week' | 'month';
  showCriticalPath: boolean;
  showDependencies: boolean;
}

export interface GanttChart extends SmartElementBase {
  type: 'gantt_chart';
  data: GanttData;
}

// Decision Matrix
export interface MatrixCriterion {
  id: string;
  name: string;
  weight: number; // 1-10
  description?: string;
}

export interface MatrixOption {
  id: string;
  name: string;
  scores: Record<string, number>; // criterionId -> score
  totalScore?: number;
}

export interface DecisionMatrixData {
  criteria: MatrixCriterion[];
  options: MatrixOption[];
  scoringMethod: 'numeric' | 'stars' | 'colors';
  autoCalculate: boolean;
}

export interface DecisionMatrix extends SmartElementBase {
  type: 'decision_matrix';
  data: DecisionMatrixData;
}

// Mind Map
export interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color?: string;
  children: MindMapNode[];
  collapsed?: boolean;
  level: number;
}

export interface MindMapData {
  rootNode: MindMapNode;
  layout: 'radial' | 'tree' | 'organic';
  autoLayout: boolean;
  showConnections: boolean;
}

export interface MindMap extends SmartElementBase {
  type: 'mind_map';
  data: MindMapData;
}

export type SmartElement = 
  | ThinkingBoard
  | KanbanBoard
  | VotingElement
  | BrainstormingSession
  | Timeline
  | GanttChart
  | DecisionMatrix
  | MindMap;

export interface SmartElementTemplate {
  type: SmartElementType;
  name: string;
  nameAr: string;
  icon: string;
  category: 'collaboration' | 'planning' | 'analysis';
  description: string;
  descriptionAr: string;
  defaultSize: { width: number; height: number };
  defaultData: Record<string, any>;
}
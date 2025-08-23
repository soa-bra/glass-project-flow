// AI Types for Planning Board
import { CanvasElement } from './canvas.types';

export interface AIAssistantState {
  isVisible: boolean;
  isProcessing: boolean;
  currentContext: AIContext;
  suggestions: AISuggestion[];
  chatHistory: AIChatMessage[];
  activeCommands: AICommand[];
}

export interface AIContext {
  boardId: string;
  selectedElements: CanvasElement[];
  visibleElements: CanvasElement[];
  currentTool: string;
  canvasState: {
    zoom: number;
    pan: { x: number; y: number };
    bounds: { width: number; height: number };
  };
  sessionInfo: {
    participants: number;
    duration: number;
    mode: 'individual' | 'collaborative';
  };
}

export interface AIChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  context?: AIContext;
  attachments?: AIAttachment[];
}

export interface AIAttachment {
  type: 'element' | 'selection' | 'frame' | 'board';
  id: string;
  preview?: string;
  metadata?: Record<string, any>;
}

export interface AISuggestion {
  id: string;
  type: AISuggestionType;
  title: string;
  description: string;
  confidence: number;
  action: AIAction;
  preview?: AIPreview;
  metadata?: Record<string, any>;
}

export type AISuggestionType = 
  | 'layout'
  | 'content' 
  | 'style'
  | 'connection'
  | 'organization'
  | 'completion'
  | 'optimization'
  | 'workflow';

export interface AIAction {
  type: AIActionType;
  parameters: Record<string, any>;
  targetElements?: string[];
  requiresConfirmation?: boolean;
}

export type AIActionType =
  | 'create_element'
  | 'modify_element'
  | 'delete_element'
  | 'group_elements'
  | 'arrange_elements'
  | 'connect_elements'
  | 'generate_content'
  | 'optimize_layout'
  | 'create_smart_element';

export interface AIPreview {
  type: 'image' | 'text' | 'elements';
  content: string | CanvasElement[];
  bounds?: { x: number; y: number; width: number; height: number };
}

export interface AICommand {
  id: string;
  command: string;
  description: string;
  shortcut?: string;
  category: AICommandCategory;
  handler: string;
  parameters?: AICommandParameter[];
}

export type AICommandCategory = 
  | 'analysis'
  | 'generation'
  | 'organization' 
  | 'completion'
  | 'export'
  | 'optimization';

export interface AICommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  default?: any;
  options?: string[];
  description?: string;
}

// Smart Analysis Types
export interface AIAnalysisResult {
  id: string;
  type: AIAnalysisType;
  timestamp: number;
  confidence: number;
  insights: AIInsight[];
  recommendations: AISuggestion[];
  metadata?: Record<string, any>;
}

export type AIAnalysisType = 
  | 'content_analysis'
  | 'layout_analysis'
  | 'workflow_analysis'
  | 'collaboration_analysis'
  | 'progress_analysis'
  | 'gap_analysis';

export interface AIInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  elements?: string[];
  data?: Record<string, any>;
}

// Smart Generation Types
export interface AIGenerationRequest {
  type: AIGenerationType;
  prompt: string;
  context: AIContext;
  constraints?: AIConstraints;
  options?: AIGenerationOptions;
}

export type AIGenerationType = 
  | 'smart_element'
  | 'content'
  | 'layout'
  | 'workflow'
  | 'project_structure'
  | 'mind_map'
  | 'timeline';

export interface AIConstraints {
  maxElements?: number;
  bounds?: { x: number; y: number; width: number; height: number };
  style?: Record<string, any>;
  excludeTypes?: string[];
  includeTypes?: string[];
}

export interface AIGenerationOptions {
  includeConnections?: boolean;
  respectExistingLayout?: boolean;
  generateVariations?: boolean;
  variationCount?: number;
  autoPlace?: boolean;
}

export interface AIGenerationResult {
  id: string;
  type: AIGenerationType;
  elements: CanvasElement[];
  connections?: AIConnection[];
  metadata: {
    prompt: string;
    timestamp: number;
    model: string;
    confidence: number;
    processingTime: number;
  };
  variations?: AIGenerationResult[];
}

export interface AIConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: AIConnectionType;
  style?: Record<string, any>;
  label?: string;
}

export type AIConnectionType = 
  | 'flow'
  | 'relationship'
  | 'dependency'
  | 'hierarchy'
  | 'association';

// Smart Project Generation
export interface AIProjectGenerationRequest {
  boardId: string;
  includeElements?: string[];
  projectTemplate?: string;
  organizationId?: string;
  options?: {
    generateTasks?: boolean;
    generateTimeline?: boolean;
    generateTeam?: boolean;
    generateBudget?: boolean;
  };
}

export interface AIProjectGenerationResult {
  projectId: string;
  name: string;
  description: string;
  structure: {
    tasks: AIGeneratedTask[];
    timeline?: AIGeneratedTimeline;
    team?: AIGeneratedTeamMember[];
    budget?: AIGeneratedBudget;
  };
  confidence: number;
  metadata: Record<string, any>;
}

export interface AIGeneratedTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  dependencies?: string[];
  assignee?: string;
  tags?: string[];
  sourceElementId?: string;
}

export interface AIGeneratedTimeline {
  startDate: string;
  endDate: string;
  milestones: {
    id: string;
    name: string;
    date: string;
    description: string;
    taskIds: string[];
  }[];
}

export interface AIGeneratedTeamMember {
  role: string;
  skills: string[];
  allocation: number;
  taskIds: string[];
}

export interface AIGeneratedBudget {
  total: number;
  breakdown: {
    category: string;
    amount: number;
    tasks: string[];
  }[];
}

// AI Service Configuration
export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  model: string;
  apiKey?: string;
  endpoint?: string;
  maxTokens?: number;
  temperature?: number;
  enableStreaming?: boolean;
  enableFunctionCalling?: boolean;
  rateLimits?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface AIModelCapabilities {
  textGeneration: boolean;
  imageGeneration: boolean;
  imageAnalysis: boolean;
  codeGeneration: boolean;
  functionCalling: boolean;
  streaming: boolean;
  maxContextLength: number;
  supportedLanguages: string[];
}

export interface AIUsageMetrics {
  requestCount: number;
  tokenUsage: number;
  averageResponseTime: number;
  errorRate: number;
  lastUpdated: number;
}
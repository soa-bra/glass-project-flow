import type { CanvasElement } from '@/types/canvas';
import {
  SmartElementTypes,
  type SmartElementType,
  parseSmartElementData,
} from '@/types/smart-elements';

interface GeneratedAIElement {
  type: string;
  title: string;
  description?: string;
  data: Record<string, any>;
  position?: { x: number; y: number };
  connections?: Array<{
    targetIndex: number;
    label?: string;
    type: 'related_to' | 'contains' | 'depends_on' | 'leads_to';
  }>;
}

interface CreateTypedSmartElementOptions {
  element: GeneratedAIElement;
  index: number;
  viewport: { zoom: number; pan: { x: number; y: number } };
}

const SMART_ELEMENT_SIZE_MAP: Record<SmartElementType, { width: number; height: number }> = {
  thinking_board: { width: 420, height: 300 },
  kanban: { width: 420, height: 320 },
  voting: { width: 380, height: 280 },
  brainstorming: { width: 420, height: 300 },
  timeline: { width: 440, height: 260 },
  decisions_matrix: { width: 440, height: 300 },
  gantt: { width: 460, height: 300 },
  interactive_sheet: { width: 440, height: 320 },
  mind_map: { width: 420, height: 320 },
  visual_diagram: { width: 420, height: 320 },
  project_card: { width: 360, height: 240 },
  task_card: { width: 360, height: 240 },
  finance_card: { width: 360, height: 240 },
  csr_card: { width: 360, height: 240 },
  crm_card: { width: 360, height: 240 },
  root_connector: { width: 320, height: 120 },
  smart_text_doc: { width: 420, height: 320 },
};

const SMART_TYPE_ALIASES: Record<string, SmartElementType> = {
  thinking: 'thinking_board',
  thinking_board: 'thinking_board',
  kanban: 'kanban',
  kanban_board: 'kanban',
  voting: 'voting',
  brainstorm: 'brainstorming',
  brainstorming: 'brainstorming',
  timeline: 'timeline',
  gantt: 'gantt',
  matrix: 'decisions_matrix',
  decisions_matrix: 'decisions_matrix',
  mindmap: 'mind_map',
  mind_map: 'mind_map',
  smart_mindmap: 'mind_map',
  visual_diagram: 'visual_diagram',
  project_card: 'project_card',
  task_card: 'task_card',
  finance_card: 'finance_card',
  csr_card: 'csr_card',
  crm_card: 'crm_card',
  interactive_sheet: 'interactive_sheet',
  smart_text_doc: 'smart_text_doc',
  root_connector: 'root_connector',
};

export function isTypedSmartCanvasElementType(type: string): type is SmartElementType {
  return SmartElementTypes.includes(type as SmartElementType);
}

export function normalizeSmartElementType(type: string): SmartElementType {
  const normalized = type.trim().toLowerCase();
  return SMART_TYPE_ALIASES[normalized] || 'thinking_board';
}

export function createTypedSmartElement({
  element,
  index,
  viewport,
}: CreateTypedSmartElementOptions): Omit<CanvasElement, 'id'> & { id?: string } {
  const smartType = normalizeSmartElementType(element.type);
  const parsedData = parseSmartElementData(smartType, {
    ...(element.data || {}),
    smartType,
    title: element.title,
    description: element.description,
  });
  const size = SMART_ELEMENT_SIZE_MAP[smartType];
  const basePosition = element.position || { x: 100 + index * 50, y: 100 + index * 50 };

  return {
    type: smartType,
    smartType,
    position: {
      x: basePosition.x - viewport.pan.x / viewport.zoom,
      y: basePosition.y - viewport.pan.y / viewport.zoom,
    },
    size,
    content: element.title,
    style: {
      backgroundColor: 'transparent',
    },
    data: {
      ...parsedData,
      smartType,
    },
    metadata: {
      aiGenerated: true,
      source: 'smart-command-bar',
      description: element.description,
      connections: element.connections || [],
    },
  };
}

export default createTypedSmartElement;

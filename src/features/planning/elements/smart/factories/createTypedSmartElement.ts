import type { CanvasElement } from '@/types/canvas';
import {
  SmartElementTypes,
  type SmartElementType,
  parseSmartElementData,
} from '@/types/smart-elements';

export interface GeneratedAIElement {
  id?: string;
  type: string;
  title: string;
  description?: string;
  data?: Record<string, unknown>;
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
  viewportHostSize?: { width: number; height: number };
}

const DEFAULT_VIEWPORT_HOST_SIZE = { width: 1280, height: 720 } as const;
const SMART_ELEMENT_STAGGER = { x: 48, y: 48 } as const;

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
  think_board: 'thinking_board',
  board: 'thinking_board',
  kanban: 'kanban',
  kanban_board: 'kanban',
  voting: 'voting',
  vote: 'voting',
  poll: 'voting',
  brainstorm: 'brainstorming',
  brainstorming: 'brainstorming',
  timeline: 'timeline',
  time_line: 'timeline',
  gantt: 'gantt',
  gantt_chart: 'gantt',
  matrix: 'decisions_matrix',
  decision_matrix: 'decisions_matrix',
  decisions_matrix: 'decisions_matrix',
  mindmap: 'mind_map',
  mind_map: 'mind_map',
  smart_mindmap: 'mind_map',
  visual: 'visual_diagram',
  diagram: 'visual_diagram',
  visual_diagram: 'visual_diagram',
  project: 'project_card',
  project_card: 'project_card',
  task: 'task_card',
  task_card: 'task_card',
  finance: 'finance_card',
  finance_card: 'finance_card',
  csr: 'csr_card',
  csr_card: 'csr_card',
  crm: 'crm_card',
  crm_card: 'crm_card',
  sheet: 'interactive_sheet',
  interactive_sheet: 'interactive_sheet',
  smart_text_doc: 'smart_text_doc',
  smart_doc: 'smart_text_doc',
  doc: 'smart_text_doc',
  root_connector: 'root_connector',
  connector: 'root_connector',
};

export function isTypedSmartCanvasElementType(type: string): type is SmartElementType {
  return SmartElementTypes.includes(type as SmartElementType);
}

export function normalizeSmartElementType(type: string): SmartElementType {
  const normalized = type.trim().toLowerCase();
  return SMART_TYPE_ALIASES[normalized] || 'thinking_board';
}

function normalizeViewportHostSize(hostSize: { width: number; height: number } | undefined): { width: number; height: number } {
  return {
    width: hostSize && hostSize.width > 0 ? hostSize.width : DEFAULT_VIEWPORT_HOST_SIZE.width,
    height: hostSize && hostSize.height > 0 ? hostSize.height : DEFAULT_VIEWPORT_HOST_SIZE.height,
  };
}

function getViewportCenterWorldPosition(
  viewport: { zoom: number; pan: { x: number; y: number } },
  viewportHostSize: { width: number; height: number } | undefined,
): { x: number; y: number } {
  const hostSize = normalizeViewportHostSize(viewportHostSize);

  return {
    x: (hostSize.width / 2 - viewport.pan.x) / viewport.zoom,
    y: (hostSize.height / 2 - viewport.pan.y) / viewport.zoom,
  };
}

function getElementWorldPosition({
  element,
  index,
  viewport,
  viewportHostSize,
}: CreateTypedSmartElementOptions): { x: number; y: number } {
  if (element.position) {
    return element.position;
  }

  const viewportCenter = getViewportCenterWorldPosition(viewport, viewportHostSize);
  return {
    x: viewportCenter.x + SMART_ELEMENT_STAGGER.x * index,
    y: viewportCenter.y + SMART_ELEMENT_STAGGER.y * index,
  };
}

export function createTypedSmartElement({
  element,
  index,
  viewport,
  viewportHostSize,
}: CreateTypedSmartElementOptions): Omit<CanvasElement, 'id'> & { id?: string } {
  const smartType = normalizeSmartElementType(element.type);
  const parsedData = parseSmartElementData(smartType, {
    ...(element.data || {}),
    smartType,
    title: element.title,
    description: element.description,
  });
  const size = SMART_ELEMENT_SIZE_MAP[smartType];
  const position = getElementWorldPosition({ element, index, viewport, viewportHostSize });

  return {
    ...(element.id ? { id: element.id } : {}),
    type: 'smart',
    smartType,
    position,
    size,
    content: element.title,
    style: {
      backgroundColor: 'transparent',
    },
    data: {
      ...parsedData,
      smartType,
      title: element.title,
      description: element.description,
    },
    metadata: {
      smartType,
      aiGenerated: true,
      source: 'smart-command-bar',
      description: element.description,
      connections: element.connections || [],
      originalType: element.type,
    },
  };
}

export default createTypedSmartElement;

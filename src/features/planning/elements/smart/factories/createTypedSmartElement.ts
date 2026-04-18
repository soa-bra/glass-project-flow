import type { CanvasElement } from '@/types/canvas';
import { parseSmartElementData, type SmartElementType } from '@/types/smart-elements';

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

const SUPPORTED_SMART_TYPES = ['thinking_board', 'kanban', 'timeline', 'gantt', 'mind_map'] as const;
const SMART_TYPE_ALIASES: Record<string, SmartElementType> = {
  thinking_board: 'thinking_board',
  thinking: 'thinking_board',
  kanban: 'kanban',
  kanban_board: 'kanban',
  timeline: 'timeline',
  gantt: 'gantt',
  mind_map: 'mind_map',
  mindmap: 'mind_map',
  smart_mindmap: 'mind_map',
};

const SMART_ELEMENT_SIZE_MAP: Record<(typeof SUPPORTED_SMART_TYPES)[number], { width: number; height: number }> = {
  thinking_board: { width: 420, height: 300 },
  kanban: { width: 420, height: 320 },
  timeline: { width: 440, height: 260 },
  gantt: { width: 460, height: 300 },
  mind_map: { width: 420, height: 320 },
};

export function isTypedSmartCanvasElementType(type: string): type is (typeof SUPPORTED_SMART_TYPES)[number] {
  return SUPPORTED_SMART_TYPES.includes(type as (typeof SUPPORTED_SMART_TYPES)[number]);
}

export function normalizeSmartElementType(type: string): (typeof SUPPORTED_SMART_TYPES)[number] {
  const normalized = type.trim().toLowerCase();
  return (SMART_TYPE_ALIASES[normalized] as (typeof SUPPORTED_SMART_TYPES)[number]) || 'thinking_board';
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

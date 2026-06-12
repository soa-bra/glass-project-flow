import { invokeAIAction } from '@/features/ai/gateway/aiGateway.client';
import {
  normalizeRelationshipType,
  type UnifiedRelationshipType,
} from '@/features/planning/integration/connectors/relationshipTypes';

export interface ReadableConnectorElementForAI {
  id: string;
  type: string;
  smartType?: string | null;
  title?: string | null;
  description?: string | null;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface SmartConnectorRelationshipSuggestion {
  relationshipType: UnifiedRelationshipType;
  title: string;
  description: string;
  confidence: number;
  reasoning?: string;
}

interface SuggestConnectorRelationshipInput {
  boardId?: string | null;
  sourceElementId: string;
  targetElementId: string;
  readableElements: ReadableConnectorElementForAI[];
  existingLinks?: Array<Record<string, unknown>>;
}

const DEFAULT_CONFIDENCE = 0.72;

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function clampConfidence(value: unknown): number {
  const numeric = readNumber(value);
  if (numeric === undefined) return DEFAULT_CONFIDENCE;
  return Math.max(0, Math.min(1, numeric > 1 ? numeric / 100 : numeric));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function extractCandidate(result: unknown, sourceElementId: string, targetElementId: string): Record<string, unknown> | null {
  const root = asRecord(result);
  if (!root) return null;

  const direct = asRecord(root.suggestion) ?? asRecord(root.relationship) ?? asRecord(root.connectorSuggestion);
  if (direct) return direct;

  const relationships = Array.isArray(root.relationships) ? root.relationships : [];
  const matched = relationships.find((item) => {
    const record = asRecord(item);
    if (!record) return false;
    const from = readString(record.from) ?? readString(record.sourceElementId) ?? readString(record.sourceId);
    const to = readString(record.to) ?? readString(record.targetElementId) ?? readString(record.targetId);
    return from === sourceElementId && to === targetElementId;
  });

  return asRecord(matched) ?? asRecord(relationships[0]) ?? null;
}

export async function suggestSmartConnectorRelationship({
  boardId,
  sourceElementId,
  targetElementId,
  readableElements,
  existingLinks = [],
}: SuggestConnectorRelationshipInput): Promise<SmartConnectorRelationshipSuggestion | null> {
  const selectedElements = readableElements.filter((element) =>
    element.id === sourceElementId || element.id === targetElementId,
  );

  if (selectedElements.length < 2) return null;

  const result = await invokeAIAction<unknown>({
    action: 'suggest_connections',
    selectedElements,
    prompt: 'اقترح نوع العلاقة الأنسب بين عنصري اللوحة المحددين. لا تنشئ علاقة تشغيلية؛ أعد اقتراحاً للمراجعة البشرية فقط.',
    context: {
      boardId,
      availableLinks: existingLinks,
      readableElementIds: readableElements.map((element) => element.id),
      sourceElementId,
      targetElementId,
    },
    departmentId: 'planning',
  });

  const candidate = extractCandidate(result, sourceElementId, targetElementId);
  const relationshipType = normalizeRelationshipType(
    readString(candidate?.relationshipType) ?? readString(candidate?.type),
  );

  const sourceTitle = selectedElements[0]?.title || selectedElements[0]?.smartType || selectedElements[0]?.type;
  const targetTitle = selectedElements[1]?.title || selectedElements[1]?.smartType || selectedElements[1]?.type;
  const reasoning = readString(candidate?.reasoning) ?? readString(candidate?.rationale);

  return {
    relationshipType,
    title: readString(candidate?.title) ?? `اقتراح علاقة: ${relationshipType}`,
    description: readString(candidate?.description) ?? reasoning ?? `العلاقة المقترحة بين ${sourceTitle} و${targetTitle}.`,
    confidence: clampConfidence(candidate?.confidence),
    reasoning,
  };
}

import {
  isOperationalRelationshipType,
  normalizeRelationshipType,
  type UnifiedRelationshipType,
} from './relationshipTypes';

export type ConnectorElementKind = 'component' | 'frame' | 'smart-element' | 'entity';

export interface ConnectorPolicyElement {
  id: string;
  type?: ConnectorElementKind | string;
  entityType?: string | null;
  smartType?: string | null;
  locked?: boolean;
  archived?: boolean;
  canRead?: boolean;
  canConnect?: boolean;
  canCreateOperationalRelationship?: boolean;
}

export interface ConnectorPolicyBoardPermissions {
  canEditBoard: boolean;
  canCreateOperationalRelationship?: boolean;
}

export interface ConnectorPolicyDecision {
  allowed: boolean;
  reason: string;
}

export interface ConnectorRelationshipValidationInput {
  source: ConnectorPolicyElement;
  target: ConnectorPolicyElement;
  relationshipType?: string | null;
}

export interface ConnectorCreatePolicyInput extends ConnectorRelationshipValidationInput {
  board: ConnectorPolicyBoardPermissions;
}

export interface ConnectorUpdatePolicyInput extends ConnectorCreatePolicyInput {
  connectorLocked?: boolean;
  connectorArchived?: boolean;
}

const ALLOWED: ConnectorPolicyDecision = {
  allowed: true,
  reason: 'العلاقة مسموحة.',
};

const OPERATIONAL_NODE_TYPES = new Set([
  'project_card',
  'task_card',
  'finance_card',
  'csr_card',
  'crm_card',
  'thinking_board',
  'kanban',
  'timeline',
  'gantt',
  'interactive_sheet',
  'smart_text_doc',
  'smart-element',
  'component',
  'entity',
]);

const PROJECT_LIKE_TYPES = new Set(['project_card', 'thinking_board', 'kanban', 'timeline', 'gantt']);
const WORK_ITEM_TYPES = new Set(['task_card', 'csr_card', 'crm_card', 'component', 'smart-element', 'entity']);

function deny(reason: string): ConnectorPolicyDecision {
  return { allowed: false, reason };
}

function describeElementType(element: ConnectorPolicyElement): string {
  return element.entityType ?? element.smartType ?? element.type ?? 'component';
}

function isFrame(element: ConnectorPolicyElement): boolean {
  return describeElementType(element) === 'frame' || element.type === 'frame';
}

function isOperationalCapable(element: ConnectorPolicyElement): boolean {
  if (isFrame(element)) return false;
  return OPERATIONAL_NODE_TYPES.has(describeElementType(element));
}

function canUseEndpoint(element: ConnectorPolicyElement, label: 'المصدر' | 'الهدف'): ConnectorPolicyDecision {
  if (element.canRead === false) {
    return deny(`لا تملك صلاحية قراءة ${label}، لذلك لا يمكن إنشاء العلاقة.`);
  }

  if (element.archived) {
    return deny(`${label} مؤرشف ولا يمكن ربطه بعلاقة جديدة.`);
  }

  if (element.locked) {
    return deny(`${label} مقفل حاليًا ولا يمكن تعديل علاقاته.`);
  }

  if (element.canConnect === false) {
    return deny(`${label} غير مؤهل لإنشاء الموصلات.`);
  }

  if (describeElementType(element) === 'root_connector') {
    return deny(`${label} هو موصل وليس عنصرًا قابلاً للربط.`);
  }

  return ALLOWED;
}

function endpointTypesAllowRelationship(
  source: ConnectorPolicyElement,
  target: ConnectorPolicyElement,
  relationshipType: UnifiedRelationshipType,
): boolean {
  const sourceType = describeElementType(source);
  const targetType = describeElementType(target);

  switch (relationshipType) {
    case 'references':
      return true;
    case 'belongs_to':
      return isFrame(target) || PROJECT_LIKE_TYPES.has(targetType) || WORK_ITEM_TYPES.has(sourceType);
    case 'funds':
      return sourceType === 'finance_card' && (PROJECT_LIKE_TYPES.has(targetType) || WORK_ITEM_TYPES.has(targetType));
    case 'delivers':
      return PROJECT_LIKE_TYPES.has(sourceType) && WORK_ITEM_TYPES.has(targetType);
    case 'depends_on':
    case 'blocks':
    case 'causes':
      return isOperationalCapable(source) && isOperationalCapable(target);
    default:
      return false;
  }
}

export function validateRelationshipType(input: ConnectorRelationshipValidationInput): ConnectorPolicyDecision {
  const relationshipType = normalizeRelationshipType(input.relationshipType);

  if (input.relationshipType && relationshipType !== input.relationshipType) {
    return deny('نوع العلاقة غير معروف أو غير مدعوم. اختر نوع علاقة صالحًا.');
  }

  if (!endpointTypesAllowRelationship(input.source, input.target, relationshipType)) {
    return deny('نوع العلاقة المحدد غير مسموح بين نوعي العنصرين.');
  }

  return ALLOWED;
}

export function canPromoteConnectorToOperational(input: ConnectorCreatePolicyInput): ConnectorPolicyDecision {
  const relationshipType = normalizeRelationshipType(input.relationshipType);

  if (!isOperationalRelationshipType(relationshipType)) {
    return deny('هذه العلاقة بصرية فقط ولا يمكن ترقيتها إلى علاقة تشغيلية.');
  }

  if (!input.board.canCreateOperationalRelationship) {
    return deny('لا تملك صلاحية إنشاء علاقة تشغيلية على هذه اللوحة.');
  }

  if (!input.source.canCreateOperationalRelationship || !input.target.canCreateOperationalRelationship) {
    return deny('أحد طرفي العلاقة غير مؤهل لعلاقة تشغيلية.');
  }

  return validateRelationshipType({
    source: input.source,
    target: input.target,
    relationshipType,
  });
}

export function canCreateConnector(input: ConnectorCreatePolicyInput): ConnectorPolicyDecision {
  if (!input.board.canEditBoard) {
    return deny('لا تملك صلاحية تعديل اللوحة لإنشاء علاقة جديدة.');
  }

  if (input.source.id === input.target.id) {
    return deny('لا يمكن ربط العنصر بنفسه. اختر عنصرًا آخر كهدف للعلاقة.');
  }

  const sourceDecision = canUseEndpoint(input.source, 'المصدر');
  if (!sourceDecision.allowed) return sourceDecision;

  const targetDecision = canUseEndpoint(input.target, 'الهدف');
  if (!targetDecision.allowed) return targetDecision;

  const relationshipDecision = validateRelationshipType(input);
  if (!relationshipDecision.allowed) return relationshipDecision;

  if (isOperationalRelationshipType(input.relationshipType)) {
    return canPromoteConnectorToOperational(input);
  }

  return ALLOWED;
}

export function canUpdateConnector(input: ConnectorUpdatePolicyInput): ConnectorPolicyDecision {
  if (input.connectorArchived) {
    return deny('الموصل مؤرشف ولا يمكن تعديله.');
  }

  if (input.connectorLocked) {
    return deny('الموصل مقفل ولا يمكن تعديله حاليًا.');
  }

  const createDecision = canCreateConnector(input);
  if (!createDecision.allowed) return createDecision;

  return {
    allowed: true,
    reason: 'يمكن تعديل العلاقة.',
  };
}

export const UNIFIED_RELATIONSHIP_TYPES = [
  'reference',
  'dependency',
  'responsibility',
  'financial',
  'temporal',
  'knowledge',
  'risk',
  'cause_effect',
  'ownership',
  'link',
  'conversion',
  'derived_from',
  // Legacy / product-specific aliases kept for backwards compatibility.
  'depends_on',
  'causes',
  'blocks',
  'references',
  'funds',
  'delivers',
  'belongs_to',
] as const;

export type UnifiedRelationshipType = (typeof UNIFIED_RELATIONSHIP_TYPES)[number];

export interface RelationshipTypeDisplay {
  label: string;
  description: string;
  dir: 'rtl';
}

export const RELATIONSHIP_TYPE_DISPLAY: Record<UnifiedRelationshipType, RelationshipTypeDisplay> = {
  reference: {
    label: 'مرجع',
    description: 'إشارة معلوماتية أو توثيقية دون أثر تشغيلي مباشر.',
    dir: 'rtl',
  },
  dependency: {
    label: 'اعتمادية',
    description: 'العنصر الهدف يعتمد على اكتمال أو توفر العنصر المصدر.',
    dir: 'rtl',
  },
  responsibility: {
    label: 'مسؤولية',
    description: 'إسناد مسؤولية أو دور بين عنصرين.',
    dir: 'rtl',
  },
  financial: {
    label: 'مالي',
    description: 'تمويل أو تكلفة أو أثر مالي مرتبط بالعلاقة.',
    dir: 'rtl',
  },
  temporal: {
    label: 'زمني',
    description: 'تسلسل أو موعد أو اعتماد زمني بين العناصر.',
    dir: 'rtl',
  },
  knowledge: {
    label: 'معرفي',
    description: 'نقل معرفة أو معلومة أو سياق معرفي.',
    dir: 'rtl',
  },
  risk: {
    label: 'مخاطر',
    description: 'مخاطرة أو مانع أو تهديد يؤثر على العنصر المرتبط.',
    dir: 'rtl',
  },
  cause_effect: {
    label: 'سبب ونتيجة',
    description: 'العنصر المصدر يسبب أو يؤثر في العنصر الهدف.',
    dir: 'rtl',
  },
  ownership: {
    label: 'ملكية',
    description: 'ملكية أو تبعية تنظيمية أو هيكلية.',
    dir: 'rtl',
  },
  link: {
    label: 'رابط',
    description: 'رابط عام بين عنصرين دون دلالة تشغيلية محددة.',
    dir: 'rtl',
  },
  conversion: {
    label: 'تحويل',
    description: 'تحويل من حالة أو صيغة أو عنصر إلى آخر.',
    dir: 'rtl',
  },
  derived_from: {
    label: 'مشتق من',
    description: 'العنصر مشتق أو مستنتج من عنصر آخر.',
    dir: 'rtl',
  },
  depends_on: {
    label: 'يعتمد على',
    description: 'نوع قديم لاعتمادية تشغيلية.',
    dir: 'rtl',
  },
  causes: {
    label: 'يسبب',
    description: 'نوع قديم لعلاقة سبب ونتيجة.',
    dir: 'rtl',
  },
  blocks: {
    label: 'يعطل',
    description: 'نوع قديم لعلاقة منع أو مخاطرة.',
    dir: 'rtl',
  },
  references: {
    label: 'يشير إلى',
    description: 'نوع قديم لعلاقة مرجعية.',
    dir: 'rtl',
  },
  funds: {
    label: 'يمول',
    description: 'نوع قديم لعلاقة مالية.',
    dir: 'rtl',
  },
  delivers: {
    label: 'يسلم',
    description: 'نوع قديم لعلاقة تسليم أو مسؤولية.',
    dir: 'rtl',
  },
  belongs_to: {
    label: 'ينتمي إلى',
    description: 'نوع قديم لعلاقة ملكية أو تبعية.',
    dir: 'rtl',
  },
};

export const OPERATIONAL_RELATIONSHIP_TYPES = [
  'dependency',
  'responsibility',
  'financial',
  'temporal',
  'risk',
  'cause_effect',
  'conversion',
  'depends_on',
  'blocks',
  'funds',
  'delivers',
] as const satisfies readonly UnifiedRelationshipType[];

export type OperationalRelationshipType = (typeof OPERATIONAL_RELATIONSHIP_TYPES)[number];

const UNIFIED_RELATIONSHIP_TYPE_SET = new Set<string>(UNIFIED_RELATIONSHIP_TYPES);
const OPERATIONAL_RELATIONSHIP_TYPE_SET = new Set<UnifiedRelationshipType>(OPERATIONAL_RELATIONSHIP_TYPES);

const LEGACY_RELATIONSHIP_MAP: Record<string, UnifiedRelationshipType> = {
  'depends-on': 'dependency',
  depends_on: 'depends_on',
  dependency: 'dependency',
  'relates-to': 'reference',
  'leads-to': 'cause_effect',
  cause_effect: 'cause_effect',
  contains: 'ownership',
  'derives-from': 'derived_from',
  derived_from: 'derived_from',
  supports: 'responsibility',
  blocks: 'blocks',
  references: 'references',
  reference: 'reference',
  funds: 'funds',
  financial: 'financial',
  delivers: 'delivers',
  belongs_to: 'belongs_to',
  ownership: 'ownership',
  responsibility: 'responsibility',
  temporal: 'temporal',
  knowledge: 'knowledge',
  risk: 'risk',
  link: 'link',
  conversion: 'conversion',
  causes: 'causes',
};

export function normalizeRelationshipType(value?: string | null): UnifiedRelationshipType | null {
  if (!value) return null;
  if (UNIFIED_RELATIONSHIP_TYPE_SET.has(value)) return value as UnifiedRelationshipType;
  return LEGACY_RELATIONSHIP_MAP[value] ?? null;
}

export function getRelationshipTypeDisplay(type?: string | null): RelationshipTypeDisplay {
  const normalizedType = normalizeRelationshipType(type);
  if (!normalizedType) return RELATIONSHIP_TYPE_DISPLAY.link;
  return RELATIONSHIP_TYPE_DISPLAY[normalizedType];
}

export function getRelationshipTypeLabel(type?: string | null): string {
  return getRelationshipTypeDisplay(type).label;
}

export function isOperationalRelationshipType(
  value?: string | null,
): value is OperationalRelationshipType {
  const normalizedType = normalizeRelationshipType(value);
  return Boolean(normalizedType && OPERATIONAL_RELATIONSHIP_TYPE_SET.has(normalizedType));
}

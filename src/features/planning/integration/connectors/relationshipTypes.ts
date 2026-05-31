export const UNIFIED_RELATIONSHIP_TYPES = [
  'depends_on',
  'causes',
  'blocks',
  'references',
  'funds',
  'delivers',
  'belongs_to',
] as const;

export type UnifiedRelationshipType = (typeof UNIFIED_RELATIONSHIP_TYPES)[number];

const LEGACY_RELATIONSHIP_MAP: Record<string, UnifiedRelationshipType> = {
  'depends-on': 'depends_on',
  'depends_on': 'depends_on',
  'relates-to': 'references',
  'leads-to': 'causes',
  contains: 'belongs_to',
  'derives-from': 'references',
  supports: 'delivers',
  blocks: 'blocks',
  references: 'references',
  funds: 'funds',
  delivers: 'delivers',
  belongs_to: 'belongs_to',
};

export function normalizeRelationshipType(value?: string | null): UnifiedRelationshipType {
  if (!value) return 'references';
  return LEGACY_RELATIONSHIP_MAP[value] ?? 'references';
}

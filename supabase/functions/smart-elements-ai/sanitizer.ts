export const REDACTED_AI_VALUE = '[REDACTED]';

export type ServerAIContextRole = 'guest' | 'viewer' | 'editor' | 'host';

export type ServerAIDataPermissions = {
  role: ServerAIContextRole;
  canViewFinancial: boolean;
  canViewLegal: boolean;
  canViewSensitive: boolean;
};

export type SanitizeSelectedElementsResult = {
  selectedElements: unknown[];
  permissions: ServerAIDataPermissions;
  redactionSummary: {
    financial: number;
    legal: number;
    sensitive: number;
  };
};

export const FINANCIAL_FIELD_PATTERNS = [
  /budget/i,
  /cost/i,
  /price/i,
  /salary/i,
  /payroll/i,
  /revenue/i,
  /profit/i,
  /invoice/i,
  /payment/i,
  /bank/i,
  /iban/i,
  /tax/i,
  /financial/i,
  /amount/i,
  /billing/i,
  /credit.?card/i,
  /card.?number/i,
  /تمويل/i,
  /ميزانية/i,
  /تكلفة/i,
  /سعر/i,
  /راتب/i,
  /فاتورة/i,
  /دفع/i,
];

export const LEGAL_FIELD_PATTERNS = [
  /legal/i,
  /contract/i,
  /clause/i,
  /nda/i,
  /liability/i,
  /lawsuit/i,
  /settlement/i,
  /compliance/i,
  /regulatory/i,
  /terms/i,
  /policy/i,
  /قانون/i,
  /عقد/i,
  /امتثال/i,
  /دعوى/i,
  /تسوية/i,
];

export const SENSITIVE_FIELD_PATTERNS = [
  /secret/i,
  /token/i,
  /password/i,
  /credential/i,
  /private/i,
  /confidential/i,
  /sensitive/i,
  /ssn/i,
  /national.?id/i,
  /passport/i,
  /phone/i,
  /email/i,
  /address/i,
  /سر/i,
  /سري/i,
  /حساس/i,
  /كلمة.?مرور/i,
  /هوية/i,
  /جواز/i,
];

const roleRank: Record<ServerAIContextRole, number> = {
  guest: 0,
  viewer: 1,
  editor: 2,
  host: 3,
};

export const normalizeServerAIRole = (role: unknown): ServerAIContextRole => {
  if (role === 'host' || role === 'editor' || role === 'viewer' || role === 'guest') return role;
  return 'guest';
};

const matchesAny = (key: string, patterns: RegExp[]): boolean => patterns.some((pattern) => pattern.test(key));

type FieldClassification = 'financial' | 'legal' | 'sensitive' | null;

const classifyField = (key: string): FieldClassification => {
  if (matchesAny(key, FINANCIAL_FIELD_PATTERNS)) return 'financial';
  if (matchesAny(key, LEGAL_FIELD_PATTERNS)) return 'legal';
  if (matchesAny(key, SENSITIVE_FIELD_PATTERNS)) return 'sensitive';
  return null;
};

const shouldRedactField = (classification: FieldClassification, permissions: ServerAIDataPermissions): boolean => {
  if (!classification) return false;

  if (classification === 'financial') {
    return !(permissions.canViewFinancial && roleRank[permissions.role] >= roleRank.editor);
  }

  if (classification === 'legal') {
    return !(permissions.canViewLegal && roleRank[permissions.role] >= roleRank.editor);
  }

  return permissions.canViewSensitive !== true;
};

const sanitizeValue = (
  value: unknown,
  permissions: ServerAIDataPermissions,
  redactionSummary: SanitizeSelectedElementsResult['redactionSummary'],
): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, permissions, redactionSummary));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, childValue]) => {
        const classification = classifyField(key);
        if (shouldRedactField(classification, permissions)) {
          if (classification) redactionSummary[classification] += 1;
          return [key, REDACTED_AI_VALUE];
        }

        return [key, sanitizeValue(childValue, permissions, redactionSummary)];
      }),
    );
  }

  return value;
};

export function sanitizeSelectedElementsForAI(
  _userId: string,
  selectedElements: unknown,
  context: { permissions: ServerAIDataPermissions },
): SanitizeSelectedElementsResult {
  const selectedElementsArray = Array.isArray(selectedElements) ? selectedElements : [];
  const permissions: ServerAIDataPermissions = {
    role: normalizeServerAIRole(context.permissions.role),
    canViewFinancial: context.permissions.canViewFinancial === true,
    canViewLegal: context.permissions.canViewLegal === true,
    canViewSensitive: context.permissions.canViewSensitive === true,
  };
  const redactionSummary = { financial: 0, legal: 0, sensitive: 0 };

  return {
    selectedElements: sanitizeValue(selectedElementsArray, permissions, redactionSummary) as unknown[],
    permissions,
    redactionSummary,
  };
}

import type { AIContextPermissions, AIContextRole, UnifiedAIContext } from './contextBuilder';

export const REDACTED_VALUE = '[REDACTED]';

const FINANCIAL_FIELD_PATTERNS = [
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

const LEGAL_FIELD_PATTERNS = [
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

const SENSITIVE_FIELD_PATTERNS = [
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

const roleRank: Record<AIContextRole, number> = {
  guest: 0,
  viewer: 1,
  editor: 2,
  host: 3,
};

const normalizeRole = (role: unknown): AIContextRole => {
  if (role === 'host' || role === 'editor' || role === 'viewer' || role === 'guest') return role;
  return 'guest';
};

const matchesAny = (key: string, patterns: RegExp[]): boolean => patterns.some((pattern) => pattern.test(key));

const shouldRedactField = (key: string, permissions: AIContextPermissions, role: AIContextRole): boolean => {
  if (role === 'host') return false;

  const canViewFinancial = permissions.canViewFinancial === true;
  const canViewLegal = permissions.canViewLegal === true;
  const canViewSensitive = permissions.canViewSensitive === true;

  if (matchesAny(key, FINANCIAL_FIELD_PATTERNS)) return !(canViewFinancial && roleRank[role] >= roleRank.editor);
  if (matchesAny(key, LEGAL_FIELD_PATTERNS)) return !(canViewLegal && roleRank[role] >= roleRank.editor);
  if (matchesAny(key, SENSITIVE_FIELD_PATTERNS)) return !canViewSensitive;

  return false;
};

const sanitizeValue = (value: unknown, permissions: AIContextPermissions, role: AIContextRole): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, permissions, role));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, childValue]) => [
        key,
        shouldRedactField(key, permissions, role)
          ? REDACTED_VALUE
          : sanitizeValue(childValue, permissions, role),
      ]),
    );
  }

  return value;
};

export function sanitizeAIContext<TContext extends UnifiedAIContext | Record<string, unknown>>(context: TContext): TContext {
  const permissions =
    context.permissions && typeof context.permissions === 'object'
      ? (context.permissions as AIContextPermissions)
      : {};
  const role = normalizeRole(permissions.role ?? context.role);

  return sanitizeValue(context, permissions, role) as TContext;
}

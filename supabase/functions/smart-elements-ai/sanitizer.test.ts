import { describe, expect, it } from 'vitest';
import { REDACTED_AI_VALUE, sanitizeSelectedElementsForAI, type ServerAIDataPermissions } from './sanitizer';

const selectedElements = [
  {
    id: 'element-1',
    title: 'Quarterly launch plan',
    budget: 125000,
    invoiceNumber: 'INV-42',
    contractTerms: 'Auto-renewal clause',
    privateNotes: 'CEO-only notes',
    data: {
      revenueProjection: 310000,
      legalOpinion: 'Counsel review required',
      email: 'person@example.test',
      publicSummary: 'Visible summary',
    },
  },
];

const sanitizeFor = (permissions: ServerAIDataPermissions) =>
  sanitizeSelectedElementsForAI('user-1', selectedElements, { permissions }).selectedElements[0] as Record<string, any>;

describe('sanitizeSelectedElementsForAI smoke checks', () => {
  it('redacts financial, legal, and sensitive fields for guest', () => {
    const element = sanitizeFor({
      role: 'guest',
      canViewFinancial: false,
      canViewLegal: false,
      canViewSensitive: false,
    });

    expect(element.title).toBe('Quarterly launch plan');
    expect(element.budget).toBe(REDACTED_AI_VALUE);
    expect(element.contractTerms).toBe(REDACTED_AI_VALUE);
    expect(element.privateNotes).toBe(REDACTED_AI_VALUE);
    expect(element.data.publicSummary).toBe('Visible summary');
  });

  it('redacts financial, legal, and sensitive fields for viewer even if broad flags are absent', () => {
    const element = sanitizeFor({
      role: 'viewer',
      canViewFinancial: false,
      canViewLegal: false,
      canViewSensitive: false,
    });

    expect(element.invoiceNumber).toBe(REDACTED_AI_VALUE);
    expect(element.data.legalOpinion).toBe(REDACTED_AI_VALUE);
    expect(element.data.email).toBe(REDACTED_AI_VALUE);
  });

  it('redacts financial fields for editor without canViewFinancial', () => {
    const element = sanitizeFor({
      role: 'editor',
      canViewFinancial: false,
      canViewLegal: true,
      canViewSensitive: false,
    });

    expect(element.budget).toBe(REDACTED_AI_VALUE);
    expect(element.data.revenueProjection).toBe(REDACTED_AI_VALUE);
    expect(element.contractTerms).toBe('Auto-renewal clause');
    expect(element.privateNotes).toBe(REDACTED_AI_VALUE);
  });

  it('allows financial fields for editor with canViewFinancial', () => {
    const element = sanitizeFor({
      role: 'editor',
      canViewFinancial: true,
      canViewLegal: false,
      canViewSensitive: false,
    });

    expect(element.budget).toBe(125000);
    expect(element.invoiceNumber).toBe('INV-42');
    expect(element.contractTerms).toBe(REDACTED_AI_VALUE);
    expect(element.privateNotes).toBe(REDACTED_AI_VALUE);
  });

  it('allows host financial/legal data but still requires explicit sensitive permission', () => {
    const element = sanitizeFor({
      role: 'host',
      canViewFinancial: true,
      canViewLegal: true,
      canViewSensitive: false,
    });

    expect(element.budget).toBe(125000);
    expect(element.contractTerms).toBe('Auto-renewal clause');
    expect(element.privateNotes).toBe(REDACTED_AI_VALUE);
    expect(element.data.email).toBe(REDACTED_AI_VALUE);
  });

  it('allows sensitive data only with explicit sensitive permission', () => {
    const element = sanitizeFor({
      role: 'host',
      canViewFinancial: true,
      canViewLegal: true,
      canViewSensitive: true,
    });

    expect(element.privateNotes).toBe('CEO-only notes');
    expect(element.data.email).toBe('person@example.test');
  });
});

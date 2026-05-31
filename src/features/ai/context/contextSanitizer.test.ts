import { describe, expect, it } from 'vitest';
import { REDACTED_VALUE, sanitizeAIContext } from './contextSanitizer';
import type { UnifiedAIContext } from './contextBuilder';

const buildContext = (role: 'guest' | 'viewer' | 'editor' | 'host', permissions = {}): UnifiedAIContext => ({
  boardId: 'board-1',
  selectedElements: [
    {
      id: 'element-1',
      title: 'Quarterly plan',
      budget: 100000,
      contractTerms: 'Termination clause',
      privateNotes: 'CEO-only note',
      data: {
        revenueProjection: 250000,
        legalOpinion: 'Needs counsel review',
        publicSummary: 'Visible summary',
      },
    },
  ],
  activeSection: 'planning',
  activeTab: 'ai',
  permissions: { role, ...permissions },
  availableLinks: [
    {
      label: 'Finance sheet',
      url: 'https://example.test/finance',
      invoiceUrl: 'https://example.test/invoice-1',
    },
  ],
  payrollAmount: 9000,
  legalMemo: 'Privileged memo',
  safeField: 'safe value',
});

describe('sanitizeAIContext', () => {
  it('redacts financial, legal, and sensitive fields for guests', () => {
    const sanitized = sanitizeAIContext(buildContext('guest'));

    expect(sanitized.safeField).toBe('safe value');
    expect(sanitized.payrollAmount).toBe(REDACTED_VALUE);
    expect(sanitized.legalMemo).toBe(REDACTED_VALUE);
    expect((sanitized.selectedElements[0] as Record<string, unknown>).budget).toBe(REDACTED_VALUE);
    expect((sanitized.selectedElements[0] as Record<string, unknown>).contractTerms).toBe(REDACTED_VALUE);
    expect((sanitized.selectedElements[0] as Record<string, unknown>).privateNotes).toBe(REDACTED_VALUE);
  });

  it('redacts financial and legal fields for viewers while preserving non-sensitive context', () => {
    const sanitized = sanitizeAIContext(buildContext('viewer'));
    const element = sanitized.selectedElements[0] as Record<string, any>;

    expect(sanitized.boardId).toBe('board-1');
    expect(element.title).toBe('Quarterly plan');
    expect(element.budget).toBe(REDACTED_VALUE);
    expect(element.contractTerms).toBe(REDACTED_VALUE);
    expect(element.data.publicSummary).toBe('Visible summary');
    expect(sanitized.availableLinks[0].invoiceUrl).toBe(REDACTED_VALUE);
  });

  it('allows editors with explicit permissions to keep financial and legal fields but still redacts sensitive fields', () => {
    const sanitized = sanitizeAIContext(
      buildContext('editor', { canViewFinancial: true, canViewLegal: true }),
    );
    const element = sanitized.selectedElements[0] as Record<string, any>;

    expect(element.budget).toBe(100000);
    expect(element.contractTerms).toBe('Termination clause');
    expect(element.data.revenueProjection).toBe(250000);
    expect(element.data.legalOpinion).toBe('Needs counsel review');
    expect(element.privateNotes).toBe(REDACTED_VALUE);
  });

  it('keeps financial, legal, and sensitive fields for hosts', () => {
    const sanitized = sanitizeAIContext(buildContext('host'));
    const element = sanitized.selectedElements[0] as Record<string, any>;

    expect(sanitized.payrollAmount).toBe(9000);
    expect(sanitized.legalMemo).toBe('Privileged memo');
    expect(element.budget).toBe(100000);
    expect(element.contractTerms).toBe('Termination clause');
    expect(element.privateNotes).toBe('CEO-only note');
  });
});

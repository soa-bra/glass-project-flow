import { describe, expect, it } from 'vitest';
import { synthesizeDashboardBoxData } from './synthesizeBoxes';

describe('synthesizeDashboardBoxData overview boxes', () => {
  it('fills overview summary, health, recent, and quick-action boxes with safe data props', () => {
    const boxData = synthesizeDashboardBoxData({
      dashboardKey: 'financial',
      noun: 'السجلات المالية',
      records: [
        {
          id: 'budget-1',
          primary: 'ميزانية الربع الأول',
          secondary: 'اعتماد مالي',
          trailing: 'active',
          tags: ['ميزانية', 'ربع سنوي'],
          detail: [
            { label: 'الحالة', value: 'active' },
            { label: 'القيمة', value: 120000 },
          ],
        },
      ],
    });

    expect(boxData['FinancialDashboard.overview.summary']['DAV-KPI-01']).toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining({ label: 'إجمالي السجلات المالية', value: 1 }),
        expect.objectContaining({ label: 'الأحدث', value: 'ميزانية الربع الأول' }),
      ]),
    });
    expect(boxData['FinancialDashboard.overview.summary']['DAV-TAG-01']).toMatchObject({
      tags: ['ميزانية', 'ربع سنوي'],
    });

    expect(boxData['FinancialDashboard.overview.health']['DAV-ALR-01']).toMatchObject({
      tone: 'info',
      title: 'الوضع مستقر',
    });
    expect(boxData['FinancialDashboard.overview.health']['DAV-DTL-01']).toMatchObject({
      rows: expect.arrayContaining([
        expect.objectContaining({ label: 'إجمالي', value: 1 }),
        expect.objectContaining({ label: 'الأحدث', value: 'ميزانية الربع الأول' }),
      ]),
    });

    expect(boxData['FinancialDashboard.overview.recent']['DAV-LST-01']).toMatchObject({
      items: [
        expect.objectContaining({
          id: 'budget-1',
          primary: 'ميزانية الربع الأول',
          secondary: 'اعتماد مالي',
          trailing: 'active',
        }),
      ],
    });

    expect(boxData['FinancialDashboard.overview.quick-actions']['ACT-BTN-01']).toMatchObject({
      children: 'إجراء أساسي',
      variant: 'primary',
    });
    expect(boxData['FinancialDashboard.overview.quick-actions']['ACT-MNU-01']).toMatchObject({
      items: expect.any(Array),
    });
  });
});

import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import BaseTaskCardLayout from './BaseTaskCardLayout';
import FeatureTaskCardHeader from './FeatureTaskCardHeader';
import FeatureTaskCardFooter from './FeatureTaskCardFooter';

const VIEWPORTS = [320, 375, 414, 768, 1024, 1366] as const;

const longTitle = 'عنوان مهمة طويل جدًا لاختبار مقاومة الكارد لأي تكدّس بصري أو تجاوز حدود الحاوية عند الشاشات الصغيرة جدًا والمتوسطة والكبيرة';
const longAssignee = 'المسؤول: المهندس التنفيذي الأول لإدارة التكاملات والبنية المؤسسية متعددة الفرق';
const longStatus = 'قيد التنفيذ مع مراجعات متعددة واعتمادات مرحلية وتحديثات يومية مرتبطة بالفرق العابرة للتخصصات';
const manyAttachments = '18 مرفقًا: BRD.pdf, UX-map.fig, sprint-plan.xlsx, contract-v4.docx, audit-notes.txt';
const SCENARIOS = [
  { name: 'عنوان طويل جدًا', title: longTitle, assignee: 'مدير مشروع', status: 'قيد التنفيذ', members: '3 أعضاء' },
  { name: 'اسم مسؤول طويل', title: 'مهمة قياسية', assignee: longAssignee, status: 'قيد التنفيذ', members: '3 أعضاء' },
  { name: 'مرفقات كثيرة', title: 'مهمة قياسية', assignee: 'مدير مشروع', status: 'قيد التنفيذ', members: manyAttachments },
  { name: 'حالة مهمة طويلة نصيًا', title: 'مهمة قياسية', assignee: 'مدير مشروع', status: longStatus, members: '3 أعضاء' },
] as const;

const hasOverflowProtection = (element: HTMLElement) => {
  const style = element.style;

  return (
    style.overflow === 'hidden' ||
    style.textOverflow === 'ellipsis' ||
    style.overflowWrap === 'anywhere' ||
    style.wordBreak === 'break-word'
  );
};

describe('TaskCard responsive stress snapshots', () => {
  afterEach(() => {
    cleanup();
  });

  it.each(VIEWPORTS.flatMap((width) => SCENARIOS.map((scenario) => ({ width, scenario }))))(
    'captures responsive snapshot at width $width px - $scenario.name',
    ({ width, scenario }) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    });

    const { container } = render(
      <div style={{ width: `${width}px`, padding: '8px' }}>
        <BaseTaskCardLayout id="stress-card">
          <FeatureTaskCardHeader
            daysLeft={7}
            title={scenario.title}
            description={scenario.members}
            priority="urgent-important"
          />
          <FeatureTaskCardFooter
            status={scenario.status}
            statusColor="#F59E0B"
            date="28/04/2026"
            assignee={scenario.assignee}
            members={scenario.members}
            taskId="stress-card"
          />
        </BaseTaskCardLayout>
      </div>
    );

    const snapshotMarkup = (container.firstChild as HTMLElement | null)?.outerHTML ?? '';

    expect(snapshotMarkup.length).toBeGreaterThan(0);
    expect(snapshotMarkup).toContain('data-overflow-guard=\"true\"');
    }
  );

  it('fails when overflow guards are missing in critical text nodes', () => {
    const { container } = render(
      <div style={{ width: '320px' }}>
        <BaseTaskCardLayout id="overflow-guard-card">
          <FeatureTaskCardHeader
            daysLeft={3}
            title={longTitle}
            description={manyAttachments}
            priority="urgent-important"
          />
          <FeatureTaskCardFooter
            status={longStatus}
            statusColor="#F59E0B"
            date="28/04/2026"
            assignee={longAssignee}
            members={manyAttachments}
            taskId="overflow-guard-card"
          />
        </BaseTaskCardLayout>
      </div>
    );

    const criticalNodes = Array.from(
      container.querySelectorAll<HTMLElement>('[data-overflow-guard="true"]')
    );

    expect(criticalNodes.length).toBeGreaterThan(0);
    for (const node of criticalNodes) {
      expect(hasOverflowProtection(node)).toBe(true);
    }
  });
});

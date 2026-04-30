import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import BaseTaskCardLayout from './BaseTaskCardLayout';
import FeatureTaskCardHeader from './FeatureTaskCardHeader';
import TaskCardStatusIndicators from './TaskCardStatusIndicators';

const VIEWPORTS = [320, 360, 390, 430, 768];

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
}

describe('Task card overflow guards', () => {
  VIEWPORTS.forEach((viewport) => {
    it(`keeps top section clipped at ${viewport}px (قص أعلى البطاقة)`, () => {
      setViewportWidth(viewport);

      const { container } = render(
        <BaseTaskCardLayout id={`task-${viewport}`}>
          <FeatureTaskCardHeader
            daysLeft={7}
            title={'عنوان طويل جداً '.repeat(8)}
            description={'وصف طويل جداً '.repeat(12)}
            priority="urgent-important"
          />
          <div>footer</div>
        </BaseTaskCardLayout>,
      );

      const card = container.querySelector('[data-task-card-id]') as HTMLDivElement;
      expect(card).toBeTruthy();
      expect(card.className).toContain('overflow-hidden');

      const sections = card.querySelectorAll(':scope > div');
      expect(sections[0].className).toContain('overflow-hidden');
      expect(sections[0].className).toContain('min-h-0');
    });

    it(`prevents title overlap with circles at ${viewport}px (تراكب عنوان مع الدوائر)`, () => {
      setViewportWidth(viewport);

      const { container } = render(
        <FeatureTaskCardHeader
          daysLeft={7}
          title={'عنوان طويل جداً '.repeat(8)}
          description={'وصف طويل جداً '.repeat(10)}
          priority="urgent-important"
        />,
      );

      const headerGrid = container.firstElementChild as HTMLDivElement;
      const innerHeaderGrid = headerGrid.firstElementChild as HTMLDivElement;
      expect(headerGrid.className).toContain('min-h-[96px]');
      expect(innerHeaderGrid.className).toContain('grid-cols-[minmax(44px,auto)_minmax(0,1fr)_minmax(44px,auto)]');

      const [leftCircleWrap, titleWrap, rightCircleWrap] = Array.from(innerHeaderGrid.children) as HTMLDivElement[];
      expect(leftCircleWrap.className).toContain('min-w-0');
      expect(rightCircleWrap.className).toContain('min-w-0');
      expect(titleWrap.className).toContain('overflow-hidden');
      expect(titleWrap.className).toContain('min-w-0');

      const circles = container.querySelectorAll('.rounded-full');
      circles.forEach((circle) => {
        expect(circle.className).toContain('shrink-0');
      });

      const title = screen.getByTitle(/عنوان طويل جداً/);
      expect(title.className).toContain('overflow-hidden');
      expect(title.className).toContain('line-clamp-2');
    });

    it(`clips bottom pills safely at ${viewport}px (قص pills في الأسفل)`, () => {
      setViewportWidth(viewport);

      const { container } = render(
        <BaseTaskCardLayout id={`task-footer-${viewport}`}>
          <div>header</div>
          <TaskCardStatusIndicators
            status={'قيد التنفيذ مع نص طويل للغاية للغاية'}
            statusColor="#00aa66"
            date={'2026-04-28 - موعد طويل'}
            assignee={'عضو فريق باسم طويل للغاية'}
            members={'+12 أعضاء فريق بمسمى طويل'}
            taskId="t-1"
          />
        </BaseTaskCardLayout>,
      );

      const card = container.querySelector('[data-task-card-id]') as HTMLDivElement;
      expect(card.className).toContain('overflow-hidden');

      const footerGrid = card.querySelector('.mt-2.grid.w-full') as HTMLDivElement;
      expect(footerGrid).toBeTruthy();

      const truncateSpans = footerGrid.querySelectorAll('span.min-w-0.truncate');
      expect(truncateSpans.length).toBeGreaterThanOrEqual(4);

      const pills = footerGrid.querySelectorAll(':scope > div');
      pills.forEach((pill) => {
        if (pill.className.includes('relative')) return;
        const style = (pill as HTMLElement).style;
        expect(style.minWidth).toBe('0px');
      });
    });
  });
});

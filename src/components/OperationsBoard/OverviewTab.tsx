import React from 'react';
import { TimelineWidget } from './Overview/TimelineWidget';
import { BudgetWidget } from './Overview/BudgetWidget';
import { HRWidget } from './Overview/HRWidget';
import { SatisfactionWidget } from './Overview/SatisfactionWidget';
import { ContractsWidget } from './Overview/ContractsWidget';
import { AISuggestedWidget } from './Overview/AISuggestedWidget';
import { InstantStatsRow } from './Overview/InstantStatsRow';
import { UpcomingTimelineCard } from './Overview/UpcomingTimelineCard';
import { ExtraWidgetOne } from './Overview/ExtraWidgetOne';
import { ExtraWidgetTwo } from './Overview/ExtraWidgetTwo';
import { ExtraWidgetThree } from './Overview/ExtraWidgetThree';
import { ExtraWidgetFour } from './Overview/ExtraWidgetFour';
import { ExtraWidgetFive } from './Overview/ExtraWidgetFive';

export const OverviewTab: React.FC<any> = () => {
  return (
    <div
      className="h-full overflow-auto px-6 pt-2 pb-7"
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: 'rtl',
      }}
    >
      {/* صف الإحصائيات العلوية */}
      <InstantStatsRow />
      {/* بطاقة الأحداث القادمة */}
      <UpcomingTimelineCard className="mb-8" />
      {/* شبكة 3x3 للبطاقات الرئيسية (أماكن الحشو فقط حالياً) */}
      <section
        className="
          grid grid-cols-1 md:grid-cols-3 gap-5 w-full pt-2
        "
      >
        <div className="col-span-1">
          <ExtraWidgetOne />
        </div>
        <div className="col-span-1">
          <ExtraWidgetTwo />
        </div>
        <div className="col-span-1">
          <ExtraWidgetThree />
        </div>
        <div className="col-span-1">
          <ExtraWidgetFour />
        </div>
        <div className="col-span-1">
          <ExtraWidgetFive />
        </div>
        <div className="col-span-1">
          {/* المقعد السادس - لم يُستخدم بعد */}
        </div>
        <div className="col-span-1">
          {/* المقعد السابع - لم يُستخدم بعد */}
        </div>
        <div className="col-span-1">
          {/* المقعد الثامن - لم يُستخدم بعد */}
        </div>
        <div className="col-span-1">
          {/* المقعد التاسع - لم يُستخدم بعد */}
        </div>
      </section>
    </div>
  );
};

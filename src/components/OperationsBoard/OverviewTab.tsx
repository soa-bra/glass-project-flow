
import React from "react";
import { TimelineWidget } from "./Overview/TimelineWidget";
import { InstantStatsRow } from "./Overview/InstantStatsRow";
import { UpcomingTimelineCard } from "./Overview/UpcomingTimelineCard";
import { LeadingStatsCard } from "./Overview/LeadingStatsCard";
import { DataStatCard } from "./Overview/DataStatCard";
import { ScoreCircleStatCard } from "./Overview/ScoreCircleStatCard";
import { ProjectSummaryCard } from "./Overview/ProjectSummaryCard";
import { EmptyCard } from "./Overview/EmptyCard";

export const OverviewTab: React.FC<any> = () => {
  return (
    <div
      className="h-full overflow-auto px-6 pt-2 pb-7"
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: "rtl",
      }}
    >
      {/* صف الإحصائيات العلوية */}
      <InstantStatsRow />
      {/* بطاقة الأحداث القادمة */}
      <UpcomingTimelineCard className="mb-7 mt-2" />
      {/* شبكة البطاقات الرئيسية */}
      <section
        className="
          grid grid-cols-1 md:grid-cols-7 gap-6 w-full pt-1
        "
        style={{ minHeight: "375px" }}
      >
        {/* عمود النظرة اللحظية */}
        <div className="col-span-2 row-span-2 h-full">
          <LeadingStatsCard
            value={92}
            label="النظرة اللحظية"
            circleData={[
              { value: 2, label: "مثال" },
              { value: 14, label: "مثال" },
              { value: 78, label: "مثال" },
            ]}
          />
        </div>
        {/* بيانات (يمين الأعلى) */}
        <div className="col-span-2 row-span-1 h-full">
          <DataStatCard title="بيانات" value={46} label="مثال" />
        </div>
        <div className="col-span-2 row-span-1 h-full">
          <DataStatCard title="بيانات" value={46} label="مثال" note="هذا النص مثال للشكل النهائي" renderBar />
        </div>
        <div className="col-span-1 row-span-1 h-full">
          <DataStatCard title="بيانات" value={17} label="مثال" note="هذا النص مثال للشكل النهائي" />
        </div>
        {/* بيانات أسفل الشمال */}
        <div className="col-span-2 row-span-1 h-full">
          <DataStatCard title="بيانات" value={3} label="مثال" renderLine />
        </div>
        {/* النسبة الدائرية */}
        <div className="col-span-2 row-span-1 h-full">
          <ScoreCircleStatCard value={75} note="هذا النص مثال للشكل النهائي" />
        </div>
        {/* تلخيص المشاريع */}
        <div className="col-span-3 row-span-2 h-full">
          <ProjectSummaryCard />
        </div>
        {/* بطاقة التنبيهات الفارغة */}
        <div className="col-span-4 row-span-2 h-full">
          <EmptyCard />
        </div>
      </section>
    </div>
  );
};

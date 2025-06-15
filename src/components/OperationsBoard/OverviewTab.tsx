
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
      className="h-full overflow-auto px-0 pt-4 pb-10"
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: "rtl",
        background: "#dde9ea", // مطابق لخلفية المرجع
        minHeight: "100vh",
        width: "100vw"
      }}
    >
      {/* صف الإحصائيات العلوية */}
      <div className="w-full max-w-[1400px] mx-auto">
        <InstantStatsRow />
      </div>
      {/* الأحداث القادمة */}
      <div className="w-full max-w-[1400px] mx-auto">
        <UpcomingTimelineCard className="mb-8" />
      </div>
      {/* شبكة البطاقات الرئيسية */}
      <section
        className="
          grid grid-cols-1 lg:grid-cols-7 gap-7 w-full max-w-[1400px] mx-auto
        "
        style={{ minHeight: "475px" }}
      >
        {/* النظرة اللحظية (يسار - أكبر) */}
        <div className="col-span-3 row-span-2 h-full">
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
        {/* بيانات الصف الأول */}
        <div className="col-span-2 row-span-1 h-full flex flex-col gap-6">
          <DataStatCard title="بيانات" value={46} label="مثال" note="هذا النص مثال للشكل النهائي" />
          <DataStatCard title="بيانات" value={3} label="مثال" note="هذا النص مثال للشكل النهائي" renderLine />
        </div>
        <div className="col-span-2 row-span-1 h-full flex flex-col gap-6">
          <DataStatCard title="بيانات" value={46} label="مثال" note="هذا النص مثال للشكل النهائي" renderBar />
          <DataStatCard title="بيانات" value={17} label="مثال" note="هذا النص مثال للشكل النهائي" renderBar />
        </div>
        {/* بيانات الصف الثاني */}
        <div className="col-span-2 row-span-1 h-full flex items-stretch">
          <ScoreCircleStatCard value={75} note="هذا النص مثال للشكل النهائي" />
        </div>
        {/* تلخيص المشاريع (أسفل) */}
        <div className="col-span-4 row-span-1 h-full">
          <ProjectSummaryCard />
        </div>
        {/* بطاقة التنبيهات الفارغة */}
        <div className="col-span-3 row-span-1 h-full">
          <EmptyCard />
        </div>
      </section>
    </div>
  );
};


import React from "react";
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
      className="h-full overflow-auto px-0 pt-5 pb-10"
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: "rtl",
        background: "#dde9ea",
        minHeight: "100vh",
        width: "100vw"
      }}
    >
      <div className="w-full max-w-[1450px] mx-auto flex flex-col gap-3">
        {/* صف البطاقات العلوية */}
        <InstantStatsRow />

        {/* الأحداث القادمة - بطاقة كبيرة بعرض كامل تقريباً */}
        <UpcomingTimelineCard className="mb-7" />

        {/* شبكة البطاقات الرئيسية 3x3 */}
        <div
          className="
              grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
              w-full pt-2 pb-4
            "
          style={{ minHeight: "530px" }}
        >
          {/* النظرة اللحظية (بالكبير، يسار أعلى) */}
          <div className="col-span-1 lg:col-span-1 row-span-2 h-full">
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
          {/* بيانات أساسية (بطاقتان يمين الأعلى) */}
          <div className="col-span-1 flex flex-col gap-7 h-full">
            <DataStatCard title="بيانات" value={46} label="مثال" note="هذا النص مثال للشكل النهائي" />
            <DataStatCard title="بيانات" value={3} label="مثال" note="هذا النص مثال للشكل النهائي" renderLine />
          </div>
          <div className="col-span-1 flex flex-col gap-7 h-full">
            <DataStatCard title="بيانات" value={46} label="مثال" note="هذا النص مثال للشكل النهائي" renderBar />
            <DataStatCard title="بيانات" value={17} label="مثال" note="هذا النص مثال للشكل النهائي" renderBar />
          </div>
          {/* نسبة دائرية + ملخص مشاريع */}
          <div className="col-span-1 flex items-stretch h-full lg:col-span-1">
            <ScoreCircleStatCard value={75} note="هذا النص مثال للشكل النهائي" />
          </div>
          <div className="col-span-2 h-full">
            <ProjectSummaryCard />
          </div>
          {/* بطاقة التنبيهات الفارغة */}
          <div className="col-span-1 h-full">
            <EmptyCard />
          </div>
        </div>
      </div>
    </div>
  );
};

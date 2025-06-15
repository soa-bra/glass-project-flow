
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// نوع بيانات وصف المايل ستون لكل مشروع
export interface Milestone {
  key: string;
  label?: string;
  percent: number; // نسبة الوصول (مثلاً: 25, 50, 75, 100)
}

// خصائص المكون
interface ProjectMilestonesProgressBarProps {
  progress: number; // القيمة بين 0-100
  milestones: Milestone[];
  stepsCount?: number; // كم شريط رأسي في الخط (افتراضي 100)
}

// ألوان مخصصة لـ SoaBra/المصابيح
const getStepColor = (percent: number) => {
  if (percent < 33) return "bg-gradient-to-t from-[#CBF9A7]/70 to-[#B5FF89]/40"; // أخضر فاتح
  if (percent < 60) return "bg-gradient-to-t from-[#81E8F7]/80 to-[#64B2FF]/70"; // أزرق
  if (percent < 90) return "bg-gradient-to-t from-[#F8A4C0]/70 to-[#F39EBB]/50"; // زهري-أحمر
  return "bg-gradient-to-t from-[#D3B7F9]/80 to-[#B388FF]/60"; // بنفسجي فاتح
};

export const ProjectMilestonesProgressBar: React.FC<ProjectMilestonesProgressBarProps> = ({
  progress,
  milestones,
  stepsCount = 120,
}) => {
  // توزيع الخطوط الصغيرة (المصابيح)
  const steps = Array.from({ length: stepsCount }).map((_, i) => {
    const percent = (i / (stepsCount - 1)) * 100;
    const isActive = progress >= percent;
    return {
      percent,
      isActive,
    };
  });

  // اتخاذ مواضع الدوائر لكل مايل ستون بناءً على أقرب خط
  const milestonePositions = milestones.map((m) => {
    // أي خطوة أقرب لنسبة المايل ستون
    const idx = Math.round((m.percent / 100) * (stepsCount - 1));
    return { ...m, idx };
  });

  return (
    <div
      className="relative w-full flex items-center py-3 select-none"
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        userSelect: "none",
      }}
    >
      {/* خط المصابيح */}
      <div className="relative flex-1 flex items-center">
        <div className="w-full flex flex-row items-center relative z-10">
          {steps.map((step, i) => {
            // هل يوجد مايل ستون بهذا المكان؟
            const isMilestone = milestonePositions.some((m) => m.idx === i);
            // إضاءة المصباح أو بقاءe عادي
            return (
              <div
                key={i}
                className={cn(
                  "transition-all duration-200",
                  "h-7 md:h-8",
                  isMilestone ? "mx-[1.2vw] md:mx-5" : "mx-0.5 md:mx-1",
                  "rounded-full",
                  step.isActive
                    ? `shadow-[0_0_8px_2px_rgba(60,175,255,0.12)] ${getStepColor(step.percent)}`
                    : "bg-gradient-to-t from-white/40 to-[#e2e2e2]/50"
                )}
                style={{
                  width: isMilestone ? "7px" : "3px",
                  opacity: isMilestone && !step.isActive ? 0.7 : 1,
                  filter: step.isActive ? "brightness(1.12) blur(0.5px)" : "blur(0.5px)",
                  border: step.isActive ? "1.5px solid rgba(255,255,255,0.80)" : "1.5px solid rgba(255,255,255,0.20)",
                  transition: "all 0.2s cubic-bezier(.4,0,.2,1)"
                }}
              />
            );
          })}
        </div>
        {/* دوائر المايل ستون */}
        {milestonePositions.map((m, i) => {
          // موضع الدائرة فوق الشريط
          const leftPercent = (m.idx / (stepsCount - 1)) * 100;
          const reached = progress >= m.percent - (100 / stepsCount); // هندسيًا مر مرور الخط
          return (
            <div
              key={m.key}
              className={cn(
                "absolute flex flex-col items-center z-30 top-1/2 -translate-y-1/2",
                "transition-all duration-300"
              )}
              style={{
                right: `calc(${leftPercent}% - 15px)`, // بسبب rtl و(عرض الدائرة 32px)
              }}
            >
              <div
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-full border",
                  reached
                    ? "bg-[#DDFDC5]/90 border-[#A2EB64]/70 shadow-[0_0_24px_5px_rgba(164,255,86,0.28)]"
                    : "bg-white/60 border-[#D7D8DC]/70 shadow-[0_0_6px_0_rgba(190,200,214,0.19)]",
                  "transition-all duration-200",
                  reached ? "scale-105" : "opacity-80"
                )}
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderWidth: 2.5,
                  fontSize: "1.25rem"
                }}
              >
                {reached ? (
                  <Check
                    size={22}
                    strokeWidth={2.3}
                    color="#51C000"
                    className="drop-shadow"
                  />
                ) : (
                  <span className="w-4 h-4 block rounded-full border bg-gray-200/70"></span>
                )}
              </div>
              {m.label && (
                <span
                  className="mt-0.5 text-xs text-gray-600 font-bold"
                  style={{
                    textShadow:
                      reached
                        ? "0 4px 12px rgba(164,255,86,0.10)"
                        : undefined,
                  }}
                >
                  {m.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectMilestonesProgressBar;

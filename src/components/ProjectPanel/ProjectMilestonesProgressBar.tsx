
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
  stepsCount?: number; // كم شريحة (افتراضي 100)
}

// تعريف ألوان الشرائح (متوافق مع التصميم والألوان المضافة للنظام)
const TICK_COLORS = [
  "bg-gradient-to-t from-[#CBF9A7]/70 to-[#B5FF89]/40",   // أخضر
  "bg-gradient-to-t from-[#81E8F7]/80 to-[#64B2FF]/70",   // أزرق
  "bg-gradient-to-t from-[#F8A4C0]/70 to-[#F39EBB]/50",   // وردي
  "bg-gradient-to-t from-[#D3B7F9]/80 to-[#B388FF]/60",   // بنفسجي
];

// دالة جلب لون بناءً على النسبة
function getStepColor(percent: number) {
  if (percent < 33) return TICK_COLORS[0];
  if (percent < 66) return TICK_COLORS[1];
  if (percent < 90) return TICK_COLORS[2];
  return TICK_COLORS[3];
}

export const ProjectMilestonesProgressBar: React.FC<ProjectMilestonesProgressBarProps> = ({
  progress,
  milestones,
  stepsCount = 64, // أفضل إخراج بصري متناسق
}) => {
  // الشرائح (مصابيح) حسب العدّ المطلوب
  const steps = Array.from({ length: stepsCount });

  // تحديد موضع كل مايل ستون بالنسبة للطول الكامل بشكل دقيق (px)
  const milestonePositions = milestones.map((m) => {
    const idx = Math.round((m.percent / 100) * (stepsCount - 1));
    return { ...m, idx };
  });

  return (
    <div
      className="relative w-full flex items-center px-0 py-3 select-none"
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        userSelect: "none",
      }}
    >
      {/* الخلفية الزجاجية - شريط كامل خلف المصابيح */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "rgba(255,255,255,0.40)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1.5px solid rgba(255,255,255,0.22)",
          zIndex: 0,
        }}
      ></div>
      {/* شريط الشرائح المرنة */}
      <div
        className="relative w-full flex items-center justify-between gap-0"
        style={{ zIndex: 1, minHeight: 32 }}
      >
        {/* الشرائح (مصابيح مضيئة، بنفس المستوى) */}
        {steps.map((_, i) => {
          const percent = (i / (stepsCount - 1)) * 100;
          const isActive = progress >= percent;
          const isMilestone = milestonePositions.some((m) => m.idx === i);

          return (
            <div
              key={i}
              className={cn(
                "transition-all duration-200 rounded-full flex-shrink-0",
                isMilestone
                  ? "mx-0" // المايل ستون تكون في المنتصف تمامًا، لا هوامش
                  : i === 0
                    ? "ml-0 mr-0.5 md:mr-1" // أول شريحة
                    : i === steps.length-1
                      ? "mr-0 ml-0.5 md:ml-1" // آخر شريحة
                      : "mx-0.5 md:mx-1",
                // Glass/Blur
                isActive
                  ? `${getStepColor(percent)} shadow-[0_0_10px_3px_rgba(120,210,255,0.11)]`
                  : "bg-gradient-to-t from-white/40 to-[#e2e2e2]/60"
              )}
              style={{
                width: isMilestone ? 10 : 4,
                height: 18,
                opacity: isMilestone && !isActive ? 0.6 : 1,
                filter: "brightness(1.00) blur(0.1px)",
                border: isActive ? "1.2px solid rgba(255,255,255,0.85)" : "1.2px solid rgba(255,255,255,0.18)",
                position: "relative",
                zIndex: isMilestone ? 6 : 2,
                transition: "all 0.21s cubic-bezier(.4,0,.2,1)",
                marginTop: 0, // متساوي دائماً
                marginBottom: 0,
              }}
            />
          );
        })}
        {/* دوائر المايل ستون محاذاة بدقة فوق الشرائح */}
        {milestonePositions.map((m, j) => {
          const left = (m.idx / (stepsCount - 1)) * 100;
          const reached = progress >= m.percent - (100 / stepsCount);

          return (
            <div
              key={m.key}
              style={{
                position: "absolute",
                right: `calc(${left}% - 16px)`, // + نصف دائرة (عرض الدائرة 32px)
                top: "-16px", // تساوي فوق الخط
                zIndex: 12,
                width: 32,
                height: 42,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full border shadow-md",
                  reached
                    ? "bg-[#DDFDC5]/90 border-[#A2EB64]/80"
                    : "bg-white/70 border-[#D7D8DC]/70",
                  "transition-all duration-200"
                )}
                style={{
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderWidth: 2,
                  fontSize: "1.20rem",
                  boxShadow: reached
                    ? "0 0 18px 4px rgba(164,255,86,0.18)"
                    : "0 0 4px 0 rgba(160,162,170,0.08)",
                  scale: reached ? "1.09" : "1",
                }}
              >
                {reached ? (
                  <Check size={20} strokeWidth={2.3} color="#51C000" className="drop-shadow" />
                ) : (
                  <span className="w-3 h-3 block rounded-full border bg-gray-200/70" />
                )}
              </div>
              {m.label && (
                <span
                  className="mt-1.5 text-xs font-bold text-gray-700 text-center"
                  dir="rtl"
                  style={{
                    textShadow: reached
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

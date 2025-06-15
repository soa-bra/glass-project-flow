
import React from "react";
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
  stepsCount?: number; // كم شريحة (افتراضي)
}

/**
 * دالة تولّد لك تدرج ألوان سلس بين مجموعة من ألوان، وتعيد لون كل خطوة بالترتيب الصحيح للطيف
 * points: مصفوفة فيها ترتيب النقاط {position: number, color: string}
 * الخطوة نفسها لونها color في الفورمات hex فقط
 */
function generateStripeColors(steps: number, gradientStops: { stop: number, color: string }[]) {
  // gradientStops مثال:
  // [
  //   {stop: 0, color: "#DBFB9A"},  // أخضر فاتح
  //   {stop: 0.33, color: "#77E8FF"}, // أزرق
  //   {stop: 0.51, color: "#F79597"}, // أحمر وردي
  //   {stop: 0.70, color: "#E5E6EF"}, // بنفسجي/رمادي
  //   {stop: 1, color: "#E5E6EF"}, // بنفسجي/رمادي
  // ]
  const result: string[] = [];
  for (let i = 0; i < steps; i++) {
    const pos = i / (steps - 1); // من 0 إلى 1
    // ابحث عن مقطع التدرج المناسب لهذه الخطوة
    const fromIdx = gradientStops.findIndex((g, idx) => pos < g.stop && idx > 0) - 1;
    if (fromIdx < 0) {
      result.push(gradientStops[0].color);
      continue;
    }
    const from = gradientStops[fromIdx], to = gradientStops[fromIdx + 1];
    const rel = (pos - from.stop) / (to.stop - from.stop);
    // interpolate كل لون (hex → rgb → interpolate → rgb → hex)
    const color = interpolateHex(from.color, to.color, rel);
    result.push(color);
  }
  return result;
}

// تحويل hex إلى rgb
function hexToRgb(hex: string) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((v) => v + v).join("");
  const n = parseInt(c, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// تحويل rgb إلى hex
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r,g,b].map(x=>x.toString(16).padStart(2, "0")).join("");
}

// تدرج خطي بين لونين
function interpolateHex(a: string, b: string, t: number) {
  const [r1,g1,b1] = hexToRgb(a), [r2,g2,b2] = hexToRgb(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b_ = Math.round(b1 + (b2 - b1) * t);
  return rgbToHex(r, g, b_);
}

export const ProjectMilestonesProgressBar: React.FC<ProjectMilestonesProgressBarProps> = ({
  progress,
  milestones,
  stepsCount = 96
}) => {
  // مصفوفة الشرائح (كل شريحة عمود صغير)
  const steps = Array.from({ length: stepsCount });
  // حدد توزيع المايل ستونز بالضبط مع الشرائح
  const milestonePositions = milestones.map((m) => {
    const idx = Math.round((m.percent / 100) * (stepsCount - 1));
    return { ...m, idx };
  });

  // توزيع الألوان: مطابق للصورة بدقة!
  const stripeColors = generateStripeColors(
    stepsCount,
    [
      { stop: 0, color: "#DBFB9A" },   // أخضر
      { stop: 0.24, color: "#A0EDA9" }, // أخضر مزرق
      { stop: 0.44, color: "#6DDFFD" }, // سماوي/أزرق
      { stop: 0.52, color: "#77B6FE" }, // أزرق (باب السماء 😅)
      { stop: 0.58, color: "#E9A3A9" }, // وردي-أحمر
      { stop: 0.69, color: "#E5E6EF" }, // بني-بنفسجي فاتح
      { stop: 1, color: "#E5E6EF" }     // نهاية بالبنفسجي/رمادي فاتح
    ]
  );

  // ريندر الشريط وكامل العناصر
  return (
    <div
      data-testid="milestones-bar"
      className="w-full"
      style={{
        position: "relative",
        minHeight: 56,
        margin: 0,
        padding: 0,
        fontFamily: "'IBM Plex Sans Arabic', Arial, Tahoma, sans-serif",
        userSelect: "none",
        direction: "rtl",
      }}
    >
      {/* شريط كامل عرض الشاشة ـ بدون بطاقة أو ظل */}
      <div
        style={{
          width: "100%",
          height: 44,
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* شرائح تدرج الألوان تحت الدوائر */}
        {steps.map((_, i) => {
          // كل شريحة لها لونها من التدرج
          const color = stripeColors[i];
          const percent = (i / (stepsCount - 1)) * 100;
          const isActive = progress >= percent;
          const isMilestone = milestonePositions.some((m) => m.idx === i);
          // الشريحة أعرض تحت الدائرة
          const specialWidth = isMilestone ? 5 : 2.1;
          return (
            <div
              key={i}
              style={{
                width: specialWidth,
                height: 34,
                borderRadius: 3.5,
                marginLeft: i === steps.length - 1 ? 0 : 1.9,
                marginRight: i === 0 ? 0 : 1.9,
                background: color,
                opacity: isActive
                  ? isMilestone ? 1 : 0.97
                  : isMilestone ? 0.42 : 0.42,
                boxShadow: isActive
                  ? "0 1px 4px 0 rgba(120,210,255,0.10)"
                  : "none",
                filter: "blur(0.06px)",
                transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
                border: "none",
                position: "relative",
                zIndex: isMilestone ? 3 : 2,
                display: "inline-block",
                pointerEvents: "none",
              }}
            />
          );
        })}

        {/* دوائر المايل ستون - زجاجية فوق الشريط بالضبط */}
        {milestonePositions.map((m, j) => {
          const left = (m.idx / (stepsCount - 1)) * 100;
          const reached = progress >= m.percent - 99 / stepsCount;
          return (
            <div
              key={m.key}
              style={{
                position: "absolute",
                right: `calc(${left}% - 23px)`, // + نصف دائرة (عرض الدائرة ~46px)
                top: "-10px",
                width: 46,
                height: 56,
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pointerEvents: "none"
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  background: reached
                    ? "rgba(211,255,172,0.80)"
                    : "rgba(239,241,249,0.71)",
                  borderRadius: "50%",
                  border: reached
                    ? "2.2px solid #B3EF77"
                    : "2.3px solid #E2E3E9",
                  boxShadow: reached
                    ? "0 0 0 7px rgba(140,233,85,0.13)"
                    : "0 0 0 4px rgba(215,220,218,0.045)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 2,
                  marginTop: 0,
                  transition: "all 0.18s cubic-bezier(.36,0,.3,1)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  position: "relative",
                }}
              >
                {reached ? (
                  <Check size={26} strokeWidth={2.2} color="#72C000" className="drop-shadow" />
                ) : (
                  <span
                    style={{
                      display: "block",
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      background: "rgba(236,238,244,0.73)",
                      border: "1.3px solid #DDDDFF",
                    }}
                  />
                )}
              </div>
              {m.label && (
                <span
                  className="font-bold text-gray-600"
                  dir="rtl"
                  style={{
                    fontSize: 15.5,
                    marginTop: 0,
                    textAlign: "center",
                    width: 70,
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                    textShadow: reached
                      ? "0 2.7px 7px rgba(164,255,86,0.10)"
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

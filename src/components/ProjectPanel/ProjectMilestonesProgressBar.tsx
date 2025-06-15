
import React from "react";
import { Check } from "lucide-react";

// نوع بيانات وصف المايل ستون لكل مشروع
export interface Milestone {
  key: string;
  label?: string;
  percent: number; // نسبة الوصول (مثلاً: 25, 50, 75, 100)
}

interface ProjectMilestonesProgressBarProps {
  progress: number; // القيمة بين 0-100
  milestones: Milestone[];
  stepsCount?: number; // غير مستخدم الآن
}

const GRADIENT =
  "linear-gradient(90deg, #DBFB9A 0%, #A0EDA9 24%, #6DDFFD 44%, #77B6FE 52%, #E9A3A9 58%, #E5E6EF 69%, #E5E6EF 100%)";

const FONT = "'IBM Plex Sans Arabic', Arial, Tahoma, sans-serif";

// تأثير glass وكذلك الخط - قابل للتعديل بسهوله حسب التصميم
function glassShadow(enabled: boolean) {
  return enabled
    ? "0 2px 24px 0 rgba(140,255,143,0.07)"
    : "0 2px 14px 0 rgba(163,163,208,0.05)";
}

export const ProjectMilestonesProgressBar: React.FC<ProjectMilestonesProgressBarProps> = ({
  progress,
  milestones,
}) => {
  // ترتيب الـ milestones بحسب النسبة، وتعيين موضعها على الشريط
  // 固定 المعايير: bar height 22px, bar radius 18px, دائرة milestone 38px
  const BAR_HEIGHT = 22;
  const BAR_RADIUS = 18;
  const CIRCLE_SIZE = 38;
  const TOP_OFFSET = 18; // كم تبعد الدوائر عن أعلى العنصر (لضبط تراكب الدوائر على البار)

  // يتحكّم في الزجاجية والتناسق بين البار والدوائر
  // استخدم الخط/الزجاج/الـ RTL كما طلبت

  // المايل ستونز: رتّبهم تصاعدياً بالنسب
  const milestonesSorted = [...milestones].sort((a, b) => a.percent - b.percent);
  // موضع كل دائرة على البار: (m.percent%) في الاتجاه الصحيح (يمين لليسار)
  // المسافة من اليمين: left = (100 - percent)%
  // سنستخدم position: absolute

  // يجب التأكد أن أول milestone دائماً عند 0%، وآخرها عند 100%
  // -------- UI رسمة البار متكونة من: ------ 
  // - مستطيل خلفية متدرج
  // - طبقة فوقه لتعبئة progress (زجاجية شفاف)
  // - دوائر milestones فوق الشريط 
  // - أرقام / علامات الوصول / عناوين milestones

  return (
    <div
      dir="rtl"
      style={{
        position: "relative",
        fontFamily: FONT,
        width: "100%",
        minHeight: CIRCLE_SIZE + TOP_OFFSET + 2,
        padding: 0,
        margin: 0,
        userSelect: "none",
        direction: "rtl",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: BAR_HEIGHT,
          background: GRADIENT,
          borderRadius: BAR_RADIUS,
          overflow: "hidden",
          boxShadow: glassShadow(false),
          marginTop: CIRCLE_SIZE / 2,
        }}
      >
        {/* طبقة progress glass فوق البار */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: BAR_HEIGHT,
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.37) 0%, rgba(255,255,255,0.15) 68%, rgba(255,255,255,0) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: BAR_RADIUS,
            borderTopRightRadius: BAR_RADIUS,
            borderBottomRightRadius: BAR_RADIUS,
            boxShadow: glassShadow(true),
            zIndex: 2,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: "none",
          }}
        ></div>
        {/* شريط خلفي لتكملة الزوايا وتناسق الحواف */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: BAR_RADIUS,
            border: "1.2px solid rgba(255,255,255,0.33)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </div>
      {/* دوائر milestones فوق الشريط */}
      {milestonesSorted.map((m, idx) => {
        // احسب موضع الدائرة على الحافة اليمنى (RTL)
        const isFirst = idx === 0;
        const isLast = idx === milestonesSorted.length - 1;
        // موقع الدائرة كنسبة مئوية
        const circleRight =
          isLast
            ? `0%`
            : isFirst
            ? `calc(100% - ${CIRCLE_SIZE / 2}px)`
            : `calc(${100 - m.percent}% - ${CIRCLE_SIZE / 2}px)`;
        // تحقق هل تم تجاوز الـ milestone أم لا
        const reached = progress >= m.percent - 1.8; // حتى 1.8% قبل الميلستون لاعتبارات الدقة
        // شكل علامة الإنجاز أو الرقم
        return (
          <div
            key={m.key}
            style={{
              position: "absolute",
              top: 0,
              right: circleRight,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              transform: "translateY(0%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: reached ? 30 : 22,
              pointerEvents: "none",
            }}
          >
            {/* دائرة زجاجية ملونة مع حافة */}
            <div
              style={{
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                borderRadius: "50%",
                background: reached
                  ? "rgba(211,255,172,0.93)"
                  : "rgba(239,241,249,0.91)",
                border: reached
                  ? "2.7px solid #B2ED73"
                  : "2.4px solid #E2E3E9",
                boxShadow: reached
                  ? "0 0 12px 7px rgba(164,255,86,0.08)"
                  : "0 0 6px 3.5px rgba(201,204,220,0.04)",
                backdropFilter: "blur(11px)",
                WebkitBackdropFilter: "blur(11px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.18s cubic-bezier(.36,0,.3,1)",
                marginBottom: 0,
                marginTop: -TOP_OFFSET,
                position: "relative",
              }}
            >
              {reached ? (
                <Check
                  size={22}
                  strokeWidth={2.5}
                  color="#69AB38"
                  style={{
                    boxShadow:
                      "0 2.7px 14px 0 rgba(137, 220, 40, 0.07)",
                  }}
                  className="drop-shadow"
                />
              ) : (
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#C9CFD4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {idx + 1}
                </span>
              )}
            </div>
            {/* تسمية milestone تحت الدائرة */}
            {m.label && (
              <span
                className="font-bold text-gray-600"
                dir="rtl"
                style={{
                  fontFamily: FONT,
                  fontSize: 15.5,
                  marginTop: 3,
                  textAlign: "center",
                  width: 85,
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                  background: "rgba(255,255,255,0.68)",
                  borderRadius: 6,
                  padding: "3.6px 7.5px",
                  boxShadow: reached
                    ? "0 2.7px 7px rgba(164,255,86,0.055)"
                    : undefined,
                  backdropFilter: "blur(9px)",
                  border: "0.5px solid #EBEDD5",
                  WebkitBackdropFilter: "blur(9px)",
                  fontWeight: reached ? 800 : 700,
                  transition: "all 0.18s cubic-bezier(.36,0,.3,1)",
                }}
              >
                {m.label}
              </span>
            )}
          </div>
        );
      })}
      {/* مؤشر progress متداخل أعلى الشريط (دبوس صغير أو خط علوي زجاجي) */}
      <div
        style={{
          position: "absolute",
          top: CIRCLE_SIZE / 2 + BAR_HEIGHT / 2 - 13,
          right: `calc(${100 - Math.min(progress, 100)}% - 7px)`,
          width: 15,
          height: 26,
          borderRadius: 6,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.41) 88%)",
          boxShadow:
            "0 10px 25px rgba(164,255,86,0.05), 0 1.5px 8px 2px rgba(90,235,250,0.12)",
          border: "1.2px solid rgba(195,220,240,0.23)",
          pointerEvents: "none",
          zIndex: 31,
          transform: "translateY(-50%)",
          display: progress < 4 ? "none" : undefined,
        }}
      />
    </div>
  );
};

export default ProjectMilestonesProgressBar;

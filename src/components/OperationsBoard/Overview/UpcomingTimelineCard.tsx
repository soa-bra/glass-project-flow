
import React from "react";

// نفس البيانات
const events = [
  {
    id: 1,
    day: "07",
    month: "Jun",
    title: "حفل الترحيب بالموظفين الجدد",
    dept: "داخلي",
  },
  {
    id: 2,
    day: "02",
    month: "Jun",
    title: "المقابلات الوظيفية",
    dept: "داخلي",
  },
  {
    id: 3,
    day: "25",
    month: "May",
    title: "اجتماع لمناقشة الشراكة الوقفية",
    dept: "جامعة الملك سعود",
  },
  {
    id: 4,
    day: "20",
    month: "May",
    title: "تسليم النماذج الأولية",
    dept: "الخليج للتدريب",
  },
  {
    id: 5,
    day: "16",
    month: "May",
    title: "محاضرة العلامة من منظور الجماعة",
    dept: "مسك الخيرية",
  },
  {
    id: 6,
    day: "12",
    month: "May",
    title: "الإجتماع النصف سنوي للمراجعة الليلية",
    dept: "داخلي",
  },
];

// القياسات الأصلية والفعلية
const originalCardHeight = 104.2626;
const currentCardHeight = 272;
const scale = currentCardHeight / originalCardHeight; // تقريبًا 2.6

// القياسات بعد التناسب
const sizes = {
  cardTitle: 10.63 * scale, // عنوان البطاقة
  day: 15 * scale, // اليوم
  month: 3.5 * scale, // الشهر
  title: 3.5 * scale, // وصف مختصر للحدث
  location: 5.5 * scale, // الجهة
  circle: 18.76 * scale, // قطر الدائرة = 48.78 تقريبًا
  vertLineWidth: 0.18 * 1.333 * scale, // إعطاء سماكة متناسقة بالشاشات العريضة (pt -> px)
  vertLineLength: (18.76 * scale) / 2, // الخط الطولي من الأعلى حتى منتصف الدائرة
  horizLineHeight: 0.18 * 1.333 * scale, // نفس سماكة الخط الأفقي
};

export const UpcomingTimelineCard = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative w-full h-[272px] bg-[#e9f8fa] rounded-[41px] p-0 flex flex-col justify-end overflow-visible border-0 font-arabic ${className}`}
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      direction: "rtl",
      background: "rgba(233, 248, 250, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "41px",
      boxShadow: "none",
    }}
  >
    {/* العنوان */}
    <div className="absolute top-0 right-0 px-14 pt-7 pb-0 flex items-center z-20 select-none">
      <span
        className="font-arabic"
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          fontWeight: 500,
          fontSize: `${sizes.cardTitle}px`,
          color: "#181b29",
          letterSpacing: 0,
        }}
      >
        الأحداث القادمة
      </span>
    </div>
    {/* الخط الأفقي الموحد (مقطوع عند الدوائر) */}
    <div
      className="absolute left-0 right-0 bottom-[37px] z-0 flex flex-row-reverse items-center"
      style={{
        width: "100%",
        height: `${sizes.horizLineHeight}px`,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* لكل دائرة، نرسم جزء من الخط بين كل دائرتين فقط */}
      {Array.from({ length: events.length - 1 }).map((_, idx) => {
        const gaps = 100 / (events.length - 1);
        return (
          <div
            key={idx}
            style={{
              height: `${sizes.horizLineHeight}px`,
              background: "#181b29",
              opacity: 0.78,
              // النسبة بين كل دائرتين
              width: `calc(${gaps}% - ${sizes.circle / 2}px)`,
              marginLeft: `${sizes.circle / 2}px`,
              marginRight: idx === 0 ? `${sizes.circle / 2}px` : 0,
            }}
          />
        );
      })}
    </div>
    {/* الخط الزمني وأحداثه */}
    <div
      className="flex flex-row-reverse justify-between items-end w-full h-full pb-0 pt-20 pr-[50px] pl-[35px] relative z-10"
      style={{
        minHeight: "215px",
        gap: 0,
      }}
    >
      {events.map((event, i) => (
        <div
          key={event.id}
          className="flex flex-col items-center min-w-0 flex-1 px-1"
          style={{
            alignSelf: "flex-end",
            zIndex: 2,
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
            height: "100%",
            position: "relative"
          }}
        >
          {/* معلومات الحدث فوق الدائرة */}
          <div
            className="flex flex-col items-end mb-3"
            style={{
              width: "100%",
              maxWidth: "176px",
              textAlign: "right",
              direction: "rtl",
              minHeight: `${sizes.circle * 2.3}px`
            }}
          >
            {/* اليوم والشهر*/}
            <div
              className="flex flex-row-reverse items-end gap-1 w-full"
              style={{
                marginBottom: "0.15em",
                marginTop: 0,
                alignItems: "flex-end"
              }}
            >
              <span
                style={{
                  fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                  fontWeight: 700,
                  fontSize: `${sizes.day}px`,
                  color: "#181b29",
                  lineHeight: 1,
                  marginRight: "2px",
                  letterSpacing: 0,
                }}
              >
                {event.day}
              </span>
              <span
                style={{
                  fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                  fontWeight: 400,
                  fontSize: `${sizes.month}px`,
                  color: "#181b29",
                  lineHeight: 1.1,
                  marginBottom: "5px",
                  letterSpacing: 0,
                }}
              >
                {event.month}
              </span>
            </div>
            {/* التعريف القصير */}
            <div
              style={{
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                fontWeight: 400,
                fontSize: `${sizes.title}px`,
                color: "#111",
                margin: ".2em 0 .3em 0",
                lineHeight: 1.3,
                textAlign: "right",
                whiteSpace: "normal",
                width: "100%",
                maxWidth: "172px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {event.title}
            </div>
            {/* السطر الثالث فارغ */}
            <div style={{ height: `${sizes.title * .4}px` }} />
            {/* الجهة أو المكان */}
            <div
              style={{
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                fontWeight: 600,
                fontSize: `${sizes.location}px`,
                color: "#181b29",
                margin: ".1em 0 0 0",
                textAlign: "right",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {event.dept}
            </div>
          </div>
          {/* الدائرة بالخط الطولي فقط (بدون تغطية الخط الأفقي) */}
          <div className="relative flex flex-col items-center" style={{ width: `${sizes.circle}px` }}>
            {/* الخط الطولي من الأعلى حتى منتصف الدائرة */}
            <div
              style={{
                width: `${sizes.vertLineWidth}px`,
                height: `${sizes.vertLineLength}px`,
                background: "#181b29",
                opacity: 0.74,
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 2,
              }}
            />
            {/* الدائرة نفسها */}
            <div
              style={{
                width: `${sizes.circle}px`,
                height: `${sizes.circle}px`,
                borderRadius: "50%",
                border: `${sizes.vertLineWidth * 2}px solid #181b29`,
                background: "#e9f8fa",
                zIndex: 3,
                boxSizing: "border-box",
                position: "relative",
                backgroundClip: "padding-box",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UpcomingTimelineCard;



import React from "react";

const CARD_ORIG_W = 514.0982;
const CARD_ORIG_H = 104.2626;
const CARD_TARGET_W = 620; // تقريبًا، يفضل التعديل لو كان القياس الفعلي مختلف
const CARD_TARGET_H = 131; // ارتفاع البطاقة تقريبًا في التطبيق
const SCALE = CARD_TARGET_W / CARD_ORIG_W; // النسبة للتكبير وهي ~1.206 أو 1.21

// تحويل القياس الأصلي إلى النسبي
function scale(val: number) {
  return val * SCALE;
}

// البيانات كما هي
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
    title: "اجتماع مناقشة الشراكة الوقفية",
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

export const UpcomingTimelineCard = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative w-full h-[${Math.round(CARD_TARGET_H)}px] rounded-[${scale(24)}px] flex flex-col justify-end overflow-visible border-0 font-arabic ${className}`}
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      direction: "rtl",
      background: "rgba(233, 248, 250, 0.92)",
      backdropFilter: "blur(20px)",
      borderRadius: `${scale(24)}px`,
      boxShadow: "none",
      padding: 0,
      minHeight: `${CARD_TARGET_H}px`,
      maxHeight: `${CARD_TARGET_H}px`,
    }}
  >
    {/* عنوان البطاقة */}
    <div
      className="absolute top-0 right-0 z-20 select-none"
      style={{
        paddingRight: scale(24),
        paddingTop: scale(10),
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      }}
    >
      <span
        style={{
          fontSize: `${scale(10.63)}px`, // العنوان
          fontWeight: 500,
          letterSpacing: 0,
          color: "#181b29",
          lineHeight: 1.2,
        }}
      >
        الأحداث القادمة
      </span>
    </div>
    {/* الخط الزمني */}
    <div
      className="flex flex-row-reverse justify-between items-end w-full h-full relative z-10 select-text"
      style={{
        minHeight: scale(86),
        paddingRight: scale(24),
        paddingLeft: scale(14),
        paddingTop: scale(28),
        paddingBottom: scale(8),
        gap: 0,
      }}
    >
      {/* عناصر الأحداث */}
      {events.map((event, idx) => (
        <div
          key={event.id}
          className="flex flex-col items-end min-w-0 max-w-[120px] flex-1 px-0"
          style={{
            alignSelf: "flex-end",
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
            textAlign: "right",
            zIndex: 20,
          }}
        >
          {/* التاريخ */}
          <div
            className="flex flex-row-reverse items-end mb-0 w-full pb-0"
            style={{
              marginBottom: scale(-2),
              paddingRight: scale(1),
              width: "100%",
            }}
          >
            {/* اليوم */}
            <span
              style={{
                fontFamily: '"IBM Plex Sans", Arial, Tahoma, sans-serif',
                fontSize: `${scale(15)}px`, // اليوم
                fontWeight: 400,
                color: "#181b29",
                lineHeight: 1,
                marginLeft: scale(5),
                verticalAlign: "bottom",
                paddingTop: 0,
              }}
            >
              {event.day}
            </span>
            {/* الشهر */}
            <span
              style={{
                fontFamily: '"IBM Plex Sans", Arial, Tahoma, sans-serif',
                fontSize: `${scale(3.5)}px`, // الشهر 3.5 * النسبة
                fontWeight: 700,
                color: "#181b29",
                letterSpacing: 0.3,
                marginBottom: scale(1), // slight offset
                verticalAlign: "bottom",
                marginRight: scale(2),
              }}
            >
              {event.month}
            </span>
          </div>
          {/* سطر تعريف الحدث */}
          <div
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              fontSize: `${scale(3.5)}px`, // ٣٫٥ بكسل
              fontWeight: 400,
              textAlign: "right",
              color: "#111",
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: scale(85),
              marginTop: scale(2.2),
            }}
          >
            {event.title}
          </div>
          {/* سطر فارغ */}
          <div style={{ height: scale(3.5), minHeight: scale(3), maxHeight: scale(6) }} />
          {/* جهة الحدث */}
          <div
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              fontSize: `${scale(5.5)}px`,
              fontWeight: 500,
              color: "#181b29",
              textAlign: "right",
              marginBottom: 0,
              marginTop: scale(2.7),
              maxWidth: scale(85),
            }}
          >
            {event.dept}
          </div>
          {/* خط رأسي يصل الدائرة */}
          <div
            style={{
              width: `${scale(0.24)}px`,
              background: "#181b29",
              height: scale(24),
              margin: `${scale(1)}px 0 0 0`,
              alignSelf: "center",
              opacity: 0.93,
            }}
          />
          {/* الدائرة السفلية الكبيرة */}
          <div
            style={{
              width: scale(18.76),
              height: scale(18.76),
              borderRadius: "50%",
              border: `${scale(0.18)}px solid #181b29`,
              background: "rgba(255,255,255,0.5)",
              margin: "0 auto",
              marginTop: scale(-0.5),
            }}
          />
        </div>
      ))}
    </div>
    {/* الخط الأفقي أسفل الدوائر */}
    <div
      className="absolute left-0 right-0"
      style={{
        bottom: scale(10),
        background: "#181b29",
        opacity: 0.85,
        zIndex: 1,
        width: "100%",
        margin: "0 auto",
        height: `${scale(0.24)}px`,
      }}
    />
  </div>
);

export default UpcomingTimelineCard;


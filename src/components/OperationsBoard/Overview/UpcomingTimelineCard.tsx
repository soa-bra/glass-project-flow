
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

// ----- حساب القياسات بناءً على زوم الصورة المرفقة -------
// نفترض ارتفاع البطاقة = 272px (بناءً على الصورة والسابق),
// نحسب كل عنصر من الحد السفلي بالترتيب:

// القياسات النسبية من الحد السفلي للصورة (تقريبية من المشاهدة الدقيقة)
// (من أسفل البطاقة إلى العنصر المذكور:)
const BOTTOM_MARGIN = 36;           // المسافة من أسفل البطاقة إلى center الدائرة
const CIRCLE_RADIUS = 32;           // نصف قطر الدائرة = 32 => القطر 64px (مطابق تقريبًا)
const HORIZ_LINE_HEIGHT = 1.2;      // سماكة الخط الأفقي
const VERT_LINE_LENGTH = 56;        // طول الخط الرأسي من مركز الدائرة لفوق
const VERT_LINE_WIDTH = 1.1;
const GAP_CIRCLE_TO_TITLE = 20;     // من أعلى الدائرة إلى بداية "الجهة"
const DEPT_FONT_SIZE = 26;          // حجم خط الجهة
const DEPT_TO_DESC = 10;            // المسافة من "الجهة" إلى بداية الوصف
const DESC_FONT_SIZE = 15.5;        // حجم خط الوصف
const DESC_TO_DATE = 14;            // من نهاية الوصف لبداية اليوم/الشهر
const DATE_FONT_SIZE = 38;          // اليوم (كبير)
const MONTH_FONT_SIZE = 13;         // الشهر (صغير)
const TITLE_FONT_SIZE = 20;         // عنوان الكارد


const CARD_BG = "rgba(233, 248, 250, 1)";

export const UpcomingTimelineCard = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`relative w-full h-[272px] rounded-[41px] p-0 flex flex-col justify-start overflow-visible border-0 font-arabic ${className}`}
      style={{
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: "rtl",
        background: CARD_BG,
        backdropFilter: "blur(20px)",
        borderRadius: "41px",
        boxShadow: "none",
      }}
    >
      {/* العنوان في الزاوية العليا اليمنى */}
      <div
        className="absolute top-0 right-0 px-14 pt-7 pb-0 flex items-center z-20 select-none"
        style={{}}
      >
        <span
          className="font-arabic"
          style={{
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
            fontWeight: 700,
            fontSize: `${TITLE_FONT_SIZE * 2.1}px`,
            color: "#181b29",
            letterSpacing: 0,
          }}
        >
          الأحداث القادمة
        </span>
      </div>

      {/* الخط الأفقي الموحد أسفل الدوائر */}
      <div
        className="absolute left-0 right-0 bottom-[36px] z-0 flex flex-row-reverse items-center pointer-events-none"
        style={{
          width: "100%",
          height: `${HORIZ_LINE_HEIGHT}px`,
        }}
      >
        {Array.from({ length: events.length - 1 }).map((_, idx) => {
          const gaps = 100 / (events.length - 1);
          return (
            <div
              key={idx}
              style={{
                height: `${HORIZ_LINE_HEIGHT}px`,
                background: "#181b29",
                opacity: 0.7,
                width: `calc(${gaps}% - ${CIRCLE_RADIUS}px)`,
                marginLeft: `${CIRCLE_RADIUS}px`,
                marginRight: idx === 0 ? `${CIRCLE_RADIUS}px` : 0,
              }}
            />
          );
        })}
      </div>

      {/* عناصر الحدث */}
      <div
        className="absolute left-0 right-0 bottom-0 flex flex-row-reverse justify-between items-end z-10"
        style={{
          height: `calc(100% - 32px)`, // منح مساحة للعنوان في الأعلى
          paddingRight: "54px",
          paddingLeft: "32px",
        }}
      >
        {events.map((event, i) => (
          <div
            key={event.id}
            className="relative flex flex-col items-center min-w-0 flex-1 px-1"
            style={{
              zIndex: 2,
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              height: "100%",
              position: "relative",
            }}
          >
            {/* الدائرة والخط الرأسي (أسفل عنصر النص - لاحقًا نرسم النص فوقهم) */}
            <div
              className="absolute left-1/2"
              style={{
                bottom: `${BOTTOM_MARGIN}px`,
                transform: "translateX(-50%)",
                zIndex: 2,
                width: `${CIRCLE_RADIUS * 2}px`,
                height: `${CIRCLE_RADIUS * 2 + VERT_LINE_LENGTH}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {/* الخط الرأسي (يخرج من منتصف أعلى الدائرة لفوق فقط) */}
              <div
                style={{
                  width: `${VERT_LINE_WIDTH}px`,
                  height: `${VERT_LINE_LENGTH}px`,
                  background: "#181b29",
                  opacity: 0.85,
                  position: "absolute",
                  bottom: `${CIRCLE_RADIUS * 2 - 2}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                }}
              />
              {/* الدائرة */}
              <div
                style={{
                  width: `${CIRCLE_RADIUS * 2}px`,
                  height: `${CIRCLE_RADIUS * 2}px`,
                  borderRadius: "50%",
                  border: `${VERT_LINE_WIDTH * 1.1}px solid #181b29`,
                  background: CARD_BG,
                  zIndex: 4,
                  boxSizing: "border-box",
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundClip: "padding-box",
                }}
              />
              {/* تغطية الخط الأفقي تحت الدائرة */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: `${CIRCLE_RADIUS * 2 + 5}px`,
                  height: `${CIRCLE_RADIUS / 1 + 6}px`,
                  background: CARD_BG,
                  zIndex: 5,
                  borderRadius: "0 0 50% 50% / 0 0 100% 100%",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* نص الجهة */}
            <div
              className="absolute text-[26px] font-bold"
              style={{
                bottom: `${BOTTOM_MARGIN + CIRCLE_RADIUS * 2 + GAP_CIRCLE_TO_TITLE}px`,
                color: "#181b29",
                width: "100%",
                textAlign: "center",
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                fontWeight: 700,
                fontSize: `${DEPT_FONT_SIZE}px`,
                lineHeight: 1.05,
                whiteSpace: "nowrap",
                direction: "rtl",
                letterSpacing: 0,
              }}
            >
              {event.dept}
            </div>
            {/* نص الوصف */}
            <div
              className="absolute font-normal"
              style={{
                bottom:
                  BOTTOM_MARGIN +
                  CIRCLE_RADIUS * 2 +
                  GAP_CIRCLE_TO_TITLE +
                  DEPT_TO_DESC +
                  DEPT_FONT_SIZE,
                color: "#111",
                width: "100%",
                textAlign: "center",
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                fontSize: `${DESC_FONT_SIZE}px`,
                lineHeight: 1.4,
                whiteSpace: "normal",
                minHeight: "18px",
                direction: "rtl",
                letterSpacing: 0,
              }}
            >
              {event.title}
            </div>
            {/* سطر اليوم والشهر */}
            <div
              className="absolute font-bold flex flex-row-reverse items-end justify-center"
              style={{
                bottom:
                  BOTTOM_MARGIN +
                  CIRCLE_RADIUS * 2 +
                  GAP_CIRCLE_TO_TITLE +
                  DEPT_TO_DESC +
                  DEPT_FONT_SIZE +
                  DESC_TO_DATE +
                  DESC_FONT_SIZE,
                width: "100%",
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                color: "#181b29",
                textAlign: "center",
                direction: "rtl",
                letterSpacing: 0,
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: `${DATE_FONT_SIZE}px`,
                  lineHeight: 1,
                  minWidth: "45px",
                  letterSpacing: 0,
                }}
              >
                {event.day}
              </span>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: `${MONTH_FONT_SIZE}px`,
                  lineHeight: 1.25,
                  marginBottom: "7px",
                  minWidth: "28px",
                  letterSpacing: 0,
                  marginRight: "3px",
                }}
              >
                {event.month}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTimelineCard;


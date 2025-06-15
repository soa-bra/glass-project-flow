
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

// قياسات أساسية للبطاقة
const originalCardHeight = 104.2626;
const currentCardHeight = 272;
const scale = currentCardHeight / originalCardHeight; // تقريبًا 2.6

// تحديث القياسات لتناسب التعديلات المطلوبة
const sizes = {
  cardTitle: 10.63 * scale,
  day: 15 * scale,
  month: 3.5 * scale,
  title: 3.5 * scale,
  location: 5.5 * scale,
  circle: 48, // قطر الدائرة ثابت من التصميم تقريبًا
  vertLineWidth: 1, // سماكة الخط الطولي
  vertLineLength: 18, // طول الخط الطولي (مصغر ليوازي النص الأعلى للسطر الثاني)
  horizLineHeight: 1, // سماكة الخط العرضي
};

const CARD_BG = "rgba(233, 248, 250, 1)"; // لون الخلفية النهائي للبطاقة

export const UpcomingTimelineCard = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative w-full h-[272px] rounded-[41px] p-0 flex flex-col justify-end overflow-visible border-0 font-arabic ${className}`}
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      direction: "rtl",
      background: CARD_BG,
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
          fontWeight: 700,
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
      className="flex flex-row-reverse justify-between items-end w-full h-full relative z-10"
      style={{
        minHeight: "215px",
        gap: 0,
        paddingBottom: "0",
        paddingTop: "60px", // زيادة البادينغ العلوي حتى تصبح النصوص في وسط البطاقة بوضوح
        paddingRight: "54px",
        paddingLeft: "32px",
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
          {/* معلومات الحدث */}
          <div
            className="flex flex-col items-end mb-0"
            style={{
              width: "100%",
              maxWidth: "170px",
              textAlign: "right",
              direction: "rtl",
              minHeight: `${sizes.circle * 2.3}px`,
              transform: "translateY(-8px)", // لرفع النص قليلاً فوق الدائرة
              justifyContent: "center"
            }}
          >
            {/* اليوم والشهر */}
            <div
              className="flex flex-row-reverse items-end gap-2 w-full"
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
                  marginRight: "1px",
                  letterSpacing: 0,
                  minWidth: "36px"
                }}
              >
                {event.day}
              </span>
              <span
                style={{
                  fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                  fontWeight: 500,
                  fontSize: `${sizes.month}px`,
                  color: "#181b29",
                  lineHeight: 1.1,
                  marginBottom: "7px",
                  letterSpacing: 0,
                  minWidth: "23px"
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
                margin: ".2em 0 .2em 0",
                lineHeight: 1.3,
                textAlign: "right",
                whiteSpace: "normal",
                width: "100%",
                maxWidth: "162px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: "20px",
              }}
            >
              {event.title}
            </div>
            {/* الجهة أو المكان */}
            <div
              style={{
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                fontWeight: 700,
                fontSize: `${sizes.location}px`,
                color: "#181b29",
                margin: ".05em 0 0 0",
                textAlign: "right",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {event.dept}
            </div>
          </div>
          {/* الدائرة بالخط الطولي مع إخفاء الخط العرضي تحتها */}
          <div
            className="relative flex flex-col items-center"
            style={{
              width: `${sizes.circle}px`,
              height: `${sizes.circle + sizes.vertLineLength + 2}px`
            }}
          >
            {/* الخط الطولي من الأعلى حتى الدائرة (أقصر) */}
            <div
              style={{
                width: `${sizes.vertLineWidth}px`,
                height: `${sizes.vertLineLength}px`, // أصغر بكثير حرصًا على نهاية الخط مع بداية السطر الثاني
                background: "#181b29",
                opacity: 0.85,
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 2,
              }}
            />
            {/* الدائرة معبأة بلون الخلفية */}
            <div
              style={{
                width: `${sizes.circle}px`,
                height: `${sizes.circle}px`,
                borderRadius: "50%",
                border: `${sizes.vertLineWidth * 1.3}px solid #181b29`,
                background: CARD_BG,
                zIndex: 4,
                boxSizing: "border-box",
                position: "relative",
                backgroundClip: "padding-box",
              }}
            />
            {/* تغطية الخط الأفقي تحت الدائرة - شكل مطلق يغطي أي خط عرضي */}
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: `${sizes.circle + 6}px`,
                height: `${sizes.circle / 2 + 2}px`,
                background: CARD_BG,
                zIndex: 5,
                borderRadius: "0 0 50% 50% / 0 0 100% 100%",
                pointerEvents: "none"
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UpcomingTimelineCard;


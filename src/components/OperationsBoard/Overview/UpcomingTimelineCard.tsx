
import React from "react";

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

export const UpcomingTimelineCard = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative w-full h-[106px] rounded-[24px] flex flex-col justify-end overflow-visible border-0 font-arabic ${className}`}
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      direction: "rtl",
      background: "rgba(233, 248, 250, 0.92)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      boxShadow: "none",
      padding: "0",
    }}
  >
    {/* عنوان البطاقة */}
    <div className="absolute top-0 right-0 z-20 select-none"
      style={{
        paddingRight: "24px",
        paddingTop: "10px",
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
      }}
    >
      <span
        style={{
          fontSize: "9px", // أصغر قليلا
          fontWeight: 500,
          letterSpacing: 0,
          color: "#181b29"
        }}
      >
        الأحداث القادمة
      </span>
    </div>
    {/* الخط الزمني */}
    <div
      className="flex flex-row-reverse justify-between items-end w-full h-full relative z-10 select-text"
      style={{
        minHeight: "86px",
        paddingRight: "24px",
        paddingLeft: "14px",
        paddingTop: "25px",
        paddingBottom: "8px",
        gap: 0,
      }}
    >
      {/* عناصر الأحداث */}
      {events.map((event, idx) => (
        <div
          key={event.id}
          className="flex flex-col items-end min-w-0 max-w-[86px] flex-1 px-0"
          style={{
            alignSelf: "flex-end",
            zIndex: 20,
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
            textAlign: "right",
          }}
        >
          {/* التاريخ */}
          <div
            className="flex flex-row-reverse items-end mb-0 w-full pb-0"
            style={{
              marginBottom: "-2px",
              paddingRight: "1px"
            }}
          >
            {/* اليوم */}
            <span
              style={{
                fontFamily: '"IBM Plex Sans", Arial, Tahoma, sans-serif',
                fontSize: "11px",
                fontWeight: 400,
                color: "#181b29",
                lineHeight: 1,
                marginLeft: "3.5px",
                verticalAlign: "bottom",
              }}
            >
              {event.day}
            </span>
            {/* الشهر */}
            <span
              style={{
                fontFamily: '"IBM Plex Sans", Arial, Tahoma, sans-serif',
                fontSize: "2.5px",
                fontWeight: 700,
                color: "#181b29",
                letterSpacing: 0.3,
                marginBottom: "1px",
                verticalAlign: "bottom",
              }}
            >
              {event.month}
            </span>
          </div>
          {/* سطر تعريف الحدث */}
          <div
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              fontSize: "3px",
              fontWeight: 400,
              textAlign: "right",
              color: "#111",
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "78px"
            }}
          >
            {event.title}
          </div>
          {/* جهة الحدث */}
          <div
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              fontSize: "4px",
              fontWeight: 500,
              textAlign: "right",
              color: "#181b29",
              marginTop: "4px",
              marginBottom: "0px",
            }}
          >
            {event.dept}
          </div>
          {/* خط رأسي يصل الدائرة */}
          <div
            style={{
              width: "0.18px",
              background: "#181b29",
              height: "14px",
              margin: "1px 0 0 0",
              alignSelf: "center",
            }}
          />
          {/* الدائرة السفلية الصغيرة */}
          <div
            style={{
              width: "11px",
              height: "11px",
              borderRadius: "50%",
              border: "0.18px solid #181b29",
              background: "transparent",
              margin: "0 auto",
              marginTop: "-0.5px",
            }}
          />
        </div>
      ))}
    </div>
    {/* الخط الأفقي أسفل الدوائر */}
    <div
      className="absolute left-0 right-0"
      style={{
        bottom: "9px",
        background: "#181b29",
        opacity: 0.85,
        zIndex: 1,
        width: "100%",
        margin: "0 auto",
        height: "0.18px",
      }}
    />
  </div>
);

export default UpcomingTimelineCard;

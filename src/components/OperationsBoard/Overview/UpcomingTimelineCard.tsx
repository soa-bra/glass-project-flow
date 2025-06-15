
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
    className={`relative w-full h-[272px] rounded-[41px] p-0 flex flex-col justify-end overflow-visible border-0 font-arabic ${className}`}
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      direction: "rtl",
      background: "rgba(233, 248, 250, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "41px",
      boxShadow: "none",
    }}
  >
    {/* عنوان البطاقة */}
    <div className="absolute top-0 right-0 px-14 pt-7 pb-0 flex items-center z-20 select-none">
      <span
        className="font-arabic"
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          fontSize: "10.63px", // px حسب المواصفة
          fontWeight: 500, // Medium
          letterSpacing: 0,
          color: "#181b29"
        }}
      >
        الأحداث القادمة
      </span>
    </div>
    {/* الخط الزمني */}
    <div
      className="flex flex-row-reverse justify-between items-end w-full h-full pb-0 pt-16 pr-[50px] pl-[26px] relative z-10 select-text"
      style={{
        minHeight: "215px",
        gap: 0,
      }}
    >
      {/* عناصر الأحداث */}
      {events.map((event, idx) => (
        <div
          key={event.id}
          className="flex flex-col items-end min-w-0 max-w-[170px] flex-1 px-1"
          style={{
            alignSelf: "flex-end",
            zIndex: 20,
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
            textAlign: "right",
          }}
        >
          {/* التاريخ */}
          <div className="flex flex-row-reverse items-end mb-0 w-full pr-1 pb-2" style={{marginBottom: "-2px"}}>
            {/* اليوم */}
            <span
              style={{
                fontFamily: '"IBM Plex Sans", Arial, Tahoma, sans-serif',
                fontSize: "15px",
                fontWeight: 400, // Regular
                color: "#181b29",
                lineHeight: 1,
                display: "inline-block",
                marginLeft: "7px",
                verticalAlign: "bottom",
              }}
            >
              {event.day}
            </span>
            {/* الشهر */}
            <span
              style={{
                fontFamily: '"IBM Plex Sans", Arial, Tahoma, sans-serif',
                fontSize: "3.5px",
                fontWeight: 700, // Bold
                color: "#181b29",
                letterSpacing: 0.3,
                display: "inline-block",
                marginBottom: "2px",
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
              fontSize: "3.5px",
              fontWeight: 400,
              textAlign: "right",
              color: "#111",
              whiteSpace: "normal",
            }}
          >
            {event.title}
          </div>
          {/* سطر فارغ */}
          <div style={{height: "7px"}} />
          {/* جهة الحدث */}
          <div
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              fontSize: "5.5px",
              fontWeight: 500, // Medium
              textAlign: "right",
              color: "#181b29",
              marginBottom: "1px",
            }}
          >
            {event.dept}
          </div>
          {/* خط رأسي يصل الدائرة */}
          <div
            style={{
              width: "0.24px", // 0.1801pt تقريب تقريبًا
              background: "#181b29",
              height: "25px",
              margin: "2px 0 0 0",
              alignSelf: "center",
            }}
          />
          {/* الدائرة السفلية الصغيرة */}
          <div
            style={{
              width: "18.76px",
              height: "18.76px",
              borderRadius: "50%",
              border: "0.24px solid #181b29",
              background: "transparent",
              margin: "0 auto",
              marginTop: "-1px",
            }}
          />
        </div>
      ))}
    </div>
    {/* الخط الأفقي أسفل الدوائر */}
    <div
      className="absolute left-0 right-0 bottom-[17px] h-[0.24px]"
      style={{
        background: "#181b29",
        opacity: 0.95,
        zIndex: 1,
        width: "100%",
        margin: "0 auto",
        height: "0.24px",
      }}
    />
  </div>
);

export default UpcomingTimelineCard;

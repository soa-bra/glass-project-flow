
import React from "react";

// نفس البيانات!
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
        className="text-[2.35rem] font-black tracking-tight text-[#181b29] font-arabic"
        style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}
      >
        الأحداث القادمة
      </span>
    </div>
    {/* الخط الزمني -- توزيع أفقي حُر */}
    <div
      className="flex flex-row-reverse justify-between items-end w-full h-full pb-0 pt-20 pr-[50px] pl-[35px] relative z-10 select-text"
      style={{
        minHeight: "215px",
        gap: 0,
      }}
    >
      {/* عناصر الأحداث */}
      {events.map((event, idx) => (
        <div
          key={event.id}
          className="flex flex-col items-center min-w-0 max-w-[230px] flex-1 px-1"
          style={{
            alignSelf: "flex-end",
            zIndex: 20,
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          }}
        >
          {/* التاريخ */}
          <div className="flex flex-col items-center mb-[8px] w-full">
            <div className="flex flex-row items-end gap-2 w-full justify-center">
              <span
                className="text-[1.04rem] font-normal text-[#181b29] leading-5"
                style={{
                  fontFamily: '"IBM Plex Sans", Arial, Tahoma, sans-serif',
                  letterSpacing: 0.2,
                  color: "#181b29"
                }}
              >
                {event.month}
              </span>
              <span
                className="text-[2.95rem] font-black text-[#181b29] leading-[1.03] mb-[2px]"
                style={{
                  fontFamily: '"IBM Plex Sans", Arial, Tahoma, sans-serif',
                  color: "#181b29",
                  fontWeight: 900,
                  lineHeight: 1.09,
                }}
              >
                {event.day}
              </span>
            </div>
          </div>
          {/* عنوان الحدث */}
          <div
            className="w-full text-[1.04rem] text-[#111] font-normal font-arabic text-center mb-[5px] leading-normal"
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              fontWeight: 400,
              marginTop: "4px",
              marginBottom: "3px",
            }}
          >
            {event.title}
          </div>
          {/* جهة الحدث */}
          <div
            className="w-full text-[1.35rem] font-black font-arabic text-center leading-tight text-[#181b29] mb-0"
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
              fontWeight: 900,
              marginBottom: "0px",
            }}
          >
            {event.dept}
          </div>
          {/* خط رأسي يصل الدائرة */}
          <div style={{
            width: "2px",
            background: "#181b29",
            height: "42px",
            marginTop: "3px",
            marginBottom: "0",
            display: "block"
          }} />
          {/* الدائرة السفلية الكبيرة */}
          <div
            className="flex items-center justify-center"
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "50%",
              border: "2.2px solid #181b29",
              background: "transparent",
              marginTop: "-2px",
              marginBottom: "0",
            }}
          ></div>
        </div>
      ))}
    </div>
    {/* الخط الأفقي الموحد */}
    <div
      className="absolute left-0 right-0 bottom-[27px] h-[2.2px]"
      style={{
        background: "#181b29",
        opacity: 0.78,
        zIndex: 1,
        width: "99.7%",
        margin: "0 auto",
      }}
    />
  </div>
);

export default UpcomingTimelineCard;



import React from "react";

// بيانات أحداث تجريبية مطابقة للصورة
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
    className={`relative w-full h-[270px] bg-[#e9f8fa] rounded-[38px] shadow-none p-0 flex flex-col justify-end overflow-hidden 
      border-0 font-arabic ${className}`}
    style={{
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      direction: "rtl",
      background: "rgba(233, 248, 250, 0.90)",
      backdropFilter: "blur(20px)",
      borderRadius: "38px",
    }}
  >
    {/* عنوان الأحداث القادمة */}
    <div className="absolute top-0 right-0 px-14 pt-9 pb-0 flex items-center z-20">
      <span
        className="text-[2.15rem] font-black tracking-tight text-[#181b29] font-arabic"
        style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}
      >
        الأحداث القادمة
      </span>
    </div>
    {/* خط زمني */}
    <div className="flex flex-row-reverse justify-between items-end w-full h-full px-8 pb-8 pt-20 pr-24 pl-4 gap-0 relative z-10">
      {/* كل حدث */}
      {events.map((event, idx) => (
        <div
          key={event.id}
          className="flex flex-col items-center min-w-0 max-w-[180px] flex-1 group cursor-pointer"
          style={{ alignSelf: "end" }}
        >
          {/* التاريخ */}
          <div className="flex flex-col items-center mb-2">
            <span
              className="text-sm text-black font-semibold font-arabic leading-3 !mb-0"
              style={{
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                letterSpacing: 0.5,
              }}
            >
              {event.month}
            </span>
            <span
              className="text-4xl md:text-5xl font-black font-arabic text-[#181b29] leading-snug mb-1"
              style={{
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
              }}
            >
              {event.day}
            </span>
          </div>
          {/* عنوان الحدث */}
          <div
            className="text-black text-[1.03rem] font-semibold font-arabic whitespace-nowrap mb-2 text-center"
            style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}
          >
            {event.title}
          </div>
          {/* جهة الحدث */}
          <div className="text-gray-800 text-base font-arabic mt-1 mb-0 text-center font-normal"
            style={{
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
            }}
          >
            {event.dept}
          </div>
          {/* الخط الرأسي (يوصل إلى الدائرة) */}
          <div className="w-[2px] bg-[#181b29] h-7 mt-1 mb-0"></div>
          {/* الدائرة الكبيرة السفلية */}
          <div
            className="w-14 h-14 rounded-full border-2 border-[#181b29] bg-white/60 backdrop-blur-2xl flex items-center justify-center"
            style={{
              marginTop: "-2px",
              boxShadow: "0 2px 12px 0 rgba(0,0,0,.03) inset"
            }}
          ></div>
        </div>
      ))}
    </div>
    {/* الخط الأفقي الموحد */}
    <div
      className="absolute left-0 right-0 bottom-[34px] h-px bg-[#181b29]"
      style={{ opacity: 0.8 }}
    ></div>
  </div>
);

export default UpcomingTimelineCard;

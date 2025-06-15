
import React from "react";

// بيانات الأحداث القادمة كما هو مطلوب
const events = [
  {
    id: 1,
    day: "07",
    month: "Jun",
    title: "حفل الترحيب بالموظفين الجدد",
    dept: "داخلي"
  },
  {
    id: 2,
    day: "02",
    month: "Jun",
    title: "المقابلات الوظيفية",
    dept: "داخلي"
  },
  {
    id: 3,
    day: "25",
    month: "May",
    title: "اجتماع لمناقشة الشراكة الوقفية",
    dept: "جامعة الملك سعود"
  },
  {
    id: 4,
    day: "20",
    month: "May",
    title: "تسليم النماذج الأولية",
    dept: "الخليج للتدريب"
  },
  {
    id: 5,
    day: "16",
    month: "May",
    title: "محاضرة العلامة من منظور الجماعة",
    dept: "مسك الخيرية"
  },
  {
    id: 6,
    day: "12",
    month: "May",
    title: "الإجتماع النصف سنوي للمراجعة الليلية",
    dept: "داخلي"
  }
];

const CARD_BG = "linear-gradient(105deg,rgba(233,248,250,1) 68%,rgba(176,211,234,0.85) 100%)";

export const UpcomingTimelineCard = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`
        glass-enhanced border border-white/40
        rounded-3xl overflow-hidden
        relative w-full h-[272px] min-h-[230px]
        flex flex-row items-stretch
        px-2 md:px-5
        ${className}
        animate-fade-in
      `}
      style={{
        background: CARD_BG,
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: "rtl"
      }}
    >
      <div className="w-[90px] bg-white/0 py-7 px-4 flex flex-col items-center justify-center">
        <div className="font-bold text-lg text-[#23272f] tracking-widest mb-1">الأحداث</div>
        <div className="text-xs text-[#6B7280] font-medium">القادمة</div>
      </div>
      <div className="flex-1 py-5 flex flex-col justify-end">
        <div className="flex flex-row-reverse gap-8 h-full items-end overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#d6e8eb]/50 pb-2">
          {events.map((event, idx) => (
            <div
              key={event.id}
              className="flex flex-col items-center w-[92px] min-w-[92px] max-w-[92px] relative group"
              style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
            >
              {idx > 0 && (
                <div
                  className="absolute bg-slate-200"
                  style={{
                    width: "1.5px",
                    height: "60px",
                    right: "50%",
                    bottom: "58px",
                    zIndex: 0,
                  }}
                ></div>
              )}
              <div
                className="w-16 h-16 bg-white/90 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-[#DCF5FC] mb-1"
                style={{
                  boxShadow: "0 1px 12px 0 rgba(102,189,232,.08), 0 1px 0 rgba(255,255,255,0.2) inset",
                  zIndex: 2
                }}
              >
                <span className="text-[#181b29] text-[2.1rem] font-bold leading-tight block">{event.day}</span>
                <span className="text-[#0077CC] text-xs font-semibold tracking-widest block -mt-2">{event.month}</span>
              </div>
              <div className="mt-2 text-[1.13rem] font-bold text-[#0858A6]">{event.dept}</div>
              <div
                className="mt-1 text-center px-1 text-[1rem] font-arabic text-[#23272f] font-medium leading-tight"
                style={{ maxWidth: "100%", wordBreak: "break-word" }}
              >
                {event.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UpcomingTimelineCard;

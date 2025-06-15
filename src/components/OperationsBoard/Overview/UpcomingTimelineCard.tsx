
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
const scale = currentCardHeight / originalCardHeight;

// القياسات بعد التناسب
const sizes = {
  cardTitle: 10.63 * scale, // عنوان البطاقة
  day: 15 * scale, // اليوم
  month: 3.5 * scale, // الشهر
  title: 3.5 * scale, // وصف مختصر للحدث
  location: 5.5 * scale, // الجهة
  circle: 18.76 * scale, // قطر الدائرة
  vertLineWidth: 0.18 * 1.333 * scale, // إعطاء سماكة متناسقة بالشاشات العريضة (pt -> px)
  vertLineHeight: 54 * scale, // تقريباً طول مناسب كخط رأسي بين العنصرين
  horizLineHeight: 0.18 * 1.333 * scale,
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
    {/* الخط الزمني -- توزيع أفقي حُر */}
    <div
      className="flex flex-row-reverse justify-between items-end w-full h-full pb-0 pt-20 pr-[50px] pl-[35px] relative z-10 select-text"
      style={{
        minHeight: "215px",
        gap: 0,
      }}
    >
      {/* عناصر الأحداث */}
      {events.map((event) => (
        <div
          key={event.id}
          className="flex flex-col items-end min-w-0 flex-1 px-1"
          style={{
            alignSelf: "flex-end",
            zIndex: 20,
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
            height: "100%",
            // توزيع العناصر إلى يمين الخط الرأسي والدائرة
          }}
        >
          {/* الخط الرأسي والدائرة */}
          <div
            className="flex flex-row items-end justify-end w-full relative"
            style={{ minHeight: sizes.vertLineHeight + sizes.circle }}
          >
            <div className="flex flex-col items-center" style={{ position: "relative" }}>
              {/* الخط الرأسي فوق الدائرة */}
              <div
                style={{
                  width: `${sizes.vertLineWidth}px`,
                  height: `${sizes.vertLineHeight}px`,
                  background: "#181b29",
                  opacity: 0.68,
                  marginBottom: "0",
                  marginTop: "0",
                  display: "block",
                  zIndex: 8,
                }}
              />
              {/* دائرة الحدث */}
              <div
                style={{
                  width: `${sizes.circle}px`,
                  height: `${sizes.circle}px`,
                  borderRadius: "50%",
                  border: `${sizes.vertLineWidth * 2}px solid #181b29`,
                  background: "transparent",
                  marginTop: "-1.4px",
                  marginBottom: "0",
                  zIndex: 10,
                  boxSizing: "border-box",
                  position: "relative",
                  backgroundClip: "padding-box",
                }}
              />
              {/* الخط الرأسي بعد الدائرة (ممتد للأسفل إذا احتجت) */}
              {/* يمكن تمديده هنا لو في قيم أعلى أو إضافة زخرفة */}
            </div>
            {/* محتوى البيانات على يمين الخط والدائرة بمحاذاة اليسار */}
            <div className="flex flex-col items-start ml-4" style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
              {/* اليوم والشهر "على نفس السطر" */}
              <div className="flex flex-row-reverse items-end gap-2 w-full mb-0" style={{ direction: "ltr" }}>
                <span
                  style={{
                    fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                    fontWeight: 400,
                    fontSize: `${sizes.day}px`,
                    color: "#181b29",
                    marginBottom: "0",
                    lineHeight: 1.02,
                  }}
                >
                  {event.day}
                </span>
                <span
                  style={{
                    fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                    fontWeight: 700,
                    fontSize: `${sizes.month}px`,
                    color: "#181b29",
                    marginBottom: "2.5px",
                    lineHeight: 1,
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
                  margin: "0 0 0.5em 0",
                  lineHeight: 1.13,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  width: "100%",
                  maxWidth: "160px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {event.title}
              </div>
              {/* السطر الثالث فارغ */}
              <div style={{ height: `${sizes.title * 0.9}px` }}/>
              {/* الجهة أو المكان */}
              <div
                style={{
                  fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                  fontWeight: 600,
                  fontSize: `${sizes.location}px`,
                  color: "#181b29",
                  margin: "0 0 0.5em 0",
                  textAlign: "left",
                  lineHeight: 1.18,
                  whiteSpace: "nowrap",
                }}
              >
                {event.dept}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* الخط الأفقي الموحد */}
    <div
      className="absolute left-0 right-0 bottom-[27px]"
      style={{
        background: "#181b29",
        opacity: 0.78,
        zIndex: 1,
        width: "99.7%",
        margin: "0 auto",
        height: `${sizes.horizLineHeight}px`,
      }}
    />
  </div>
);

export default UpcomingTimelineCard;

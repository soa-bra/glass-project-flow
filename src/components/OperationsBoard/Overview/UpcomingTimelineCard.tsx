import React from "react";

// نفس البيانات
const events = [{
  id: 1,
  day: "07",
  month: "Jun",
  title: "حفل الترحيب بالموظفين الجدد",
  dept: "داخلي"
}, {
  id: 2,
  day: "02",
  month: "Jun",
  title: "المقابلات الوظيفية",
  dept: "داخلي"
}, {
  id: 3,
  day: "25",
  month: "May",
  title: "اجتماع لمناقشة الشراكة الوقفية",
  dept: "جامعة الملك سعود"
}, {
  id: 4,
  day: "20",
  month: "May",
  title: "تسليم النماذج الأولية",
  dept: "الخليج للتدريب"
}, {
  id: 5,
  day: "16",
  month: "May",
  title: "محاضرة العلامة من منظور الجماعة",
  dept: "مسك الخيرية"
}, {
  id: 6,
  day: "12",
  month: "May",
  title: "الإجتماع النصف سنوي للمراجعة الليلية",
  dept: "داخلي"
}];

// ----- حساب القياسات بناءً على زوم الصورة المرفقة -------
// نفترض ارتفاع البطاقة = 272px (بناءً على الصورة والسابق),
// نحسب كل عنصر من الحد السفلي بالترتيب:

// القياسات النسبية من الحد السفلي للصورة (تقريبية من المشاهدة الدقيقة)
// (من أسفل البطاقة إلى العنصر المذكور:)
const BOTTOM_MARGIN = 36; // المسافة من أسفل البطاقة إلى center الدائرة
const CIRCLE_RADIUS = 32; // نصف قطر الدائرة = 32 => القطر 64px (مطابق تقريبًا)
const HORIZ_LINE_HEIGHT = 1.2; // سماكة الخط الأفقي
const VERT_LINE_LENGTH = 56; // طول الخط الرأسي من مركز الدائرة لفوق
const VERT_LINE_WIDTH = 1.1;
const GAP_CIRCLE_TO_TITLE = 20; // من أعلى الدائرة إلى بداية "الجهة"
const DEPT_FONT_SIZE = 26; // حجم خط الجهة
const DEPT_TO_DESC = 10; // المسافة من "الجهة" إلى بداية الوصف
const DESC_FONT_SIZE = 15.5; // حجم خط الوصف
const DESC_TO_DATE = 14; // من نهاية الوصف لبداية اليوم/الشهر
const DATE_FONT_SIZE = 38; // اليوم (كبير)
const MONTH_FONT_SIZE = 13; // الشهر (صغير)
const TITLE_FONT_SIZE = 20; // عنوان الكارد

const CARD_BG = "rgba(233, 248, 250, 1)";
export const UpcomingTimelineCard = ({
  className = ""
}: {
  className?: string;
}) => {
  return;
};
export default UpcomingTimelineCard;
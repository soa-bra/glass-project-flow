
import React from "react";
import { ChevronLeft, Settings, Bell, Users, CircleDot, Calendar, Search } from "lucide-react";

const PROJECTS = [
  { id: 1, name: "تطوير الموقع الإلكتروني", date: "08 Jun", members: 3, status: "موقف", badge: "pink" },
  { id: 2, name: "تطوير الموقع الإلكتروني", date: "25 Jun", members: 4, status: "تحت التنفيذ", badge: "green" },
  { id: 3, name: "تطوير الموقع الإلكتروني", date: "05 Aug", members: 5, status: "تحت الاعتماد", badge: "primary" },
  { id: 4, name: "تطوير الموقع الإلكتروني", date: "05 May", members: 2, status: "مغلق", badge: "purple" },
  { id: 5, name: "تطوير الموقع الإلكتروني", date: "29 May", members: 7, status: "متأخر", badge: "yellow" },
  { id: 6, name: "تطوير الموقع الإلكتروني", date: "17 Aug", members: 3, status: "تحت التنفيذ", badge: "blue" },
];

const FILTERS = [
  { icon: <Search className="w-5 h-5"/> },
  { icon: <Calendar className="w-5 h-5"/> },
  { icon: <Users className="w-5 h-5"/> },
  { icon: <CircleDot className="w-5 h-5"/> },
];

const TABS = [
  "نظرة عامة",
  "مالية",
  "قانونية",
  "موارد بشرية",
  "عملاء",
  "تقارير",
];

export default function Index() {
  return (
    <div
      dir="rtl"
      className="min-h-screen w-full flex flex-row bg-[#DFE8ED] font-arabic overflow-x-hidden"
      style={{ fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif', background: "#DFE8ED" }}
    >
      {/* القائمة الجانبية */}
      <aside className="w-[110px] flex-shrink-0 flex flex-col items-center justify-between pt-14 pb-8 bg-[#E3EBF0] border-l border-white/60 min-h-screen">
        <div className="flex flex-col gap-5 items-center justify-start">
          <Settings className="w-7 h-7 text-soabra-text-secondary mb-3 opacity-75 hover:opacity-100 transition"/>
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-white shadow mb-2">
              <Users className="w-6 h-6 text-soabra-text-secondary" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-white shadow">
              <Bell className="w-6 h-6 text-soabra-text-secondary" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-white shadow">
              <CircleDot className="w-6 h-6 text-soabra-text-secondary" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-8 mt-9 w-[66px]">
            <img
              src="/logo.svg"
              alt="SoaBra Logo"
              className="object-contain"
              style={{ maxWidth: "90%", margin: "auto" }}
            />
            <div className="text-xs text-soabra-text-secondary font-bold mt-2 text-center">SoaBra<br/>سويبرا</div>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/80 border border-white flex items-center justify-center shadow">
            <ChevronLeft className="w-6 h-6 text-soabra-text-secondary" />
          </button>
        </div>
        <div className="text-xs font-semibold mt-8 mb-2 text-soabra-text-secondary">القائمة</div>
      </aside>

      {/* عمود المشاريع */}
      <section className="w-[325px] flex-shrink-0 h-[calc(100vh-0px)] bg-[#DFE8ED] flex flex-col border-l border-white/50 pt-10">
        <header className="flex flex-row items-center justify-between px-7 pb-3">
          <span className="text-2xl font-bold">المشاريع</span>
          <div className="flex flex-row gap-4">
            <button className="w-9 h-9 rounded-full bg-[#E3EBF0] flex items-center justify-center border">
              +
            </button>
            <button className="w-9 h-9 rounded-full bg-[#E3EBF0] flex items-center justify-center border">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </header>
        <div className="flex flex-row gap-3 items-center px-7 mb-1">
          {FILTERS.map((x, i) => (
            <button
              key={i}
              className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center shadow border hover:shadow-md transition"
            >
              {x.icon}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto px-4 pt-3 flex-1 pb-10">
          {PROJECTS.map((project, idx) => (
            <div
              key={project.id}
              className="rounded-2xl bg-white/80 border border-white/50 shadow mb-4 p-4 flex flex-row items-center gap-3"
              style={{
                minHeight: 69,
                fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
                backdropFilter: "blur(16px)",
              }}
            >
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold bg-[#FBF7FC]`}>
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="flex flex-1 flex-col items-end pr-2">
                <span className="text-lg font-bold mb-1">{project.name}</span>
                <span className="text-xs text-soabra-text-secondary">تطوير موقع سوير</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-xs text-soabra-text-secondary/70">{project.date}</span>
                <span className="text-xs w-max px-2 rounded-full font-semibold"
                  style={{
                    background:
                      project.badge === "pink" ? "#F6E2EA" :
                      project.badge === "green" ? "#E4F8ED" :
                      project.badge === "primary" ? "#E4F0F8" :
                      project.badge === "purple" ? "#EBE5F5" :
                      project.badge === "yellow" ? "#FFF9DB" : "#E4F8F8",
                    color: "#34363b"
                  }}>
                  {project.status}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center border font-bold">{project.members}</div>
            </div>
          ))}
        </div>
      </section>

      {/* لوحة الإدارة والتشغيل */}
      <main className="flex-1 h-full flex flex-col bg-[#DFE8ED] px-0 py-0">
        {/* شريط التبويبات والقائمة العلوية والشعار */}
        <div className="w-full flex flex-row items-center justify-between py-9 px-12" style={{ minHeight: 58 }}>
          <div className="flex flex-row items-center gap-2">
            {TABS.map((tab, i) => (
              <button key={i} className={`px-4 py-2 mx-1 rounded-full font-semibold transition text-base
                ${i === 0 ? "bg-[#F3F7F9] border border-blue-400 text-[#23272f]" : "bg-transparent text-[#8D969B]"}
              `}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-row gap-7 items-center">
            <Bell className="w-7 h-7 text-soabra-text-secondary hover:opacity-70 cursor-pointer" />
            <Users className="w-7 h-7 text-soabra-text-secondary hover:opacity-70 cursor-pointer" />
            <span className="font-extrabold text-2xl text-[#1C2833] ml-7">لوحة الإدارة والتشغيل</span>
          </div>
          <div className="flex flex-col items-center pr-4" style={{minWidth: 95}}>
            <img src="/logo.svg" alt="SoaBra" className="w-14 h-10 object-contain" />
            <span className="text-[13px] font-bold text-soabra-text-secondary leading-3">سويبرا</span>
          </div>
        </div>
        {/* محتوى العمليات بالكامل */}
        <div className="flex-1 overflow-auto rounded-t-3xl bg-[#E9F2F7] border border-white/45 mx-7 px-3 pt-7 pb-5"
             style={{
               backdropFilter: "blur(20px)",
               minHeight: "62vh"
             }}>
          {/* صف الملخص العلوي */}
          <div className="flex flex-row justify-between gap-5 mb-9">
            {/* جمع الأداء المالي، عدد المشاريع، عدد الشكاوى */}
            <div className="flex flex-row gap-7">
              <div className="flex flex-col justify-between items-end p-0">
                <span className="text-[#8D969B] font-medium text-base mb-2">الإيرادات التوقعية</span>
                <span className="font-bold text-3xl text-[#222A2D]">150 ألف ر.س</span>
                <span className="text-sm text-[#7A8792] font-medium">قيمة العقود المتوقع تحصيلها</span>
              </div>
              <div className="flex flex-col items-end p-0">
                <span className="text-[#8c959e] font-medium text-base mb-2">الشكاوى</span>
                <div className="flex items-baseline">
                  <span className="font-bold text-2xl text-[#23272f] mr-2">05</span>
                  <span className="text-xs text-[#6d7681]">شكوى</span>
                </div>
                <span className="text-xs text-[#7A8792] font-medium">الأسبوع الحالي</span>
              </div>
              <div className="flex flex-col items-end p-0">
                <span className="text-[#8c959e] font-medium text-base mb-2">المشاريع القائمة</span>
                <div className="flex items-baseline">
                  <span className="font-bold text-2xl text-[#23272f] mr-2">03</span>
                  <span className="text-xs text-[#6d7681]">مشروع</span>
                </div>
                <span className="text-xs text-[#7A8792] font-medium">تنفذ في الوقت الحالي</span>
              </div>
            </div>
          </div>
          {/* الأحداث القادمة: الخط الزمني الأفقي */}
          <div className="rounded-3xl bg-white/65 shadow border border-white/70 px-12 py-8 mb-8 flex flex-col gap-4"
              style={{ backdropFilter: 'blur(20px)' }}>
            <div className="text-2xl font-bold mb-8 text-[#222A2D]">الأحداث القادمة</div>
            <div className="flex flex-row items-center justify-between w-full gap-2">
              {[12, 16, 20, 25, 2, 7].map((n, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-[#F3F5F7] border border-white rounded-full w-16 h-16 flex flex-col items-center justify-center text-lg text-[#222A2D] font-bold mb-2 shadow">
                    {n}
                  </div>
                  <div className="text-soabra-text-secondary text-xs whitespace-nowrap">
                    {i === 0 && "جلسة مجلس إدارة"}{i === 1 && "اجتماع اللجنة"}
                    {i === 2 && "تقديم تقارير"}{i === 3 && "جامعة الملك سعود"}
                    {i === 4 && "مناقشة الميزانية"}{i === 5 && "صالون التميز"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* الشبكة الرئيسية للمؤشرات والبطاقات */}
          <div className="grid grid-cols-12 gap-5 px-3">
            {/* النظرة المالية */}
            <div className="col-span-3 rounded-3xl bg-[#CBE7E1] shadow border border-white/65 flex flex-col items-end p-10 relative min-h-[224px]"
                style={{backdropFilter:'blur(18px)'}}>
              <div className="text-lg font-bold text-[#263A39] mb-4">النظرة المالية</div>
              <div className="flex flex-row text-5xl font-bold text-[#3BA791] mb-7 mt-1 gap-2">
                92
                <span className="text-xs font-medium ml-2 self-end text-[#29403C]">Lead Score</span>
              </div>
              <div className="mt-auto w-full flex justify-between">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#5B8A7A] mb-2">مثال</span>
                  <span className="text-lg font-bold text-[#233D36]">02</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#5B8A7A] mb-2">مثال</span>
                  <span className="text-lg font-bold text-[#233D36]">14</span>
                </div>
                <div className="flex flex-col items-end ml-3">
                  <span className="text-xs text-[#5B8A7A] mb-2">مثال</span>
                  <span className="text-lg font-bold text-[#233D36]">78</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#5B8A7A] mb-2">مثال</span>
                  <span className="text-lg font-bold text-[#233D36]">03</span>
                </div>
              </div>
            </div>
            {/* بيانات 1 */}
            <div className="col-span-3 rounded-3xl bg-white/80 shadow border border-white/65 flex flex-col items-end p-10 min-h-[224px]" style={{backdropFilter:'blur(18px)'}}>
              <div className="text-lg font-bold text-[#263A39] mb-3">بيانات</div>
              <span className="text-5xl font-bold text-[#31474f] mb-6">46</span>
              <div className="text-sm text-[#6d879d] mt-auto">هنا النص مثال للشكل البياني</div>
            </div>
            {/* بيانات 2 */}
            <div className="col-span-3 rounded-3xl bg-white/80 shadow border border-white/65 flex flex-col items-end p-10 min-h-[224px]" style={{backdropFilter:'blur(18px)'}}>
              <div className="text-lg font-bold text-[#263A39] mb-3">بيانات</div>
              <span className="text-5xl font-bold text-[#31474f] mb-6">46</span>
              <div className="text-sm text-[#6d879d] mt-auto">هنا النص مثال للشكل البياني</div>
            </div>
            {/* بيانات – شريط تقدم (bar) */}
            <div className="col-span-3 rounded-3xl bg-white/80 shadow border border-white/65 flex flex-col items-end p-10 min-h-[224px]" style={{backdropFilter:'blur(18px)'}}>
              <div className="text-lg font-bold text-[#263A39] mb-3">بيانات</div>
              <div className="mb-6 flex flex-col w-full items-end">
                <div className="w-40 h-2 rounded bg-[#D2ECE2] mb-2">
                  <div className="h-full bg-[#3BA791] rounded" style={{width: "55%"}}></div>
                </div>
                <div className="w-32 h-2 rounded bg-[#D7EAF7] mb-1">
                  <div className="h-full bg-[#86B8DC] rounded" style={{width: "80%"}}></div>
                </div>
                <div className="w-28 h-2 rounded bg-[#FADADE]">
                  <div className="h-full bg-[#FAC6CB] rounded" style={{width: "33%"}}></div>
                </div>
              </div>
              <div className="text-sm text-[#6d879d] mt-auto">هنا النص مثال للشكل البياني</div>
            </div>
            {/* بيانات 3: donut نسبة*/}
            <div className="col-span-3 rounded-3xl bg-white/80 shadow border border-white/65 flex flex-col items-end p-10 min-h-[224px]" style={{backdropFilter:'blur(18px)'}}>
              <div className="text-lg font-bold text-[#263A39] mb-3">نسبة</div>
              <div className="w-full flex flex-row items-center mb-5 justify-end">
                <svg width={72} height={72} viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="31" stroke="#E4E9EF" strokeWidth="8" fill="none"/>
                  <circle cx="36" cy="36" r="31" stroke="#2F4151" strokeWidth="8" fill="none"
                    strokeDasharray={195} strokeDashoffset={48} strokeLinecap="round"/>
                  <text x="36" y="43" fontSize="23" fontWeight="bold" textAnchor="middle" fill="#2F4151">75%</text>
                </svg>
              </div>
              <div className="text-sm text-[#6d879d] mt-auto">حدة</div>
            </div>
            {/* بيانات 4 – احمر */}
            <div className="col-span-3 rounded-3xl bg-[#F4DEDF] shadow border border-white/65 flex flex-col items-end p-10 min-h-[224px]" style={{backdropFilter:'blur(18px)'}}>
              <div className="text-lg font-bold text-[#263A39] mb-3">بيانات</div>
              <span className="text-5xl font-bold text-[#31474f] mb-6">03</span>
              <div className="flex-1 mt-auto w-full">
                <svg width={110} height={30} viewBox="0 0 110 30">
                  <polyline
                    fill="none"
                    stroke="#cb6c65"
                    strokeWidth={3}
                    points="0,25 18,11 36,19 54,10 72,15 90,8 110,27"
                  />
                </svg>
              </div>
              <div className="text-sm text-[#6d879d] mt-auto">هنا النص مثال للشكل البياني</div>
            </div>
            {/* ملخص المشاريع – أزرق فاتح */}
            <div className="col-span-6 rounded-3xl bg-[#CBE5EE] shadow border border-white/65 flex flex-col items-end p-10 min-h-[224px]" style={{backdropFilter:'blur(18px)'}}>
              <div className="text-lg font-bold text-[#263A39] mb-3">ملخص المشاريع</div>
              <div className="w-full flex-1 flex flex-row justify-center items-center p-3">
                <svg width={180} height={70} viewBox="0 0 180 70">
                  <rect x="10" y="40" width="18" height="30" fill="#AFE1D7" rx="4"/>
                  <rect x="38" y="28" width="18" height="42" fill="#8AD3EB" rx="4"/>
                  <rect x="66" y="52" width="18" height="18" fill="#FCF09D" rx="4"/>
                  <rect x="94" y="15" width="18" height="55" fill="#7B92E2" rx="4"/>
                  <rect x="122" y="32" width="18" height="38" fill="#E9A7F7" rx="4"/>
                </svg>
              </div>
              <div className="flex flex-row gap-4 flex-wrap w-full justify-center items-center mt-auto">
                <div className="flex flex-row items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-[#AFE1D7] inline-block"></span>
                  <span className="text-xs font-bold text-[#263A39]">ماليات: 140 مثال</span>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-[#8AD3EB] inline-block"></span>
                  <span className="text-xs font-bold text-[#263A39]">قانونية: 50 مثال</span>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-[#FCF09D] inline-block"></span>
                  <span className="text-xs font-bold text-[#263A39]">تنفيذ: 02 مثال</span>
                </div>
              </div>
            </div>
          </div>
          {/* التنبيهات */}
          <div className="rounded-3xl bg-white/55 shadow border border-white/70 p-8 mt-9 flex flex-col min-h-[120px]"
              style={{backdropFilter:'blur(22px)'}}>
            <div className="text-lg font-bold text-[#263A39]">التنبيهات</div>
            <div className="mt-6 text-soabra-text-secondary text-base">لا يوجد تنبيهات حاليا</div>
          </div>
        </div>
      </main>
    </div>
  );
}

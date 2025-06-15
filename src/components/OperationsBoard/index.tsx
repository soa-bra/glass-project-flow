import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TAB_ITEMS } from './types';
import { TrendingUp, TrendingDown, Clock, FileText, ListCheck } from 'lucide-react';

// عناصر الإحصاءات العلوية كما في التصميم
const topStats = [
  {
    label: 'عدد المستخدمين',
    value: 150,
    desc: 'المستخدمين في المنصة',
    icon: <TrendingUp size={22} strokeWidth={1.5} />,
  },
  {
    label: 'الطلبات',
    value: 5,
    desc: 'طلبات جديدة اليوم',
    icon: <ListCheck size={22} strokeWidth={1.5} />,
  },
  {
    label: 'عقود منتهية',
    value: 3,
    desc: 'بحاجة لتجديد',
    icon: <FileText size={22} strokeWidth={1.5} />,
  },
  {
    label: 'متأخر',
    value: 3,
    desc: 'مهام متاخرة',
    icon: <Clock size={22} strokeWidth={1.5} />,
  },
];

const tabClass = (active: boolean) =>
  `font-arabic rounded-xl px-7 py-2.5 text-base transition-all 
   ${active ? 'bg-black text-white shadow-sm' : 'bg-white/0 border border-gray-300 text-black hover:bg-gray-200'} 
   font-semibold`;

export const OperationsBoard = ({
  isSidebarCollapsed
}: {
  isSidebarCollapsed: boolean;
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div
      className="fixed transition-all duration-500 ease-in-out operations-board-expanded"
      style={{
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        borderRadius: '28px',
        background: '#d6e8eb', // تم تغيير اللون هنا
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 30,
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: 'rtl'
      }}
    >
      {/* رأس اللوحة (العنوان + أزرار التبويب) */}
      <div className="w-full px-8 pt-8 pb-2 flex items-center justify-between">
        <div>
          <h2 className="text-[2rem] md:text-[2.1rem] font-black tracking-tight m-0 pb-1 font-arabic"
            style={{
              color: '#181b29',
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
            }}>لوحة الإدارة والتشغيل</h2>
        </div>
        {/* أزرار التبويبات */}
        <div className="flex gap-2.5 mt-1 mb-1">
          {TAB_ITEMS.map(tab =>
            <button
              type="button"
              key={tab.value}
              className={tabClass(activeTab === tab.value)}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          )}
        </div>
      </div>
      {/* سطر الإحصائيات الفورية */}
      <div className="w-full flex justify-between items-center gap-4 px-8 pb-2">
        {topStats.map((stat, idx) => (
          <div
            key={stat.label}
            className="flex items-center justify-end gap-3 flex-1 min-w-0"
            style={{
              background: 'none',
              boxShadow: 'none'
            }}
          >
            <div className="flex flex-col items-end text-right">
              <span className="text-[1.3rem] font-extrabold font-arabic leading-tight block text-black mb-0">
                {stat.value}
              </span>
              <span className="text-[14px] text-black/75 font-medium font-arabic">{stat.label}</span>
              <span className="text-[12px] text-gray-500 font-arabic mt-0">{stat.desc}</span>
            </div>
            <span className="bg-white/45 rounded-full p-2.5 flex items-center justify-center ml-2 border border-gray-300 shadow-sm"
                  style={{
                    boxShadow: 'inset 0 1px 5px 0 rgba(40,90,150,0.10)'
                  }}>
              {stat.icon}
            </span>
          </div>
        ))}
      </div>
      {/* شريط الأحداث القادمة */}
      <div className="w-full px-6 pt-3 pb-2">
        <div style={{
          background: '#f2ffff',
          borderRadius: 24,
          boxShadow: '0 1px 10px 0 rgba(100,180,200,0.04) inset',
          border: '1px solid #e6ecef'
        }} className="w-full py-6 px-8 flex flex-col gap-1 backdrop-blur-[10px]">
          <div className="text-xl font-arabic font-bold mb-4 text-black">الأحداث القادمة</div>
          {/* عناصر الخط الزمني الحقيقي تُدرج هنا وليس عنصر placeholder */}
          {/* إذا لم يكن هناك بيانات بعد اترك المساحة فارغة (بدون عناصر اختبار أو مكونات سوف تطور لاحقا) */}
        </div>
      </div>
      {/* شبكة البطاقات الرئيسية */}
      <div className="w-full flex-1 px-6 py-4">
        <div className="grid grid-cols-3 grid-rows-3 gap-5 h-full w-full">
          {/* عمود 1, صف 1&2: النظرة المالية */}
          <div className="row-span-2 rounded-3xl shadow-inner bg-[#f2ffff] border border-[#e2f3f8] p-6 flex flex-col justify-between animate-fade-in" style={{
            boxShadow: '0 4px 30px 0 rgba(60,160,200,0.05) inset',
            minHeight: '280px',
            // Glassmorphism
            background: 'rgba(242,255,255,0.97)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="text-lg font-arabic font-extrabold text-black mb-2">النظرة المالية</div>
            <div className="flex items-center justify-between flex-1 w-full gap-0">
              <div className="relative flex-1 flex items-center justify-center">
                {/* عدّاد حلقي فقط */}
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="53" fill="#fff" stroke="#c8f4e1" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="53" fill="none" stroke="#29936c" strokeWidth="10"
                    strokeDasharray={340}
                    strokeDashoffset={90}
                    style={{ transition: 'stroke-dashoffset 0.55s ease-out' }}
                  />
                  <text x="60" y="72" textAnchor="middle" fontSize="38" fontWeight="bold" fill="#181b29">92</text>
                  <text x="60" y="102" textAnchor="middle" fontSize="15" fill="#29936c">Load Score</text>
                </svg>
              </div>
              {/* معلومات القيم الجانبية */}
              <div className="flex flex-col items-end gap-2 pr-5 flex-1">
                <div className="text-black text-base font-extrabold">02</div>
                <div className="text-[#182236] text-sm">مصروفات</div>
                <div className="text-black text-base font-extrabold mt-3">14</div>
                <div className="text-[#182236] text-sm">مداخيل</div>
                <div className="text-black text-base font-extrabold mt-3">78</div>
                <div className="text-[#182236] text-sm">أخرى</div>
              </div>
            </div>
          </div>
          {/* عمود 2, صف 1: ملخص المهام */}
          <div className="rounded-3xl shadow-inner bg-[#f2ffff] border border-[#e2f3f8] p-6 min-h-[130px] flex flex-col animate-fade-in delay-100" style={{
            background: 'rgba(242,255,255,0.97)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="text-lg font-arabic font-extrabold text-black mb-2">ملخّص المهام</div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center">
                <span className="text-black text-xl font-black">46</span>
                <span className="text-gray-500 text-xs mt-0.5">قيد الانتظار</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-black text-xl font-black">14</span>
                <span className="text-gray-500 text-xs mt-0.5">قيد التنفيذ</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-black text-xl font-black">72</span>
                <span className="text-gray-500 text-xs mt-0.5">مكتملة</span>
              </div>
            </div>
          </div>
          {/* عمود 3, صف 1: مقياس الأداء */}
          <div className="rounded-3xl shadow-inner bg-[#f2ffff] border border-[#e2f3f8] p-6 min-h-[130px] flex flex-col animate-fade-in delay-200" style={{
            background: 'rgba(242,255,255,0.97)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="text-lg font-arabic font-extrabold text-black mb-2">مقياس الأداء</div>
            <div className="flex flex-row-reverse items-center flex-1 h-full w-full gap-3 mt-2 justify-between">
              <div className="flex flex-col justify-end gap-2 items-end">
                {[28, 55, 40, 62].map((h, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="flex gap-0.5">
                      <div style={{
                        height: `${h}px`, width: 12, background: '#29936c', borderRadius: 6,
                        boxShadow: '0 1px 3px 0 rgba(30,190,180,.05)'
                      }} />
                      <div style={{
                        height: `${h / 2}px`, width: 12, background: '#181b29', borderRadius: 6,
                        marginTop: `${h / 2}px`, position: 'relative', zIndex: 2
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center flex flex-col items-start mr-2">
                <div className="text-3xl font-extrabold font-arabic text-black">85%</div>
                <div className="text-xs font-arabic text-gray-700">نسبة الأداء العام</div>
              </div>
            </div>
          </div>
          {/* عمود 2, صف 2: بطاقة رسم خطي */}
          <div className="rounded-3xl shadow-inner bg-[#f2ffff] border border-[#e2f3f8] p-6 min-h-[130px] flex flex-col animate-fade-in delay-150" style={{
            background: 'rgba(242,255,255,0.97)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="text-lg font-arabic font-extrabold text-black mb-2">تحليل الطلبات</div>
            <div className="flex items-center gap-3 flex-1">
              <svg width="80" height="36" viewBox="0 0 80 36">
                <polyline
                  fill="none"
                  stroke="#29936c"
                  strokeWidth="3"
                  points="0,27 10,20 20,12 30,26 40,12 50,22 60,10 70,18 80,5"
                />
              </svg>
              <div className="flex flex-col items-end">
                <span className="text-black text-xl font-extrabold">3</span>
                <span className="text-xs font-arabic text-gray-400">ملصقات</span>
              </div>
            </div>
          </div>
          {/* عمود 3, صف 2: دائرة بيانات + تعليق */}
          <div className="rounded-3xl shadow-inner bg-[#f2ffff] border border-[#e2f3f8] p-6 min-h-[130px] flex flex-col animate-fade-in delay-200" style={{
            background: 'rgba(242,255,255,0.97)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="text-lg font-arabic font-extrabold text-black mb-2">بيانات <span className="text-black font-normal">اقترحها الذكاء الصناعي</span></div>
            <div className="flex items-center gap-5 flex-1">
              <div className="relative">
                <svg width="54" height="54">
                  <circle cx="27" cy="27" r="24" fill="#e9f6fc"/>
                  <circle cx="27" cy="27" r="24" fill="none"
                    stroke="#29936c" strokeWidth="6"
                    strokeDasharray={151}
                    strokeDashoffset={36}
                    style={{transition: 'stroke-dashoffset .6s ease-out'}}
                  />
                  <text x="27" y="32" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#181b29">75%</text>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-black font-arabic text-xs">تحليل الفريق يشير أن المؤشر بخطر منخفض</div>
              </div>
            </div>
          </div>
          {/* عمود 1, صف 3: تنبيهات (يشارك جزء من العمود الثاني) */}
          <div className="col-span-2 rounded-3xl shadow-inner bg-[#f2ffff] border border-[#e2f3f8] min-h-[110px] flex flex-col p-6 animate-fade-in delay-300" style={{
            background: 'rgba(242,255,255,0.97)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="text-lg font-arabic font-extrabold text-black mb-2">التنبيهات</div>
            <div className="text-black/80 font-arabic text-sm mt-5">لا توجد تنبيهات حاليا...</div>
          </div>
          {/* عمود 3, صف 3: ملخص المشاريع (مخطط بياني) */}
          <div className="rounded-3xl shadow-inner bg-[#a4e2f6]/80 border border-[#d1ecf8] min-h-[110px] flex flex-col p-6 items-center justify-center animate-fade-in delay-350" style={{
            background: 'rgba(242,255,255,0.97)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="text-base font-arabic font-extrabold text-black mb-2">ملخص المشاريع</div>
            <div className="flex items-end gap-3 w-full justify-between mt-2 px-2">
              {[24, 32, 20, 17, 27].map((h, i) => (
                <div key={i} className="flex flex-col-reverse items-center gap-1">
                  <div style={{
                    height: `${h}px`,
                    width: 17,
                    borderRadius: 7,
                    background: 'rgba(41,147,108,0.5)',
                    boxShadow: '0 1px 10px #e4f3ef inset'
                  }} />
                  <span className="text-xs font-arabic text-black block">{['وفق الخطة', 'تحت الإعداد', 'متوقف', 'متأخر', 'تحت المعالجة'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fade-in-card 0.60s cubic-bezier(.36,.2,.05,1.05) both;
        }
        .animate-fade-in.delay-100 { animation-delay: .08s }
        .animate-fade-in.delay-150 { animation-delay: .13s }
        .animate-fade-in.delay-200 { animation-delay: .18s }
        .animate-fade-in.delay-300 { animation-delay: .27s }
        .animate-fade-in.delay-350 { animation-delay: .33s }
        @keyframes fade-in-card {
          0% { opacity: 0; transform: translateY(18px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default OperationsBoard;

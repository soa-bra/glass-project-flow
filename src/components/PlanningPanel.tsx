import React from 'react';
interface PlanningPanelProps {
  isMainSidebarCollapsed: boolean;
}
const PlanningPanelLayout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  return <div style={{
    background: 'var(--backgrounds-admin-ops-board-bg)'
  }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto px-0 mx-0 bg-[#d9e7ed]">
          <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>;
};
const PlanningPanel: React.FC<PlanningPanelProps> = ({
  isMainSidebarCollapsed
}) => {
  return (
    <PlanningPanelLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-black mb-8">لوحة التخطيط التشاركي</h2>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">المشاريع النشطة</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <p className="text-sm text-gray-600">مشروع جاري</p>
          </div>
          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">الفرق المشاركة</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <p className="text-sm text-gray-600">فريق نشط</p>
          </div>
          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">المهام المكتملة</h3>
            <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
            <p className="text-sm text-gray-600">مهمة هذا الشهر</p>
          </div>
          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">معدل الإنجاز</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
            <p className="text-sm text-gray-600">من الأهداف</p>
          </div>
        </div>

        {/* Main Planning Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strategic Planning */}
          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-black mb-6">التخطيط الاستراتيجي</h3>
            <div className="space-y-4">
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium text-black mb-2">الأهداف طويلة المدى</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">توسيع نطاق الخدمات</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">جاري</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">تحسين رضا العملاء</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">مكتمل</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium text-black mb-2">المؤشرات الرئيسية</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">الإيرادات</span>
                    <span className="text-sm font-semibold text-green-600">+15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">العملاء الجدد</span>
                    <span className="text-sm font-semibold text-blue-600">+22%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Planning */}
          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-black mb-6">تخطيط الفرق</h3>
            <div className="space-y-4">
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium text-black mb-2">الفرق النشطة</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">فريق التطوير</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">8 أعضاء</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">فريق التسويق</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">5 أعضاء</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">فريق المبيعات</span>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">6 أعضاء</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium text-black mb-2">توزيع العبء</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">متوسط العبء</span>
                    <span className="text-sm font-semibold text-orange-600">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">الفرق المتاحة</span>
                    <span className="text-sm font-semibold text-green-600">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Planning Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">الجداول الزمنية</h3>
            <div className="space-y-3">
              <div className="bg-white/50 rounded-lg p-3">
                <span className="text-sm font-medium text-black">مراجعة ربعية</span>
                <p className="text-xs text-gray-600 mt-1">15 مارس 2024</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <span className="text-sm font-medium text-black">إطلاق المنتج</span>
                <p className="text-xs text-gray-600 mt-1">30 أبريل 2024</p>
              </div>
            </div>
          </div>

          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">تحليل البيانات</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black">معدل النجاح</span>
                <span className="text-sm font-semibold text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black">الكفاءة العامة</span>
                <span className="text-sm font-semibold text-blue-600">88%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">الابتكار والتطوير</h3>
            <div className="space-y-3">
              <div className="bg-white/50 rounded-lg p-3">
                <span className="text-sm font-medium text-black">أفكار جديدة</span>
                <p className="text-xs text-gray-600 mt-1">12 فكرة قيد المراجعة</p>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <span className="text-sm font-medium text-black">مشاريع R&D</span>
                <p className="text-xs text-gray-600 mt-1">3 مشاريع نشطة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlanningPanelLayout>
  );
};

export default PlanningPanel;
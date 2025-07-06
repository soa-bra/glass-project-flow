import React from 'react';
import CanvasBoardContents from './CanvasBoard/CanvasBoardContents';
interface PlanningPanelProps {
  selectedCategory: string | null;
  isMainSidebarCollapsed: boolean;
  isPlanningSidebarCollapsed: boolean;
}
const PlanningPanelLayout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  return <div style={{
    background: 'var(--backgrounds-admin-ops-board-bg)'
  }} className="h-full rounded-3xl overflow-hidden">
      
    </div>;
};
const PlanningPanel: React.FC<PlanningPanelProps> = ({
  selectedCategory,
  isMainSidebarCollapsed,
  isPlanningSidebarCollapsed
}) => {
  const renderContent = () => {
    if (!selectedCategory) {
      return <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">التخطيط التشاركي</h2>
            <p className="text-lg text-gray-600 mb-8">اختر فئة من القائمة الجانبية لبدء التخطيط</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-black mb-2">التخطيط الاستراتيجي</h3>
                <p className="text-sm text-gray-700">وضع الخطط طويلة المدى وتحديد الأهداف الاستراتيجية</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-black mb-2">تخطيط المشاريع</h3>
                <p className="text-sm text-gray-700">إدارة وتخطيط المشاريع بشكل تشاركي</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-black mb-2">تخطيط الفرق</h3>
                <p className="text-sm text-gray-700">تنسيق العمل بين الفرق المختلفة</p>
              </div>
            </div>
          </div>
        </div>;
    }

    // Render content based on selected category
    switch (selectedCategory) {
      case 'canvas':
        return <CanvasBoardContents 
          projectId="PROJECT_001" 
          userId="USER_001" 
          userRole="manager" 
        />;
      case 'strategic':
        return <div className="p-6">
            <h2 className="text-2xl font-bold text-black mb-6">التخطيط الاستراتيجي</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black mb-4">الأهداف الاستراتيجية</h3>
                <div className="space-y-3">
                  <div className="bg-white/50 rounded-lg p-3">
                    <h4 className="font-medium text-black">توسيع نطاق الخدمات</h4>
                    <p className="text-sm text-gray-600 mt-1">زيادة تنوع الخدمات المقدمة بنسبة 30%</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <h4 className="font-medium text-black">تحسين رضا العملاء</h4>
                    <p className="text-sm text-gray-600 mt-1">الوصول لمعدل رضا 95% خلال العام</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black mb-4">المؤشرات الرئيسية</h3>
                <div className="space-y-3">
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
          </div>;
      case 'projects':
        return <div className="p-6">
            <h2 className="text-2xl font-bold text-black mb-6">تخطيط المشاريع</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black mb-4">المشاريع الجارية</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <p className="text-sm text-gray-600">مشروع نشط</p>
              </div>
              <div className="bg-white/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black mb-4">المشاريع المخططة</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">8</div>
                <p className="text-sm text-gray-600">مشروع في التخطيط</p>
              </div>
              <div className="bg-white/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black mb-4">المشاريع المكتملة</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">25</div>
                <p className="text-sm text-gray-600">مشروع مكتمل</p>
              </div>
            </div>
          </div>;
      case 'teams':
        return <div className="p-6">
            <h2 className="text-2xl font-bold text-black mb-6">تخطيط الفرق</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black mb-4">الفرق النشطة</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                    <span className="font-medium text-black">فريق التطوير</span>
                    <span className="text-sm text-blue-600">8 أعضاء</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                    <span className="font-medium text-black">فريق التسويق</span>
                    <span className="text-sm text-green-600">5 أعضاء</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black mb-4">توزيع العبء</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">متوسط العبء</span>
                    <span className="text-sm font-semibold text-orange-600">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">الفرق المتاحة</span>
                    <span className="text-sm font-semibold text-green-600">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>;
      default:
        return <div className="p-6">
            <h2 className="text-2xl font-bold text-black mb-6">
              {selectedCategory === 'timeline' && 'الجداول الزمنية'}
              {selectedCategory === 'performance' && 'تخطيط الأداء'}
              {selectedCategory === 'analytics' && 'تحليل البيانات'}
              {selectedCategory === 'innovation' && 'التخطيط للابتكار'}
              {selectedCategory === 'documentation' && 'التوثيق والتقارير'}
              {selectedCategory === 'settings' && 'إعدادات التخطيط'}
            </h2>
            <div className="bg-white/30 rounded-xl p-6">
              <p className="text-gray-600">محتوى هذا القسم قيد التطوير...</p>
            </div>
          </div>;
    }
  };
  return <PlanningPanelLayout>
      {renderContent()}
    </PlanningPanelLayout>;
};
export default PlanningPanel;
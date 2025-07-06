import React from 'react';
import { CanvasBoardContents } from './CollaborativePlanning';

interface PlanningPanelProps {
  selectedCategory: string | null;
  isMainSidebarCollapsed: boolean;
  isPlanningSidebarCollapsed: boolean;
}

const PlanningPanel: React.FC<PlanningPanelProps> = ({
  selectedCategory,
  isMainSidebarCollapsed,
  isPlanningSidebarCollapsed
}) => {
  // Render the collaborative planning canvas for the main planning experience
  if (selectedCategory === 'canvas' || selectedCategory === 'strategic' || selectedCategory === 'projects' || selectedCategory === 'teams') {
    return (
      <div style={{ background: 'var(--backgrounds-project-mgmt-board-bg)' }} className="h-full rounded-3xl overflow-hidden">
        <CanvasBoardContents selectedCategory={selectedCategory} />
      </div>
    );
  }

  // Default content for other categories or when no category is selected
  const renderContent = () => {
    if (!selectedCategory) {
      return (
        <div className="h-full flex items-center justify-center" style={{ background: 'var(--backgrounds-admin-ops-board-bg)' }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">التخطيط التشاركي</h2>
            <p className="text-lg text-gray-600 mb-8">اختر فئة من القائمة الجانبية لبدء التخطيط</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 cursor-pointer hover:bg-white/30 transition-colors">
                <h3 className="text-lg font-semibold text-black mb-2">لوحة التخطيط التشاركي</h3>
                <p className="text-sm text-gray-700">إنشاء وتحرير الخطط بشكل تعاوني مع الذكاء الاصطناعي</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-black mb-2">الجداول الزمنية</h3>
                <p className="text-sm text-gray-700">إنشاء وإدارة الجداول الزمنية للمشاريع</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-black mb-2">تحليل البيانات</h3>
                <p className="text-sm text-gray-700">تحليل بيانات التخطيط والأداء</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6" style={{ background: 'var(--backgrounds-admin-ops-board-bg)' }}>
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
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--backgrounds-admin-ops-board-bg)' }} className="h-full rounded-3xl overflow-hidden">
      {renderContent()}
    </div>
  );
};
export default PlanningPanel;
import React, { useState } from 'react';

interface PlanningPanelProps {
  selectedCategory: string | null;
  isMainSidebarCollapsed: boolean;
  isPlanningSidebarCollapsed: boolean;
}

interface CanvasBoardContentsProps {
  projectId: string;
  userId: string;
}

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({ projectId, userId }) => {
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [layers, setLayers] = useState<any[]>([]);

  return (
    <div className="relative h-full bg-white overflow-hidden" style={{ margin: '10px' }}>
      {/* Canvas Layer System - Main area */}
      <div className="w-full h-full">
        <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <div className="text-2xl font-bold mb-2">لوحة التخطيط التشاركي</div>
              <div className="text-lg">الأداة المحددة: {selectedTool}</div>
              <div className="text-sm text-gray-400 mt-2">المشروع: {projectId} | المستخدم: {userId}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Properties Bar - Bottom Left */}
      <div className="absolute bottom-4 left-4 w-72">
        <div className="bg-white rounded-lg shadow-lg border p-3">
          <div className="text-sm">
            <div className="font-medium mb-2">خصائص الأداة</div>
            <div className="text-gray-600">الأداة: {selectedTool}</div>
            {selectedElementId && <div className="text-gray-600">العنصر: {selectedElementId}</div>}
          </div>
        </div>
      </div>

      {/* Inspector - Top Right */}
      <div className="absolute top-4 right-4 w-80">
        <div className="bg-white rounded-lg shadow-lg border p-4">
          <div className="text-sm">
            <div className="font-medium mb-3">المفتش</div>
            {selectedElementId ? (
              <div className="space-y-2">
                <div className="text-gray-600">العنصر المحدد: {selectedElementId}</div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">الخصائص:</div>
                  <div className="text-xs text-gray-600">العرض: 100px</div>
                  <div className="text-xs text-gray-600">الارتفاع: 100px</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">لا يوجد عنصر محدد</div>
            )}
          </div>
        </div>
      </div>

      {/* AI Panel - Bottom Right */}
      <div className="absolute bottom-4 right-4 w-80">
        <div className="bg-white rounded-lg shadow-lg border p-4">
          <div className="text-sm">
            <div className="font-medium mb-3">مساعد الذكاء الاصطناعي</div>
            <div className="space-y-3">
              <div className="text-gray-600">الوضع: التخطيط</div>
              <div className="text-gray-600">المشروع: {projectId}</div>
              {selectedElementId && (
                <div className="text-gray-600">العنصر: {selectedElementId}</div>
              )}
              <button className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                اقتراحات AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Toolbar - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-lg shadow-lg border p-2">
          <div className="flex gap-2">
            {[
              { id: 'select', name: 'تحديد', icon: '👆' },
              { id: 'draw', name: 'رسم', icon: '✏️' },
              { id: 'text', name: 'نص', icon: '📝' },
              { id: 'shape', name: 'شكل', icon: '🔷' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded text-sm transition-colors ${
                  selectedTool === tool.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{tool.icon}</span>
                <span className="text-xs">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
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
  selectedCategory,
  isMainSidebarCollapsed,
  isPlanningSidebarCollapsed
}) => {
  const renderContent = () => {
    // Always show the canvas board for collaborative planning
    return (
      <CanvasBoardContents 
        projectId="project-001" 
        userId="user-001" 
      />
    );

    // Legacy category-based content (keeping for reference)
    /* 
    if (!selectedCategory) {
      return;
    }

    // Render content based on selected category
    switch (selectedCategory) {
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
    */
  };
  return <PlanningPanelLayout>
      {renderContent()}
    </PlanningPanelLayout>;
};
export default PlanningPanel;
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BusinessWidgetType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'management' | 'finance' | 'customer' | 'operations';
  size: { width: number; height: number };
  color: string;
}

interface BusinessWidgetsPanelProps {
  onAddWidget: (widgetType: BusinessWidgetType) => void;
}

export const BusinessWidgetsPanel: React.FC<BusinessWidgetsPanelProps> = ({ onAddWidget }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const widgetTypes: BusinessWidgetType[] = [
    {
      id: 'project_cards',
      name: 'بطاقات المشاريع',
      description: 'عرض ومتابعة جميع المشاريع الجارية والمكتملة',
      icon: '📋',
      category: 'management',
      size: { width: 400, height: 500 },
      color: 'from-accent-blue to-accent-green'
    },
    {
      id: 'finance_widget',
      name: 'لوحة المالية',
      description: 'متابعة الميزانيات والمصروفات والتحليل المالي',
      icon: '💰',
      category: 'finance',
      size: { width: 380, height: 480 },
      color: 'from-accent-green to-accent-blue'
    },
    {
      id: 'crm_widget',
      name: 'أنشطة CRM',
      description: 'إدارة العلاقات مع العملاء والأنشطة التجارية',
      icon: '👥',
      category: 'customer',
      size: { width: 420, height: 520 },
      color: 'from-purple-500 to-accent-blue'
    },
    {
      id: 'csr_widget',
      name: 'خدمة العملاء',
      description: 'متابعة طلبات الدعم وخدمة العملاء',
      icon: '🎧',
      category: 'customer',
      size: { width: 400, height: 500 },
      color: 'from-accent-red to-orange-500'
    }
  ];

  const categories = [
    { id: 'all', name: 'جميع الودجت', icon: '📊' },
    { id: 'management', name: 'الإدارة', icon: '📈' },
    { id: 'finance', name: 'المالية', icon: '💰' },
    { id: 'customer', name: 'العملاء', icon: '👥' },
    { id: 'operations', name: 'العمليات', icon: '⚙️' }
  ];

  const filteredWidgets = selectedCategory === 'all' 
    ? widgetTypes 
    : widgetTypes.filter(widget => widget.category === selectedCategory);

  const handleAddWidget = (widget: BusinessWidgetType) => {
    // Add widget to canvas
    onAddWidget(widget);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-black mb-2">ودجت الأعمال</h3>
        <p className="text-sm text-gray-600">
          اسحب الودجت إلى اللوحة لإضافتها
        </p>
      </div>

      {/* Category Tabs */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredWidgets.map((widget, index) => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => handleAddWidget(widget)}
            >
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-black hover:shadow-lg transition-all duration-200">
                {/* Widget Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${widget.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {widget.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-black text-sm">
                        {widget.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {widget.size.width} × {widget.size.height}
                      </p>
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
                      +
                    </div>
                  </div>
                </div>

                {/* Widget Description */}
                <p className="text-sm text-gray-600 mb-3">
                  {widget.description}
                </p>

                {/* Widget Features */}
                <div className="flex flex-wrap gap-1">
                  {widget.id === 'project_cards' && (
                    <>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">إحصائيات المشاريع</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">تتبع التقدم</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">إدارة الفرق</span>
                    </>
                  )}
                  {widget.id === 'finance_widget' && (
                    <>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">تتبع الميزانية</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">تحليل المصروفات</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">تقارير مالية</span>
                    </>
                  )}
                  {widget.id === 'crm_widget' && (
                    <>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">إدارة العملاء</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">تتبع الصفقات</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">متابعة الأنشطة</span>
                    </>
                  )}
                  {widget.id === 'csr_widget' && (
                    <>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">طلبات الدعم</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">متابعة الحلول</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">تقييم الرضا</span>
                    </>
                  )}
                </div>

                {/* Add Button */}
                <div className="mt-4 text-center">
                  <button className="w-full bg-gray-100 text-black py-2 rounded-xl text-sm font-medium hover:bg-black hover:text-white transition-all group-hover:bg-black group-hover:text-white">
                    إضافة إلى اللوحة
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredWidgets.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">لا توجد ودجت في هذه الفئة</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">
            💡 نصيحة: يمكنك سحب الودجت مباشرة إلى اللوحة
          </p>
          <div className="text-xs text-gray-500">
            {filteredWidgets.length} ودجت متاح
          </div>
        </div>
      </div>
    </div>
  );
};
/**
 * BasePageHeader Stories - قصص مكون رأس الصفحة
 */
import React from 'react';
import { BasePageHeader } from '@/components/shared/BasePageHeader';
import { Home, Settings, Users, FileText, BarChart3, Plus, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default {
  title: 'Components/BasePageHeader',
  component: BasePageHeader,
};

// Basic Usage
export const BasicUsage = () => (
  <div className="p-8 space-y-8 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">📋 الاستخدام الأساسي</h2>
    
    <BasePageHeader title="لوحة التحكم" />
    
    <BasePageHeader 
      title="المشاريع"
      subtitle="إدارة جميع مشاريعك من مكان واحد"
    />
  </div>
);

// With Icons
export const WithIcons = () => (
  <div className="p-8 space-y-8 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">🎨 مع أيقونات</h2>
    
    <BasePageHeader 
      title="الرئيسية"
      icon={Home}
    />
    
    <BasePageHeader 
      title="الإعدادات"
      subtitle="تخصيص إعدادات حسابك"
      icon={Settings}
    />
    
    <BasePageHeader 
      title="الموظفين"
      subtitle="إدارة فريق العمل"
      icon={Users}
    />
  </div>
);

// With Actions
export const WithActions = () => (
  <div className="p-8 space-y-8 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">⚡ مع أزرار الإجراءات</h2>
    
    <BasePageHeader 
      title="المشاريع"
      subtitle="إدارة جميع مشاريعك"
      icon={FileText}
      actions={
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          مشروع جديد
        </Button>
      }
    />
    
    <BasePageHeader 
      title="التقارير"
      subtitle="عرض وتحليل البيانات"
      icon={BarChart3}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            تصفية
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            تصدير
          </Button>
        </div>
      }
    />
  </div>
);

// Different Pages Examples
export const DifferentPagesExamples = () => (
  <div className="p-8 space-y-8 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">🌍 أمثلة صفحات متنوعة</h2>
    
    <div className="bg-panel p-4 rounded-xl">
      <BasePageHeader 
        title="لوحة التحكم الرئيسية"
        subtitle="نظرة شاملة على أداء المؤسسة"
        icon={Home}
        actions={
          <Button variant="outline" size="sm">
            تحديث البيانات
          </Button>
        }
      />
    </div>
    
    <div className="bg-panel p-4 rounded-xl">
      <BasePageHeader 
        title="إدارة الموظفين"
        subtitle="عرض وتعديل بيانات الموظفين"
        icon={Users}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة موظف
            </Button>
          </div>
        }
      />
    </div>
    
    <div className="bg-panel p-4 rounded-xl">
      <BasePageHeader 
        title="إعدادات النظام"
        subtitle="تخصيص إعدادات التطبيق والحساب"
        icon={Settings}
      />
    </div>
  </div>
);

// Minimal Style
export const MinimalStyle = () => (
  <div className="p-8 space-y-8 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">✨ تصميم بسيط</h2>
    
    <BasePageHeader title="العنوان فقط" />
    
    <BasePageHeader 
      title="العنوان مع الوصف"
      subtitle="وصف مختصر للصفحة"
    />
  </div>
);

import React from 'react';
import { User, Shield, Bell, Settings, Database, Palette, Globe, Key, Monitor, CreditCard, Users, Building } from 'lucide-react';

interface GenericSettingsPanelProps {
  category: string;
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const GenericSettingsPanel: React.FC<GenericSettingsPanelProps> = ({ 
  category,
  isMainSidebarCollapsed,
  isSettingsSidebarCollapsed 
}) => {
  const getCategoryInfo = (categoryKey: string) => {
    const categories: Record<string, { title: string; icon: React.ComponentType<any>; description: string }> = {
      profile: { 
        title: 'الملف الشخصي', 
        icon: User, 
        description: 'إدارة معلوماتك الشخصية وتفضيلاتك' 
      },
      security: { 
        title: 'الأمان والخصوصية', 
        icon: Shield, 
        description: 'ضبط إعدادات الأمان وحماية البيانات' 
      },
      notifications: { 
        title: 'الإشعارات', 
        icon: Bell, 
        description: 'تخصيص تفضيلات الإشعارات والتنبيهات' 
      },
      system: { 
        title: 'إعدادات النظام', 
        icon: Settings, 
        description: 'إعدادات النظام العامة والتكوين' 
      },
      database: { 
        title: 'قاعدة البيانات', 
        icon: Database, 
        description: 'إدارة قاعدة البيانات والنسخ الاحتياطي' 
      },
      appearance: { 
        title: 'المظهر والواجهة', 
        icon: Palette, 
        description: 'تخصيص مظهر النظام والواجهة' 
      },
      integrations: { 
        title: 'التكاملات', 
        icon: Globe, 
        description: 'ربط النظام مع الخدمات الخارجية' 
      },
      access: { 
        title: 'الصلاحيات والوصول', 
        icon: Key, 
        description: 'إدارة صلاحيات المستخدمين والوصول' 
      },
      display: { 
        title: 'إعدادات العرض', 
        icon: Monitor, 
        description: 'تخصيص إعدادات العرض والشاشة' 
      },
      billing: { 
        title: 'الفوترة والاشتراكات', 
        icon: CreditCard, 
        description: 'إدارة الفوترة والخطط والمدفوعات' 
      },
      team: { 
        title: 'إدارة الفريق', 
        icon: Users, 
        description: 'إدارة أعضاء الفريق والأدوار' 
      },
      organization: { 
        title: 'إعدادات المؤسسة', 
        icon: Building, 
        description: 'إعدادات المؤسسة والهيكل التنظيمي' 
      }
    };
    
    return categories[categoryKey] || { 
      title: 'إعدادات', 
      icon: Settings, 
      description: 'إعدادات النظام' 
    };
  };

  const categoryInfo = getCategoryInfo(category);
  const IconComponent = categoryInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#96d8d0] rounded-3xl p-6 border border-black/10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-black">{categoryInfo.title}</h2>
            <p className="text-sm text-black/80">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
        <div className="text-center py-12">
          <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            إعدادات {categoryInfo.title}
          </h3>
          <p className="text-gray-600 mb-6">
            سيتم إضافة خيارات الإعدادات الخاصة بـ {categoryInfo.title} هنا قريباً
          </p>
          <div className="bg-white/60 rounded-2xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              💡 هذا القسم قيد التطوير وسيحتوي على جميع الإعدادات والخيارات المتعلقة بـ {categoryInfo.title}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#F2FFFF] rounded-3xl p-4 border border-black/10 text-center">
          <h4 className="font-semibold text-black mb-2">إعدادات سريعة</h4>
          <p className="text-sm text-gray-600">الوصول للإعدادات الأكثر استخداماً</p>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-4 border border-black/10 text-center">
          <h4 className="font-semibold text-black mb-2">مساعدة</h4>
          <p className="text-sm text-gray-600">الحصول على المساعدة والتوجيه</p>
        </div>
        <div className="bg-[#F2FFFF] rounded-3xl p-4 border border-black/10 text-center">
          <h4 className="font-semibold text-black mb-2">الافتراضي</h4>
          <p className="text-sm text-gray-600">استعادة الإعدادات الافتراضية</p>
        </div>
      </div>
    </div>
  );
};
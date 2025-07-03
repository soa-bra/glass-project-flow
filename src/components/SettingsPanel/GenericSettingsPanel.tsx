import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Settings, Database, Palette, Globe, Key, Monitor, CreditCard, Users, Building } from 'lucide-react';
import { useAutosave } from './hooks/useAutosave';

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
  const getCategoryInfo = (categoryKey: string): { title: string; icon: React.ComponentType<any>; description: string; hasWizard?: boolean } => {
    const categories: Record<string, { title: string; icon: React.ComponentType<any>; description: string; hasWizard?: boolean }> = {
      account: { 
        title: 'الحساب الشخصي', 
        icon: User, 
        description: 'إدارة معلوماتك الشخصية وتفضيلاتك' 
      },
      security: { 
        title: 'الخصوصية والأمان', 
        icon: Shield, 
        description: 'ضبط إعدادات الأمان وحماية البيانات' 
      },
      notifications: { 
        title: 'الإشعارات', 
        icon: Bell, 
        description: 'تخصيص تفضيلات الإشعارات والتنبيهات' 
      },
      integrations: { 
        title: 'التكاملات الخارجية', 
        icon: Settings, 
        description: 'ربط النظام مع الخدمات الخارجية' 
      },
      ai: { 
        title: 'الذكاء الاصطناعي', 
        icon: Settings, 
        description: 'إدارة نماذج الذكاء الاصطناعي وتدريبها',
        hasWizard: true
      },
      theme: { 
        title: 'المظهر', 
        icon: Palette, 
        description: 'تخصيص مظهر النظام والواجهة' 
      },
      'data-governance': { 
        title: 'إدارة البيانات', 
        icon: Database, 
        description: 'إدارة قاعدة البيانات والنسخ الاحتياطي' 
      },
      'users-roles': { 
        title: 'المستخدمون والأدوار', 
        icon: Users, 
        description: 'إدارة أعضاء الفريق والأدوار' 
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
  
  // State for form data
  const [formData, setFormData] = useState({
    basicSettings: {},
    advancedSettings: {},
    lastModified: new Date().toISOString()
  });
  
  const [lastAutosave, setLastAutosave] = useState<string>('');
  
  // Mock user ID - in real app this would come from auth context
  const userId = 'user123';
  
  // Autosave functionality
  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000, // 20 seconds
    userId,
    section: category,
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });
  
  // Load draft on component mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft.data);
      setLastAutosave(new Date(draft.timestamp).toLocaleTimeString('ar-SA'));
    }
  }, [category]);

  const handleAITrainingWizard = () => {
    // This would open the AI training wizard with steps: taskType, dataScope, resourcesSchedule
    console.log('Opening AI Training Wizard with steps: taskType, dataScope, resourcesSchedule');
    // In real implementation, this would make a POST request to /ai/train-jobs
  };

  const handleSave = async () => {
    try {
      // This would make a POST request to /settings/<section>/commit
      console.log(`Saving settings to /settings/${category}/commit`);
      
      // Clear the draft after successful save
      clearDraft();
      
      // Trigger settings.updated event
      const event = new CustomEvent('settings.updated', {
        detail: { section: category, data: formData }
      });
      window.dispatchEvent(event);
      
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      basicSettings: {},
      advancedSettings: {},
      lastModified: new Date().toISOString()
    });
    clearDraft();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-black/20">
            <IconComponent className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-black">{categoryInfo.title}</h2>
            <p className="text-sm font-normal text-black">{categoryInfo.description}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">●</div>
            <p className="text-xs font-normal text-gray-400">متصل</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <div className="space-y-6">
          {/* Settings Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div style={{ backgroundColor: '#bdeed3' }} className="rounded-2xl p-4 border border-black/10">
              <h4 className="text-sm font-bold text-black mb-2">إعدادات أساسية</h4>
              <p className="text-xs font-normal text-gray-400">الإعدادات الأساسية للـ {categoryInfo.title}</p>
            </div>
            <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10">
              <h4 className="text-sm font-bold text-black mb-2">خيارات متقدمة</h4>
              <p className="text-xs font-normal text-gray-400">إعدادات متقدمة للمستخدمين المتخصصين</p>
            </div>
          </div>

          {/* AI Training Wizard (only for AI section) */}
          {categoryInfo.hasWizard && (
            <div style={{ backgroundColor: '#96d8d0' }} className="rounded-2xl p-6 border border-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-black mb-2">معالج التدريب</h4>
                  <p className="text-sm font-normal text-black">تدريب نموذج جديد من الأرشيف</p>
                </div>
                <button
                  onClick={handleAITrainingWizard}
                  style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
                  className="px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  تدريب نموذج جديد من الأرشيف
                </button>
              </div>
            </div>
          )}

          {/* Settings Preview */}
          <div className="grid grid-cols-3 gap-4">
            <div style={{ backgroundColor: '#d9d2fd' }} className="rounded-2xl p-4 border border-black/10 text-center">
              <div className="text-2xl font-bold text-black mb-1">12</div>
              <p className="text-xs font-normal text-gray-400">إعدادات مفعلة</p>
            </div>
            <div style={{ backgroundColor: '#f1b5b9' }} className="rounded-2xl p-4 border border-black/10 text-center">
              <div className="text-2xl font-bold text-black mb-1">3</div>
              <p className="text-xs font-normal text-gray-400">تحتاج مراجعة</p>
            </div>
            <div style={{ backgroundColor: '#fbe2aa' }} className="rounded-2xl p-4 border border-black/10 text-center">
              <div className="text-2xl font-bold text-black mb-1">5</div>
              <p className="text-xs font-normal text-gray-400">مسودات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-normal text-gray-400">
          {lastAutosave ? `آخر حفظ تلقائي: ${lastAutosave}` : 'لم يتم الحفظ بعد'}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            style={{ backgroundColor: '#F2FFFF', color: '#000000' }}
            className="px-6 py-2 rounded-full text-sm font-medium border border-black/20 hover:bg-gray-50 transition-colors"
          >
            إعادة تعيين
          </button>
          <button
            onClick={handleSave}
            style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
            className="px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};
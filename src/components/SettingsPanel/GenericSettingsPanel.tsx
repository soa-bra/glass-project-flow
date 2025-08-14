import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Settings, Database, Palette, Globe, Key, Monitor, CreditCard, Users, Building } from 'lucide-react';
import { useAutosave } from './hooks/useAutosave';
import { SoaCard, SoaIcon, SoaTypography, SoaBadge, SoaKPICard } from '@/components/ui';

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
  const getCategoryInfo = (categoryKey: string): { title: string; icon: any; description: string; hasWizard?: boolean } => {
    const categories: Record<string, { title: string; icon: any; description: string; hasWizard?: boolean }> = {
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
      <div className="rounded-card-top border border-soabra-border p-6" style={{ backgroundColor: '#F2FFFF' }}>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-soabra-white/20 rounded-full flex items-center justify-center border border-soabra-ink-30">
            <IconComponent className="w-6 h-6 text-soabra-ink" />
          </div>
          <div className="flex-1">
            <SoaTypography variant="title" className="text-soabra-ink">{categoryInfo.title}</SoaTypography>
            <SoaTypography variant="subtitle" className="text-soabra-ink">{categoryInfo.description}</SoaTypography>
          </div>
          <div className="text-center">
            <div className="text-display-m text-soabra-accent-green">●</div>
            <SoaTypography variant="label" className="text-soabra-ink-60">متصل</SoaTypography>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-card-top border border-soabra-border p-6" style={{ backgroundColor: '#F2FFFF' }}>
        <div className="space-y-6">
          {/* Settings Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-soabra-border p-4" style={{ backgroundColor: '#bdeed3' }}>
              <SoaTypography variant="subtitle" className="text-soabra-ink mb-2">إعدادات أساسية</SoaTypography>
              <SoaTypography variant="label" className="text-soabra-ink-60">الإعدادات الأساسية للـ {categoryInfo.title}</SoaTypography>
            </div>
            <div className="rounded-2xl border border-soabra-border p-4" style={{ backgroundColor: '#a4e2f6' }}>
              <SoaTypography variant="subtitle" className="text-soabra-ink mb-2">خيارات متقدمة</SoaTypography>
              <SoaTypography variant="label" className="text-soabra-ink-60">إعدادات متقدمة للمستخدمين المتخصصين</SoaTypography>
            </div>
          </div>

          {/* AI Training Wizard (only for AI section) */}
          {categoryInfo.hasWizard && (
            <div className="rounded-2xl border border-soabra-border p-6" style={{ backgroundColor: '#96d8d0' }}>
              <div className="flex items-center justify-between">
                <div>
                  <SoaTypography variant="subtitle" className="text-soabra-ink mb-2">معالج التدريب</SoaTypography>
                  <SoaTypography variant="body" className="text-soabra-ink">تدريب نموذج جديد من الأرشيف</SoaTypography>
                </div>
                <button
                  onClick={handleAITrainingWizard}
                  className="bg-soabra-ink text-soabra-white px-6 py-2 rounded-full text-body font-medium hover:opacity-90 transition-opacity"
                >
                  تدريب نموذج جديد من الأرشيف
                </button>
              </div>
            </div>
          )}

          {/* Settings Preview */}
          <div className="grid grid-cols-3 gap-4">
            <SoaKPICard
              title="إعدادات مفعلة"
              value="12"
              icon={Settings}
              variant="success"
            />
            <SoaKPICard
              title="تحتاج مراجعة"
              value="3"
              icon={Settings}
              variant="warning"
            />
            <SoaKPICard
              title="مسودات"
              value="5"
              icon={Settings}
              variant="default"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <SoaTypography variant="label" className="text-soabra-ink-60">
          {lastAutosave ? `آخر حفظ تلقائي: ${lastAutosave}` : 'لم يتم الحفظ بعد'}
        </SoaTypography>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="bg-soabra-panel text-soabra-ink px-6 py-2 rounded-full text-body font-medium border border-soabra-border hover:bg-soabra-ink-30 transition-colors"
          >
            إعادة تعيين
          </button>
          <button
            onClick={handleSave}
            className="bg-soabra-ink text-soabra-white px-6 py-2 rounded-full text-body font-medium hover:opacity-90 transition-opacity"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};
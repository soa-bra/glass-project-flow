
import React, { useState } from 'react';
import { User, Mail, Lock, Globe, Camera } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';
import { BaseActionButton } from '@/components/shared/BaseActionButton';

interface AccountSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const AccountSettingsPanel: React.FC<AccountSettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    profile: {
      firstName: 'أحمد',
      lastName: 'السعودي',
      email: 'ahmed@supra.sa',
      phone: '+966501234567',
      position: 'مدير المشاريع',
      department: 'التسويق'
    },
    preferences: {
      language: 'ar',
      timezone: 'Asia/Riyadh',
      dateFormat: 'dd/mm/yyyy',
      emailNotifications: true
    },
    lastModified: new Date().toISOString()
  });

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'account',
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const handleSave = async () => {
    try {
      clearDraft();
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'account', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving account settings:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          الحساب الشخصي
        </h2>
        <div className="flex items-center gap-3">
          <BaseActionButton
            onClick={handleSave}
            variant="primary"
            size="md"
          >
            حفظ التغييرات
          </BaseActionButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-0 my-[25px]">
        <div className="space-y-6">
          {/* Profile Information */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4">المعلومات الشخصية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">الاسم الأول</label>
                <input
                  type="text"
                  value={formData.profile.firstName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, firstName: e.target.value }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">اسم العائلة</label>
                <input
                  type="text"
                  value={formData.profile.lastName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, lastName: e.target.value }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.profile.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, email: e.target.value }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.profile.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, phone: e.target.value }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4">معلومات العمل</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">المنصب</label>
                <input
                  type="text"
                  value={formData.profile.position}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, position: e.target.value }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">القسم</label>
                <select
                  value={formData.profile.department}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, department: e.target.value }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="التسويق">التسويق</option>
                  <option value="المالية">المالية</option>
                  <option value="الموارد البشرية">الموارد البشرية</option>
                  <option value="القانونية">القانونية</option>
                  <option value="التقنية">التقنية</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4">التفضيلات</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">اللغة</label>
                <select
                  value={formData.preferences.language}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: e.target.value }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">المنطقة الزمنية</label>
                <select
                  value={formData.preferences.timezone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, timezone: e.target.value }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="Asia/Riyadh">الرياض</option>
                  <option value="Asia/Dubai">دبي</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

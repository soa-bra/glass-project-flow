
import React, { useState } from 'react';
import { Shield, Lock, Key, Smartphone, AlertTriangle } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';
import { BaseActionButton } from '@/components/shared/BaseActionButton';

interface SecuritySettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const SecuritySettingsPanel: React.FC<SecuritySettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    password: {
      requireComplexity: true,
      minLength: 8,
      expireDays: 90,
      preventReuse: 5
    },
    twoFactor: {
      enabled: true,
      method: 'app',
      backupCodes: true
    },
    sessions: {
      timeout: 30,
      allowMultiple: false,
      logoutInactive: true
    },
    audit: {
      logAccess: true,
      retainDays: 365,
      alertSuspicious: true
    },
    lastModified: new Date().toISOString()
  });

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'security',
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const handleSave = async () => {
    try {
      clearDraft();
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'security', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving security settings:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          الخصوصية والأمان
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
          {/* Two-Factor Authentication */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              المصادقة الثنائية
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.twoFactor.enabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    twoFactor: { ...prev.twoFactor, enabled: e.target.checked }
                  }))}
                />
                <span className="text-sm text-black">تفعيل المصادقة الثنائية</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">طريقة المصادقة</label>
                  <select
                    value={formData.twoFactor.method}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      twoFactor: { ...prev.twoFactor, method: e.target.value }
                    }))}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                    disabled={!formData.twoFactor.enabled}
                  >
                    <option value="app">تطبيق المصادقة</option>
                    <option value="sms">رسالة نصية</option>
                    <option value="email">البريد الإلكتروني</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Password Policy */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              سياسة كلمات المرور
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">الحد الأدنى لطول كلمة المرور</label>
                <input
                  type="number"
                  min="6"
                  max="32"
                  value={formData.password.minLength}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    password: { ...prev.password, minLength: parseInt(e.target.value) }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">انتهاء صلاحية كلمة المرور (أيام)</label>
                <input
                  type="number"
                  min="30"
                  max="365"
                  value={formData.password.expireDays}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    password: { ...prev.password, expireDays: parseInt(e.target.value) }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.password.requireComplexity}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    password: { ...prev.password, requireComplexity: e.target.checked }
                  }))}
                />
                <span className="text-sm text-black">تطبيق تعقيد كلمة المرور</span>
              </label>
            </div>
          </div>

          {/* Session Management */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              إدارة الجلسات
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">انتهاء الجلسة (دقائق)</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={formData.sessions.timeout}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sessions: { ...prev.sessions, timeout: parseInt(e.target.value) }
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.sessions.allowMultiple}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sessions: { ...prev.sessions, allowMultiple: e.target.checked }
                  }))}
                />
                <span className="text-sm text-black">السماح بجلسات متعددة</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.sessions.logoutInactive}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sessions: { ...prev.sessions, logoutInactive: e.target.checked }
                  }))}
                />
                <span className="text-sm text-black">تسجيل الخروج التلقائي للجلسات غير النشطة</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

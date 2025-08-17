
import React, { useState } from 'react';
import { Settings, Zap, Globe, Database, Link } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';
import { BaseActionButton } from '@/components/shared/BaseActionButton';

interface IntegrationsSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const IntegrationsSettingsPanel: React.FC<IntegrationsSettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    apis: {
      enabled: true,
      rateLimit: 1000,
      authentication: 'oauth2',
      webhook: true
    },
    external: {
      slack: { enabled: true, webhook: 'https://hooks.slack.com/...' },
      teams: { enabled: false, webhook: '' },
      email: { enabled: true, provider: 'smtp' }
    },
    database: {
      backupEnabled: true,
      syncInterval: 24,
      compressionEnabled: true
    },
    lastModified: new Date().toISOString()
  });

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'integrations',
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const handleSave = async () => {
    try {
      clearDraft();
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'integrations', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving integrations settings:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          التكاملات الخارجية
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
          {/* API Settings */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              إعدادات API
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.apis.enabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    apis: { ...prev.apis, enabled: e.target.checked }
                  }))}
                />
                <span className="text-sm text-black">تفعيل API</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">حد الطلبات في الساعة</label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={formData.apis.rateLimit}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      apis: { ...prev.apis, rateLimit: parseInt(e.target.value) }
                    }))}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                    disabled={!formData.apis.enabled}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">طريقة المصادقة</label>
                  <select
                    value={formData.apis.authentication}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      apis: { ...prev.apis, authentication: e.target.value }
                    }))}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                    disabled={!formData.apis.enabled}
                  >
                    <option value="oauth2">OAuth 2.0</option>
                    <option value="apikey">API Key</option>
                    <option value="jwt">JWT Token</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* External Services */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              <Link className="w-5 h-5" />
              الخدمات الخارجية
            </h3>
            
            <div className="space-y-6">
              {/* Slack Integration */}
              <div className="rounded-[24px] bg-[#F8F9FA] border border-[#E9ECEF] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-black">Slack</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.external.slack.enabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        external: {
                          ...prev.external,
                          slack: { ...prev.external.slack, enabled: e.target.checked }
                        }
                      }))}
                    />
                    <span className="text-sm text-black">مفعل</span>
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="Webhook URL"
                  value={formData.external.slack.webhook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    external: {
                      ...prev.external,
                      slack: { ...prev.external.slack, webhook: e.target.value }
                    }
                  }))}
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  disabled={!formData.external.slack.enabled}
                />
              </div>

              {/* Teams Integration */}
              <div className="rounded-[24px] bg-[#F8F9FA] border border-[#E9ECEF] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-black">Microsoft Teams</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.external.teams.enabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        external: {
                          ...prev.external,
                          teams: { ...prev.external.teams, enabled: e.target.checked }
                        }
                      }))}
                    />
                    <span className="text-sm text-black">مفعل</span>
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="Webhook URL"
                  value={formData.external.teams.webhook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    external: {
                      ...prev.external,
                      teams: { ...prev.external.teams, webhook: e.target.value }
                    }
                  }))}
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  disabled={!formData.external.teams.enabled}
                />
              </div>
            </div>
          </div>

          {/* Database Integration */}
          <div className="rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              قاعدة البيانات
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.database.backupEnabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    database: { ...prev.database, backupEnabled: e.target.checked }
                  }))}
                />
                <span className="text-sm text-black">تفعيل النسخ الاحتياطي التلقائي</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">فترة المزامنة (ساعات)</label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={formData.database.syncInterval}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      database: { ...prev.database, syncInterval: parseInt(e.target.value) }
                    }))}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              </div>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.database.compressionEnabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    database: { ...prev.database, compressionEnabled: e.target.checked }
                  }))}
                />
                <span className="text-sm text-black">تفعيل ضغط البيانات</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link2, Key, Shield, CheckCircle, AlertCircle, Settings, Zap, Download, Upload } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';
import { BaseActionButton } from '@/components/shared/BaseActionButton';

interface IntegrationsSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'disconnected' | 'pending';
  description: string;
  apiEndpoint?: string;
  webhookUrl?: string;
  lastSync?: string;
}

export const IntegrationsSettingsPanel: React.FC<IntegrationsSettingsPanelProps> = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      category: 'اتصالات',
      status: 'connected',
      description: 'إشعارات المشاريع والمهام',
      webhookUrl: 'https://hooks.slack.com/services/...',
      lastSync: '2024-01-20 10:30'
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      category: 'تخزين',
      status: 'connected',
      description: 'نسخ احتياطي للملفات',
      apiEndpoint: 'https://www.googleapis.com/drive/v3',
      lastSync: '2024-01-20 09:15'
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'تطوير',
      status: 'disconnected',
      description: 'إدارة المشاريع التقنية',
      apiEndpoint: 'https://api.github.com'
    }
  ]);

  const [formData, setFormData] = useState({
    apiSettings: {
      rateLimiting: true,
      authentication: 'oauth2',
      timeout: 30,
      retryAttempts: 3
    },
    webhooks: {
      enabled: true,
      secretKey: 'wh_sec_' + Math.random().toString(36).substr(2, 9),
      allowedIPs: ['192.168.1.0/24']
    },
    aiAutomation: {
      autoMapping: true,
      smartRetry: true,
      anomalyDetection: true,
      predictiveSync: false
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

  const handleIntegrationToggle = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: integration.status === 'connected' ? 'disconnected' : 'connected' }
        : integration
    ));
  };

  const handleSave = async () => {
    try {
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'integrations', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Error handled silently
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return 'متصل';
      case 'pending': return 'في الانتظار';
      default: return 'غير متصل';
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--sb-column-3-bg)' }}>
      {/* Header with Title */}
      <div className="py-[45px] px-6">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          التكاملات والربط
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-6" style={{ background: 'var(--sb-column-3-bg)' }}>
        <div className="space-y-6">

          {/* Header Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-black/20">
                <Link2 className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-black">التكاملات الخارجية</h2>
                <p className="text-sm font-normal text-black">ربط النظام مع الخدمات الخارجية والتطبيقات الثالثة</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">●</div>
                <p className="text-xs font-normal text-gray-400">نشط</p>
              </div>
            </div>
          </div>

          {/* AI Setup Assistant Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              🤖 مساعد الإعداد التلقائي
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">AI Setup Assistant</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">الربط الذكي</h4>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.aiAutomation.autoMapping}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aiAutomation: { ...prev.aiAutomation, autoMapping: e.target.checked }
                    }))}
                  />
                  <span className="text-sm text-black">تعيين الحقول تلقائيًا</span>
                </label>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">كشف الشذوذ</h4>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.aiAutomation.anomalyDetection}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aiAutomation: { ...prev.aiAutomation, anomalyDetection: e.target.checked }
                    }))}
                  />
                  <span className="text-sm text-black">مراقبة الأنشطة المشبوهة</span>
                </label>
              </div>
            </div>
          </div>

          {/* Available Integrations Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">التكاملات المتاحة</h3>
            
            <div className="space-y-4">
              {integrations.map(integration => (
                <div key={integration.id} className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(integration.status)}
                      <div>
                        <h4 className="text-sm font-bold text-black">{integration.name}</h4>
                        <p className="text-xs text-gray-600">{integration.description}</p>
                        <span className="text-xs text-gray-500">{integration.category}</span>
                        {integration.lastSync && (
                          <p className="text-xs text-gray-400">آخر مزامنة: {integration.lastSync}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                        integration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getStatusBadge(integration.status)}
                      </span>
                      <button
                        onClick={() => handleIntegrationToggle(integration.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          integration.status === 'connected'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {integration.status === 'connected' ? 'قطع الاتصال' : 'ربط'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Settings Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">إعدادات API</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  المصادقة والأمان
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">نوع المصادقة</label>
                    <select 
                      value={formData.apiSettings.authentication}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        apiSettings: { ...prev.apiSettings, authentication: e.target.value }
                      }))}
                      className="w-full p-2 rounded-lg border text-sm"
                    >
                      <option value="oauth2">OAuth 2.0</option>
                      <option value="jwt">JWT Token</option>
                      <option value="api-key">API Key</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.apiSettings.rateLimiting}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        apiSettings: { ...prev.apiSettings, rateLimiting: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">تفعيل حدود المعدل</span>
                  </label>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  إعدادات الاتصال
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">مهلة الانتظار (ثانية)</label>
                    <input 
                      type="number"
                      value={formData.apiSettings.timeout}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        apiSettings: { ...prev.apiSettings, timeout: parseInt(e.target.value) }
                      }))}
                      className="w-full p-2 rounded-lg border text-sm"
                      min="5"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">محاولات إعادة الاتصال</label>
                    <input 
                      type="number"
                      value={formData.apiSettings.retryAttempts}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        apiSettings: { ...prev.apiSettings, retryAttempts: parseInt(e.target.value) }
                      }))}
                      className="w-full p-2 rounded-lg border text-sm"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Webhooks Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">Webhooks</h3>
            
            <div className="space-y-4">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-black">حالة Webhooks</h4>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.webhooks.enabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        webhooks: { ...prev.webhooks, enabled: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">مفعل</span>
                  </label>
                </div>
                
                {formData.webhooks.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">المفتاح السري</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={formData.webhooks.secretKey}
                          readOnly
                          className="flex-1 p-2 rounded-lg border text-sm bg-gray-50"
                        />
                        <button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            webhooks: { ...prev.webhooks, secretKey: 'wh_sec_' + Math.random().toString(36).substr(2, 9) }
                          }))}
                          className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                        >
                          تجديد
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <p className="text-xs font-normal text-gray-400">تكاملات نشطة</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">12</div>
              <p className="text-xs font-normal text-gray-400">تكاملات متاحة</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">99.2%</div>
              <p className="text-xs font-normal text-gray-400">وقت التشغيل</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-xs font-normal text-gray-400">
              {lastAutosave ? `آخر حفظ تلقائي: ${lastAutosave}` : 'لم يتم الحفظ بعد'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFormData({
                    apiSettings: { rateLimiting: false, authentication: 'oauth2', timeout: 30, retryAttempts: 3 },
                    webhooks: { enabled: false, secretKey: '', allowedIPs: [] },
                    aiAutomation: { autoMapping: false, smartRetry: false, anomalyDetection: false, predictiveSync: false },
                    lastModified: new Date().toISOString()
                  });
                  clearDraft();
                }}
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
      </div>
    </div>
  );
};
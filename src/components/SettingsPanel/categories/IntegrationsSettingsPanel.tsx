import React, { useState } from 'react';
import { Link2, Plus, Check, X, Settings, Zap, Key, MessageSquare, FileText, BarChart3 } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'disconnected' | 'error';
  type: 'communication' | 'storage' | 'analytics' | 'productivity';
  apiKey?: string;
  config?: Record<string, any>;
  lastSync?: string;
}

interface IntegrationsSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const IntegrationsSettingsPanel: React.FC<IntegrationsSettingsPanelProps> = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Slack',
      description: 'تكامل مع فرق العمل والإشعارات',
      icon: MessageSquare,
      status: 'connected',
      type: 'communication',
      apiKey: 'xoxb-****-****-****',
      lastSync: '2024-01-20 10:30'
    },
    {
      id: '2',
      name: 'Google Drive',
      description: 'تخزين ومشاركة الملفات',
      icon: FileText,
      status: 'connected',
      type: 'storage',
      lastSync: '2024-01-20 09:15'
    },
    {
      id: '3',
      name: 'Power BI',
      description: 'تحليل البيانات والتقارير',
      icon: BarChart3,
      status: 'disconnected',
      type: 'analytics'
    },
    {
      id: '4',
      name: 'Zapier',
      description: 'أتمتة العمليات والمهام',
      icon: Zap,
      status: 'error',
      type: 'productivity'
    }
  ]);

  const [showSetupWizard, setShowSetupWizard] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState(1);
  const [setupData, setSetupData] = useState<Record<string, any>>({});
  const [aiAssistantActive, setAiAssistantActive] = useState(false);

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'integrations',
    data: { integrations },
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const startAISetupAssistant = (integrationId: string) => {
    setAiAssistantActive(true);
    setShowSetupWizard(integrationId);
    setSetupStep(1);
    
    // هنا سيكون استدعاء مساعد الإعداد التلقائي
    setTimeout(() => {
      const integration = integrations.find(i => i.id === integrationId);
      if (integration) {
        setSetupData({
          name: integration.name,
          type: integration.type,
          suggestedConfig: {
            apiKey: 'auto-generated-key-suggestion',
            webhook: `https://api.soabra.com/webhooks/${integration.name.toLowerCase()}`,
            scope: 'read,write,admin'
          }
        });
      }
      setAiAssistantActive(false);
    }, 2000);
  };

  const connectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected' as const, lastSync: new Date().toLocaleString('ar-SA') }
        : integration
    ));
    setShowSetupWizard(null);
    setSetupStep(1);
  };

  const disconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const, apiKey: undefined, lastSync: undefined }
        : integration
    ));
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'متصل';
      case 'disconnected': return 'منقطع';
      case 'error': return 'خطأ';
      default: return 'غير معروف';
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving integrations settings to /settings/integrations/commit');
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'integrations', data: { integrations } }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save integrations settings:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          التكاملات والربط
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-0 my-[25px]">
        <div className="space-y-6">
      {/* Header */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
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

      {/* مساعد الإعداد التلقائي بالذكاء الاصطناعي */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          🤖 مساعد الإعداد التلقائي
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">AI Setup Assistant</span>
        </h3>
        <p className="text-sm text-black mb-4">
          يملأ الحقول والمفاتيح تلقائياً بناءً على وصف بسيط للتكامل المطلوب
        </p>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${aiAssistantActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-black">
            {aiAssistantActive ? 'يعمل الآن...' : 'جاهز للاستخدام'}
          </span>
        </div>
      </div>

      {/* التكاملات المتاحة */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-black">التكاملات المتاحة</h3>
          <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium flex items-center gap-2">
            <Plus size={14} />
            إضافة تكامل جديد
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map(integration => {
            const IconComponent = integration.icon;
            return (
              <div key={integration.id} style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">{integration.name}</h4>
                      <p className="text-xs text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`}></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">الحالة:</span>
                    <span className="font-medium text-black">{getStatusText(integration.status)}</span>
                  </div>
                  
                  {integration.lastSync && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">آخر مزامنة:</span>
                      <span className="font-medium text-black">{integration.lastSync}</span>
                    </div>
                  )}
                  
                  {integration.apiKey && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">API Key:</span>
                      <code className="text-xs bg-white/50 p-1 rounded">{integration.apiKey}</code>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {integration.status === 'connected' ? (
                    <>
                      <button
                        onClick={() => disconnectIntegration(integration.id)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-full text-xs font-medium"
                      >
                        قطع الاتصال
                      </button>
                      <button className="px-3 py-2 bg-gray-200 text-black rounded-full text-xs font-medium">
                        <Settings size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startAISetupAssistant(integration.id)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-full text-xs font-medium"
                      >
                        🤖 إعداد ذكي
                      </button>
                      <button
                        onClick={() => setShowSetupWizard(integration.id)}
                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-full text-xs font-medium"
                      >
                        إعداد يدوي
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* معالج الإعداد */}
      {showSetupWizard && (
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
          <h3 className="text-md font-bold text-black mb-4">
            معالج إعداد {integrations.find(i => i.id === showSetupWizard)?.name}
          </h3>
          
          <div className="mb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= setupStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step < setupStep ? <Check size={16} /> : step}
                  </div>
                  {step < 3 && <div className="w-8 h-1 bg-gray-200 mx-2"></div>}
                </div>
              ))}
            </div>
          </div>

          {setupStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-black">الخطوة 1: معلومات الاتصال</h4>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="API Key"
                  value={setupData.suggestedConfig?.apiKey || ''}
                  className="w-full p-3 rounded-lg border text-sm"
                  onChange={(e) => setSetupData(prev => ({
                    ...prev,
                    suggestedConfig: { ...prev.suggestedConfig, apiKey: e.target.value }
                  }))}
                />
                <input 
                  type="url" 
                  placeholder="Webhook URL"
                  value={setupData.suggestedConfig?.webhook || ''}
                  className="w-full p-3 rounded-lg border text-sm"
                  onChange={(e) => setSetupData(prev => ({
                    ...prev,
                    suggestedConfig: { ...prev.suggestedConfig, webhook: e.target.value }
                  }))}
                />
              </div>
            </div>
          )}

          {setupStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-black">الخطوة 2: الصلاحيات</h4>
              <div className="space-y-2">
                {['read', 'write', 'admin'].map(scope => (
                  <label key={scope} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={scope !== 'admin'} />
                    <span className="text-sm text-black">{scope}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {setupStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-black">الخطوة 3: اختبار الاتصال</h4>
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">✅ تم اختبار الاتصال بنجاح</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {setupStep > 1 && (
              <button
                onClick={() => setSetupStep(setupStep - 1)}
                className="px-4 py-2 bg-gray-200 text-black rounded-full text-sm font-medium"
              >
                السابق
              </button>
            )}
            
            {setupStep < 3 ? (
              <button
                onClick={() => setSetupStep(setupStep + 1)}
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
              >
                التالي
              </button>
            ) : (
              <button
                onClick={() => connectIntegration(showSetupWizard)}
                className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium"
              >
                إنهاء الإعداد
              </button>
            )}
            
            <button
              onClick={() => {
                setShowSetupWizard(null);
                setSetupStep(1);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* إحصائيات التكاملات */}
      <div className="grid grid-cols-4 gap-4">
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">{integrations.filter(i => i.status === 'connected').length}</div>
          <p className="text-xs font-normal text-gray-400">تكاملات نشطة</p>
        </div>
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">{integrations.filter(i => i.status === 'error').length}</div>
          <p className="text-xs font-normal text-gray-400">تحتاج إصلاح</p>
        </div>
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">24</div>
          <p className="text-xs font-normal text-gray-400">مزامنة اليوم</p>
        </div>
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">99.8%</div>
          <p className="text-xs font-normal text-gray-400">وقت التشغيل</p>
        </div>
      </div>

      {/* أزرار العمل */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-normal text-gray-400">
          {lastAutosave ? `آخر حفظ تلقائي: ${lastAutosave}` : 'لم يتم الحفظ بعد'}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIntegrations([]);
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
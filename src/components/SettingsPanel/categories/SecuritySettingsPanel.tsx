import React, { useState } from 'react';
import { ShieldCheck, Smartphone, Key, Monitor, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';
import { SecurityDisclaimer, SecuritySetupPrompt } from '../../ui/security-disclaimer';
import { RateLimiter } from '../../../utils/validation';

interface SecuritySettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const SecuritySettingsPanel: React.FC<SecuritySettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    mfa: {
      enabled: true,
      methods: ['totp', 'sms']
    },
    apiKeys: [
      { id: '1', name: 'API Key للتطبيق الرئيسي', created: '2024-01-15', lastUsed: '2024-01-20' },
      { id: '2', name: 'API Key للتكاملات', created: '2024-01-10', lastUsed: '2024-01-19' }
    ],
    trustedDevices: [
      { id: '1', name: 'MacBook Pro - Chrome', location: 'الرياض', lastAccess: '2024-01-20 10:30' },
      { id: '2', name: 'iPhone 15 Pro', location: 'الرياض', lastAccess: '2024-01-20 09:15' }
    ],
    activeSessions: [
      { id: '1', device: 'MacBook Pro', browser: 'Chrome', ip: '192.168.1.100', location: 'الرياض', active: true },
      { id: '2', device: 'iPhone', browser: 'Safari', ip: '192.168.1.101', location: 'الرياض', active: true }
    ],
    lastModified: new Date().toISOString()
  });

  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [securityAlerts, setSecurityAlerts] = useState([
    { id: '1', type: 'suspicious', message: 'محاولة دخول مشبوهة من عنوان IP غير معروف', severity: 'high', time: '2024-01-20 08:30' },
    { id: '2', type: 'policy', message: 'يُنصح بتفعيل MFA للأجهزة الجديدة', severity: 'medium', time: '2024-01-19 14:20' }
  ]);

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

  const generateNewApiKey = () => {
    if (!RateLimiter.isAllowed('generateApiKey', 3, 300000)) { // 3 attempts per 5 minutes
      alert('تم تجاوز الحد المسموح لإنشاء مفاتيح API. حاول مرة أخرى بعد 5 دقائق.');
      return;
    }

    const newKey = {
      id: Date.now().toString(),
      name: 'API Key جديد',
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'لم يُستخدم بعد'
    };
    setFormData(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, newKey]
    }));
  };

  const revokeApiKey = (keyId: string) => {
    setFormData(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.filter(key => key.id !== keyId)
    }));
  };

  const terminateSession = (sessionId: string) => {
    setFormData(prev => ({
      ...prev,
      activeSessions: prev.activeSessions.filter(session => session.id !== sessionId)
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving security settings to /settings/security/commit');
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'security', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save security settings:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          إعدادات الأمان
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
        
        {/* Security Disclaimer */}
        <SecurityDisclaimer 
          type="frontend-only" 
          className="mb-4"
        />
        
        <SecuritySetupPrompt className="mb-6" />
      {/* Header */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-black/20">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-black">الخصوصية والأمان</h2>
            <p className="text-sm font-normal text-black">ضبط إعدادات الأمان وحماية البيانات</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">●</div>
            <p className="text-xs font-normal text-gray-400">محمي</p>
          </div>
        </div>
      </div>

      {/* تنبيهات الأمان بالذكاء الاصطناعي */}
      <div style={{ backgroundColor: '#f1b5b9' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          🤖 تنبيهات الأمان الذكي
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">AI Anomaly Model</span>
        </h3>
        <div className="space-y-3">
          {securityAlerts.map(alert => (
            <div key={alert.id} className="bg-white/50 rounded-lg p-3 flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-black">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
              <button className="text-xs bg-black text-white px-3 py-1 rounded-full">معالجة</button>
            </div>
          ))}
        </div>
      </div>

      {/* التحقق الثنائي */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <SecurityDisclaimer 
          type="mock" 
          feature="المصادقة الثنائية"
          className="mb-4"
        />
        <h3 className="text-md font-bold text-black mb-4">التحقق الثنائي (MFA)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div style={{ backgroundColor: '#bdeed3' }} className="rounded-2xl p-4 border border-black/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-black">حالة MFA</h4>
              <div className={`w-4 h-4 rounded-full ${formData.mfa.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-xs text-black mb-3">
              {formData.mfa.enabled ? 'مفعّل' : 'معطّل'} - حماية إضافية لحسابك
            </p>
            <button
              onClick={() => setFormData(prev => ({
                ...prev,
                mfa: { ...prev.mfa, enabled: !prev.mfa.enabled }
              }))}
              className={`w-full px-4 py-2 rounded-full text-sm font-medium ${
                formData.mfa.enabled 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {formData.mfa.enabled ? 'تعطيل MFA' : 'تفعيل MFA'}
            </button>
          </div>

          <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">طرق التحقق</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.mfa.methods.includes('totp')}
                  onChange={(e) => {
                    const methods = e.target.checked 
                      ? [...formData.mfa.methods, 'totp']
                      : formData.mfa.methods.filter(m => m !== 'totp');
                    setFormData(prev => ({ ...prev, mfa: { ...prev.mfa, methods } }));
                  }}
                />
                <Smartphone className="w-4 h-4" />
                <span className="text-sm">تطبيق المصادقة</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.mfa.methods.includes('sms')}
                  onChange={(e) => {
                    const methods = e.target.checked 
                      ? [...formData.mfa.methods, 'sms']
                      : formData.mfa.methods.filter(m => m !== 'sms');
                    setFormData(prev => ({ ...prev, mfa: { ...prev.mfa, methods } }));
                  }}
                />
                <span className="text-sm">رسائل SMS</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* إدارة مفاتيح API */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <SecurityDisclaimer 
          type="demo" 
          feature="مفاتيح API"
          className="mb-4"
        />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-black">مفاتيح API</h3>
          <button
            onClick={generateNewApiKey}
            className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
          >
            إنشاء مفتاح جديد
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.apiKeys.map(key => (
            <div key={key.id} style={{ backgroundColor: '#d9d2fd' }} className="rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-black">{key.name}</h4>
                <p className="text-xs text-gray-500">أُنشئ: {key.created} | آخر استخدام: {key.lastUsed}</p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-xs bg-white/50 p-1 rounded">
                    {showApiKey[key.id] ? 'sk-1234567890abcdef' : '••••••••••••••••'}
                  </code>
                  <button
                    onClick={() => setShowApiKey(prev => ({ ...prev, [key.id]: !prev[key.id] }))}
                  >
                    {showApiKey[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => revokeApiKey(key.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium"
              >
                إلغاء
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* الأجهزة الموثوقة */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">الأجهزة الموثوقة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.trustedDevices.map(device => (
            <div key={device.id} style={{ backgroundColor: '#96d8d0' }} className="rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-black">{device.name}</h4>
                  <p className="text-xs text-gray-600">{device.location}</p>
                  <p className="text-xs text-gray-500">آخر دخول: {device.lastAccess}</p>
                </div>
                <Monitor className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* الجلسات النشطة */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">الجلسات النشطة</h3>
        
        <div className="space-y-3">
          {formData.activeSessions.map(session => (
            <div key={session.id} style={{ backgroundColor: '#fbe2aa' }} className="rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-black">{session.device} - {session.browser}</h4>
                <p className="text-xs text-gray-600">{session.ip} | {session.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <button
                  onClick={() => terminateSession(session.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium"
                >
                  إنهاء الجلسة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات الأمان */}
      <div className="grid grid-cols-4 gap-4">
        <div style={{ backgroundColor: '#bdeed3' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">98%</div>
          <p className="text-xs font-normal text-gray-400">مستوى الأمان</p>
        </div>
        <div style={{ backgroundColor: '#f1b5b9' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">2</div>
          <p className="text-xs font-normal text-gray-400">تنبيهات نشطة</p>
        </div>
        <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">3</div>
          <p className="text-xs font-normal text-gray-400">أجهزة موثوقة</p>
        </div>
        <div style={{ backgroundColor: '#d9d2fd' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">5</div>
          <p className="text-xs font-normal text-gray-400">مفاتيح API</p>
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
              setFormData({
                mfa: { enabled: false, methods: [] },
                apiKeys: [],
                trustedDevices: [],
                activeSessions: [],
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
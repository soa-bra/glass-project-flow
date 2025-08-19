import React, { useState } from 'react';
import { Database, Shield, FileText, Clock, AlertTriangle, CheckCircle, Lock, Unlock } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';

interface DataGovernanceSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const DataGovernanceSettingsPanel: React.FC<DataGovernanceSettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    retention: {
      financial: 10, // years
      legal: 7,
      hr: 5,
      projects: 3,
      logs: 1
    },
    backup: {
      enabled: true,
      frequency: 'daily',
      location: 'cloud',
      encryption: true
    },
    compliance: {
      gdpr: true,
      nca: true,
      iso27001: false,
      sox: false
    },
    access: {
      dataClassification: true,
      encryptionAtRest: true,
      encryptionInTransit: true,
      auditTrail: true
    },
    aiGovernance: {
      modelTracking: true,
      biasDetection: true,
      ethicalReview: true,
      dataSourceTracking: true
    },
    lastModified: new Date().toISOString()
  });

  const [complianceStatus] = useState([
    { framework: 'GDPR', status: 'compliant', lastReview: '2024-01-15' },
    { framework: 'NCA', status: 'compliant', lastReview: '2024-01-10' },
    { framework: 'ISO 27001', status: 'pending', lastReview: '2024-01-05' }
  ]);

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'data-governance',
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const handleSave = async () => {
    try {
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'data-governance', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Error handled silently
    }
  };

  const getComplianceIcon = (status: string) => {
    return status === 'compliant' ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--sb-column-3-bg)' }}>
      {/* Header with Title */}
      <div className="py-[45px] px-6">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          حوكمة البيانات
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-6" style={{ background: 'var(--sb-column-3-bg)' }}>
        <div className="space-y-6">

          {/* Header Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-black/20">
                <Database className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-black">حوكمة البيانات</h2>
                <p className="text-sm font-normal text-black">إدارة البيانات والامتثال والخصوصية</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">●</div>
                <p className="text-xs font-normal text-gray-400">متوافق</p>
              </div>
            </div>
          </div>

          {/* AI Compliance Monitor Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              🤖 مراقب الامتثال الذكي
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">AI Compliance Monitor</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {complianceStatus.map(item => (
                <div key={item.framework} className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getComplianceIcon(item.status)}
                    <h4 className="text-sm font-bold text-black">{item.framework}</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    {item.status === 'compliant' ? 'متوافق' : 'يحتاج مراجعة'}
                  </p>
                  <p className="text-xs text-gray-500">آخر مراجعة: {item.lastReview}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Retention Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">سياسات الاحتفاظ بالبيانات</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                  <label className="text-xs text-gray-600">البيانات المالية (سنوات)</label>
                  <input 
                    type="number"
                    value={formData.retention.financial}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      retention: { ...prev.retention, financial: parseInt(e.target.value) }
                    }))}
                    className="w-full p-2 rounded-lg border text-sm mt-1"
                    min="1"
                    max="20"
                  />
                </div>
                <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                  <label className="text-xs text-gray-600">البيانات القانونية (سنوات)</label>
                  <input 
                    type="number"
                    value={formData.retention.legal}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      retention: { ...prev.retention, legal: parseInt(e.target.value) }
                    }))}
                    className="w-full p-2 rounded-lg border text-sm mt-1"
                    min="1"
                    max="15"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                  <label className="text-xs text-gray-600">بيانات الموارد البشرية (سنوات)</label>
                  <input 
                    type="number"
                    value={formData.retention.hr}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      retention: { ...prev.retention, hr: parseInt(e.target.value) }
                    }))}
                    className="w-full p-2 rounded-lg border text-sm mt-1"
                    min="1"
                    max="10"
                  />
                </div>
                <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                  <label className="text-xs text-gray-600">بيانات المشاريع (سنوات)</label>
                  <input 
                    type="number"
                    value={formData.retention.projects}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      retention: { ...prev.retention, projects: parseInt(e.target.value) }
                    }))}
                    className="w-full p-2 rounded-lg border text-sm mt-1"
                    min="1"
                    max="7"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Backup Settings Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">النسخ الاحتياطي والاستعادة</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  الجدولة
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">تكرار النسخ</label>
                    <select 
                      value={formData.backup.frequency}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        backup: { ...prev.backup, frequency: e.target.value }
                      }))}
                      className="w-full p-2 rounded-lg border text-sm"
                    >
                      <option value="hourly">كل ساعة</option>
                      <option value="daily">يومياً</option>
                      <option value="weekly">أسبوعياً</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.backup.encryption}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        backup: { ...prev.backup, encryption: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">التشفير المتقدم</span>
                  </label>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  الموقع والأمان
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">موقع النسخة</label>
                    <select 
                      value={formData.backup.location}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        backup: { ...prev.backup, location: e.target.value }
                      }))}
                      className="w-full p-2 rounded-lg border text-sm"
                    >
                      <option value="cloud">السحابة</option>
                      <option value="local">محلي</option>
                      <option value="hybrid">مختلط</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.backup.enabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        backup: { ...prev.backup, enabled: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">تفعيل النسخ التلقائي</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">99.8%</div>
              <p className="text-xs font-normal text-gray-400">امتثال البيانات</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">24h</div>
              <p className="text-xs font-normal text-gray-400">آخر نسخة احتياطية</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">2.3TB</div>
              <p className="text-xs font-normal text-gray-400">حجم البيانات</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">0</div>
              <p className="text-xs font-normal text-gray-400">مخالفات نشطة</p>
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
                    retention: { financial: 10, legal: 7, hr: 5, projects: 3, logs: 1 },
                    backup: { enabled: false, frequency: 'daily', location: 'cloud', encryption: false },
                    compliance: { gdpr: false, nca: false, iso27001: false, sox: false },
                    access: { dataClassification: false, encryptionAtRest: false, encryptionInTransit: false, auditTrail: false },
                    aiGovernance: { modelTracking: false, biasDetection: false, ethicalReview: false, dataSourceTracking: false },
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
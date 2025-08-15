import React, { useState } from 'react';
import { Database, Shield, FileText, Clock, Users, Key, Eye, Lock } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';

interface DataGovernanceSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const DataGovernanceSettingsPanel: React.FC<DataGovernanceSettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    retention: {
      auditLogs: 2555, // days
      financialRecords: 3650,
      personalData: 2555,
      projectData: 1825,
      communicationLogs: 1095
    },
    privacy: {
      gdprCompliant: true,
      ccpaCompliant: true,
      ncaCompliant: true,
      dataMinimization: true,
      anonymization: true,
      rightToErasure: true
    },
    access: {
      dataClassification: true,
      accessLogging: true,
      fieldLevelSecurity: true,
      encryptionAtRest: true,
      encryptionInTransit: true
    },
    backup: {
      frequency: 'daily',
      retention: 90, // days
      cloudProvider: 'aws',
      encryption: true,
      geoReplication: true
    },
    compliance: {
      automatedReports: true,
      policyUpdates: true,
      breachNotification: true,
      auditTrail: true
    },
    lastModified: new Date().toISOString()
  });

  const [complianceReports] = useState([
    { id: '1', type: 'GDPR', status: 'compliant', lastAudit: '2024-01-15', nextDue: '2024-04-15' },
    { id: '2', type: 'CCPA', status: 'compliant', lastAudit: '2024-01-10', nextDue: '2024-04-10' },
    { id: '3', type: 'NCA', status: 'pending', lastAudit: '2023-12-20', nextDue: '2024-03-20' }
  ]);

  const [dataCategories] = useState([
    { name: 'البيانات الشخصية', count: 12847, sensitivityLevel: 'high', encrypted: true },
    { name: 'البيانات المالية', count: 8934, sensitivityLevel: 'high', encrypted: true },
    { name: 'بيانات المشاريع', count: 15623, sensitivityLevel: 'medium', encrypted: true },
    { name: 'سجلات التدقيق', count: 45782, sensitivityLevel: 'low', encrypted: false }
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

  const updateRetention = (category: string, days: number) => {
    setFormData(prev => ({
      ...prev,
      retention: { ...prev.retention, [category]: days }
    }));
  };

  const handleDataPurge = async (category: string) => {
    // Initiating data purge for category
    // هنا سيكون استدعاء API لحذف البيانات
  };

  const handleSave = async () => {
    try {
      // Saving data governance settings
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'data-governance', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Error handled silently
    }
  };

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          حوكمة البيانات
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

      {/* مراقبة الامتثال بالذكاء الاصطناعي */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          🤖 مراقب الامتثال الذكي
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">AI Compliance Monitor</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4">
            <h4 className="text-sm font-bold text-black mb-2">تقييم المخاطر التلقائي</h4>
            <p className="text-xs text-gray-600">فحص دوري للبيانات الحساسة</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4">
            <h4 className="text-sm font-bold text-black mb-2">كشف التسريبات</h4>
            <p className="text-xs text-gray-600">مراقبة 24/7 للوصول غير المصرح</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4">
            <h4 className="text-sm font-bold text-black mb-2">تحديث السياسات</h4>
            <p className="text-xs text-gray-600">مراجعة تلقائية للوائح الجديدة</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* سياسات الاحتفاظ بالبيانات */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          سياسات الاحتفاظ بالبيانات
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div style={{ backgroundColor: '#bdeed3' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">البيانات الحساسة</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">سجلات التدقيق</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={formData.retention.auditLogs}
                    min="365" 
                    max="3650"
                    className="w-20 p-1 rounded border text-xs"
                    onChange={(e) => updateRetention('auditLogs', parseInt(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">يوم</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">البيانات المالية</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={formData.retention.financialRecords}
                    min="1095" 
                    max="3650"
                    className="w-20 p-1 rounded border text-xs"
                    onChange={(e) => updateRetention('financialRecords', parseInt(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">يوم</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">البيانات الشخصية</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={formData.retention.personalData}
                    min="365" 
                    max="2555"
                    className="w-20 p-1 rounded border text-xs"
                    onChange={(e) => updateRetention('personalData', parseInt(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">يوم</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">بيانات التشغيل</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">بيانات المشاريع</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={formData.retention.projectData}
                    min="365" 
                    max="1825"
                    className="w-20 p-1 rounded border text-xs"
                    onChange={(e) => updateRetention('projectData', parseInt(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">يوم</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">سجلات التواصل</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={formData.retention.communicationLogs}
                    min="365" 
                    max="1095"
                    className="w-20 p-1 rounded border text-xs"
                    onChange={(e) => updateRetention('communicationLogs', parseInt(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">يوم</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تصنيف البيانات */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">تصنيف البيانات</h3>
        
        <div className="space-y-3">
          {dataCategories.map((category, index) => (
            <div key={index} style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {category.encrypted ? <Lock className="w-4 h-4 text-green-600" /> : <Key className="w-4 h-4 text-gray-400" />}
                  <div>
                    <h4 className="text-sm font-bold text-black">{category.name}</h4>
                    <p className="text-xs text-gray-600">{category.count.toLocaleString()} سجل</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getSensitivityColor(category.sensitivityLevel)}`}>
                  {category.sensitivityLevel === 'high' ? 'عالي' : category.sensitivityLevel === 'medium' ? 'متوسط' : 'منخفض'}
                </span>
                <button
                  onClick={() => handleDataPurge(category.name)}
                  className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium"
                >
                  حذف منتهي الصلاحية
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إعدادات الخصوصية */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          إعدادات الخصوصية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{ backgroundColor: '#96d8d0' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">الامتثال التنظيمي</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.privacy.gdprCompliant}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, gdprCompliant: e.target.checked }
                  }))}
                />
                <span className="text-sm">GDPR</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.privacy.ccpaCompliant}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, ccpaCompliant: e.target.checked }
                  }))}
                />
                <span className="text-sm">CCPA</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.privacy.ncaCompliant}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, ncaCompliant: e.target.checked }
                  }))}
                />
                <span className="text-sm">NCA</span>
              </label>
            </div>
          </div>

          <div style={{ backgroundColor: '#fbe2aa' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">معالجة البيانات</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.privacy.dataMinimization}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, dataMinimization: e.target.checked }
                  }))}
                />
                <span className="text-sm">تقليل البيانات</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.privacy.anonymization}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, anonymization: e.target.checked }
                  }))}
                />
                <span className="text-sm">إخفاء الهوية</span>
              </label>
            </div>
          </div>

          <div style={{ backgroundColor: '#f1b5b9' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">حقوق المستخدمين</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.privacy.rightToErasure}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, rightToErasure: e.target.checked }
                  }))}
                />
                <span className="text-sm">الحق في المحو</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* تقارير الامتثال */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          تقارير الامتثال
        </h3>
        
        <div className="space-y-3">
          {complianceReports.map(report => (
            <div key={report.id} style={{ backgroundColor: '#bdeed3' }} className="rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold text-black">{report.type}</h4>
                  <p className="text-xs text-gray-600">آخر تدقيق: {report.lastAudit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getComplianceStatusColor(report.status)}`}>
                  {report.status === 'compliant' ? 'متوافق' : report.status === 'pending' ? 'معلق' : 'غير متوافق'}
                </span>
                <span className="text-xs text-gray-500">التالي: {report.nextDue}</span>
                <button className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
                  تحديث
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات الحوكمة */}
      <div className="grid grid-cols-4 gap-4">
        <div style={{ backgroundColor: '#bdeed3' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">99.8%</div>
          <p className="text-xs font-normal text-gray-400">معدل الامتثال</p>
        </div>
        <div style={{ backgroundColor: '#f1b5b9' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">47GB</div>
          <p className="text-xs font-normal text-gray-400">البيانات المحمية</p>
        </div>
        <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">0</div>
          <p className="text-xs font-normal text-gray-400">انتهاكات هذا الشهر</p>
        </div>
        <div style={{ backgroundColor: '#d9d2fd' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">156</div>
          <p className="text-xs font-normal text-gray-400">سياسة نشطة</p>
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
                retention: { auditLogs: 2555, financialRecords: 3650, personalData: 2555, projectData: 1825, communicationLogs: 1095 },
                privacy: { gdprCompliant: true, ccpaCompliant: true, ncaCompliant: true, dataMinimization: true, anonymization: true, rightToErasure: true },
                access: { dataClassification: true, accessLogging: true, fieldLevelSecurity: true, encryptionAtRest: true, encryptionInTransit: true },
                backup: { frequency: 'daily', retention: 90, cloudProvider: 'aws', encryption: true, geoReplication: true },
                compliance: { automatedReports: true, policyUpdates: true, breachNotification: true, auditTrail: true },
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
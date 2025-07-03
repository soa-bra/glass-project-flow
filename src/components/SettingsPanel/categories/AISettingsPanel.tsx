import React, { useState } from 'react';
import { BrainCircuit, Zap, Target, BarChart3, Settings, Eye, Database, Cpu } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';

interface AISettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const AISettingsPanel: React.FC<AISettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    models: {
      primary: 'gpt-4.1-2025-04-14',
      fallback: 'gpt-4.1-mini-2025-04-14',
      reasoning: 'o4-mini-2025-04-16'
    },
    features: {
      smartSuggestions: true,
      autoCompletion: true,
      predictiveAnalytics: true,
      anomalyDetection: true,
      smartNotifications: true,
      contentGeneration: true,
      riskAssessment: true
    },
    performance: {
      maxTokens: 4000,
      temperature: 0.7,
      responseTimeout: 30000,
      batchProcessing: true,
      caching: true
    },
    privacy: {
      dataRetention: 30,
      anonymization: true,
      auditLogs: true,
      gdprCompliant: true
    },
    lastModified: new Date().toISOString()
  });

  const [usage] = useState({
    thisMonth: { requests: 12847, tokens: 2456789, cost: 432.50 },
    lastMonth: { requests: 11203, tokens: 2134567, cost: 387.20 },
    average: { dailyRequests: 427, efficiency: 94.2 }
  });

  const [activeExperiments] = useState([
    { id: '1', name: 'تحسين دقة التنبؤات المالية', status: 'running', progress: 78 },
    { id: '2', name: 'تحليل المشاعر في تقييم العملاء', status: 'completed', progress: 100 },
    { id: '3', name: 'أتمتة تصنيف الوثائق القانونية', status: 'pending', progress: 23 }
  ]);

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'ai',
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const updateFeature = (feature: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled }
    }));
  };

  const updateModel = (modelType: string, model: string) => {
    setFormData(prev => ({
      ...prev,
      models: { ...prev.models, [modelType]: model }
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving AI settings to /settings/ai/commit');
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'ai', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save AI settings:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          الذكاء الاصطناعي
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

        {/* تجارب الذكاء الاصطناعي الجارية */}
        <div style={{ backgroundColor: '#f2ffff' }} className="p-6 rounded-3xl border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          🧪 التجارب النشطة
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">AI Lab</span>
        </h3>
        
          <div className="space-y-3">
            {activeExperiments.map(experiment => (
              <div key={experiment.id} style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4 border border-black/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-black">{experiment.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  experiment.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  experiment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {experiment.status === 'running' ? 'جاري' : experiment.status === 'completed' ? 'مكتمل' : 'معلق'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${experiment.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{experiment.progress}% مكتمل</p>
            </div>
          ))}
        </div>
      </div>

        {/* نماذج الذكاء الاصطناعي */}
        <div style={{ backgroundColor: '#f2ffff' }} className="p-6 rounded-3xl border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">نماذج الذكاء الاصطناعي</h3>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              النموذج الأساسي
            </h4>
            <select 
              value={formData.models.primary}
              onChange={(e) => updateModel('primary', e.target.value)}
              className="w-full p-2 rounded-lg border text-sm"
            >
              <option value="gpt-4.1-2025-04-14">GPT-4.1 (2025)</option>
              <option value="o3-2025-04-16">O3 (2025)</option>
              <option value="gpt-4o">GPT-4O</option>
            </select>
          </div>

          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">النموذج الاحتياطي</h4>
            <select 
              value={formData.models.fallback}
              onChange={(e) => updateModel('fallback', e.target.value)}
              className="w-full p-2 rounded-lg border text-sm"
            >
              <option value="gpt-4.1-mini-2025-04-14">GPT-4.1 Mini</option>
              <option value="o4-mini-2025-04-16">O4 Mini</option>
            </select>
          </div>

          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">نموذج التفكير</h4>
            <select 
              value={formData.models.reasoning}
              onChange={(e) => updateModel('reasoning', e.target.value)}
              className="w-full p-2 rounded-lg border text-sm"
            >
              <option value="o4-mini-2025-04-16">O4 Mini (سريع)</option>
              <option value="o3-2025-04-16">O3 (قوي)</option>
            </select>
          </div>
        </div>
      </div>

        {/* الميزات الذكية */}
        <div style={{ backgroundColor: '#f2ffff' }} className="p-6 rounded-3xl border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">الميزات الذكية</h3>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">التحليل والتنبؤ</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.features.predictiveAnalytics}
                  onChange={(e) => updateFeature('predictiveAnalytics', e.target.checked)}
                />
                <Target className="w-4 h-4" />
                <span className="text-sm">التحليل التنبؤي</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.features.anomalyDetection}
                  onChange={(e) => updateFeature('anomalyDetection', e.target.checked)}
                />
                <Eye className="w-4 h-4" />
                <span className="text-sm">كشف الشذوذ</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.features.riskAssessment}
                  onChange={(e) => updateFeature('riskAssessment', e.target.checked)}
                />
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">تقييم المخاطر</span>
              </label>
            </div>
          </div>

          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">الأتمتة الذكية</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.features.smartSuggestions}
                  onChange={(e) => updateFeature('smartSuggestions', e.target.checked)}
                />
                <Zap className="w-4 h-4" />
                <span className="text-sm">الاقتراحات الذكية</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.features.autoCompletion}
                  onChange={(e) => updateFeature('autoCompletion', e.target.checked)}
                />
                <span className="text-sm">الإكمال التلقائي</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.features.contentGeneration}
                  onChange={(e) => updateFeature('contentGeneration', e.target.checked)}
                />
                <span className="text-sm">توليد المحتوى</span>
              </label>
            </div>
          </div>
        </div>
      </div>

        {/* إعدادات الأداء */}
        <div style={{ backgroundColor: '#f2ffff' }} className="p-6 rounded-3xl border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">إعدادات الأداء</h3>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">المعاملات</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">الحد الأقصى للرموز</label>
                <input 
                  type="number" 
                  value={formData.performance.maxTokens}
                  min="1000" 
                  max="8000"
                  className="w-full p-2 rounded-lg border text-sm"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    performance: { ...prev.performance, maxTokens: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">درجة الحرارة (0-1)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={formData.performance.temperature}
                  className="w-full"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    performance: { ...prev.performance, temperature: parseFloat(e.target.value) }
                  }))}
                />
                <span className="text-xs text-gray-500">{formData.performance.temperature}</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">التحسينات</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.performance.batchProcessing}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    performance: { ...prev.performance, batchProcessing: e.target.checked }
                  }))}
                />
                <span className="text-sm">المعالجة المجمعة</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.performance.caching}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    performance: { ...prev.performance, caching: e.target.checked }
                  }))}
                />
                <Database className="w-4 h-4" />
                <span className="text-sm">التخزين المؤقت</span>
              </label>
            </div>
          </div>
        </div>
      </div>

        {/* إحصائيات الاستخدام */}
        <div className="grid grid-cols-4 gap-4">
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
            <div className="text-2xl font-bold text-black mb-1">{usage.thisMonth.requests.toLocaleString()}</div>
            <p className="text-xs font-normal text-gray-400">طلبات هذا الشهر</p>
          </div>
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
            <div className="text-2xl font-bold text-black mb-1">{(usage.thisMonth.tokens / 1000000).toFixed(1)}M</div>
            <p className="text-xs font-normal text-gray-400">رموز معالجة</p>
          </div>
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
            <div className="text-2xl font-bold text-black mb-1">{usage.average.efficiency}%</div>
            <p className="text-xs font-normal text-gray-400">كفاءة النماذج</p>
          </div>
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
            <div className="text-2xl font-bold text-black mb-1">${usage.thisMonth.cost.toFixed(0)}</div>
            <p className="text-xs font-normal text-gray-400">تكلفة الشهر</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
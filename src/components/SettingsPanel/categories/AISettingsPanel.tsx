import React, { useState } from 'react';
import { BrainCircuit, Cpu, Database, Zap, Activity, Target, TrendingUp, Settings } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';
import { BaseActionButton } from '@/components/shared/BaseActionButton';

interface AISettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

interface Experiment {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'paused';
  progress: number;
  startDate: string;
  estimatedCompletion: string;
}

export const AISettingsPanel: React.FC<AISettingsPanelProps> = () => {
  const [activeExperiments] = useState<Experiment[]>([
    {
      id: '1',
      name: 'تحليل أنماط العملاء',
      status: 'running',
      progress: 67,
      startDate: '2024-01-15',
      estimatedCompletion: '2024-01-25'
    },
    {
      id: '2',
      name: 'تحسين توقعات المشاريع',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-10',
      estimatedCompletion: '2024-01-20'
    }
  ]);

  const [formData, setFormData] = useState({
    models: {
      nlp: { enabled: true, confidence: 0.85 },
      vision: { enabled: false, confidence: 0.75 },
      analytics: { enabled: true, confidence: 0.90 }
    },
    training: {
      autoRetrain: true,
      dataQuality: 0.95,
      lastTrainingDate: '2024-01-15',
      nextScheduled: '2024-02-01'
    },
    performance: {
      maxConcurrent: 10,
      timeout: 30,
      caching: true
    },
    lastModified: new Date().toISOString()
  });

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

  const handleModelToggle = (modelType: string) => {
    setFormData(prev => ({
      ...prev,
      models: {
        ...prev.models,
        [modelType]: {
          ...prev.models[modelType as keyof typeof prev.models],
          enabled: !prev.models[modelType as keyof typeof prev.models].enabled
        }
      }
    }));
  };

  const handleTrainNewModel = () => {
    // This would typically make an API call to start training
    console.log('بدء تدريب نموذج جديد من الأرشيف...');
  };

  const handleSave = async () => {
    try {
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'ai', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Error handled silently
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--sb-column-3-bg)' }}>
      {/* Header with Title */}
      <div className="py-[45px] px-6">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          الذكاء الاصطناعي
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-6" style={{ background: 'var(--sb-column-3-bg)' }}>
        <div className="space-y-6">

          {/* Active Experiments Card */}
          <div className="rounded-[24px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              🧪 التجارب النشطة
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">AI Lab</span>
            </h3>
            
            <div className="space-y-3">
              {activeExperiments.map(experiment => (
                <div key={experiment.id} className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
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
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>بدأ: {experiment.startDate}</span>
                    <span>متوقع: {experiment.estimatedCompletion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Training Wizard Card */}
          <div className="rounded-[24px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              🚀 معالج التدريب
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Training Wizard</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">نوع المهمة</h4>
                <select className="w-full p-2 rounded-lg border text-sm">
                  <option>تصنيف الوثائق</option>
                  <option>تحليل المشاعر</option>
                  <option>استخراج المعلومات</option>
                  <option>توقع الاتجاهات</option>
                </select>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">مصدر البيانات</h4>
                <select className="w-full p-2 rounded-lg border text-sm">
                  <option>أرشيف المشاريع</option>
                  <option>بيانات العملاء</option>
                  <option>الوثائق القانونية</option>
                  <option>السجلات المالية</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleTrainNewModel}
                style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
                className="px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                تدريب نموذج جديد من الأرشيف
              </button>
            </div>
          </div>

          {/* Model Management Card */}
          <div className="rounded-[24px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">إدارة النماذج</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-black">معالجة اللغة</h4>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.models.nlp.enabled}
                      onChange={() => handleModelToggle('nlp')}
                    />
                    <span className="text-xs">مفعل</span>
                  </label>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black">{(formData.models.nlp.confidence * 100).toFixed(0)}%</div>
                  <p className="text-xs text-gray-500">دقة النموذج</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-black">رؤية الحاسوب</h4>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.models.vision.enabled}
                      onChange={() => handleModelToggle('vision')}
                    />
                    <span className="text-xs">مفعل</span>
                  </label>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black">{(formData.models.vision.confidence * 100).toFixed(0)}%</div>
                  <p className="text-xs text-gray-500">دقة النموذج</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-black">التحليلات</h4>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.models.analytics.enabled}
                      onChange={() => handleModelToggle('analytics')}
                    />
                    <span className="text-xs">مفعل</span>
                  </label>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black">{(formData.models.analytics.confidence * 100).toFixed(0)}%</div>
                  <p className="text-xs text-gray-500">دقة النموذج</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Settings Card */}
          <div className="rounded-[24px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">إعدادات الأداء</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">الاستعلامات المتزامنة</h4>
                <input 
                  type="number"
                  value={formData.performance.maxConcurrent}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    performance: { ...prev.performance, maxConcurrent: parseInt(e.target.value) }
                  }))}
                  className="w-full p-2 rounded-lg border text-sm"
                  min="1"
                  max="50"
                />
                <p className="text-xs text-gray-500 mt-2">الحد الأقصى للطلبات المتزامنة</p>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">مهلة الانتظار</h4>
                <input 
                  type="number"
                  value={formData.performance.timeout}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    performance: { ...prev.performance, timeout: parseInt(e.target.value) }
                  }))}
                  className="w-full p-2 rounded-lg border text-sm"
                  min="5"
                  max="120"
                />
                <p className="text-xs text-gray-500 mt-2">المدة بالثواني قبل انتهاء الوقت</p>
              </div>
            </div>
          </div>

          {/* Training Status Card */}
          <div className="rounded-[24px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">حالة التدريب</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  جودة البيانات
                </h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black mb-1">
                    {(formData.training.dataQuality * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500">نظافة وجودة البيانات</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${formData.training.dataQuality * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">الجدول الزمني</h4>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <span>آخر تدريب: </span>
                    <span className="font-medium">{formData.training.lastTrainingDate}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span>التدريب القادم: </span>
                    <span className="font-medium">{formData.training.nextScheduled}</span>
                  </div>
                  <label className="flex items-center gap-2 mt-3">
                    <input 
                      type="checkbox" 
                      checked={formData.training.autoRetrain}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        training: { ...prev.training, autoRetrain: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">إعادة التدريب التلقائي</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">3</div>
              <p className="text-xs font-normal text-gray-400">نماذج نشطة</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">87%</div>
              <p className="text-xs font-normal text-gray-400">متوسط الدقة</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">2.3s</div>
              <p className="text-xs font-normal text-gray-400">متوسط الاستجابة</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">15K</div>
              <p className="text-xs font-normal text-gray-400">طلبات اليوم</p>
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
                    models: {
                      nlp: { enabled: false, confidence: 0.75 },
                      vision: { enabled: false, confidence: 0.75 },
                      analytics: { enabled: false, confidence: 0.75 }
                    },
                    training: {
                      autoRetrain: false,
                      dataQuality: 0.80,
                      lastTrainingDate: '',
                      nextScheduled: ''
                    },
                    performance: {
                      maxConcurrent: 5,
                      timeout: 30,
                      caching: false
                    },
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
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import React, { useState } from 'react';
import { Palette, Sun, Moon, Monitor, Contrast, Paintbrush, Eye, Zap } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';

interface ThemeSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const ThemeSettingsPanel: React.FC<ThemeSettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    appearance: {
      mode: 'auto', // light, dark, auto
      colorScheme: 'soabra-default',
      contrast: 'normal', // low, normal, high
      fontSize: 16,
      borderRadius: 'medium'
    },
    colors: {
      primary: '#000000',
      secondary: '#F2FFFF',
      accent: '#96d8d0',
      background: '#FFFFFF',
      text: '#000000'
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      focusVisible: true,
      dyslexiaFriendly: false
    },
    aiPersonalization: {
      enabled: true,
      adaptiveColors: true,
      contextualThemes: true,
      moodBasedSwitching: false
    },
    lastModified: new Date().toISOString()
  });

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'theme',
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const colorSchemes = [
    { key: 'soabra-default', name: 'سـوبــرا الافتراضي', primary: '#000000', secondary: '#F2FFFF' },
    { key: 'dark-professional', name: 'المهني الداكن', primary: '#FFFFFF', secondary: '#1a1a1a' },
    { key: 'warm-earth', name: 'الأرض الدافئة', primary: '#8B4513', secondary: '#FDF5E6' },
    { key: 'ocean-breeze', name: 'نسيم المحيط', primary: '#006994', secondary: '#E0F6FF' }
  ];

  const handleSave = async () => {
    try {
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'theme', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Error handled silently
    }
  };

  return (
    <div className="h-full flex flex-col bg-white" >
      {/* Header with Title */}
      <div className="py-[45px] px-6">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          إعدادات المظهر
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-6" >
        <div className="space-y-6">

          {/* Theme Mode Card */}
          <AppCardSurface density="standard">
            <h3 className="text-md font-bold text-black mb-4">وضع المظهر</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'light', label: 'فاتح', icon: Sun },
                { key: 'dark', label: 'داكن', icon: Moon },
                { key: 'auto', label: 'تلقائي', icon: Monitor }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFormData(prev => ({ ...prev, appearance: { ...prev.appearance, mode: key } }))}
                  className={`p-4 rounded-2xl border border-black/10 transition-all ${formData.appearance.mode === key ? 'ring-2 ring-black' : ''}`}
                  style={{
                    backgroundColor: key === 'light' ? '#FFFFFF' : key === 'dark' ? '#1a1a1a' : '#F8F9FA',
                    color: key === 'dark' ? '#FFFFFF' : '#000000'
                  }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color Schemes Card */}
          <AppCardSurface density="standard">
            <h3 className="text-md font-bold text-black mb-4">أنظمة الألوان</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorSchemes.map(scheme => (
                <button
                  key={scheme.key}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    appearance: { ...prev.appearance, colorScheme: scheme.key },
                    colors: { ...prev.colors, primary: scheme.primary, secondary: scheme.secondary }
                  }))}
                  className={`p-4 rounded-2xl border transition-all text-right ${
                    formData.appearance.colorScheme === scheme.key 
                      ? 'ring-2 ring-black border-black/20' 
                      : 'border-black/10 hover:border-black/20'
                  }`}
                  style={{ backgroundColor: scheme.secondary }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: scheme.primary }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: scheme.primary }}>
                        {scheme.name}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scheme.primary }}></div>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scheme.secondary }}></div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Personalization Card */}
          <AppCardSurface density="standard">
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              🤖 التخصيص بالذكاء الاصطناعي
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">AI Personalization</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">الألوان التكيفية</h4>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.aiPersonalization.adaptiveColors}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aiPersonalization: { ...prev.aiPersonalization, adaptiveColors: e.target.checked }
                    }))}
                  />
                  <span className="text-sm text-black">تكيف الألوان حسب المحتوى</span>
                </label>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">المظاهر السياقية</h4>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.aiPersonalization.contextualThemes}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aiPersonalization: { ...prev.aiPersonalization, contextualThemes: e.target.checked }
                    }))}
                  />
                  <span className="text-sm text-black">مظاهر حسب نوع العمل</span>
                </label>
              </div>
            </div>
          </div>

          {/* Accessibility Card */}
          <AppCardSurface density="standard">
            <h3 className="text-md font-bold text-black mb-4">إعدادات إمكانية الوصول</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  البصر
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.accessibility.highContrast}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, highContrast: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">تباين عالي</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.accessibility.dyslexiaFriendly}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, dyslexiaFriendly: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">خط مناسب لعسر القراءة</span>
                  </label>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  الحركة
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.accessibility.reducedMotion}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, reducedMotion: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">تقليل الحركة</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={formData.accessibility.focusVisible}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, focusVisible: e.target.checked }
                      }))}
                    />
                    <span className="text-sm text-black">حدود التركيز المرئية</span>
                  </label>
                </div>
              </div>
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
                    appearance: { mode: 'auto', colorScheme: 'soabra-default', contrast: 'normal', fontSize: 16, borderRadius: 'medium' },
                    colors: { primary: '#000000', secondary: '#F2FFFF', accent: '#96d8d0', background: '#FFFFFF', text: '#000000' },
                    accessibility: { highContrast: false, reducedMotion: false, focusVisible: true, dyslexiaFriendly: false },
                    aiPersonalization: { enabled: false, adaptiveColors: false, contextualThemes: false, moodBasedSwitching: false },
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
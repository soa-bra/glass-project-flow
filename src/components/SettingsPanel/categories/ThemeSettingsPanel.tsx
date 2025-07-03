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

  const [previewMode, setPreviewMode] = useState<string>('current');
  
  const themePresets = [
    { id: 'soabra-default', name: 'سوبرا الافتراضي', colors: { primary: '#000000', secondary: '#F2FFFF', accent: '#96d8d0' } },
    { id: 'ocean-breeze', name: 'نسيم المحيط', colors: { primary: '#0066CC', secondary: '#E6F3FF', accent: '#00AAFF' } },
    { id: 'sunset-glow', name: 'توهج الغروب', colors: { primary: '#FF6B35', secondary: '#FFF4F0', accent: '#FFB28A' } },
    { id: 'forest-green', name: 'الأخضر الطبيعي', colors: { primary: '#2D5016', secondary: '#F0F8E8', accent: '#7CB342' } },
    { id: 'royal-purple', name: 'البنفسجي الملكي', colors: { primary: '#6A1B9A', secondary: '#F3E5F5', accent: '#BA68C8' } }
  ];

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

  const applyThemePreset = (preset: typeof themePresets[0]) => {
    setFormData(prev => ({
      ...prev,
      colors: { ...prev.colors, ...preset.colors },
      appearance: { ...prev.appearance, colorScheme: preset.id }
    }));
  };

  const generateAITheme = async () => {
    // هنا سيكون استدعاء مولد الثيمات بالذكاء الاصطناعي
    const aiGeneratedColors = {
      primary: '#1A365D',
      secondary: '#EDF8FF',
      accent: '#4299E1',
      background: '#FFFFFF',
      text: '#2D3748'
    };
    
    setFormData(prev => ({
      ...prev,
      colors: { ...prev.colors, ...aiGeneratedColors },
      appearance: { ...prev.appearance, colorScheme: 'ai-generated' }
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving theme settings to /settings/theme/commit');
      clearDraft();
      
      // تطبيق الثيم على الصفحة
      document.documentElement.style.setProperty('--color-primary', formData.colors.primary);
      document.documentElement.style.setProperty('--color-secondary', formData.colors.secondary);
      document.documentElement.style.setProperty('--color-accent', formData.colors.accent);
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'theme', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save theme settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-black/20">
            <Palette className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-black">المظهر والثيمات</h2>
            <p className="text-sm font-normal text-black">تخصيص شكل ومظهر النظام</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">●</div>
            <p className="text-xs font-normal text-gray-400">مخصص</p>
          </div>
        </div>
      </div>

      {/* مولد الثيمات بالذكاء الاصطناعي */}
      <div style={{ backgroundColor: '#d9d2fd' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          🎨 مولد الثيمات الذكي
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">AI Theme Generator</span>
        </h3>
        <p className="text-sm text-black mb-4">
          ينشئ ثيمات مخصصة بناءً على تفضيلاتك وسياق استخدامك للنظام
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={generateAITheme}
            className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium flex items-center gap-2"
          >
            <Zap size={14} />
            توليد ثيم ذكي
          </button>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.aiPersonalization.adaptiveColors}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                aiPersonalization: { ...prev.aiPersonalization, adaptiveColors: e.target.checked }
              }))}
            />
            <span className="text-sm text-black">ألوان تكيفية</span>
          </label>
        </div>
      </div>

      {/* وضع الإضاءة */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">وضع الإضاءة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setFormData(prev => ({ ...prev, appearance: { ...prev.appearance, mode: 'light' } }))}
            className={`p-4 rounded-2xl border border-black/10 transition-all ${
              formData.appearance.mode === 'light' ? 'ring-2 ring-black' : ''
            }`}
            style={{ backgroundColor: '#fbe2aa' }}
          >
            <div className="flex flex-col items-center gap-3">
              <Sun className="w-8 h-8 text-black" />
              <div>
                <h4 className="text-sm font-bold text-black">الوضع الفاتح</h4>
                <p className="text-xs text-gray-600">مناسب للعمل النهاري</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFormData(prev => ({ ...prev, appearance: { ...prev.appearance, mode: 'dark' } }))}
            className={`p-4 rounded-2xl border border-black/10 transition-all ${
              formData.appearance.mode === 'dark' ? 'ring-2 ring-black' : ''
            }`}
            style={{ backgroundColor: '#96d8d0' }}
          >
            <div className="flex flex-col items-center gap-3">
              <Moon className="w-8 h-8 text-black" />
              <div>
                <h4 className="text-sm font-bold text-black">الوضع الداكن</h4>
                <p className="text-xs text-gray-600">مريح للعين</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFormData(prev => ({ ...prev, appearance: { ...prev.appearance, mode: 'auto' } }))}
            className={`p-4 rounded-2xl border border-black/10 transition-all ${
              formData.appearance.mode === 'auto' ? 'ring-2 ring-black' : ''
            }`}
            style={{ backgroundColor: '#f1b5b9' }}
          >
            <div className="flex flex-col items-center gap-3">
              <Monitor className="w-8 h-8 text-black" />
              <div>
                <h4 className="text-sm font-bold text-black">تلقائي</h4>
                <p className="text-xs text-gray-600">حسب النظام</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* الثيمات المحددة مسبقاً */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">الثيمات المحددة مسبقاً</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themePresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyThemePreset(preset)}
              className={`p-4 rounded-2xl border border-black/10 transition-all text-left ${
                formData.appearance.colorScheme === preset.id ? 'ring-2 ring-black' : ''
              }`}
              style={{ backgroundColor: '#bdeed3' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.primary }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.secondary }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.accent }}></div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">{preset.name}</h4>
                  <p className="text-xs text-gray-600">ثيم جاهز</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* تخصيص الألوان */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">تخصيص الألوان</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">الألوان الأساسية</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-600 w-16">الأساسي:</label>
                <input 
                  type="color" 
                  value={formData.colors.primary}
                  className="w-12 h-8 rounded border-none"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    colors: { ...prev.colors, primary: e.target.value }
                  }))}
                />
                <span className="text-xs font-mono text-black">{formData.colors.primary}</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-600 w-16">الثانوي:</label>
                <input 
                  type="color" 
                  value={formData.colors.secondary}
                  className="w-12 h-8 rounded border-none"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    colors: { ...prev.colors, secondary: e.target.value }
                  }))}
                />
                <span className="text-xs font-mono text-black">{formData.colors.secondary}</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-600 w-16">المميز:</label>
                <input 
                  type="color" 
                  value={formData.colors.accent}
                  className="w-12 h-8 rounded border-none"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    colors: { ...prev.colors, accent: e.target.value }
                  }))}
                />
                <span className="text-xs font-mono text-black">{formData.colors.accent}</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#96d8d0' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">إعدادات الخط</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">حجم الخط</label>
                <input 
                  type="range" 
                  min="12" 
                  max="24" 
                  value={formData.appearance.fontSize}
                  className="w-full"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, fontSize: parseInt(e.target.value) }
                  }))}
                />
                <span className="text-xs text-gray-500">{formData.appearance.fontSize}px</span>
              </div>
              <div>
                <label className="text-xs text-gray-600">زوايا الحدود</label>
                <select 
                  value={formData.appearance.borderRadius}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, borderRadius: e.target.value }
                  }))}
                  className="w-full p-2 rounded-lg border text-sm"
                >
                  <option value="small">صغيرة</option>
                  <option value="medium">متوسطة</option>
                  <option value="large">كبيرة</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* إعدادات إمكانية الوصول */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">إمكانية الوصول</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={{ backgroundColor: '#fbe2aa' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
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
                <span className="text-sm">تباين عالي</span>
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
                <span className="text-sm">صديق لعسر القراءة</span>
              </label>
            </div>
          </div>

          <div style={{ backgroundColor: '#f1b5b9' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">الحركة</h4>
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
                <span className="text-sm">تقليل الحركة</span>
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
                <span className="text-sm">إبراز التركيز</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* معاينة الثيم */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">معاينة الثيم</h3>
        
        <div 
          className="rounded-2xl p-4 border border-black/10"
          style={{ 
            backgroundColor: formData.colors.secondary,
            color: formData.colors.text
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold">عنوان تجريبي</h4>
            <button 
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: formData.colors.primary }}
            >
              زر تجريبي
            </button>
          </div>
          <p className="text-sm mb-3">هذا نص تجريبي لإظهار شكل الثيم المختار</p>
          <div 
            className="w-full h-2 rounded"
            style={{ backgroundColor: formData.colors.accent }}
          ></div>
        </div>
      </div>

      {/* إحصائيات التخصيص */}
      <div className="grid grid-cols-4 gap-4">
        <div style={{ backgroundColor: '#bdeed3' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">5</div>
          <p className="text-xs font-normal text-gray-400">ثيمات محفوظة</p>
        </div>
        <div style={{ backgroundColor: '#f1b5b9' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">23</div>
          <p className="text-xs font-normal text-gray-400">تغيير هذا الشهر</p>
        </div>
        <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">87%</div>
          <p className="text-xs font-normal text-gray-400">رضا المستخدمين</p>
        </div>
        <div style={{ backgroundColor: '#d9d2fd' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">12</div>
          <p className="text-xs font-normal text-gray-400">ثيمات ذكية</p>
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
  );
};
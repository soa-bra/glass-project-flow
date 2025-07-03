import React, { useState } from 'react';
import { User, Camera, Key, Globe, Save } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';

interface AccountSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const AccountSettingsPanel: React.FC<AccountSettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    profile: {
      fullName: 'أحمد محمد السعيد',
      email: 'ahmed.alsaeid@soabra.com',
      phone: '+966501234567',
      avatar: '',
      language: 'ar'
    },
    password: {
      current: '',
      new: '',
      confirm: ''
    },
    lastModified: new Date().toISOString()
  });

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const [suggestedPassword, setSuggestedPassword] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'account',
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const generateStrongPassword = async () => {
    // هنا سيكون استدعاء GPT-Pass-Suggest
    const mockSuggestion = 'Sp@rK2024!mN$';
    setSuggestedPassword(mockSuggestion);
    setFormData(prev => ({
      ...prev,
      password: { ...prev.password, new: mockSuggestion }
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving account settings to /settings/account/commit');
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'account', data: formData }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save account settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-black/20">
            <User className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-black">الحساب الشخصي</h2>
            <p className="text-sm font-normal text-black">إدارة معلوماتك الشخصية وتفضيلاتك</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">●</div>
            <p className="text-xs font-normal text-gray-400">متصل</p>
          </div>
        </div>
      </div>

      {/* البيانات الشخصية */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">البيانات الشخصية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* صورة المستخدم */}
          <div style={{ backgroundColor: '#bdeed3' }} className="rounded-2xl p-4 border border-black/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-black">الصورة الشخصية</h4>
                <button className="mt-2 px-4 py-2 bg-black text-white rounded-full text-xs font-medium flex items-center gap-2">
                  <Camera size={14} />
                  تغيير الصورة
                </button>
              </div>
            </div>
          </div>

          {/* معلومات الاتصال */}
          <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">معلومات الاتصال</h4>
            <div className="space-y-3">
              <input 
                type="text" 
                value={formData.profile.fullName}
                className="w-full p-2 rounded-lg border text-sm"
                placeholder="الاسم الكامل"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, fullName: e.target.value }
                }))}
              />
              <input 
                type="email" 
                value={formData.profile.email}
                className="w-full p-2 rounded-lg border text-sm"
                placeholder="البريد الإلكتروني"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, email: e.target.value }
                }))}
              />
              <input 
                type="tel" 
                value={formData.profile.phone}
                className="w-full p-2 rounded-lg border text-sm"
                placeholder="رقم الجوال"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, phone: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* إدارة كلمات المرور */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">إدارة كلمات المرور</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div style={{ backgroundColor: '#d9d2fd' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">تغيير كلمة المرور</h4>
            <div className="space-y-3">
              <input 
                type="password" 
                placeholder="كلمة المرور الحالية"
                className="w-full p-2 rounded-lg border text-sm"
                value={formData.password.current}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: { ...prev.password, current: e.target.value }
                }))}
              />
              <input 
                type="password" 
                placeholder="كلمة المرور الجديدة"
                className="w-full p-2 rounded-lg border text-sm"
                value={formData.password.new}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: { ...prev.password, new: e.target.value }
                }))}
              />
              <input 
                type="password" 
                placeholder="تأكيد كلمة المرور"
                className="w-full p-2 rounded-lg border text-sm"
                value={formData.password.confirm}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: { ...prev.password, confirm: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* مولد كلمات المرور بالذكاء الاصطناعي */}
          <div style={{ backgroundColor: '#96d8d0' }} className="rounded-2xl p-4 border border-black/10">
            <h4 className="text-sm font-bold text-black mb-3">🤖 مولد كلمات المرور الذكي</h4>
            <p className="text-xs text-black mb-3">اقتراح كلمة مرور قوية باستخدام GPT-Pass-Suggest</p>
            <button
              onClick={generateStrongPassword}
              className="w-full mb-3 px-4 py-2 bg-black text-white rounded-full text-sm font-medium flex items-center justify-center gap-2"
            >
              <Key size={14} />
              اقتراح كلمة مرور قوية
            </button>
            {suggestedPassword && (
              <div className="p-2 bg-white/50 rounded-lg">
                <p className="text-xs text-gray-600">مقترح:</p>
                <code className="text-sm font-mono text-black">{suggestedPassword}</code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* إعدادات اللغة */}
      <div style={{ backgroundColor: '#F2FFFF' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4">تفضيلات اللغة</h3>
        
        <div style={{ backgroundColor: '#fbe2aa' }} className="rounded-2xl p-4 border border-black/10">
          <div className="flex items-center gap-4">
            <Globe className="w-6 h-6 text-black" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-black">لغة الواجهة</h4>
              <select 
                value={formData.profile.language}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, language: e.target.value }
                }))}
                className="mt-2 p-2 rounded-lg border text-sm"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات الحساب */}
      <div className="grid grid-cols-3 gap-4">
        <div style={{ backgroundColor: '#bdeed3' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">127</div>
          <p className="text-xs font-normal text-gray-400">يوم في النظام</p>
        </div>
        <div style={{ backgroundColor: '#f1b5b9' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">89%</div>
          <p className="text-xs font-normal text-gray-400">معدل النشاط</p>
        </div>
        <div style={{ backgroundColor: '#a4e2f6' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">24</div>
          <p className="text-xs font-normal text-gray-400">مشروع مكتمل</p>
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
                profile: { fullName: '', email: '', phone: '', avatar: '', language: 'ar' },
                password: { current: '', new: '', confirm: '' },
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
            className="px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Save size={14} />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};
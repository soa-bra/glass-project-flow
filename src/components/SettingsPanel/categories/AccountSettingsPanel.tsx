import React, { useState } from 'react';
import { User, Camera, Key, Globe, Save } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';
import { SecurityDisclaimer } from '../../ui/security-disclaimer';
import { ValidationSchemas, FormValidator, InputSanitizer, RateLimiter } from '../../../utils/validation';

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

  const validateField = (field: string, value: string) => {
    let error: string | null = null;
    
    switch (field) {
      case 'fullName':
        error = FormValidator.validateField(ValidationSchemas.name, value);
        break;
      case 'email':
        error = FormValidator.validateField(ValidationSchemas.email, value);
        break;
      case 'phone':
        error = FormValidator.validateField(ValidationSchemas.phone, value);
        break;
      case 'newPassword':
        if (value) {
          error = FormValidator.validateField(ValidationSchemas.password, value);
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password.new) {
          error = 'كلمة المرور غير متطابقة';
        }
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
    
    return !error;
  };

  const generateStrongPassword = async () => {
    if (!RateLimiter.isAllowed('generatePassword', 5, 60000)) { // 5 attempts per minute
      alert('تم تجاوز الحد المسموح لتوليد كلمات المرور. حاول مرة أخرى بعد دقيقة.');
      return;
    }

    // هنا سيكون استدعاء GPT-Pass-Suggest
    const mockSuggestion = 'Sp@rK2024!mN$';
    setSuggestedPassword(mockSuggestion);
    setFormData(prev => ({
      ...prev,
      password: { ...prev.password, new: mockSuggestion }
    }));
    validateField('newPassword', mockSuggestion);
  };

  const handleSave = async () => {
    try {
      // Validate all fields before saving
      const isNameValid = validateField('fullName', formData.profile.fullName);
      const isEmailValid = validateField('email', formData.profile.email);
      const isPhoneValid = validateField('phone', formData.profile.phone);
      const isPasswordValid = !formData.password.new || validateField('newPassword', formData.password.new);
      const isConfirmValid = !formData.password.confirm || validateField('confirmPassword', formData.password.confirm);
      
      if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmValid) {
        alert('يرجى تصحيح الأخطاء قبل الحفظ');
        return;
      }

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
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-0 py-[10px] my-[25px]">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[10px]">
          إعدادات الحساب
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
          {/* Header */}
          <div className="bg-[#FFFFFF] rounded-[40px] p-6 ring-1 ring-[#DADCE0]">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center ring-1 ring-[#DADCE0]">
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
          <div className="bg-[#FFFFFF] rounded-[40px] p-6 ring-1 ring-[#DADCE0]">
            <h3 className="text-md font-bold text-black mb-4">البيانات الشخصية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* صورة المستخدم */}
              <div className="bg-transparent rounded-[40px] p-4 ring-1 ring-[#DADCE0]">
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
              <div className="bg-transparent rounded-[40px] p-4 ring-1 ring-[#DADCE0]">
                <h4 className="text-sm font-bold text-black mb-3">معلومات الاتصال</h4>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={formData.profile.fullName}
                    className={`w-full p-2 rounded-lg border text-sm ${validationErrors.fullName ? 'border-red-500' : ''}`}
                    placeholder="الاسم الكامل"
                    onChange={(e) => {
                      const sanitized = InputSanitizer.sanitizeText(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, fullName: sanitized }
                      }));
                      validateField('fullName', sanitized);
                    }}
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>
                  )}
                  <input 
                    type="email" 
                    value={formData.profile.email}
                    className={`w-full p-2 rounded-lg border text-sm ${validationErrors.email ? 'border-red-500' : ''}`}
                    placeholder="البريد الإلكتروني"
                    onChange={(e) => {
                      const sanitized = InputSanitizer.sanitizeEmail(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, email: sanitized }
                      }));
                      validateField('email', sanitized);
                    }}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  )}
                  <input 
                    type="tel" 
                    value={formData.profile.phone}
                    className={`w-full p-2 rounded-lg border text-sm ${validationErrors.phone ? 'border-red-500' : ''}`}
                    placeholder="رقم الجوال"
                    onChange={(e) => {
                      const sanitized = InputSanitizer.sanitizeNumeric(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, phone: sanitized }
                      }));
                      validateField('phone', sanitized);
                    }}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* إدارة كلمات المرور */}
          <div className="bg-[#FFFFFF] rounded-[40px] p-6 ring-1 ring-[#DADCE0]">
            <h3 className="text-md font-bold text-black mb-4">إدارة كلمات المرور</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-transparent rounded-[40px] p-4 ring-1 ring-[#DADCE0]">
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
                    className={`w-full p-2 rounded-lg border text-sm ${validationErrors.newPassword ? 'border-red-500' : ''}`}
                    value={formData.password.new}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        password: { ...prev.password, new: e.target.value }
                      }));
                      validateField('newPassword', e.target.value);
                    }}
                  />
                  {validationErrors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.newPassword}</p>
                  )}
                  <input 
                    type="password" 
                    placeholder="تأكيد كلمة المرور"
                    className={`w-full p-2 rounded-lg border text-sm ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.password.confirm}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        password: { ...prev.password, confirm: e.target.value }
                      }));
                      validateField('confirmPassword', e.target.value);
                    }}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* مولد كلمات المرور بالذكاء الاصطناعي */}
              <div className="bg-transparent rounded-[40px] p-4 ring-1 ring-[#DADCE0]">
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
          <div className="bg-[#FFFFFF] rounded-[40px] p-6 ring-1 ring-[#DADCE0]">
            <h3 className="text-md font-bold text-black mb-4">تفضيلات اللغة</h3>
            
            <div className="bg-transparent rounded-[40px] p-4 ring-1 ring-[#DADCE0]">
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
            <div className="bg-transparent rounded-[40px] p-4 ring-1 ring-[#DADCE0] text-center">
              <div className="text-2xl font-bold text-black mb-1">127</div>
              <p className="text-xs font-normal text-gray-400">يوم في النظام</p>
            </div>
            <div className="bg-transparent rounded-[40px] p-4 ring-1 ring-[#DADCE0] text-center">
              <div className="text-2xl font-bold text-black mb-1">89%</div>
              <p className="text-xs font-normal text-gray-400">معدل النشاط</p>
            </div>
            <div className="bg-transparent rounded-[40px] p-4 ring-1 ring-[#DADCE0] text-center">
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
            style={{ backgroundColor: '#f2ffff', color: '#000000' }}
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
      </div>
    </div>
  );
};
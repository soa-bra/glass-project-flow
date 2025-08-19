import React, { useState } from 'react';
import { Bell, Smartphone, Mail, MessageSquare, Settings, Volume2, VolumeX, Clock, Target } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';

interface NotificationsSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const NotificationsSettingsPanel: React.FC<NotificationsSettingsPanelProps> = () => {
  const [formData, setFormData] = useState({
    preferences: {
      email: true,
      push: true,
      sms: false,
      inApp: true,
      sound: true
    },
    channels: {
      projects: ['email', 'push'],
      tasks: ['push', 'inApp'],
      financial: ['email'],
      legal: ['email', 'push'],
      hr: ['inApp']
    },
    schedule: {
      workHours: { start: '09:00', end: '17:00' },
      timezone: 'Asia/Riyadh',
      quietHours: { enabled: true, start: '22:00', end: '07:00' }
    },
    aiSettings: {
      smartDigest: true,
      priorityFiltering: true,
      predictiveAlerts: true,
      contextualGrouping: true
    },
    lastModified: new Date().toISOString()
  });

  const [notificationHistory] = useState([
    { id: '1', type: 'project', message: 'تحديث في مشروع العلامة التجارية الجديد', time: '2024-01-20 10:30', read: false },
    { id: '2', type: 'financial', message: 'فاتورة جديدة تحتاج موافقة', time: '2024-01-20 09:15', read: true },
    { id: '3', type: 'hr', message: 'تقييم الأداء الشهري متاح', time: '2024-01-19 16:45', read: true }
  ]);

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'notifications',
    data: formData,
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const updatePreference = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const updateChannelSettings = (module: string, channels: string[]) => {
    setFormData(prev => ({
      ...prev,
      channels: { ...prev.channels, [module]: channels }
    }));
  };

  const handleSave = async () => {
    try {
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'notifications', data: formData }
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
          الإشعارات والتنبيهات
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-6" style={{ background: 'var(--sb-column-3-bg)' }}>
        <div className="space-y-6">

          {/* AI Smart Notifications Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
              🤖 نظام الإشعارات الذكي
              <BaseBadge variant="warning" size="sm">AI Smart Notify</BaseBadge>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">الملخص الذكي</h4>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.aiSettings.smartDigest}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aiSettings: { ...prev.aiSettings, smartDigest: e.target.checked }
                    }))}
                  />
                  <span className="text-sm text-black">تجميع الإشعارات ذات الصلة</span>
                </label>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">فلترة الأولوية</h4>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.aiSettings.priorityFiltering}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aiSettings: { ...prev.aiSettings, priorityFiltering: e.target.checked }
                    }))}
                  />
                  <span className="text-sm text-black">إظهار الإشعارات المهمة أولاً</span>
                </label>
              </div>
            </div>
          </div>

          {/* General Notifications Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">تفضيلات الإشعارات</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-black" />
                  <h4 className="text-sm font-bold text-black">البريد الإلكتروني</h4>
                  <BaseBadge variant={formData.preferences.email ? 'success' : 'secondary'} size="sm">
                    {formData.preferences.email ? 'مفعل' : 'معطل'}
                  </BaseBadge>
                </div>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.preferences.email}
                    onChange={(e) => updatePreference('email', e.target.checked)}
                  />
                  <span className="text-sm text-black">تفعيل إشعارات البريد</span>
                </label>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone className="w-5 h-5 text-black" />
                  <h4 className="text-sm font-bold text-black">الدفع</h4>
                  <BaseBadge variant={formData.preferences.push ? 'success' : 'secondary'} size="sm">
                    {formData.preferences.push ? 'مفعل' : 'معطل'}
                  </BaseBadge>
                </div>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.preferences.push}
                    onChange={(e) => updatePreference('push', e.target.checked)}
                  />
                  <span className="text-sm text-black">تفعيل الإشعارات المدفوعة</span>
                </label>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <div className="flex items-center gap-3 mb-3">
                  {formData.preferences.sound ? <Volume2 className="w-5 h-5 text-black" /> : <VolumeX className="w-5 h-5 text-black" />}
                  <h4 className="text-sm font-bold text-black">الصوت</h4>
                  <BaseBadge variant={formData.preferences.sound ? 'success' : 'secondary'} size="sm">
                    {formData.preferences.sound ? 'مفعل' : 'معطل'}
                  </BaseBadge>
                </div>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.preferences.sound}
                    onChange={(e) => updatePreference('sound', e.target.checked)}
                  />
                  <span className="text-sm text-black">تفعيل الأصوات</span>
                </label>
              </div>
            </div>
          </div>

          {/* Project Notifications Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">إشعارات المشاريع</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  المهام والمشاريع
                </h4>
                <div className="space-y-2">
                  {['email', 'push', 'sms'].map(channel => (
                    <label key={channel} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.channels.projects.includes(channel)}
                        onChange={(e) => {
                          const channels = e.target.checked 
                            ? [...formData.channels.projects, channel]
                            : formData.channels.projects.filter(c => c !== channel);
                          updateChannelSettings('projects', channels);
                        }}
                      />
                      <span className="text-sm">{channel === 'email' ? 'بريد إلكتروني' : channel === 'push' ? 'إشعار فوري' : 'رسالة نصية'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">الإشعارات المالية</h4>
                <div className="space-y-2">
                  {['email', 'push', 'sms'].map(channel => (
                    <label key={channel} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.channels.financial.includes(channel)}
                        onChange={(e) => {
                          const channels = e.target.checked 
                            ? [...formData.channels.financial, channel]
                            : formData.channels.financial.filter(c => c !== channel);
                          updateChannelSettings('financial', channels);
                        }}
                      />
                      <span className="text-sm">{channel === 'email' ? 'بريد إلكتروني' : channel === 'push' ? 'إشعار فوري' : 'رسالة نصية'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Smart Timing Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">إعدادات التوقيت</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  ساعات العمل
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">من</label>
                    <input 
                      type="time" 
                      value={formData.schedule.workHours.start}
                      className="w-full p-2 rounded-lg border text-sm"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, workHours: { ...prev.schedule.workHours, start: e.target.value } }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">إلى</label>
                    <input 
                      type="time" 
                      value={formData.schedule.workHours.end}
                      className="w-full p-2 rounded-lg border text-sm"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, workHours: { ...prev.schedule.workHours, end: e.target.value } }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                <h4 className="text-sm font-bold text-black mb-3">الساعات الهادئة</h4>
                <label className="flex items-center gap-2 mb-3">
                  <input 
                    type="checkbox" 
                    checked={formData.schedule.quietHours.enabled}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, quietHours: { ...prev.schedule.quietHours, enabled: e.target.checked } }
                    }))}
                  />
                  <span className="text-sm text-black">تفعيل الساعات الهادئة</span>
                </label>
                {formData.schedule.quietHours.enabled && (
                  <div className="space-y-2">
                    <input 
                      type="time" 
                      value={formData.schedule.quietHours.start}
                      className="w-full p-2 rounded-lg border text-sm"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, quietHours: { ...prev.schedule.quietHours, start: e.target.value } }
                      }))}
                    />
                    <input 
                      type="time" 
                      value={formData.schedule.quietHours.end}
                      className="w-full p-2 rounded-lg border text-sm"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, quietHours: { ...prev.schedule.quietHours, end: e.target.value } }
                      }))}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notification History Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">سجل الإشعارات الأخيرة</h3>
            
            <div className="space-y-3">
              {notificationHistory.map(notification => (
                <div key={notification.id} className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BaseBadge variant={notification.read ? 'secondary' : 'info'} size="sm">
                      {notification.read ? 'مقروء' : 'جديد'}
                    </BaseBadge>
                    <div>
                      <p className="text-sm font-medium text-black">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                  <BaseBadge variant="outline" size="sm">{notification.type}</BaseBadge>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">47</div>
              <p className="text-xs font-normal text-gray-600">هذا الأسبوع</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">5</div>
              <p className="text-xs font-normal text-gray-600">غير مقروءة</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">92%</div>
              <p className="text-xs font-normal text-gray-600">معدل القراءة</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">3.2</div>
              <p className="text-xs font-normal text-gray-600">متوسط يومي</p>
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
                    preferences: { email: false, push: false, sms: false, inApp: false, sound: false },
                    channels: { projects: [], tasks: [], financial: [], legal: [], hr: [] },
                    schedule: { workHours: { start: '09:00', end: '17:00' }, timezone: 'Asia/Riyadh', quietHours: { enabled: false, start: '22:00', end: '07:00' } },
                    aiSettings: { smartDigest: false, priorityFiltering: false, predictiveAlerts: false, contextualGrouping: false },
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
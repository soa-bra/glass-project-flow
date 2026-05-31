import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { Calendar, Plus, Settings, BarChart3, Target, DollarSign, X } from 'lucide-react';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const CampaignsChannelsTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'campaigns' | 'channels' | 'calendar'>('campaigns');
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isChannelSettingsOpen, setIsChannelSettingsOpen] = useState(false);

  const [campaigns, setCampaigns] = useState([
    { id: '1', name: 'حملة العودة للمدارس 2024', type: 'paid_ads', status: 'active', budget: 50000, spent: 32500, startDate: '2024-08-01', endDate: '2024-09-15', channels: ['Facebook', 'Instagram', 'Google Ads'], approvalStatus: 'approved', performance: { roas: 4.2, cpa: 245, ctr: 3.4 } },
    { id: '2', name: 'حملة التسويق بالمحتوى', type: 'content', status: 'scheduled', budget: 25000, spent: 0, startDate: '2024-09-01', endDate: '2024-11-30', channels: ['LinkedIn', 'Blog', 'YouTube'], approvalStatus: 'creative_review', performance: { roas: 0, cpa: 0, ctr: 0 } },
    { id: '3', name: 'فعالية المؤتمر السنوي', type: 'events', status: 'active', budget: 120000, spent: 75000, startDate: '2024-07-15', endDate: '2024-10-15', channels: ['Event Platform', 'Email', 'Social Media'], approvalStatus: 'approved', performance: { roas: 2.8, cpa: 420, ctr: 2.1 } },
  ]);

  const [channelSettings, setChannelSettings] = useState([
    { id: '1', name: 'Facebook Ads', platform: 'Facebook', active: true, budget: 15000 },
    { id: '2', name: 'LinkedIn Sponsored', platform: 'LinkedIn', active: true, budget: 8000 },
    { id: '3', name: 'Email Marketing', platform: 'Email', active: true, budget: 5000 },
    { id: '4', name: 'Google Ads', platform: 'Google', active: false, budget: 10000 },
  ]);

  const channels = [
    { id: '1', name: 'Facebook Ads', type: 'digital', platform: 'Facebook', status: 'active', budget: 15000, spent: 12300, performance: { impressions: 125000, clicks: 4250, conversions: 119, ctr: 3.4, cpc: 2.89, cpa: 245 } },
    { id: '2', name: 'LinkedIn Sponsored Content', type: 'digital', platform: 'LinkedIn', status: 'active', budget: 8000, spent: 6500, performance: { impressions: 45000, clicks: 2200, conversions: 156, ctr: 4.9, cpc: 2.95, cpa: 189 } },
    { id: '3', name: 'Email Marketing', type: 'email', platform: 'Custom', status: 'active', budget: 5000, spent: 3200, performance: { impressions: 25000, clicks: 1800, conversions: 95, ctr: 7.2, cpc: 1.78, cpa: 156 } },
  ];

  const campaignFields: FormField[] = [
    { name: 'name', label: 'اسم الحملة', type: 'text', required: true, placeholder: 'أدخل اسم الحملة' },
    { name: 'type', label: 'نوع الحملة', type: 'select', required: true, options: [
      { value: 'paid_ads', label: 'إعلانات مدفوعة' },
      { value: 'content', label: 'تسويق بالمحتوى' },
      { value: 'events', label: 'فعاليات' },
      { value: 'social', label: 'تواصل اجتماعي' },
    ]},
    { name: 'budget', label: 'الميزانية (ر.س)', type: 'number', required: true, placeholder: '0' },
    { name: 'startDate', label: 'تاريخ البداية', type: 'date', required: true },
    { name: 'endDate', label: 'تاريخ النهاية', type: 'date', required: true },
    { name: 'description', label: 'وصف الحملة', type: 'textarea', placeholder: 'أدخل وصف الحملة...' },
  ];

  const handleCreateCampaign = (data: Record<string, string>) => {
    const newCampaign = {
      id: String(Date.now()),
      name: data.name,
      type: data.type,
      status: 'scheduled' as const,
      budget: Number(data.budget),
      spent: 0,
      startDate: data.startDate,
      endDate: data.endDate,
      channels: [],
      approvalStatus: 'pending',
      performance: { roas: 0, cpa: 0, ctr: 0 },
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const toggleChannelActive = (channelId: string) => {
    setChannelSettings(prev => prev.map(ch => ch.id === channelId ? { ...ch, active: !ch.active } : ch));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string }> = {
      'active': { label: 'نشطة', variant: 'success' },
      'scheduled': { label: 'مجدولة', variant: 'info' },
      'paused': { label: 'متوقفة', variant: 'warning' },
      'completed': { label: 'مكتملة', variant: 'default' },
      'draft': { label: 'مسودة', variant: 'default' },
    };
    const statusInfo = statusMap[status] || statusMap.draft;
    return <UnifiedBadge variant={statusInfo.variant as any}>{statusInfo.label}</UnifiedBadge>;
  };

  const getApprovalBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string }> = {
      'approved': { label: 'معتمدة', variant: 'success' },
      'creative_review': { label: 'مراجعة إبداعية', variant: 'warning' },
      'pending': { label: 'في الانتظار', variant: 'default' },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <UnifiedBadge variant={statusInfo.variant as any}>{statusInfo.label}</UnifiedBadge>;
  };

  // Calendar data
  const getMonthDays = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) { days.push(i); }
    return days;
  };

  const getCampaignForDay = (day: number) => {
    return campaigns.filter(c => {
      const start = new Date(c.startDate).getDate();
      const end = new Date(c.endDate).getDate();
      return day >= Math.min(start, 1) && day <= Math.max(end, 30);
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-0 px-0 mx-[15px]">
          <UnifiedButton onClick={() => setActiveView('campaigns')} variant={activeView === 'campaigns' ? 'primary' : 'outline'}>الحملات</UnifiedButton>
          <UnifiedButton onClick={() => setActiveView('channels')} variant={activeView === 'channels' ? 'primary' : 'outline'}>القنوات</UnifiedButton>
          <UnifiedButton onClick={() => setActiveView('calendar')} variant={activeView === 'calendar' ? 'primary' : 'outline'}>
            <Calendar className="w-4 h-4" />
            التقويم
          </UnifiedButton>
        </div>
        <div className="flex gap-0">
          <UnifiedButton variant="primary" onClick={() => setIsCreateCampaignOpen(true)}>
            <Plus className="w-4 h-4" />
            إنشاء حملة جديدة
          </UnifiedButton>
          <UnifiedButton variant="outline" onClick={() => setIsChannelSettingsOpen(true)}>
            <Settings className="w-4 h-4" />
            إعدادات القنوات
          </UnifiedButton>
        </div>
      </div>

      {activeView === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <BaseBox key={campaign.id} variant="operations" className="transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-black font-arabic">{campaign.name}</h3>
                    <p className="text-sm text-black font-arabic">{campaign.startDate} إلى {campaign.endDate}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {getStatusBadge(campaign.status)}
                    {getApprovalBadge(campaign.approvalStatus)}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-[#a4e2f6] rounded-lg">
                    <DollarSign className="w-5 h-5 text-black mx-auto mb-1" />
                    <p className="text-xs text-black font-arabic">الميزانية</p>
                    <p className="font-semibold text-black">{campaign.budget.toLocaleString()} ر.س</p>
                  </div>
                  <div className="text-center p-3 bg-[#bdeed3] rounded-lg">
                    <BarChart3 className="w-5 h-5 text-black mx-auto mb-1" />
                    <p className="text-xs text-black font-arabic">المصروف</p>
                    <p className="font-semibold text-black">{campaign.spent.toLocaleString()} ر.س</p>
                  </div>
                  <div className="text-center p-3 bg-[#d9d2fd] rounded-lg">
                    <Target className="w-5 h-5 text-black mx-auto mb-1" />
                    <p className="text-xs text-black font-arabic">ROAS</p>
                    <p className="font-semibold text-black">{campaign.performance.roas}x</p>
                  </div>
                  <div className="text-center p-3 bg-[#fbe2aa] rounded-lg">
                    <Target className="w-5 h-5 text-black mx-auto mb-1" />
                    <p className="text-xs text-black font-arabic">CPA</p>
                    <p className="font-semibold text-black">{campaign.performance.cpa} ر.س</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-black font-arabic mb-2">القنوات:</p>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.channels.map((channel, index) => <UnifiedBadge key={index} variant="default">{channel}</UnifiedBadge>)}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-black font-arabic mb-1">
                    <span>تقدم الحملة</span>
                    <span>{campaign.budget > 0 ? Math.round(campaign.spent / campaign.budget * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full transition-all duration-300" style={{ width: `${campaign.budget > 0 ? campaign.spent / campaign.budget * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </BaseBox>
          ))}
        </div>
      )}

      {activeView === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map(channel => (
            <BaseBox key={channel.id} variant="operations" className="transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-black font-arabic">{channel.name}</h3>
                    <p className="text-sm text-black font-arabic">{channel.platform}</p>
                  </div>
                  {getStatusBadge(channel.status)}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-black font-arabic">الظهور</span><span className="font-semibold text-black">{channel.performance.impressions.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-black font-arabic">النقرات</span><span className="font-semibold text-black">{channel.performance.clicks.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-black font-arabic">التحويلات</span><span className="font-semibold text-black">{channel.performance.conversions}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-black font-arabic">CTR</span><span className="font-semibold text-black">{channel.performance.ctr}%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-black font-arabic">CPC</span><span className="font-semibold text-black">{channel.performance.cpc} ر.س</span></div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm font-arabic mb-1 text-black">
                    <span>الميزانية المستخدمة</span>
                    <span>{Math.round(channel.spent / channel.budget * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full" style={{ width: `${channel.spent / channel.budget * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </BaseBox>
          ))}
        </div>
      )}

      {activeView === 'calendar' && (
        <BaseBox variant="operations">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-black font-arabic mb-2">تقويم الحملات</h3>
            <p className="text-sm text-black/60 font-arabic">عرض تفاعلي لجدولة الحملات والفعاليات التسويقية</p>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-black/50 font-arabic py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getMonthDays().map(day => {
              const dayCampaigns = getCampaignForDay(day);
              return (
                <div key={day} className={`min-h-[80px] p-2 rounded-xl border border-black/5 ${dayCampaigns.length > 0 ? 'bg-[#bdeed3]/20' : 'bg-gray-50'}`}>
                  <span className="text-xs font-medium text-black">{day}</span>
                  {dayCampaigns.slice(0, 2).map((c, i) => (
                    <div key={i} className="mt-1 text-[10px] bg-black/10 rounded px-1 py-0.5 truncate font-arabic">{c.name}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </BaseBox>
      )}

      <GenericFormModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        title="إنشاء حملة تسويقية جديدة"
        fields={campaignFields}
        onSubmit={handleCreateCampaign}
        submitLabel="إنشاء الحملة"
        successMessage="تم إنشاء الحملة بنجاح"
      />

      <Dialog open={isChannelSettingsOpen} onOpenChange={setIsChannelSettingsOpen}>
        <DialogContent className="max-w-lg bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black font-arabic text-center">إعدادات القنوات التسويقية</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {channelSettings.map(ch => (
              <div key={ch.id} className="flex items-center justify-between p-4 rounded-2xl border border-black/10 bg-white/30">
                <div>
                  <h4 className="font-semibold text-black font-arabic">{ch.name}</h4>
                  <p className="text-sm text-black/60 font-arabic">{ch.platform} • ميزانية: {ch.budget.toLocaleString()} ر.س</p>
                </div>
                <Switch checked={ch.active} onCheckedChange={() => toggleChannelActive(ch.id)} />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <UnifiedButton variant="primary" onClick={() => { setIsChannelSettingsOpen(false); toast.success("تم حفظ إعدادات القنوات"); }}>حفظ الإعدادات</UnifiedButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

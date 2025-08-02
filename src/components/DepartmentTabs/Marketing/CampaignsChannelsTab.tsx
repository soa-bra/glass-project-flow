import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
import { Calendar, Plus, Settings, BarChart3, Target, DollarSign } from 'lucide-react';
export const CampaignsChannelsTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'campaigns' | 'channels' | 'calendar'>('campaigns');
  const campaigns = [{
    id: '1',
    name: 'حملة العودة للمدارس 2024',
    type: 'paid_ads',
    status: 'active',
    budget: 50000,
    spent: 32500,
    startDate: '2024-08-01',
    endDate: '2024-09-15',
    channels: ['Facebook', 'Instagram', 'Google Ads'],
    approvalStatus: 'approved',
    performance: {
      roas: 4.2,
      cpa: 245,
      ctr: 3.4
    }
  }, {
    id: '2',
    name: 'حملة التسويق بالمحتوى',
    type: 'content',
    status: 'scheduled',
    budget: 25000,
    spent: 0,
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    channels: ['LinkedIn', 'Blog', 'YouTube'],
    approvalStatus: 'creative_review',
    performance: {
      roas: 0,
      cpa: 0,
      ctr: 0
    }
  }, {
    id: '3',
    name: 'فعالية المؤتمر السنوي',
    type: 'events',
    status: 'active',
    budget: 120000,
    spent: 75000,
    startDate: '2024-07-15',
    endDate: '2024-10-15',
    channels: ['Event Platform', 'Email', 'Social Media'],
    approvalStatus: 'approved',
    performance: {
      roas: 2.8,
      cpa: 420,
      ctr: 2.1
    }
  }];
  const channels = [{
    id: '1',
    name: 'Facebook Ads',
    type: 'digital',
    platform: 'Facebook',
    status: 'active',
    budget: 15000,
    spent: 12300,
    performance: {
      impressions: 125000,
      clicks: 4250,
      conversions: 119,
      ctr: 3.4,
      cpc: 2.89,
      cpa: 245
    }
  }, {
    id: '2',
    name: 'LinkedIn Sponsored Content',
    type: 'digital',
    platform: 'LinkedIn',
    status: 'active',
    budget: 8000,
    spent: 6500,
    performance: {
      impressions: 45000,
      clicks: 2200,
      conversions: 156,
      ctr: 4.9,
      cpc: 2.95,
      cpa: 189
    }
  }, {
    id: '3',
    name: 'Email Marketing',
    type: 'email',
    platform: 'Custom',
    status: 'active',
    budget: 5000,
    spent: 3200,
    performance: {
      impressions: 25000,
      clicks: 1800,
      conversions: 95,
      ctr: 7.2,
      cpc: 1.78,
      cpa: 156
    }
  }];
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'active': {
        label: 'نشطة',
        variant: 'success'
      },
      'scheduled': {
        label: 'مجدولة',
        variant: 'info'
      },
      'paused': {
        label: 'متوقفة',
        variant: 'warning'
      },
      'completed': {
        label: 'مكتملة',
        variant: 'default'
      },
      'draft': {
        label: 'مسودة',
        variant: 'default'
      }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <UnifiedBadge variant={statusInfo.variant as any}>{statusInfo.label}</UnifiedBadge>;
  };
  const getApprovalBadge = (status: string) => {
    const statusMap = {
      'approved': {
        label: 'معتمدة',
        variant: 'success'
      },
      'creative_review': {
        label: 'مراجعة إبداعية',
        variant: 'warning'
      },
      'legal_review': {
        label: 'مراجعة قانونية',
        variant: 'default'
      },
      'financial_review': {
        label: 'مراجعة مالية',
        variant: 'info'
      },
      'rejected': {
        label: 'مرفوضة',
        variant: 'error'
      },
      'pending': {
        label: 'في الانتظار',
        variant: 'default'
      }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <UnifiedBadge variant={statusInfo.variant as any}>{statusInfo.label}</UnifiedBadge>;
  };
  return <div className="mb-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-0 px-0 mx-[15px]">
          <UnifiedButton onClick={() => setActiveView('campaigns')} variant={activeView === 'campaigns' ? 'primary' : 'outline'}>
            الحملات
          </UnifiedButton>
          <UnifiedButton onClick={() => setActiveView('channels')} variant={activeView === 'channels' ? 'primary' : 'outline'}>
            القنوات
          </UnifiedButton>
          <UnifiedButton onClick={() => setActiveView('calendar')} variant={activeView === 'calendar' ? 'primary' : 'outline'}>
            <Calendar className="w-4 h-4" />
            التقويم
          </UnifiedButton>
        </div>
        
        <div className="flex gap-0">
          <UnifiedButton variant="primary">
            <Plus className="w-4 h-4" />
            إنشاء حملة جديدة
          </UnifiedButton>
          <UnifiedButton variant="outline">
            <Settings className="w-4 h-4" />
            إعدادات القنوات
          </UnifiedButton>
        </div>
      </div>

      {/* Campaigns View */}
      {activeView === 'campaigns' && <div className="space-y-4">
          {campaigns.map(campaign => <BaseCard key={campaign.id} variant="operations" className="transition-all duration-300">
              <div className="space-y-4">
                {/* Campaign Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-black font-arabic">{campaign.name}</h3>
                    <p className="text-sm text-black font-arabic">
                      {campaign.startDate} إلى {campaign.endDate}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {getStatusBadge(campaign.status)}
                    {getApprovalBadge(campaign.approvalStatus)}
                  </div>
                </div>

                {/* Campaign Metrics */}
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

                {/* Campaign Channels */}
                <div>
                  <p className="text-sm font-semibold text-black font-arabic mb-2">القنوات:</p>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.channels.map((channel, index) => <UnifiedBadge key={index} variant="default">
                        {channel}
                      </UnifiedBadge>)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-black font-arabic mb-1">
                    <span>تقدم الحملة</span>
                    <span>{Math.round(campaign.spent / campaign.budget * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full transition-all duration-300" style={{
                width: `${campaign.spent / campaign.budget * 100}%`
              }}></div>
                  </div>
                </div>
              </div>
            </BaseCard>)}
        </div>}

      {/* Channels View */}
      {activeView === 'channels' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map(channel => <BaseCard key={channel.id} variant="operations" className="transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-black font-arabic">{channel.name}</h3>
                    <p className="text-sm text-black font-arabic">{channel.platform}</p>
                  </div>
                  {getStatusBadge(channel.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-black font-arabic">الظهور</span>
                    <span className="font-semibold text-black">{channel.performance.impressions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black font-arabic">النقرات</span>
                    <span className="font-semibold text-black">{channel.performance.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black font-arabic">التحويلات</span>
                    <span className="font-semibold text-black">{channel.performance.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black font-arabic">CTR</span>
                    <span className="font-semibold text-black">{channel.performance.ctr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black font-arabic">CPC</span>
                    <span className="font-semibold text-black">{channel.performance.cpc} ر.س</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm font-arabic mb-1 text-black">
                    <span>الميزانية المستخدمة</span>
                    <span>{Math.round(channel.spent / channel.budget * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full" style={{
                width: `${channel.spent / channel.budget * 100}%`
              }}></div>
                  </div>
                </div>
              </div>
            </BaseCard>)}
        </div>}

      {/* Calendar View */}
      {activeView === 'calendar' && <BaseCard variant="operations">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-black/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black font-arabic mb-2">تقويم الحملات</h3>
            <p className="text-black font-arabic mb-6">
              عرض تفاعلي لجدولة الحملات والفعاليات التسويقية
            </p>
            <UnifiedButton variant="primary" size="lg">
              قريباً - تقويم تفاعلي متقدم
            </UnifiedButton>
          </div>
        </BaseCard>}
    </div>;
};
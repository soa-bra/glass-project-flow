
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Settings, BarChart3, Target, DollarSign } from 'lucide-react';

export const CampaignsChannelsTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'campaigns' | 'channels' | 'calendar'>('campaigns');

  const campaigns = [
    {
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
      performance: { roas: 4.2, cpa: 245, ctr: 3.4 }
    },
    {
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
      performance: { roas: 0, cpa: 0, ctr: 0 }
    },
    {
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
      performance: { roas: 2.8, cpa: 420, ctr: 2.1 }
    }
  ];

  const channels = [
    {
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
    },
    {
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
    },
    {
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
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'active': { label: 'نشطة', className: 'bg-green-100 text-green-700' },
      'scheduled': { label: 'مجدولة', className: 'bg-blue-100 text-blue-700' },
      'paused': { label: 'متوقفة', className: 'bg-yellow-100 text-yellow-700' },
      'completed': { label: 'مكتملة', className: 'bg-gray-100 text-gray-700' },
      'draft': { label: 'مسودة', className: 'bg-gray-100 text-gray-600' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getApprovalBadge = (status: string) => {
    const statusMap = {
      'approved': { label: 'معتمدة', className: 'bg-green-100 text-green-700' },
      'creative_review': { label: 'مراجعة إبداعية', className: 'bg-orange-100 text-orange-700' },
      'legal_review': { label: 'مراجعة قانونية', className: 'bg-purple-100 text-purple-700' },
      'financial_review': { label: 'مراجعة مالية', className: 'bg-blue-100 text-blue-700' },
      'rejected': { label: 'مرفوضة', className: 'bg-red-100 text-red-700' },
      'pending': { label: 'في الانتظار', className: 'bg-gray-100 text-gray-600' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'campaigns' ? 'default' : 'outline'}
            onClick={() => setActiveView('campaigns')}
            className="font-arabic"
          >
            الحملات
          </Button>
          <Button 
            variant={activeView === 'channels' ? 'default' : 'outline'}
            onClick={() => setActiveView('channels')}
            className="font-arabic"
          >
            القنوات
          </Button>
          <Button 
            variant={activeView === 'calendar' ? 'default' : 'outline'}
            onClick={() => setActiveView('calendar')}
            className="font-arabic"
          >
            <Calendar className="w-4 h-4 ml-2" />
            التقويم
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button className="font-arabic">
            <Plus className="w-4 h-4 ml-2" />
            إنشاء حملة جديدة
          </Button>
          <Button variant="outline" className="font-arabic">
            <Settings className="w-4 h-4 ml-2" />
            إعدادات القنوات
          </Button>
        </div>
      </div>

      {/* Campaigns View */}
      {activeView === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <GenericCard key={campaign.id} className="hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                {/* Campaign Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-arabic">{campaign.name}</h3>
                    <p className="text-sm text-gray-600 font-arabic">
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
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-arabic">الميزانية</p>
                    <p className="font-semibold text-gray-900">{campaign.budget.toLocaleString()} ر.س</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-arabic">المصروف</p>
                    <p className="font-semibold text-gray-900">{campaign.spent.toLocaleString()} ر.س</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-arabic">ROAS</p>
                    <p className="font-semibold text-gray-900">{campaign.performance.roas}x</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Target className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-arabic">CPA</p>
                    <p className="font-semibold text-gray-900">{campaign.performance.cpa} ر.س</p>
                  </div>
                </div>

                {/* Campaign Channels */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 font-arabic mb-2">القنوات:</p>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.channels.map((channel, index) => (
                      <Badge key={index} variant="outline" className="font-arabic">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 font-arabic mb-1">
                    <span>تقدم الحملة</span>
                    <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </GenericCard>
          ))}
        </div>
      )}

      {/* Channels View */}
      {activeView === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <GenericCard key={channel.id} className="hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 font-arabic">{channel.name}</h3>
                    <p className="text-sm text-gray-600 font-arabic">{channel.platform}</p>
                  </div>
                  {getStatusBadge(channel.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 font-arabic">الظهور</span>
                    <span className="font-semibold">{channel.performance.impressions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 font-arabic">النقرات</span>
                    <span className="font-semibold">{channel.performance.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 font-arabic">التحويلات</span>
                    <span className="font-semibold">{channel.performance.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 font-arabic">CTR</span>
                    <span className="font-semibold">{channel.performance.ctr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 font-arabic">CPC</span>
                    <span className="font-semibold">{channel.performance.cpc} ر.س</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm font-arabic mb-1">
                    <span>الميزانية المستخدمة</span>
                    <span>{Math.round((channel.spent / channel.budget) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(channel.spent / channel.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </GenericCard>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <GenericCard>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 font-arabic mb-2">تقويم الحملات</h3>
            <p className="text-gray-600 font-arabic mb-6">
              عرض تفاعلي لجدولة الحملات والفعاليات التسويقية
            </p>
            <Button className="font-arabic">قريباً - تقويم تفاعلي متقدم</Button>
          </div>
        </GenericCard>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Clock, RefreshCw } from 'lucide-react';

interface AnalyticsPanelProps {
  selectedTool: string;
  projectId: string;
  layers: any[];
}

interface AnalyticsData {
  totalElements: number;
  totalSessions: number;
  activeUsers: number;
  lastUpdated: Date;
  elementTypes: { [key: string]: number };
  activityTimeline: { time: string; action: string }[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ 
  selectedTool, 
  projectId, 
  layers 
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalElements: 0,
    totalSessions: 0,
    activeUsers: 0,
    lastUpdated: new Date(),
    elementTypes: {},
    activityTimeline: []
  });
  const [loading, setLoading] = useState(false);

  if (selectedTool !== 'analytics') return null;

  useEffect(() => {
    updateAnalytics();
  }, [layers, projectId]);

  const updateAnalytics = () => {
    setLoading(true);
    
    // حساب أنواع العناصر
    const elementTypes: { [key: string]: number } = {};
    layers.forEach(layer => {
      const type = layer.type || 'unknown';
      elementTypes[type] = (elementTypes[type] || 0) + 1;
    });

    // محاكاة بيانات النشاط
    const activityTimeline = [
      { time: '14:30', action: 'أضيف عنصر نص جديد' },
      { time: '14:25', action: 'تم تعديل موقع العنصر' },
      { time: '14:20', action: 'انضم مستخدم جديد' },
      { time: '14:15', action: 'تم حفظ المشروع' },
      { time: '14:10', action: 'أضيفت ملاحظة لاصقة' }
    ];

    setTimeout(() => {
      setAnalytics({
        totalElements: layers.length,
        totalSessions: Math.floor(Math.random() * 50) + 10,
        activeUsers: Math.floor(Math.random() * 8) + 2,
        lastUpdated: new Date(),
        elementTypes,
        activityTimeline
      });
      setLoading(false);
    }, 1000);
  };

  const getElementTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      text: 'نص',
      shape: 'شكل',
      sticky: 'ملاحظة لاصقة',
      timeline: 'جدول زمني',
      mindmap: 'خريطة ذهنية',
      brainstorm: 'عصف ذهني',
      root: 'جذر',
      moodboard: 'مودبورد',
      unknown: 'غير محدد'
    };
    return labels[type] || type;
  };

  const stats = [
    {
      label: 'إجمالي العناصر',
      value: analytics.totalElements,
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      label: 'الجلسات النشطة',
      value: analytics.totalSessions,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'المستخدمون النشطون',
      value: analytics.activeUsers,
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <ToolPanelContainer title="تحليلات الأداء">
      <div className="space-y-4">
        {/* زر التحديث */}
        <Button 
          onClick={updateAnalytics}
          disabled={loading}
          variant="outline"
          size="sm"
          className="w-full rounded-full"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          تحديث البيانات
        </Button>

        {/* الإحصائيات الرئيسية */}
        <div className="grid gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-gray-50 border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-arabic text-gray-600">{stat.label}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* توزيع أنواع العناصر */}
        {Object.keys(analytics.elementTypes).length > 0 && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-2">توزيع العناصر</h4>
            <div className="space-y-2">
              {Object.entries(analytics.elementTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between text-xs">
                  <span className="font-arabic">{getElementTypeLabel(type)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-gray-200 rounded">
                      <div 
                        className="h-full bg-blue-500 rounded"
                        style={{ 
                          width: `${(count / analytics.totalElements) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="font-mono">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* سجل النشاط */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">آخر النشاطات</h4>
          <div className="space-y-2">
            {analytics.activityTimeline.map((activity, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-gray-500 font-mono">{activity.time}</span>
                <span className="font-arabic text-gray-700">{activity.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="border-t pt-3 mt-4">
          <div className="text-xs text-gray-500 font-arabic space-y-1">
            <div>آخر تحديث: {analytics.lastUpdated.toLocaleTimeString('ar')}</div>
            <div>معرف المشروع: {projectId.slice(0, 8)}...</div>
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};
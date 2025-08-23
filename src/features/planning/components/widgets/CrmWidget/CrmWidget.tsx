import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface CrmActivity {
  activity_id: string;
  activity_type: string;
  activity_status: 'pending' | 'active' | 'completed' | 'cancelled';
  client_name: string;
  contact_info: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  priority_score: number;
  due_date: string;
  assigned_to: string;
  assigned_name: string;
  description: string;
  tags: string[];
  last_contact_date: string;
  next_follow_up: string;
  deal_value: number;
  deal_stage: string;
}

interface CrmWidgetProps {
  element: any;
  isSelected: boolean;
  onUpdate: (updates: any) => void;
}

export const CrmWidget: React.FC<CrmWidgetProps> = ({ 
  element, 
  isSelected, 
  onUpdate 
}) => {
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCrmData();
  }, []);

  const fetchCrmData = async () => {
    try {
      setLoading(true);
      
      // Fetch CRM activities data
      const { data: activitiesData, error: activitiesError } = await supabase.rpc('get_widget_data', {
        widget_type: 'crm_activities' as any,
        limit_count: 8 as any
      }) as { data: any[] | null; error: any };

      if (activitiesError) throw activitiesError;

      // Fetch CRM stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_widget_stats', {
        widget_type: 'crm_activities' as any
      }) as { data: any; error: any };

      if (statsError) throw statsError;

      setActivities(activitiesData?.map((item: any) => item.data) || []);
      setStats(statsData || {});
    } catch (err) {
      console.error('Error fetching CRM data:', err);
      setError('فشل في تحميل بيانات CRM');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-accent-green';
      case 'active': return 'bg-accent-blue';
      case 'pending': return 'bg-accent-yellow';
      case 'cancelled': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'active': return 'نشط';
      case 'pending': return 'معلق';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'meeting': return '👥';
      case 'email': return '📧';
      case 'follow_up': return '🔄';
      case 'proposal': return '📋';
      case 'contract': return '📄';
      default: return '📝';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className={`w-full h-full bg-white rounded-2xl border-2 border-dashed ${isSelected ? 'border-black' : 'border-gray-300'} p-6`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full h-full bg-white rounded-2xl border-2 border-dashed ${isSelected ? 'border-black' : 'border-red-300'} p-6`}>
        <div className="text-center text-red-500">
          <div className="text-2xl mb-2">👥</div>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchCrmData}
            className="mt-2 px-4 py-2 bg-accent-red text-white rounded-lg text-sm hover:bg-accent-red/80 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-white rounded-2xl border-2 ${isSelected ? 'border-black' : 'border-gray-200'} shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-accent-blue p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">أنشطة CRM</h3>
          <div className="text-xs opacity-90">
            {activities.length} نشاط
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">{stats.active_activities || 0}</div>
            <div className="text-xs opacity-90">نشط</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">{stats.pending_activities || 0}</div>
            <div className="text-xs opacity-90">معلق</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">{stats.high_priority || 0}</div>
            <div className="text-xs opacity-90">عالي الأولوية</div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-3">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-sm">لا توجد أنشطة CRM</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.activity_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              {/* Activity Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getActivityIcon(activity.activity_type)}</span>
                  <div>
                    <h4 className="font-bold text-black text-sm">
                      {activity.client_name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {activity.assigned_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getPriorityColor(activity.priority)}`}></span>
                  <span className="text-xs text-gray-600">
                    {getPriorityText(activity.priority)}
                  </span>
                </div>
              </div>

              {/* Activity Description */}
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                {activity.description}
              </p>

              {/* Activity Details */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-gray-600">الحالة:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(activity.activity_status)}`}></span>
                    <span className="font-medium">{getStatusText(activity.activity_status)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">قيمة الصفقة:</span>
                  <div className="font-bold text-accent-green mt-1">
                    {activity.deal_value ? formatCurrency(activity.deal_value) : 'غير محدد'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ الاستحقاق:</span>
                  <div className={`font-medium mt-1 ${isOverdue(activity.due_date) ? 'text-accent-red' : 'text-black'}`}>
                    {formatDate(activity.due_date)}
                    {isOverdue(activity.due_date) && ' ⚠️'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">المتابعة القادمة:</span>
                  <div className="font-medium text-accent-blue mt-1">
                    {activity.next_follow_up ? formatDate(activity.next_follow_up) : 'غير محدد'}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {activity.tags && activity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {activity.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {activity.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{activity.tags.length - 3} المزيد</span>
                  )}
                </div>
              )}

              {/* Deal Stage */}
              {activity.deal_stage && (
                <div className="mt-2 text-xs">
                  <span className="text-gray-600">مرحلة الصفقة: </span>
                  <span className="font-medium text-accent-blue">{activity.deal_stage}</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
        <button 
          onClick={fetchCrmData}
          className="text-xs text-purple-600 hover:text-purple-800 transition-colors"
        >
          🔄 تحديث أنشطة CRM
        </button>
      </div>
    </div>
  );
};
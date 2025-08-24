import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface CsrRequest {
  request_id: string;
  request_type: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed' | 'escalated';
  severity_level: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  priority_score: number;
  customer_name: string;
  customer_contact: any;
  agent_name: string;
  subject: string;
  description: string;
  request_date: string;
  due_date: string;
  resolution_date?: string;
  hours_open: number;
  is_overdue: boolean;
  escalation_level: number;
  satisfaction_score?: number;
  category: string;
  subcategory: string;
}

interface CsrWidgetProps {
  element: any;
  isSelected: boolean;
  onUpdate: (updates: any) => void;
}

export const CsrWidget: React.FC<CsrWidgetProps> = ({ 
  element, 
  isSelected, 
  onUpdate 
}) => {
  const [requests, setRequests] = useState<CsrRequest[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCsrData();
  }, []);

  const fetchCsrData = async () => {
    try {
      setLoading(true);
      
      // Fetch CSR requests data
      const { data: requestsData, error: requestsError } = await supabase.rpc('get_widget_data' as any, {
        widget_type: 'csr_requests',
        limit_count: 8
      }) as { data: any[] | null; error: any };

      if (requestsError) throw requestsError;

      // Fetch CSR stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_widget_stats' as any, {
        widget_type: 'csr_requests'
      }) as { data: any; error: any };

      if (statsError) throw statsError;

      setRequests(requestsData?.map((item: any) => item.data) || []);
      setStats(statsData || {});
    } catch (err) {
      console.error('Error fetching CSR data:', err);
      setError('فشل في تحميل بيانات خدمة العملاء');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'حرج';
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
      case 'in_progress': return 'bg-accent-blue';
      case 'open': return 'bg-accent-yellow';
      case 'escalated': return 'bg-orange-500';
      case 'closed': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'in_progress': return 'قيد المعالجة';
      case 'open': return 'مفتوح';
      case 'escalated': return 'مُصعّد';
      case 'closed': return 'مغلق';
      default: return 'غير محدد';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint': return '😠';
      case 'inquiry': return '❓';
      case 'technical_support': return '🔧';
      case 'billing': return '💰';
      case 'feature_request': return '💡';
      case 'bug_report': return '🐛';
      default: return '📞';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatHours = (hours: number) => {
    if (hours < 24) {
      return `${Math.round(hours)} ساعة`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.round(hours % 24);
      return `${days} يوم${remainingHours > 0 ? ` و ${remainingHours} ساعة` : ''}`;
    }
  };

  const getSatisfactionEmoji = (score?: number) => {
    if (!score) return '⚪';
    if (score >= 4.5) return '😊';
    if (score >= 3.5) return '🙂';
    if (score >= 2.5) return '😐';
    if (score >= 1.5) return '🙁';
    return '😞';
  };

  if (loading) {
    return (
      <div className={`w-full h-full bg-white rounded-2xl border-2 border-dashed ${isSelected ? 'border-black' : 'border-gray-300'} p-6`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
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
          <div className="text-2xl mb-2">🎧</div>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchCsrData}
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
      <div className="bg-gradient-to-br from-accent-red to-orange-500 p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">طلبات خدمة العملاء</h3>
          <div className="text-xs opacity-90">
            {requests.length} طلب
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-sm font-bold">{stats.overdue_requests || 0}</div>
            <div className="text-xs opacity-90">متأخر</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-sm font-bold">{stats.urgent_requests || 0}</div>
            <div className="text-xs opacity-90">عاجل</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-sm font-bold">{Math.round(stats.avg_resolution_time || 0)}ساعة</div>
            <div className="text-xs opacity-90">متوسط الحل</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-sm font-bold">{Math.round(stats.completion_rate || 0)}%</div>
            <div className="text-xs opacity-90">معدل الإنجاز</div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-3">
        {requests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🎧</div>
            <p className="text-sm">لا توجد طلبات خدمة عملاء</p>
          </div>
        ) : (
          requests.map((request, index) => (
            <motion.div
              key={request.request_id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-4 hover:shadow-md transition-shadow ${
                request.is_overdue ? 'bg-red-50 border-l-4 border-red-500' : 'bg-gray-50'
              }`}
            >
              {/* Request Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getRequestTypeIcon(request.request_type)}</span>
                  <div>
                    <h4 className="font-bold text-black text-sm">
                      {request.customer_name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      وكيل: {request.agent_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getSeverityColor(request.severity_level)}`}></span>
                  <span className="text-xs text-gray-600">
                    {getSeverityText(request.severity_level)}
                  </span>
                  {request.is_overdue && (
                    <span className="text-red-500 text-xs">⚠️ متأخر</span>
                  )}
                </div>
              </div>

              {/* Request Subject */}
              <h5 className="font-medium text-sm text-black mb-2">
                {request.subject}
              </h5>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-gray-600">الحالة:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(request.status)}`}></span>
                    <span className="font-medium">{getStatusText(request.status)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">مفتوح منذ:</span>
                  <div className="font-medium text-black mt-1">
                    {formatHours(request.hours_open)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <div className="font-medium text-gray-700 mt-1">
                    {formatDate(request.request_date)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ الاستحقاق:</span>
                  <div className={`font-medium mt-1 ${request.is_overdue ? 'text-red-600' : 'text-gray-700'}`}>
                    {formatDate(request.due_date)}
                  </div>
                </div>
              </div>

              {/* Category & Satisfaction */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-accent-blue/10 text-accent-blue rounded">
                    {request.category}
                  </span>
                  {request.subcategory && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">
                      {request.subcategory}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">الرضا:</span>
                  <span className="text-lg">
                    {getSatisfactionEmoji(request.satisfaction_score)}
                  </span>
                  {request.satisfaction_score && (
                    <span className="text-gray-600">
                      {request.satisfaction_score.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Escalation Level */}
              {request.escalation_level > 0 && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-orange-600">🔺 مُصعّد المستوى {request.escalation_level}</span>
                </div>
              )}

              {/* Resolution Date */}
              {request.resolution_date && (
                <div className="mt-2 text-xs text-green-600">
                  ✅ تم الحل في: {formatDate(request.resolution_date)}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
        <button 
          onClick={fetchCsrData}
          className="text-xs text-accent-red hover:text-accent-red/80 transition-colors"
        >
          🔄 تحديث طلبات الخدمة
        </button>
      </div>
    </div>
  );
};
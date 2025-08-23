import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Wifi, 
  Database, 
  Cloud, 
  Users, 
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity
} from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  value: string;
  details?: string;
  lastUpdated: number;
}

interface SystemHealthProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({
  isVisible,
  onClose
}) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate health metrics
  useEffect(() => {
    const updateMetrics = () => {
      const now = Date.now();
      
      setMetrics([
        {
          id: 'api',
          name: 'حالة API',
          status: 'healthy',
          value: '200ms',
          details: 'جميع النهايات تعمل بشكل طبيعي',
          lastUpdated: now
        },
        {
          id: 'database',
          name: 'قاعدة البيانات',
          status: 'healthy',
          value: '45ms',
          details: 'Supabase متصل وسريع الاستجابة',
          lastUpdated: now
        },
        {
          id: 'realtime',
          name: 'التزامن اللحظي',
          status: 'warning',
          value: '250ms',
          details: 'بطء طفيف في المزامنة',
          lastUpdated: now
        },
        {
          id: 'collaboration',
          name: 'خدمات التعاون',
          status: 'healthy',
          value: '12 مستخدم',
          details: 'المستخدمون متصلون ونشطون',
          lastUpdated: now
        },
        {
          id: 'ai',
          name: 'المساعد الذكي',
          status: 'error',
          value: 'غير متاح',
          details: 'فشل في الاتصال بخدمات الذكاء الاصطناعي',
          lastUpdated: now
        },
        {
          id: 'storage',
          name: 'التخزين',
          status: 'healthy',
          value: '2.1 GB متاح',
          details: 'مساحة كافية للملفات والأصول',
          lastUpdated: now
        }
      ]);
      
      setLastUpdate(new Date());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: HealthMetric['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getMetricIcon = (id: string) => {
    switch (id) {
      case 'api':
        return <Wifi className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'realtime':
        return <Activity className="h-4 w-4" />;
      case 'collaboration':
        return <Users className="h-4 w-4" />;
      case 'ai':
        return <Zap className="h-4 w-4" />;
      case 'storage':
        return <Cloud className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
    }
  };

  const getHealthySummary = () => {
    const healthy = metrics.filter(m => m.status === 'healthy').length;
    const warnings = metrics.filter(m => m.status === 'warning').length;
    const errors = metrics.filter(m => m.status === 'error').length;
    
    return { healthy, warnings, errors, total: metrics.length };
  };

  if (!isVisible) return null;

  const summary = getHealthySummary();
  const overallHealth = summary.errors === 0 && summary.warnings <= 1 ? 'healthy' : 
                       summary.errors === 0 ? 'warning' : 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 w-80 z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <h3 className="font-bold text-sm">صحة النظام</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Overall Health Status */}
        <div className={`p-3 rounded-lg border ${
          overallHealth === 'healthy' ? 'bg-green-50 border-green-200' :
          overallHealth === 'warning' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(overallHealth)}
            <span className={`font-medium text-sm ${getStatusColor(overallHealth)}`}>
              {overallHealth === 'healthy' ? 'النظام يعمل بشكل ممتاز' :
               overallHealth === 'warning' ? 'النظام يعمل مع تحذيرات' :
               'النظام يواجه مشاكل'}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <div className="font-bold text-green-600">{summary.healthy}</div>
              <div className="text-green-700">سليم</div>
            </div>
            <div>
              <div className="font-bold text-yellow-600">{summary.warnings}</div>
              <div className="text-yellow-700">تحذير</div>
            </div>
            <div>
              <div className="font-bold text-red-600">{summary.errors}</div>
              <div className="text-red-700">خطأ</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2 text-center">
          آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
        </div>
      </div>

      {/* Health Metrics */}
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {metrics.map(metric => (
          <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={getStatusColor(metric.status)}>
                {getMetricIcon(metric.id)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {metric.name}
                </div>
                <div className="text-xs text-gray-500">
                  {metric.details}
                </div>
              </div>
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-1">
                {getStatusIcon(metric.status)}
                <span className={`text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-3 py-2 bg-accent-blue text-white rounded text-xs hover:bg-accent-blue/80"
          >
            إعادة تشغيل النظام
          </button>
          <button
            onClick={() => setMetrics([])}
            className="px-3 py-2 border border-gray-300 rounded text-xs hover:bg-gray-50"
          >
            مسح البيانات
          </button>
        </div>
      </div>
    </motion.div>
  );
};
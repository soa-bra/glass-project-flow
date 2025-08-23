import React from 'react';
import { motion } from 'framer-motion';
import { usePerformance } from '../../../hooks/usePerformance';
import { Activity, Cpu, MemoryStick, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface PerformanceDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isVisible,
  onClose
}) => {
  const { metrics, suggestions, isHealthy } = usePerformance();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent-blue" />
          <h3 className="font-bold text-sm">لوحة الأداء</h3>
        </div>
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <CheckCircle className="h-4 w-4 text-accent-green" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-accent-red" />
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* FPS */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-accent-green" />
            <span className="text-xs text-gray-600">FPS</span>
          </div>
          <div className="text-lg font-bold text-black">
            {metrics.fps}
          </div>
          <div className="text-xs text-gray-500">
            متوسط: {metrics.averages.avgFps}
          </div>
        </div>

        {/* Memory */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MemoryStick className="h-4 w-4 text-accent-yellow" />
            <span className="text-xs text-gray-600">الذاكرة</span>
          </div>
          <div className="text-lg font-bold text-black">
            {metrics.memoryUsage} MB
          </div>
          <div className="text-xs text-gray-500">
            متوسط: {metrics.averages.avgMemory} MB
          </div>
        </div>

        {/* Elements */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-4 w-4 text-accent-blue" />
            <span className="text-xs text-gray-600">العناصر</span>
          </div>
          <div className="text-lg font-bold text-black">
            {metrics.elementCount}
          </div>
        </div>

        {/* Render Time */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-600">زمن الرسم</span>
          </div>
          <div className="text-lg font-bold text-black">
            {metrics.averages.avgRenderTime}ms
          </div>
        </div>
      </div>

      {/* Performance Status */}
      <div className={`p-3 rounded-lg mb-3 ${
        isHealthy 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">أداء ممتاز</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">يحتاج تحسين</span>
            </>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">اقتراحات التحسين:</h4>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-accent-yellow">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Performance Bars */}
      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="space-y-2">
          {/* FPS Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>معدل الإطارات</span>
              <span>{metrics.fps}/60 FPS</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  metrics.fps >= 55 ? 'bg-green-500' : 
                  metrics.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((metrics.fps / 60) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Memory Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>استخدام الذاكرة</span>
              <span>{metrics.memoryUsage}/500 MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  metrics.memoryUsage < 300 ? 'bg-green-500' : 
                  metrics.memoryUsage < 400 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((metrics.memoryUsage / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
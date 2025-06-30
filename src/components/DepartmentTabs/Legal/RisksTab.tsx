
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { AlertTriangle, Shield, Activity, TrendingUp } from 'lucide-react';
import { mockRiskAssessments } from './data';
import { getStatusColor, getStatusText, getRiskColor, calculateRiskScore, formatDate } from './utils';

export const RisksTab: React.FC = () => {
  const riskStats = {
    critical: mockRiskAssessments.filter(risk => risk.riskLevel === 'critical').length,
    high: mockRiskAssessments.filter(risk => risk.riskLevel === 'high').length,
    medium: mockRiskAssessments.filter(risk => risk.riskLevel === 'medium').length,
    low: mockRiskAssessments.filter(risk => risk.riskLevel === 'low').length,
  };

  return (
    <div className="h-full overflow-auto">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <BaseCard className="p-4 text-center border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">{riskStats.critical}</div>
          <div className="text-sm text-gray-600">مخاطر حرجة</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-600">{riskStats.high}</div>
          <div className="text-sm text-gray-600">مخاطر عالية</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{riskStats.medium}</div>
          <div className="text-sm text-gray-600">مخاطر متوسطة</div>
        </BaseCard>
        
        <BaseCard className="p-4 text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{riskStats.low}</div>
          <div className="text-sm text-gray-600">مخاطر منخفضة</div>
        </BaseCard>
      </div>

      {/* Risk Matrix */}
      <BaseCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">مصفوفة المخاطر</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="text-center text-sm font-medium text-gray-700">الاحتمالية</div>
          <div className="text-center text-sm font-medium text-gray-700">منخفض (1)</div>
          <div className="text-center text-sm font-medium text-gray-700">متوسط (2)</div>
          <div className="text-center text-sm font-medium text-gray-700">عالي (3)</div>
          <div className="text-center text-sm font-medium text-gray-700">حرج (4)</div>
          
          {[5, 4, 3, 2, 1].map(impact => (
            <React.Fragment key={impact}>
              <div className="text-center text-sm font-medium text-gray-700 py-2">
                التأثير ({impact})
              </div>
              {[1, 2, 3, 4].map(probability => {
                const score = probability * impact;
                let colorClass = 'bg-green-200';
                if (score >= 12) colorClass = 'bg-red-200';
                else if (score >= 8) colorClass = 'bg-orange-200';
                else if (score >= 4) colorClass = 'bg-yellow-200';
                
                return (
                  <div 
                    key={`${impact}-${probability}`}
                    className={`h-12 flex items-center justify-center rounded ${colorClass} border`}
                  >
                    <span className="text-sm font-medium">{score}</span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">الألوان:</span>
          <span className="inline-block w-4 h-4 bg-green-200 rounded mx-1"></span> منخفض (1-3)
          <span className="inline-block w-4 h-4 bg-yellow-200 rounded mx-1"></span> متوسط (4-7)
          <span className="inline-block w-4 h-4 bg-orange-200 rounded mx-1"></span> عالي (8-11)
          <span className="inline-block w-4 h-4 bg-red-200 rounded mx-1"></span> حرج (12-20)
        </div>
      </BaseCard>

      {/* Risk Assessments */}
      <BaseCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">تقييمات المخاطر</h3>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            إضافة تقييم جديد
          </button>
        </div>
        
        <div className="space-y-4">
          {mockRiskAssessments.map((risk) => (
            <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-800">{risk.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(risk.status)}`}>
                      {getStatusText(risk.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>الفئة: {getStatusText(risk.category)}</span>
                    <span>المسؤول: {risk.assignedTo}</span>
                    <span>تاريخ التحديد: {formatDate(risk.dateIdentified)}</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold ${getRiskColor(risk.riskLevel)}`}>
                    {calculateRiskScore(risk.probability, risk.impact)}
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-600">
                    {getStatusText(risk.riskLevel)}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-800 mb-1">استراتيجية التخفيف:</div>
                <div className="text-sm text-gray-600">{risk.mitigationStrategy}</div>
              </div>
              
              <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <span>الاحتمالية: {risk.probability}/5</span>
                <span>التأثير: {risk.impact}/5</span>
                <span>الهدف: {formatDate(risk.targetResolution)}</span>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
};

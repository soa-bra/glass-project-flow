import React from 'react';
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

  const getRiskStatusColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-[#f1b5b9] text-black';
      case 'high': return 'bg-[#fbe2aa] text-black';
      case 'medium': return 'bg-[#a4e2f6] text-black';
      case 'low': return 'bg-[#bdeed3] text-black';
      default: return 'bg-[#d9d2fd] text-black';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">إدارة المخاطر والنزاعات</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-white flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          إضافة تقييم جديد
        </button>
      </div>

      {/* نظرة عامة على المخاطر */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center">
              <Shield className="h-4 w-4 text-black" />
            </div>
            توزيع المخاطر حسب المستوى
          </h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{riskStats.critical}</div>
              <div className="text-sm font-medium text-black font-arabic">مخاطر حرجة</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{riskStats.high}</div>
              <div className="text-sm font-medium text-black font-arabic">مخاطر عالية</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <Activity className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{riskStats.medium}</div>
              <div className="text-sm font-medium text-black font-arabic">مخاطر متوسطة</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center mx-auto mb-2">
                <Shield className="h-4 w-4 text-black" />
              </div>
              <div className="text-2xl font-bold text-black font-arabic">{riskStats.low}</div>
              <div className="text-sm font-medium text-black font-arabic">مخاطر منخفضة</div>
            </div>
          </div>
        </div>
      </div>

      {/* مصفوفة المخاطر */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic">مصفوفة المخاطر</h3>
        </div>
        <div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            <div className="text-center text-sm font-medium text-black font-arabic">الاحتمالية</div>
            <div className="text-center text-sm font-medium text-black font-arabic">منخفض (1)</div>
            <div className="text-center text-sm font-medium text-black font-arabic">متوسط (2)</div>
            <div className="text-center text-sm font-medium text-black font-arabic">عالي (3)</div>
            <div className="text-center text-sm font-medium text-black font-arabic">حرج (4)</div>
            
            {[5, 4, 3, 2, 1].map(impact => (
              <React.Fragment key={impact}>
                <div className="text-center text-sm font-medium text-black font-arabic py-2">
                  التأثير ({impact})
                </div>
                {[1, 2, 3, 4].map(probability => {
                  const score = probability * impact;
                  let colorClass = 'bg-[#bdeed3]';
                  if (score >= 12) colorClass = 'bg-[#f1b5b9]';
                  else if (score >= 8) colorClass = 'bg-[#fbe2aa]';
                  else if (score >= 4) colorClass = 'bg-[#a4e2f6]';
                  
                  return (
                    <div 
                      key={`${impact}-${probability}`}
                      className={`h-12 flex items-center justify-center rounded-3xl ${colorClass} border border-black/10`}
                    >
                      <span className="text-sm font-medium text-black">{score}</span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="text-sm text-black font-arabic">
            <span className="font-medium">الألوان:</span>
            <span className="inline-block w-4 h-4 bg-[#bdeed3] rounded mx-1"></span> منخفض (1-3)
            <span className="inline-block w-4 h-4 bg-[#a4e2f6] rounded mx-1"></span> متوسط (4-7)
            <span className="inline-block w-4 h-4 bg-[#fbe2aa] rounded mx-1"></span> عالي (8-11)
            <span className="inline-block w-4 h-4 bg-[#f1b5b9] rounded mx-1"></span> حرج (12-20)
          </div>
        </div>
      </div>

      {/* تقييمات المخاطر */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic">تقييمات المخاطر</h3>
        </div>
        <div>
          <div className="space-y-4">
            {mockRiskAssessments.map((risk) => (
              <div key={risk.id} className="p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-black font-arabic">{risk.title}</h4>
                      <span className={`px-3 py-1 text-xs rounded-full font-arabic ${getStatusColor(risk.status)}`}>
                        {getStatusText(risk.status)}
                      </span>
                    </div>
                    <p className="text-sm text-black/70 font-arabic mb-2">{risk.description}</p>
                    <div className="flex items-center gap-4 text-sm text-black/70 font-arabic">
                      <span>الفئة: {getStatusText(risk.category)}</span>
                      <span>المسؤول: {risk.assignedTo}</span>
                      <span>تاريخ التحديد: {formatDate(risk.dateIdentified)}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-black font-bold ${getRiskStatusColor(risk.riskLevel)}`}>
                      {calculateRiskScore(risk.probability, risk.impact)}
                    </div>
                    <div className="text-xs text-center mt-1 text-black/70 font-arabic">
                      {getStatusText(risk.riskLevel)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-transparent border border-black/10 rounded-3xl p-3">
                  <div className="text-sm font-medium text-black font-arabic mb-1">استراتيجية التخفيف:</div>
                  <div className="text-sm text-black/70 font-arabic">{risk.mitigationStrategy}</div>
                </div>
                
                <div className="flex justify-between items-center mt-3 text-sm text-black/70 font-arabic">
                  <span>الاحتمالية: {risk.probability}/5</span>
                  <span>التأثير: {risk.impact}/5</span>
                  <span>الهدف: {formatDate(risk.targetResolution)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
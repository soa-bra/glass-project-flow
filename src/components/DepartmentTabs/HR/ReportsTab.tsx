
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { BarChart3, PieChart, TrendingUp, Users, Calendar, Download, Filter, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockWorkforceAnalytics, mockHRStats } from './data';

export const ReportsTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  
  const analytics = mockWorkforceAnalytics;
  const stats = mockHRStats;

  const reportTypes = [
    {
      id: 'attendance',
      title: 'تقرير الحضور والغياب',
      description: 'تحليل شامل لحضور الموظفين ومعدلات الغياب',
      icon: Calendar,
      color: 'text-blue-600',
      lastGenerated: '2024-12-30'
    },
    {
      id: 'performance',
      title: 'تقرير الأداء والتقييم',
      description: 'ملخص تقييمات الأداء والإنجازات',
      icon: TrendingUp,
      color: 'text-green-600',
      lastGenerated: '2024-12-28'
    },
    {
      id: 'recruitment',
      title: 'تقرير التوظيف والاستقطاب',
      description: 'إحصائيات التوظيف ومعدلات النجاح',
      icon: Users,
      color: 'text-purple-600',
      lastGenerated: '2024-12-25'
    },
    {
      id: 'training',
      title: 'تقرير التدريب والتطوير',
      description: 'تحليل البرامج التدريبية ومعدلات الإكمال',
      icon: BarChart3,
      color: 'text-orange-600',
      lastGenerated: '2024-12-20'
    },
    {
      id: 'workforce',
      title: 'تحليل القوى العاملة',
      description: 'رؤى شاملة حول تركيبة وتوزيع القوى العاملة',
      icon: PieChart,
      color: 'text-indigo-600',
      lastGenerated: '2024-12-30'
    }
  ];

  const quickInsights = [
    {
      title: 'أعلى معدل حضور',
      value: '98.5%',
      department: 'قسم التقنية',
      trend: 'up'
    },
    {
      title: 'أعلى معدل رضا',
      value: '4.7/5',
      department: 'قسم التصميم',
      trend: 'up'
    },
    {
      title: 'أسرع وقت توظيف',
      value: '12 يوم',
      department: 'قسم المالية',
      trend: 'down'
    },
    {
      title: 'أعلى معدل إكمال تدريب',
      value: '94%',
      department: 'قسم التسويق',
      trend: 'up'
    }
  ];

  const generateReport = (reportType: string) => {
    // هنا يمكن إضافة منطق توليد التقرير
  };

  return (
    <div className="space-y-6 bg-transparent">
      {/* لوحة المعلومات التحليلية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard variant="operations" className="p-4">
          <div className="text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{analytics.totalEmployees}</p>
            <p className="text-sm text-gray-600 font-arabic">إجمالي الموظفين</p>
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{analytics.turnoverRate}%</p>
            <p className="text-sm text-gray-600 font-arabic">معدل الدوران</p>
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{analytics.averageAge}</p>
            <p className="text-sm text-gray-600 font-arabic">متوسط العمر</p>
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.attendanceRate}%</p>
            <p className="text-sm text-gray-600 font-arabic">معدل الحضور</p>
          </div>
        </BaseCard>
      </div>

      {/* الرؤى السريعة */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">الرؤى السريعة</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium font-arabic text-sm">{insight.title}</h4>
                <TrendingUp className={`h-4 w-4 ${insight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{insight.value}</p>
              <p className="text-sm text-gray-600 font-arabic">{insight.department}</p>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* أنواع التقارير */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">التقارير المتاحة</h3>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-arabic"
            >
              <option value="daily">يومي</option>
              <option value="weekly">أسبوعي</option>
              <option value="monthly">شهري</option>
              <option value="quarterly">ربع سنوي</option>
              <option value="yearly">سنوي</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              <span className="font-arabic">تصفية</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {reportTypes.map((report, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <report.icon className={`h-8 w-8 ${report.color}`} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 font-arabic mb-2">{report.title}</h3>
                    <p className="text-gray-600 font-arabic mb-3">{report.description}</p>
                    <p className="text-sm text-gray-500">آخر إنشاء: {report.lastGenerated}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateReport(report.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="font-arabic">عرض</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateReport(report.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="font-arabic">تحميل</span>
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => generateReport(report.id)}
                    className="font-arabic"
                  >
                    إنشاء تقرير جديد
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* توزيع القوى العاملة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">التوزيع حسب القسم</h3>
          </div>
          
          <div className="space-y-3">
            {analytics.departmentDistribution.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-arabic">{dept.department}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-600 rounded-full" 
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">{dept.count}</span>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">توزيع الأداء</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-arabic">ممتاز</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-600 rounded-full" style={{ width: '35%' }} />
                </div>
                <span className="text-sm font-bold w-12 text-right">{analytics.performanceDistribution.excellent}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-arabic">جيد</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '55%' }} />
                </div>
                <span className="text-sm font-bold w-12 text-right">{analytics.performanceDistribution.good}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-arabic">مقبول</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-yellow-600 rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-sm font-bold w-12 text-right">{analytics.performanceDistribution.satisfactory}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-arabic">يحتاج تحسين</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-red-600 rounded-full" style={{ width: '20%' }} />
                </div>
                <span className="text-sm font-bold w-12 text-right">{analytics.performanceDistribution.needsImprovement}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

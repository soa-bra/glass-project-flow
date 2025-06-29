
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Filter, Download } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ProjectProfitability {
  projectName: string;
  revenue: number;
  directCosts: number;
  indirectCosts: number;
  profit: number;
  profitMargin: number;
  roi: number;
}

interface KPIMetric {
  name: string;
  value: string;
  change: number;
  benchmark: number;
  status: 'good' | 'warning' | 'poor';
}

interface Forecast {
  period: 'Q3' | 'Q4' | '2025';
  scenario: 'optimistic' | 'realistic' | 'pessimistic';
  revenue: number;
  expenses: number;
  profit: number;
  confidence: number;
}

interface ComparisonData {
  period: string;
  actualRevenue: number;
  budgetedRevenue: number;
  actualExpenses: number;
  budgetedExpenses: number;
  variance: number;
}

export const FinancialAnalysisTab: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [analysisType, setAnalysisType] = useState<'profitability' | 'kpi' | 'forecast' | 'comparison'>('profitability');

  const projectProfitability: ProjectProfitability[] = [
    {
      projectName: 'تطوير التطبيق الجوال',
      revenue: 450000,
      directCosts: 280000,
      indirectCosts: 65000,
      profit: 105000,
      profitMargin: 23.3,
      roi: 30.4
    },
    {
      projectName: 'تصميم الهوية البصرية',
      revenue: 120000,
      directCosts: 45000,
      indirectCosts: 18000,
      profit: 57000,
      profitMargin: 47.5,
      roi: 90.5
    },
    {
      projectName: 'استشارات التسويق الرقمي',
      revenue: 95000,
      directCosts: 55000,
      indirectCosts: 12000,
      profit: 28000,
      profitMargin: 29.5,
      roi: 41.8
    }
  ];

  const kpiMetrics: KPIMetric[] = [
    { name: 'هامش الربح الإجمالي', value: '32.5%', change: 2.3, benchmark: 30, status: 'good' },
    { name: 'معدل العائد على الاستثمار', value: '24.8%', change: -1.2, benchmark: 25, status: 'warning' },
    { name: 'نسبة الديون إلى الأصول', value: '18.4%', change: -3.1, benchmark: 20, status: 'good' },
    { name: 'دورة التحصيل', value: '42 يوم', change: 5.2, benchmark: 35, status: 'poor' },
    { name: 'نسبة السيولة الحالية', value: '2.1', change: 0.3, benchmark: 2, status: 'good' },
    { name: 'معدل نمو الإيرادات', value: '15.6%', change: 4.1, benchmark: 12, status: 'good' }
  ];

  const forecasts: Forecast[] = [
    { period: 'Q3', scenario: 'optimistic', revenue: 950000, expenses: 720000, profit: 230000, confidence: 85 },
    { period: 'Q3', scenario: 'realistic', revenue: 850000, expenses: 680000, profit: 170000, confidence: 92 },
    { period: 'Q3', scenario: 'pessimistic', revenue: 750000, expenses: 640000, profit: 110000, confidence: 78 },
    { period: 'Q4', scenario: 'realistic', revenue: 1200000, expenses: 890000, profit: 310000, confidence: 88 }
  ];

  const comparisonData: ComparisonData[] = [
    { period: 'يناير', actualRevenue: 180000, budgetedRevenue: 175000, actualExpenses: 125000, budgetedExpenses: 130000, variance: 2.9 },
    { period: 'فبراير', actualRevenue: 210000, budgetedRevenue: 195000, actualExpenses: 145000, budgetedExpenses: 140000, variance: 7.7 },
    { period: 'مارس', actualRevenue: 240000, budgetedRevenue: 220000, actualExpenses: 165000, budgetedExpenses: 160000, variance: 9.1 },
    { period: 'أبريل', actualRevenue: 220000, budgetedRevenue: 210000, actualExpenses: 155000, budgetedExpenses: 150000, variance: 4.8 },
    { period: 'مايو', actualRevenue: 280000, budgetedRevenue: 250000, actualExpenses: 185000, budgetedExpenses: 175000, variance: 12.0 },
    { period: 'يونيو', actualRevenue: 320000, budgetedRevenue: 280000, actualExpenses: 205000, budgetedExpenses: 195000, variance: 14.3 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      good: 'default' as const,
      warning: 'secondary' as const,
      poor: 'destructive' as const
    };
    const labels = {
      good: 'جيد',
      warning: 'تحذير',
      poor: 'ضعيف'
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* أدوات التحكم */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 font-arabic">التحليل المالي والتقارير</h2>
        <div className="flex gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="month">شهري</option>
            <option value="quarter">ربع سنوي</option>
            <option value="year">سنوي</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            تخصيص التقرير
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* تبويبات التحليل */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'profitability', label: 'ربحية المشاريع', icon: TrendingUp },
          { key: 'kpi', label: 'مؤشرات الأداء', icon: BarChart3 },
          { key: 'forecast', label: 'التنبؤات المالية', icon: Calendar },
          { key: 'comparison', label: 'مقارنة الأداء', icon: PieChart }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setAnalysisType(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all font-arabic ${
              analysisType === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوى التحليل */}
      {analysisType === 'profitability' && (
        <div className="space-y-4">
          <BaseCard className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-arabic">تحليل ربحية المشاريع</h3>
            <div className="space-y-4">
              {projectProfitability.map((project, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-800 font-arabic">{project.projectName}</h4>
                    <div className="text-left">
                      <div className="text-lg font-bold text-green-600">
                        {project.profit.toLocaleString()} ريال
                      </div>
                      <div className="text-sm text-gray-600">صافي الربح</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">الإيرادات</div>
                      <div className="font-bold">{(project.revenue / 1000).toFixed(0)}k</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">التكاليف المباشرة</div>
                      <div className="font-bold text-red-600">{(project.directCosts / 1000).toFixed(0)}k</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">التكاليف غير المباشرة</div>
                      <div className="font-bold text-orange-600">{(project.indirectCosts / 1000).toFixed(0)}k</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">هامش الربح</div>
                      <div className="font-bold text-blue-600">{project.profitMargin.toFixed(1)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">العائد على الاستثمار</div>
                      <div className="font-bold text-purple-600">{project.roi.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={project.profitMargin} 
                    className="h-2"
                    indicatorClassName={project.profitMargin > 30 ? 'bg-green-500' : project.profitMargin > 20 ? 'bg-blue-500' : 'bg-orange-500'}
                  />
                </div>
              ))}
            </div>
          </BaseCard>
        </div>
      )}

      {analysisType === 'kpi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kpiMetrics.map((metric, index) => (
            <BaseCard key={index} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 font-arabic">{metric.name}</h3>
                  <div className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</div>
                </div>
                <div className="text-left">
                  {getStatusBadge(metric.status)}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  {metric.change > 0 ? 
                    <TrendingUp className="h-4 w-4 text-green-600" /> : 
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  }
                  <span className={metric.change > 0 ? 'text-green-600' : 'text-red-600'}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                </div>
                <div className="text-gray-600">
                  المعيار: {metric.benchmark}{typeof metric.benchmark === 'number' && metric.name.includes('%') ? '%' : ''}
                </div>
              </div>
              
              <div className="mt-3">
                <Progress 
                  value={Math.min(100, (parseFloat(metric.value) / metric.benchmark) * 100)} 
                  className="h-2"
                  indicatorClassName={`${getStatusColor(metric.status).replace('text-', 'bg-').replace('-600', '-500')}`}
                />
              </div>
            </BaseCard>
          ))}
        </div>
      )}

      {analysisType === 'forecast' && (
        <div className="space-y-4">
          <BaseCard className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-arabic">التنبؤات المالية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {forecasts.map((forecast, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-gray-800 font-arabic">
                      {forecast.period} - {
                        forecast.scenario === 'optimistic' ? 'متفائل' :
                        forecast.scenario === 'realistic' ? 'واقعي' : 'متشائم'
                      }
                    </h4>
                    <Badge variant={forecast.confidence > 90 ? 'default' : 'secondary'}>
                      الثقة: {forecast.confidence}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الإيرادات المتوقعة:</span>
                      <span className="font-bold text-green-600">{(forecast.revenue / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المصروفات المتوقعة:</span>
                      <span className="font-bold text-red-600">{(forecast.expenses / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-800 font-bold">الربح المتوقع:</span>
                      <span className="font-bold text-blue-600">{(forecast.profit / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  
                  <Progress 
                    value={(forecast.profit / forecast.revenue) * 100} 
                    className="h-2 mt-3"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
              ))}
            </div>
          </BaseCard>
        </div>
      )}

      {analysisType === 'comparison' && (
        <BaseCard className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-arabic">مقارنة الأداء الفعلي بالمخطط</h3>
          <div className="space-y-4">
            {comparisonData.map((data, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-800 font-arabic">{data.period}</h4>
                  <Badge variant={data.variance > 0 ? 'default' : 'destructive'}>
                    التباين: {data.variance > 0 ? '+' : ''}{data.variance.toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">الإيرادات</h5>
                    <div className="flex justify-between text-sm mb-1">
                      <span>الفعلي: {data.actualRevenue.toLocaleString()}</span>
                      <span>المخطط: {data.budgetedRevenue.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(data.actualRevenue / data.budgetedRevenue) * 100} 
                      className="h-2"
                      indicatorClassName={data.actualRevenue > data.budgetedRevenue ? 'bg-green-500' : 'bg-orange-500'}
                    />
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">المصروفات</h5>
                    <div className="flex justify-between text-sm mb-1">
                      <span>الفعلي: {data.actualExpenses.toLocaleString()}</span>
                      <span>المخطط: {data.budgetedExpenses.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(data.actualExpenses / data.budgetedExpenses) * 100} 
                      className="h-2"
                      indicatorClassName={data.actualExpenses < data.budgetedExpenses ? 'bg-green-500' : 'bg-red-500'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>
      )}
    </div>
  );
};

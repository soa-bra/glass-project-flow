
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Target, Brain, Download, Calendar } from 'lucide-react';

export const FinancialAnalysisTab = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('performance');

  // Mock financial analysis data
  const performanceData = {
    revenue: { current: 2850000, previous: 2650000, growth: 7.5 },
    expenses: { current: 1920000, previous: 1780000, growth: 7.9 },
    profit: { current: 930000, previous: 870000, growth: 6.9 },
    roi: { current: 32.6, previous: 32.8, growth: -0.6 },
    debtToAssets: { current: 0.35, previous: 0.38, growth: -7.9 },
    profitMargin: { current: 32.6, previous: 32.8, growth: -0.6 }
  };

  const projectProfitability = [
    { name: 'مشروع تطوير التطبيق', revenue: 800000, cost: 480000, profit: 320000, margin: 40 },
    { name: 'حملة التسويق الرقمي', revenue: 600000, cost: 420000, profit: 180000, margin: 30 },
    { name: 'تطوير الموقع الإلكتروني', revenue: 500000, cost: 350000, profit: 150000, margin: 30 },
    { name: 'مشروع التدريب', revenue: 400000, cost: 280000, profit: 120000, margin: 30 },
    { name: 'مشروع البحث والتطوير', revenue: 1200000, cost: 570000, profit: 630000, margin: 52.5 }
  ];

  const aiPredictions = {
    nextQuarter: {
      revenue: { predicted: 3100000, confidence: 85, factors: ['نمو السوق', 'مشاريع جديدة', 'التوسع'] },
      expenses: { predicted: 2050000, confidence: 82, factors: ['زيادة التكاليف', 'توظيف جديد', 'التضخم'] },
      profit: { predicted: 1050000, confidence: 83, factors: ['كفاءة العمليات', 'تحسن الهامش'] }
    },
    risks: [
      { risk: 'تأخر المدفوعات', probability: 25, impact: 'متوسط' },
      { risk: 'زيادة التكاليف التشغيلية', probability: 35, impact: 'عالي' },
      { risk: 'انخفاض الطلب', probability: 15, impact: 'عالي' }
    ],
    opportunities: [
      { opportunity: 'دخول أسواق جديدة', probability: 60, impact: 'عالي' },
      { opportunity: 'تحسين الكفاءة', probability: 75, impact: 'متوسط' },
      { opportunity: 'شراكات استراتيجية', probability: 45, impact: 'عالي' }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getRiskColor = (probability: number) => {
    if (probability >= 50) return 'text-red-600 bg-red-50';
    if (probability >= 25) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="h-full rounded-2xl p-6 operations-board-card" style={{
      background: 'var(--backgrounds-cards-admin-ops)'
    }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-arabic text-right mb-2">التحليل المالي والتقارير</h2>
            <p className="text-gray-600 font-arabic text-right">تحليلات متعمقة وتنبؤات مالية ذكية</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2 font-arabic">
              <Download className="h-4 w-4" />
              تصدير التقرير
            </Button>
            <Button variant="outline" className="gap-2 font-arabic">
              <Calendar className="h-4 w-4" />
              تخصيص الفترة
            </Button>
          </div>
        </div>

        {/* Analysis Type Selector */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedAnalysis === 'performance' ? 'default' : 'outline'}
            onClick={() => setSelectedAnalysis('performance')}
            className="font-arabic gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            تقارير الأداء المالي
          </Button>
          <Button
            variant={selectedAnalysis === 'profitability' ? 'default' : 'outline'}
            onClick={() => setSelectedAnalysis('profitability')}
            className="font-arabic gap-2"
          >
            <PieChart className="h-4 w-4" />
            تحليل ربحية المشاريع
          </Button>
          <Button
            variant={selectedAnalysis === 'predictions' ? 'default' : 'outline'}
            onClick={() => setSelectedAnalysis('predictions')}
            className="font-arabic gap-2"
          >
            <Brain className="h-4 w-4" />
            التنبؤات المالية
          </Button>
        </div>

        {/* Content based on selected analysis */}
        <div className="flex-1 overflow-auto">
          {selectedAnalysis === 'performance' && (
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="glass-section border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-arabic text-right">الإيرادات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className={`flex items-center gap-1 ${getGrowthColor(performanceData.revenue.growth)}`}>
                        {getGrowthIcon(performanceData.revenue.growth)}
                        <span className="text-sm font-arabic">
                          {Math.abs(performanceData.revenue.growth).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold font-arabic">{formatCurrency(performanceData.revenue.current)}</p>
                        <p className="text-sm text-gray-600 font-arabic">الفترة السابقة: {formatCurrency(performanceData.revenue.previous)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-section border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-arabic text-right">المصروفات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className={`flex items-center gap-1 ${getGrowthColor(performanceData.expenses.growth)}`}>
                        {getGrowthIcon(performanceData.expenses.growth)}
                        <span className="text-sm font-arabic">
                          {Math.abs(performanceData.expenses.growth).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold font-arabic">{formatCurrency(performanceData.expenses.current)}</p>
                        <p className="text-sm text-gray-600 font-arabic">الفترة السابقة: {formatCurrency(performanceData.expenses.previous)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-section border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-arabic text-right">صافي الربح</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className={`flex items-center gap-1 ${getGrowthColor(performanceData.profit.growth)}`}>
                        {getGrowthIcon(performanceData.profit.growth)}
                        <span className="text-sm font-arabic">
                          {Math.abs(performanceData.profit.growth).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold font-arabic">{formatCurrency(performanceData.profit.current)}</p>
                        <p className="text-sm text-gray-600 font-arabic">الفترة السابقة: {formatCurrency(performanceData.profit.previous)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Performance Indicators */}
              <Card className="glass-section border-0">
                <CardHeader>
                  <CardTitle className="font-arabic text-right">مؤشرات الأداء الرئيسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold font-arabic">{performanceData.roi.current}%</p>
                      <p className="text-sm text-gray-600 font-arabic">معدل العائد على الاستثمار</p>
                      <p className={`text-xs ${getGrowthColor(performanceData.roi.growth)} font-arabic`}>
                        {performanceData.roi.growth > 0 ? '+' : ''}{performanceData.roi.growth}%
                      </p>
                    </div>
                    <div className="text-center">
                      <PieChart className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold font-arabic">{performanceData.debtToAssets.current}</p>
                      <p className="text-sm text-gray-600 font-arabic">نسبة الديون إلى الأصول</p>
                      <p className={`text-xs ${getGrowthColor(performanceData.debtToAssets.growth)} font-arabic`}>
                        {performanceData.debtToAssets.growth > 0 ? '+' : ''}{performanceData.debtToAssets.growth}%
                      </p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-2xl font-bold font-arabic">{performanceData.profitMargin.current}%</p>
                      <p className="text-sm text-gray-600 font-arabic">هامش الربح</p>
                      <p className={`text-xs ${getGrowthColor(performanceData.profitMargin.growth)} font-arabic`}>
                        {performanceData.profitMargin.growth > 0 ? '+' : ''}{performanceData.profitMargin.growth}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedAnalysis === 'profitability' && (
            <div className="space-y-6">
              <Card className="glass-section border-0">
                <CardHeader>
                  <CardTitle className="font-arabic text-right">تحليل ربحية المشاريع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectProfitability.map((project, index) => (
                      <div key={index} className="p-4 bg-white/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-left">
                            <span className="text-lg font-bold text-green-600 font-arabic">{project.margin}%</span>
                            <p className="text-sm text-gray-600 font-arabic">هامش الربح</p>
                          </div>
                          <div className="text-right">
                            <h3 className="font-semibold font-arabic">{project.name}</h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-arabic text-gray-600">الإيرادات</p>
                            <p className="font-bold text-blue-600 font-arabic">{formatCurrency(project.revenue)}</p>
                          </div>
                          <div className="text-center">
                            <p className="font-arabic text-gray-600">التكاليف</p>
                            <p className="font-bold text-red-600 font-arabic">{formatCurrency(project.cost)}</p>
                          </div>
                          <div className="text-center">
                            <p className="font-arabic text-gray-600">الربح</p>
                            <p className="font-bold text-green-600 font-arabic">{formatCurrency(project.profit)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedAnalysis === 'predictions' && (
            <div className="space-y-6">
              {/* AI Predictions */}
              <Card className="glass-section border-0">
                <CardHeader>
                  <CardTitle className="font-arabic text-right flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    التنبؤات المالية الذكية - الربع القادم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 font-arabic mb-2">الإيرادات المتوقعة</h4>
                      <p className="text-2xl font-bold text-blue-600 font-arabic">{formatCurrency(aiPredictions.nextQuarter.revenue.predicted)}</p>
                      <p className="text-sm text-blue-600 font-arabic">دقة التنبؤ: {aiPredictions.nextQuarter.revenue.confidence}%</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 font-arabic mb-2">المصروفات المتوقعة</h4>
                      <p className="text-2xl font-bold text-red-600 font-arabic">{formatCurrency(aiPredictions.nextQuarter.expenses.predicted)}</p>
                      <p className="text-sm text-red-600 font-arabic">دقة التنبؤ: {aiPredictions.nextQuarter.expenses.confidence}%</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 font-arabic mb-2">الربح المتوقع</h4>
                      <p className="text-2xl font-bold text-green-600 font-arabic">{formatCurrency(aiPredictions.nextQuarter.profit.predicted)}</p>
                      <p className="text-sm text-green-600 font-arabic">دقة التنبؤ: {aiPredictions.nextQuarter.profit.confidence}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risks and Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-section border-0">
                  <CardHeader>
                    <CardTitle className="font-arabic text-right text-red-800">المخاطر المحتملة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiPredictions.risks.map((risk, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-arabic ${getRiskColor(risk.probability)}`}>
                              {risk.probability}%
                            </span>
                            <h4 className="font-semibold font-arabic">{risk.risk}</h4>
                          </div>
                          <p className="text-sm text-gray-600 font-arabic">التأثير: {risk.impact}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-section border-0">
                  <CardHeader>
                    <CardTitle className="font-arabic text-right text-green-800">الفرص المتاحة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiPredictions.opportunities.map((opportunity, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="px-2 py-1 rounded text-xs font-arabic bg-green-50 text-green-600">
                              {opportunity.probability}%
                            </span>
                            <h4 className="font-semibold font-arabic">{opportunity.opportunity}</h4>
                          </div>
                          <p className="text-sm text-gray-600 font-arabic">التأثير: {opportunity.impact}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const BudgetManagementTab = () => {
  const [selectedBudgetType, setSelectedBudgetType] = useState('general');

  // Mock budget data
  const budgets = {
    general: {
      title: 'الميزانية العامة للمؤسسة',
      total: 5000000,
      spent: 3200000,
      remaining: 1800000,
      categories: [
        { name: 'التسويق والإعلان', budget: 800000, spent: 520000, percentage: 65 },
        { name: 'الموارد البشرية', budget: 1500000, spent: 980000, percentage: 65.3 },
        { name: 'التطوير والتقنية', budget: 1200000, spent: 750000, percentage: 62.5 },
        { name: 'العمليات التشغيلية', budget: 1000000, spent: 680000, percentage: 68 },
        { name: 'الإدارة العامة', budget: 500000, spent: 270000, percentage: 54 }
      ]
    },
    projects: {
      title: 'ميزانيات المشاريع',
      total: 3500000,
      spent: 2100000,
      remaining: 1400000,
      categories: [
        { name: 'مشروع تطوير التطبيق', budget: 800000, spent: 480000, percentage: 60 },
        { name: 'حملة التسويق الرقمي', budget: 600000, spent: 420000, percentage: 70 },
        { name: 'تطوير الموقع الإلكتروني', budget: 500000, spent: 350000, percentage: 70 },
        { name: 'مشروع التدريب', budget: 400000, spent: 280000, percentage: 70 },
        { name: 'مشروع البحث والتطوير', budget: 1200000, spent: 570000, percentage: 47.5 }
      ]
    },
    departments: {
      title: 'ميزانيات الأقسام',
      total: 2800000,
      spent: 1850000,
      remaining: 950000,
      categories: [
        { name: 'قسم المبيعات', budget: 800000, spent: 520000, percentage: 65 },
        { name: 'قسم التقنية', budget: 900000, spent: 630000, percentage: 70 },
        { name: 'قسم الموارد البشرية', budget: 600000, spent: 390000, percentage: 65 },
        { name: 'قسم التسويق', budget: 500000, spent: 310000, percentage: 62 }
      ]
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const currentBudget = budgets[selectedBudgetType as keyof typeof budgets];
  const overallPercentage = (currentBudget.spent / currentBudget.total) * 100;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 75) return 'text-orange-600 bg-orange-50';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertTriangle className="h-4 w-4" />;
    if (percentage >= 75) return <Target className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="h-full rounded-2xl p-6 operations-board-card" style={{
      background: 'var(--backgrounds-cards-admin-ops)'
    }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-arabic text-right mb-2">إدارة الميزانيات والتخطيط المالي</h2>
            <p className="text-gray-600 font-arabic text-right">أدوات متطورة لإعداد وإدارة الميزانيات</p>
          </div>
          <Button className="gap-2 font-arabic">
            <PlusCircle className="h-4 w-4" />
            إنشاء ميزانية جديدة
          </Button>
        </div>

        {/* Budget Type Selector */}
        <div className="flex gap-2 mb-6">
          {Object.entries(budgets).map(([key, budget]) => (
            <Button
              key={key}
              variant={selectedBudgetType === key ? "default" : "outline"}
              onClick={() => setSelectedBudgetType(key)}
              className="font-arabic"
            >
              {budget.title}
            </Button>
          ))}
        </div>

        {/* Overall Budget Summary */}
        <Card className="glass-section border-0 mb-6">
          <CardHeader>
            <CardTitle className="font-arabic text-right">{currentBudget.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-arabic">إجمالي الميزانية</p>
                <p className="text-2xl font-bold font-arabic">{formatCurrency(currentBudget.total)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-arabic">المصروف</p>
                <p className="text-2xl font-bold text-red-600 font-arabic">{formatCurrency(currentBudget.spent)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-arabic">المتبقي</p>
                <p className="text-2xl font-bold text-green-600 font-arabic">{formatCurrency(currentBudget.remaining)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-arabic">نسبة الإنفاق</p>
                <p className="text-2xl font-bold text-blue-600 font-arabic">{overallPercentage.toFixed(1)}%</p>
              </div>
            </div>
            <Progress value={overallPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-4">
            {currentBudget.categories.map((category, index) => (
              <Card key={index} className="glass-section border-0">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-arabic ${getStatusColor(category.percentage)}`}>
                      {getStatusIcon(category.percentage)}
                      {category.percentage.toFixed(1)}%
                    </div>
                    <h3 className="font-semibold font-arabic">{category.name}</h3>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="font-arabic">{formatCurrency(category.spent)} من {formatCurrency(category.budget)}</span>
                    <span className="text-gray-600 font-arabic">المتبقي: {formatCurrency(category.budget - category.spent)}</span>
                  </div>
                  
                  <Progress 
                    value={category.percentage} 
                    className="h-2"
                    indicatorClassName={
                      category.percentage >= 90 ? 'bg-red-500' :
                      category.percentage >= 75 ? 'bg-orange-500' :
                      category.percentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Budget Scenarios */}
        <Card className="glass-section border-0 mt-6">
          <CardHeader>
            <CardTitle className="font-arabic text-right flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              سيناريوهات التخطيط المالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 font-arabic mb-2">السيناريو المتفائل</h4>
                <p className="text-2xl font-bold text-green-600 font-arabic">{formatCurrency(currentBudget.total * 1.15)}</p>
                <p className="text-sm text-green-600 font-arabic">+15% زيادة متوقعة</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 font-arabic mb-2">السيناريو المتوقع</h4>
                <p className="text-2xl font-bold text-blue-600 font-arabic">{formatCurrency(currentBudget.total)}</p>
                <p className="text-sm text-blue-600 font-arabic">الميزانية الحالية</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 font-arabic mb-2">السيناريو المتشائم</h4>
                <p className="text-2xl font-bold text-orange-600 font-arabic">{formatCurrency(currentBudget.total * 0.85)}</p>
                <p className="text-sm text-orange-600 font-arabic">-15% تخفيض محتمل</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, Building2 } from 'lucide-react';

export const FinancialOverviewTab = () => {
  // Mock data for financial overview
  const financialStats = {
    totalRevenue: 2850000,
    totalExpenses: 1920000,
    netProfit: 930000,
    cashFlow: 1250000,
    accountsReceivable: 680000,
    accountsPayable: 340000
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="h-full rounded-2xl p-6 operations-board-card" style={{
      background: 'var(--backgrounds-cards-admin-ops)'
    }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-arabic text-right mb-2">لوحة المعلومات المالية الرئيسية</h2>
          <p className="text-gray-600 font-arabic text-right">نظرة شاملة على الوضع المالي في الوقت الفعلي</p>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <Card className="glass-section border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-arabic text-right">{formatCurrency(financialStats.totalRevenue)}</div>
              <p className="text-xs text-green-600 flex items-center justify-end gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-arabic">+{getPercentageChange(financialStats.totalRevenue, 2650000)}%</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Expenses */}
          <Card className="glass-section border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي المصروفات</CardTitle>
              <CreditCard className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-arabic text-right">{formatCurrency(financialStats.totalExpenses)}</div>
              <p className="text-xs text-red-600 flex items-center justify-end gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-arabic">+{getPercentageChange(financialStats.totalExpenses, 1780000)}%</span>
              </p>
            </CardContent>
          </Card>

          {/* Net Profit */}
          <Card className="glass-section border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">صافي الربح</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-arabic text-right">{formatCurrency(financialStats.netProfit)}</div>
              <p className="text-xs text-green-600 flex items-center justify-end gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-arabic">+{getPercentageChange(financialStats.netProfit, 870000)}%</span>
              </p>
            </CardContent>
          </Card>

          {/* Cash Flow */}
          <Card className="glass-section border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">التدفق النقدي</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-arabic text-right">{formatCurrency(financialStats.cashFlow)}</div>
              <p className="text-xs text-green-600 flex items-center justify-end gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-arabic">+{getPercentageChange(financialStats.cashFlow, 1100000)}%</span>
              </p>
            </CardContent>
          </Card>

          {/* Accounts Receivable */}
          <Card className="glass-section border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">الذمم المدينة</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-arabic text-right">{formatCurrency(financialStats.accountsReceivable)}</div>
              <p className="text-xs text-orange-600 flex items-center justify-end gap-1 mt-1">
                <TrendingDown className="h-3 w-3" />
                <span className="font-arabic">-{getPercentageChange(720000, financialStats.accountsReceivable)}%</span>
              </p>
            </CardContent>
          </Card>

          {/* Accounts Payable */}
          <Card className="glass-section border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">الذمم الدائنة</CardTitle>
              <CreditCard className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-arabic text-right">{formatCurrency(financialStats.accountsPayable)}</div>
              <p className="text-xs text-green-600 flex items-center justify-end gap-1 mt-1">
                <TrendingDown className="h-3 w-3" />
                <span className="font-arabic">-{getPercentageChange(380000, financialStats.accountsPayable)}%</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Trend Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <Card className="glass-section border-0">
            <CardHeader>
              <CardTitle className="font-arabic text-right">اتجاهات الإيرادات والمصروفات</CardTitle>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <div className="text-center text-gray-500 font-arabic">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>رسم بياني تفاعلي للاتجاهات المالية</p>
                <p className="text-sm mt-1">سيتم تطويره قريباً</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-section border-0">
            <CardHeader>
              <CardTitle className="font-arabic text-right">مقارنة الأداء بالأهداف</CardTitle>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <div className="text-center text-gray-500 font-arabic">
                <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>مقارنات الأداء الفعلي بالمخطط</p>
                <p className="text-sm mt-1">سيتم تطويره قريباً</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

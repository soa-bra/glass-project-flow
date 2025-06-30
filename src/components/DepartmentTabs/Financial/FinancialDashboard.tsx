import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, FileText, BarChart, Settings, Download, Upload, Eye, Calculator, CreditCard, Receipt, PieChart, Target, Wallet, BookOpen, Database, Bell } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { BaseCard } from '@/components/ui/BaseCard';

// Mock data for financial dashboard
const mockKPIData = {
  revenue: {
    value: 2450000,
    change: 12.5,
    trend: 'up'
  },
  expenses: {
    value: 1850000,
    change: -8.3,
    trend: 'down'
  },
  netProfit: {
    value: 600000,
    change: 45.2,
    trend: 'up'
  },
  cashFlow: {
    value: 420000,
    change: 23.1,
    trend: 'up'
  }
};
const mockBudgetData = [{
  month: 'يناير',
  budget: 200000,
  actual: 185000
}, {
  month: 'فبراير',
  budget: 220000,
  actual: 210000
}, {
  month: 'مارس',
  budget: 250000,
  actual: 245000
}, {
  month: 'أبريل',
  budget: 230000,
  actual: 255000
}, {
  month: 'مايو',
  budget: 240000,
  actual: 235000
}, {
  month: 'يونيو',
  budget: 260000,
  actual: 270000
}];
const mockCashFlowData = [{
  month: 'يناير',
  inflow: 300000,
  outflow: 250000
}, {
  month: 'فبراير',
  inflow: 320000,
  outflow: 280000
}, {
  month: 'مارس',
  inflow: 350000,
  outflow: 290000
}, {
  month: 'أبريل',
  inflow: 330000,
  outflow: 310000
}, {
  month: 'مايو',
  inflow: 380000,
  outflow: 320000
}, {
  month: 'يونيو',
  inflow: 400000,
  outflow: 330000
}];
const mockBudgetTree = [{
  id: 1,
  name: 'الميزانية العامة 2024',
  amount: 5000000,
  status: 'approved',
  children: [{
    id: 11,
    name: 'مشاريع التطوير',
    amount: 2000000,
    status: 'approved'
  }, {
    id: 12,
    name: 'التشغيل والصيانة',
    amount: 1500000,
    status: 'pending'
  }, {
    id: 13,
    name: 'الموارد البشرية',
    amount: 1200000,
    status: 'approved'
  }, {
    id: 14,
    name: 'التسويق والإعلان',
    amount: 300000,
    status: 'review'
  }]
}];
const mockTransactions = [{
  id: 1,
  date: '2024-06-29',
  description: 'دفع راتب الموظفين',
  amount: -120000,
  type: 'expense',
  category: 'HR',
  status: 'completed'
}, {
  id: 2,
  date: '2024-06-28',
  description: 'إيراد من مشروع ABC',
  amount: 250000,
  type: 'revenue',
  category: 'Projects',
  status: 'completed'
}, {
  id: 3,
  date: '2024-06-27',
  description: 'مصاريف تسويقية',
  amount: -15000,
  type: 'expense',
  category: 'Marketing',
  status: 'pending'
}, {
  id: 4,
  date: '2024-06-26',
  description: 'دفع فواتير الخدمات',
  amount: -8500,
  type: 'expense',
  category: 'Operations',
  status: 'completed'
}];
const mockInvoices = [{
  id: 'INV-001',
  client: 'شركة الأمل',
  amount: 150000,
  status: 'paid',
  dueDate: '2024-06-15'
}, {
  id: 'INV-002',
  client: 'مؤسسة الرؤية',
  amount: 75000,
  status: 'pending',
  dueDate: '2024-07-01'
}, {
  id: 'INV-003',
  client: 'شركة النجاح',
  amount: 200000,
  status: 'overdue',
  dueDate: '2024-06-20'
}, {
  id: 'INV-004',
  client: 'مجموعة التقدم',
  amount: 125000,
  status: 'draft',
  dueDate: '2024-07-15'
}];
const mockExpenseCategories = [{
  name: 'الموارد البشرية',
  value: 45,
  color: '#8884d8'
}, {
  name: 'التشغيل',
  value: 25,
  color: '#82ca9d'
}, {
  name: 'التسويق',
  value: 15,
  color: '#ffc658'
}, {
  name: 'التطوير',
  value: 10,
  color: '#ff7c7c'
}, {
  name: 'أخرى',
  value: 5,
  color: '#8dd1e1'
}];
export const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState([{
    id: 1,
    type: 'warning',
    message: 'تجاوز ميزانية التسويق بنسبة 15%',
    priority: 'high'
  }, {
    id: 2,
    type: 'info',
    message: 'موعد دفع الرواتب خلال 3 أيام',
    priority: 'medium'
  }, {
    id: 3,
    type: 'success',
    message: 'تم استلام دفعة من مشروع XYZ',
    priority: 'low'
  }]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusText = (status: string) => {
    const statusMap: {
      [key: string]: string;
    } = {
      'approved': 'معتمد',
      'pending': 'في الانتظار',
      'review': 'قيد المراجعة',
      'rejected': 'مرفوض',
      'paid': 'مدفوع',
      'overdue': 'متأخر',
      'draft': 'مسودة',
      'completed': 'مكتمل'
    };
    return statusMap[status] || status;
  };

  // KPI Cards Component
  const KPICards = () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-green-600">{formatCurrency(mockKPIData.revenue.value)}</h3>
              <Badge variant="default" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{mockKPIData.revenue.change}%
              </Badge>
            </div>
          </div>
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
      </BaseCard>

      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">إجمالي المصروفات</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-red-600">{formatCurrency(mockKPIData.expenses.value)}</h3>
              <Badge variant="destructive" className="text-xs">
                <TrendingDown className="w-3 h-3 mr-1" />
                {mockKPIData.expenses.change}%
              </Badge>
            </div>
          </div>
          <Wallet className="h-8 w-8 text-red-600" />
        </div>
      </BaseCard>

      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">صافي الربح</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(mockKPIData.netProfit.value)}</h3>
              <Badge variant="default" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{mockKPIData.netProfit.change}%
              </Badge>
            </div>
          </div>
          <Target className="h-8 w-8 text-blue-600" />
        </div>
      </BaseCard>

      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">التدفق النقدي</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-purple-600">{formatCurrency(mockKPIData.cashFlow.value)}</h3>
              <Badge variant="default" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{mockKPIData.cashFlow.change}%
              </Badge>
            </div>
          </div>
          <BarChart className="h-8 w-8 text-purple-600" />
        </div>
      </BaseCard>
    </div>;
  const tabItems = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'budgets', label: 'الميزانيات' },
    { value: 'transactions', label: 'النفقات والإيرادات' },
    { value: 'invoices', label: 'الفواتير والمدفوعات' },
    { value: 'analysis', label: 'التحليل والتقارير' },
    { value: 'settings', label: 'الضبط' },
    { value: 'templates', label: 'النماذج والقوالب' },
    { value: 'reports', label: 'التقارير' }
  ];
  return (
    <div className="space-y-6 p-6 bg-transparent">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        {/* Updated TabsList to match other department panels */}
        <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar px-0 mb-6" dir="rtl">
          <TabsList 
            style={{
              direction: "rtl",
              width: "fit-content"
            }} 
            className="gap-1 justify-end bg-transparent min-w-max flex-nowrap py-0 h-auto"
          >
            {tabItems.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="text-sm font-arabic rounded-full py-2 px-6 transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-black hover:bg-gray-100 hover:text-gray-800 whitespace-nowrap data-[state=active]:bg-black"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <style>{`
            .no-scrollbar {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none !important;
            }
          `}</style>
        </div>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <KPICards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget vs Actual Chart */}
            <BaseCard variant="operations" className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  الميزانية مقابل الفعلي (شهري)
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={mockBudgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={value => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="budget" fill="#8884d8" name="الميزانية" />
                    <Bar dataKey="actual" fill="#82ca9d" name="الفعلي" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </BaseCard>

            {/* Cash Flow Forecast */}
            <BaseCard variant="operations" className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  توقعات التدفق النقدي
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockCashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={value => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="inflow" stroke="#8884d8" name="التدفق الداخل" />
                    <Line type="monotone" dataKey="outflow" stroke="#82ca9d" name="التدفق الخارج" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </BaseCard>
          </div>

          {/* AI Alerts */}
          <BaseCard variant="operations" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                تنبيهات الذكاء الاصطناعي
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-3">
                {alerts.map(alert => <div key={alert.id} className={`p-4 rounded-lg border ${alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : alert.type === 'info' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center gap-3">
                      {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                      {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-600" />}
                      {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      <span className="font-medium">{alert.message}</span>
                      <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'secondary' : 'default'}>
                        {alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </BaseCard>
        </TabsContent>

        {/* Tab 2: Budgets */}
        <TabsContent value="budgets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">إدارة الميزانيات</h3>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              إنشاء ميزانية جديدة
            </Button>
          </div>

          <BaseCard variant="operations" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>شجرة الميزانيات</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {mockBudgetTree.map(budget => <div key={budget.id} className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5" />
                      <div>
                        <h4 className="font-semibold">{budget.name}</h4>
                        <p className="text-sm text-gray-600">{formatCurrency(budget.amount)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(budget.status)}>
                      {getStatusText(budget.status)}
                    </Badge>
                  </div>
                  
                  <div className="ml-8 space-y-2">
                    {budget.children.map(child => <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          <div>
                            <h5 className="font-medium">{child.name}</h5>
                            <p className="text-sm text-gray-600">{formatCurrency(child.amount)}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(child.status)}>
                          {getStatusText(child.status)}
                        </Badge>
                      </div>)}
                  </div>
                </div>)}
            </CardContent>
          </BaseCard>
        </TabsContent>

        {/* Tab 3: Transactions */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">النفقات والإيرادات</h3>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                رفع مستند
              </Button>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                إضافة قيد
              </Button>
            </div>
          </div>

          <BaseCard variant="operations" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>دفتر القيود</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-3">
                {mockTransactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.type === 'revenue' ? <TrendingUp className="h-6 w-6 text-green-600" /> : <TrendingDown className="h-6 w-6 text-red-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.description}</h4>
                        <p className="text-sm text-gray-600">{transaction.date} • {transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </BaseCard>
        </TabsContent>

        {/* Tab 4: Invoices */}
        <TabsContent value="invoices" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">الفواتير والمدفوعات</h3>
            <Button>
              <Receipt className="w-4 h-4 mr-2" />
              إنشاء فاتورة
            </Button>
          </div>

          <BaseCard variant="operations" className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>جدول الفواتير</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-3">
                {mockInvoices.map(invoice => <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Receipt className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{invoice.id}</h4>
                        <p className="text-sm text-gray-600">{invoice.client}</p>
                        <p className="text-xs text-gray-500">تاريخ الاستحقاق: {invoice.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold">{formatCurrency(invoice.amount)}</p>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusText(invoice.status)}
                      </Badge>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </BaseCard>
        </TabsContent>

        {/* Tab 5: Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">التحليل والتقارير</h3>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              تصدير التقرير
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Categories */}
            <BaseCard variant="operations" className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  توزيع المصروفات
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie data={mockExpenseCategories} cx="50%" cy="50%" labelLine={false} label={({
                    name,
                    percent
                  }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {mockExpenseCategories.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </BaseCard>

            {/* AI Predictions */}
            <BaseCard variant="operations" className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  التنبؤات المالية
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">السيناريو المتفائل</h4>
                  <p className="text-green-700">نمو متوقع: +25%</p>
                  <p className="text-green-600">الإيرادات المتوقعة: {formatCurrency(3062500)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">السيناريو الأساسي</h4>
                  <p className="text-blue-700">نمو متوقع: +12%</p>
                  <p className="text-blue-600">الإيرادات المتوقعة: {formatCurrency(2744000)}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800">السيناريو المتحفظ</h4>
                  <p className="text-orange-700">نمو متوقع: +5%</p>
                  <p className="text-orange-600">الإيرادات المتوقعة: {formatCurrency(2572500)}</p>
                </div>
              </CardContent>
            </BaseCard>
          </div>
        </TabsContent>

        {/* Tab 6: Settings */}
        <TabsContent value="settings" className="space-y-6">
          <h3 className="text-2xl font-bold">إعدادات النظام المالي</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BaseCard variant="operations" className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  مخطط الحسابات
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-code">رمز الحساب</Label>
                  <Input id="account-code" placeholder="مثال: 1100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name">اسم الحساب</Label>
                  <Input id="account-name" placeholder="مثال: النقدية بالصندوق" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-type">نوع الحساب</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset">أصول</SelectItem>
                      <SelectItem value="liability">خصوم</SelectItem>
                      <SelectItem value="equity">حقوق الملكية</SelectItem>
                      <SelectItem value="revenue">إيرادات</SelectItem>
                      <SelectItem value="expense">مصروفات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">إضافة حساب</Button>
              </CardContent>
            </BaseCard>

            <BaseCard variant="operations" className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  إعدادات الضرائب
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vat-rate">معدل ضريبة القيمة المضافة (%)</Label>
                  <Input id="vat-rate" type="number" placeholder="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-number">الرقم الضريبي</Label>
                  <Input id="tax-number" placeholder="300000000000003" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">العملة الأساسية</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="EUR">يورو (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">حفظ الإعدادات</Button>
              </CardContent>
            </BaseCard>
          </div>
        </TabsContent>

        {/* Tab 7: Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">النماذج والقوالب المالية</h3>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              رفع قالب جديد
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
            name: 'قالب الميزانية السنوية',
            type: 'Excel',
            downloads: 45
          }, {
            name: 'نموذج طلب صرف',
            type: 'PDF',
            downloads: 32
          }, {
            name: 'قالب الفاتورة الموحدة',
            type: 'Word',
            downloads: 78
          }, {
            name: 'نموذج تقرير مالي شهري',
            type: 'Excel',
            downloads: 23
          }, {
            name: 'قالب عقد مالي',
            type: 'PDF',
            downloads: 19
          }, {
            name: 'نموذج طلب ميزانية',
            type: 'Word',
            downloads: 56
          }].map((template, index) => <BaseCard key={index} variant="operations" className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.type}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{template.downloads} تحميل</span>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    تحميل
                  </Button>
                </div>
              </BaseCard>)}
          </div>
        </TabsContent>

        {/* Tab 8: Reports */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">التقارير المالية</h3>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              إنشاء تقرير مخصص
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
            name: 'تقرير الأرباح والخسائر',
            period: 'شهري',
            lastGenerated: '2024-06-29'
          }, {
            name: 'تقرير المركز المالي',
            period: 'ربع سنوي',
            lastGenerated: '2024-06-28'
          }, {
            name: 'تقرير التدفق النقدي',
            period: 'أسبوعي',
            lastGenerated: '2024-06-30'
          }, {
            name: 'تقرير تحليل المصروفات',
            period: 'شهري',
            lastGenerated: '2024-06-29'
          }, {
            name: 'تقرير أداء الميزانية',
            period: 'شهري',
            lastGenerated: '2024-06-29'
          }, {
            name: 'تقرير حسابات العملاء',
            period: 'أسبوعي',
            lastGenerated: '2024-06-30'
          }].map((report, index) => <BaseCard key={index} variant="operations" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-gray-600">{report.period}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">آخر تحديث: {report.lastGenerated}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      عرض
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </BaseCard>)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

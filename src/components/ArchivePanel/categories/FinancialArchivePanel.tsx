
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, DollarSign, Calendar, TrendingUp, FileText, CreditCard, Receipt } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';

export const FinancialArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockFinancialRecords = [
    {
      id: '1',
      type: 'تقرير مالي سنوي',
      title: 'التقرير المالي لعام 2023',
      year: '2023',
      revenue: '2,450,000',
      expenses: '1,890,000',
      profit: '560,000',
      date: '2024-01-31',
      status: 'مكتمل',
      audited: true
    },
    {
      id: '2',
      type: 'فواتير مدفوعة',
      title: 'فواتير الربع الرابع 2023',
      period: 'ديسمبر 2023',
      totalAmount: '125,000',
      invoiceCount: 45,
      date: '2023-12-31',
      status: 'مدفوع',
      category: 'مصروفات تشغيلية'
    },
    {
      id: '3',
      type: 'ميزانية مشروع',
      title: 'ميزانية حملة العلامة التجارية الجديدة',
      projectId: 'PRJ-2023-015',
      budgetAmount: '300,000',
      actualSpent: '287,500',
      variance: '-12,500',
      date: '2023-11-15',
      status: 'مغلق'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'مدفوع': return 'bg-blue-100 text-blue-800';
      case 'مغلق': return 'bg-gray-100 text-gray-800';
      case 'معلق': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'تقرير مالي سنوي': return TrendingUp;
      case 'فواتير مدفوعة': return Receipt;
      case 'ميزانية مشروع': return CreditCard;
      default: return FileText;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="font-medium text-black font-arabic text-3xl">
          السجلات المالية
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-black text-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            تقرير مالي شامل
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            تصفية حسب السنة
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="p-4 rounded-[41px] border" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في السجلات المالية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full ring-1 focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
                style={{ borderColor: 'var(--sb-box-border)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Records List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockFinancialRecords.map((record) => {
            const IconComponent = getTypeIcon(record.type);
            return (
              <div key={record.id} className="p-6 rounded-[41px] border" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <h3 className="font-bold text-black font-arabic text-lg">{record.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </div>
                      <BaseBadge variant="secondary" size="sm">
                        {record.type}
                      </BaseBadge>
                      {record.type === 'تقرير مالي سنوي' && record.audited && (
                        <BaseBadge variant="info" size="sm">
                          مراجع
                        </BaseBadge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      {record.type === 'تقرير مالي سنوي' && (
                        <>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            الإيرادات: {record.revenue} ر.س
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            المصروفات: {record.expenses} ر.س
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            الربح: {record.profit} ر.س
                          </span>
                        </>
                      )}
                      
                      {record.type === 'فواتير مدفوعة' && (
                        <>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            إجمالي المبلغ: {record.totalAmount} ر.س
                          </span>
                          <span className="flex items-center gap-1">
                            عدد الفواتير: {record.invoiceCount}
                          </span>
                          <span className="flex items-center gap-1 font-arabic">
                            {record.category}
                          </span>
                        </>
                      )}
                      
                      {record.type === 'ميزانية مشروع' && (
                        <>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            الميزانية: {record.budgetAmount} ر.س
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            المصروف: {record.actualSpent} ر.س
                          </span>
                          <span className="flex items-center gap-1">
                            الفرق: {record.variance} ر.س
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{record.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" className="bg-black text-white rounded-full">
                      <Eye className="w-4 h-4 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full">
                      <Download className="w-4 h-4 mr-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

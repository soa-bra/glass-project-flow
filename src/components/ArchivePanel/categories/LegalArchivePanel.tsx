
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Scale, Calendar, Shield, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const LegalArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockLegalRecords = [
    {
      id: '1',
      type: 'عقد مع عميل',
      title: 'عقد خدمات التسويق الرقمي - شركة النور',
      contractNumber: 'CON-2023-045',
      clientName: 'شركة النور للتجارة',
      startDate: '2023-01-15',
      endDate: '2023-12-31',
      value: '450,000',
      status: 'منتهي',
      priority: 'عادي'
    },
    {
      id: '2',
      type: 'وثيقة امتثال',
      title: 'تقرير الامتثال لقانون حماية البيانات',
      regulationName: 'نظام حماية البيانات الشخصية',
      complianceDate: '2023-11-30',
      nextReview: '2024-05-30',
      status: 'مكتمل',
      priority: 'مرتفع'
    },
    {
      id: '3',
      type: 'قضية قانونية',
      title: 'نزاع علامة تجارية - قضية رقم 2023/567',
      caseNumber: 'CASE-2023-567',
      court: 'المحكمة التجارية بالرياض',
      startDate: '2023-03-20',
      closedDate: '2023-09-15',
      outcome: 'في صالحنا',
      status: 'مغلق',
      priority: 'مرتفع'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'منتهي': return 'bg-gray-100 text-gray-800';
      case 'مغلق': return 'bg-blue-100 text-blue-800';
      case 'نشط': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'مرتفع': return 'bg-red-100 text-red-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'عادي': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'عقد مع عميل': return FileText;
      case 'وثيقة امتثال': return Shield;
      case 'قضية قانونية': return Scale;
      default: return FileText;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="text-display-m font-bold text-soabra-ink font-arabic">
          الوثائق القانونية
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-soabra-ink text-soabra-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            تقرير قانوني
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            تصفية حسب النوع
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="bg-[#FFFFFF] p-4 rounded-[40px] ring-1 ring-[#DADCE0]">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الوثائق القانونية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full ring-1 ring-[#DADCE0] focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Legal Records List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockLegalRecords.map((record) => {
            const IconComponent = getTypeIcon(record.type);
            return (
              <div key={record.id} className="bg-[#FFFFFF] p-6 rounded-[40px] ring-1 ring-[#DADCE0]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <h3 className="font-bold text-black font-arabic text-lg">{record.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status === 'مكتمل' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {record.status === 'نشط' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {record.status}
                      </div>
                      <Badge variant="secondary" className="font-arabic">
                        {record.type}
                      </Badge>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(record.priority)}`}>
                        {record.priority}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      {record.type === 'عقد مع عميل' && (
                        <>
                          <span className="flex items-center gap-1 font-arabic">
                            {record.clientName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {record.startDate} - {record.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            القيمة: {record.value} ر.س
                          </span>
                        </>
                      )}
                      
                      {record.type === 'وثيقة امتثال' && (
                        <>
                          <span className="flex items-center gap-1 font-arabic">
                            {record.regulationName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            تاريخ الامتثال: {record.complianceDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            المراجعة القادمة: {record.nextReview}
                          </span>
                        </>
                      )}
                      
                      {record.type === 'قضية قانونية' && (
                        <>
                          <span className="flex items-center gap-1 font-arabic">
                            {record.court}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {record.startDate} - {record.closedDate}
                          </span>
                          <span className="flex items-center gap-1 font-arabic">
                            النتيجة: {record.outcome}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {record.contractNumber || record.caseNumber || 'وثيقة قانونية'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" className="bg-soabra-ink text-soabra-white rounded-full">
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

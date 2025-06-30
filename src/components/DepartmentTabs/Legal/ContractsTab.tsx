
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Plus, Search, Filter, Download, Edit, Eye, AlertCircle } from 'lucide-react';

export const ContractsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const contracts = [
    { id: 1, title: 'عقد شراكة استراتيجية - شركة ABC', client: 'شركة ABC المحدودة', status: 'نشط', type: 'شراكة', value: '500,000 ر.س', date: '2024-01-15', expiry: '2025-01-15' },
    { id: 2, title: 'اتفاقية خدمات تسويقية', client: 'مؤسسة التسويق الذكي', status: 'قيد المراجعة', type: 'خدمات', value: '75,000 ر.س', date: '2024-06-10', expiry: '2024-12-10' },
    { id: 3, title: 'عقد استشارات إدارية', client: 'شركة الاستشارات المتقدمة', status: 'منتهي', type: 'استشارات', value: '120,000 ر.س', date: '2023-08-20', expiry: '2024-08-20' }
  ];

  const templates = [
    { id: 1, name: 'قالب عقد الشراكة التجارية', category: 'شراكات', usage: 15 },
    { id: 2, name: 'قالب اتفاقية الخدمات', category: 'خدمات', usage: 23 },
    { id: 3, name: 'قالب عقد العمل', category: 'موارد بشرية', usage: 8 },
    { id: 4, name: 'قالب اتفاقية السرية', category: 'أمان', usage: 31 }
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="active" dir="rtl">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm rounded-full">
          <TabsTrigger value="active" className="rounded-full">العقود النشطة</TabsTrigger>
          <TabsTrigger value="templates" className="rounded-full">القوالب</TabsTrigger>
          <TabsTrigger value="archive" className="rounded-full">الأرشيف</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-full">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Search and Filters */}
          <BaseCard size="sm">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في العقود..."
                  className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 ml-2" />
                  تصفية
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  عقد جديد
                </Button>
              </div>
            </div>
          </BaseCard>

          {/* Contracts List */}
          <BaseCard size="lg">
            <div className="space-y-4">
              {contracts.map((contract) => (
                <div key={contract.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">{contract.title}</h4>
                      <p className="text-gray-600 text-sm">{contract.client}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      contract.status === 'نشط' ? 'bg-green-100 text-green-800' :
                      contract.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {contract.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">النوع: </span>
                      <span className="font-medium">{contract.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">القيمة: </span>
                      <span className="font-medium">{contract.value}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">تاريخ التوقيع: </span>
                      <span className="font-medium">{contract.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">تاريخ الانتهاء: </span>
                      <span className="font-medium">{contract.expiry}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 ml-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800">قوالب العقود</h3>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 ml-2" />
                قالب جديد
              </Button>
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="w-6 h-6 text-blue-600 mt-1" />
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{template.category}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{template.name}</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">استُخدم {template.usage} مرة</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">استخدام</Button>
                      <Button size="sm" variant="outline">تعديل</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="archive">
          <BaseCard size="lg">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">أرشيف العقود</h3>
              <p className="text-gray-600">سيتم عرض العقود المؤرشفة والمنتهية هنا</p>
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">127</div>
                <div className="text-sm text-gray-600">إجمالي العقود</div>
              </div>
            </BaseCard>
            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">2.5M</div>
                <div className="text-sm text-gray-600">القيمة الإجمالية (ر.س)</div>
              </div>
            </BaseCard>
            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">45</div>
                <div className="text-sm text-gray-600">متوسط مدة التنفيذ (يوم)</div>
              </div>
            </BaseCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

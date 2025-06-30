
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Image, Video, FileText, Upload, Download, Share, Eye, Clock, CheckCircle } from 'lucide-react';

export const ContentAssetsTab: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const contentCalendar = [
    { id: 1, title: 'منشور إطلاق المنتج', type: 'منشور', platform: 'Instagram', date: '2024-01-20', status: 'مجدول' },
    { id: 2, title: 'فيديو توضيحي', type: 'فيديو', platform: 'YouTube', date: '2024-01-22', status: 'قيد المراجعة' },
    { id: 3, title: 'إعلان العروض', type: 'إعلان', platform: 'Facebook', date: '2024-01-25', status: 'معتمد' }
  ];

  const assets = [
    { id: 1, name: 'شعار الشركة الجديد', type: 'صورة', format: 'PNG', size: '2.5 MB', status: 'معتمد', expires: '2024-12-31' },
    { id: 2, name: 'فيديو تعريفي بالخدمات', type: 'فيديو', format: 'MP4', size: '45 MB', status: 'قيد المراجعة', expires: '2024-06-30' },
    { id: 3, name: 'كتيب المنتجات', type: 'مستند', format: 'PDF', size: '8.2 MB', status: 'معتمد', expires: '2024-09-30' },
    { id: 4, name: 'قالب البريد الإلكتروني', type: 'قالب', format: 'HTML', size: '1.1 MB', status: 'معتمد', expires: '2025-01-31' }
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="calendar" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="calendar" className="rounded-md">تقويم المحتوى</TabsTrigger>
          <TabsTrigger value="assets" className="rounded-md">مكتبة الأصول</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Content Calendar */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                تقويم المحتوى التفاعلي
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Calendar className="w-4 h-4 ml-2" />
                إضافة محتوى
              </Button>
            </div>
          }>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">العنوان</th>
                    <th className="text-right p-3">النوع</th>
                    <th className="text-right p-3">المنصة</th>
                    <th className="text-right p-3">تاريخ النشر</th>
                    <th className="text-right p-3">الحالة</th>
                    <th className="text-right p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {contentCalendar.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3">{item.platform}</td>
                      <td className="p-3">{item.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'معتمد' ? 'bg-green-100 text-green-800' :
                          item.status === 'مجدول' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline"><Eye className="w-3 h-3" /></Button>
                          <Button size="sm" variant="outline"><Share className="w-3 h-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BaseCard>

          {/* Publishing Permissions */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800">صلاحيات النشر</h3>
          }>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">مراجعة إبداعية</h4>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">تمت الموافقة</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">مراجعة قانونية</h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">قيد المراجعة</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">مراجعة مالية</h4>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">تمت الموافقة</span>
                </div>
              </div>
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          {/* Asset Library */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
                <Image className="w-5 h-5" />
                مكتبة الأصول المتكاملة (DAM)
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 ml-2" />
                رفع أصل جديد
              </Button>
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    {asset.type === 'صورة' && <Image className="w-8 h-8 text-blue-600" />}
                    {asset.type === 'فيديو' && <Video className="w-8 h-8 text-red-600" />}
                    {asset.type === 'مستند' && <FileText className="w-8 h-8 text-green-600" />}
                    {asset.type === 'قالب' && <FileText className="w-8 h-8 text-purple-600" />}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{asset.name}</h4>
                      <p className="text-xs text-gray-600">{asset.format} • {asset.size}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>الحالة:</span>
                      <span className={`px-2 py-1 rounded font-medium ${
                        asset.status === 'معتمد' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>انتهاء الصلاحية:</span>
                      <span className="font-medium">{asset.expires}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-3 h-3 ml-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>

          {/* Asset Expiry Alerts */}
          <BaseCard size="lg" header={
            <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              تنبيهات انتهاء الصلاحية
            </h3>
          }>
            <div className="space-y-3">
              {[
                { name: 'ترخيص الموسيقى التصويرية', expires: '30 يوم', type: 'ترخيص' },
                { name: 'صور المنتجات الموسمية', expires: '45 يوم', type: 'أصل' },
                { name: 'عقد الشراكة الإعلامية', expires: '60 يوم', type: 'عقد' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">نوع: {item.type}</div>
                  </div>
                  <div className="text-sm text-yellow-700 font-medium">
                    باقي {item.expires}
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

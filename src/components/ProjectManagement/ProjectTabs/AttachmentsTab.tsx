import React from 'react';
import { BaseProjectTabLayout } from '../BaseProjectTabLayout';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Paperclip, Upload, Download, Eye, Trash2, Search } from 'lucide-react';

interface AttachmentsTabProps {
  documents?: any;
}

export const AttachmentsTab: React.FC<AttachmentsTabProps> = ({ documents }) => {
  const attachmentStats = [
    {
      title: 'إجمالي الملفات',
      value: '127',
      unit: 'ملف',
      description: 'جميع المرفقات في المشروع'
    },
    {
      title: 'المساحة المستخدمة',
      value: '2.4',
      unit: 'GB',
      description: 'من أصل 10 GB متاحة'
    },
    {
      title: 'الملفات الجديدة',
      value: '8',
      unit: 'ملف',
      description: 'تم إضافتها هذا الأسبوع'
    },
    {
      title: 'عدد التحميلات',
      value: '342',
      unit: 'تحميل',
      description: 'خلال الشهر الماضي'
    }
  ];

  const mockFiles = [
    {
      id: 1,
      name: 'تصميم الواجهة الرئيسية.figma',
      type: 'design',
      size: '12.5 MB',
      uploadedBy: 'فاطمة علي',
      uploadDate: '2024-01-25',
      category: 'تصميم',
      version: '3.2'
    },
    {
      id: 2,
      name: 'مواصفات المشروع التقنية.pdf',
      type: 'document',
      size: '2.1 MB',
      uploadedBy: 'محمد أحمد',
      uploadDate: '2024-01-24',
      category: 'مستندات',
      version: '1.0'
    },
    {
      id: 3,
      name: 'قاعدة البيانات - نسخة احتياطية.sql',
      type: 'database',
      size: '156 MB',
      uploadedBy: 'عبدالله سالم',
      uploadDate: '2024-01-23',
      category: 'قواعد بيانات',
      version: '2.1'
    },
    {
      id: 4,
      name: 'دليل المستخدم.docx',
      type: 'document',
      size: '4.8 MB',
      uploadedBy: 'نورا محمد',
      uploadDate: '2024-01-22',
      category: 'توثيق',
      version: '1.5'
    }
  ];

  const fileCategories = [
    { name: 'تصميم', count: 23, color: 'success' },
    { name: 'مستندات', count: 45, color: 'info' },
    { name: 'كود مصدري', count: 34, color: 'warning' },
    { name: 'قواعد بيانات', count: 12, color: 'error' },
    { name: 'توثيق', count: 13, color: 'default' }
  ];

  return (
    <BaseProjectTabLayout
      value="files"
      title="إدارة المرفقات"
      icon={<Paperclip className="w-4 h-4" />}
      kpiStats={attachmentStats}
    >
      {/* File Management Actions */}
      <BaseCard title="إدارة الملفات" icon={<Upload className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <BaseActionButton 
            variant="primary" 
            icon={<Upload className="w-4 h-4" />}
          >
            رفع ملف جديد
          </BaseActionButton>
          <BaseActionButton 
            variant="outline" 
            icon={<Search className="w-4 h-4" />}
          >
            البحث في الملفات
          </BaseActionButton>
        </div>
        
        {/* File Categories */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-600 mb-3">التصنيفات</h4>
          <div className="flex flex-wrap gap-2">
            {fileCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <BaseBadge variant={category.color as any} size="sm">
                  {category.name}
                </BaseBadge>
                <span className="text-xs text-gray-600">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
      </BaseCard>

      {/* Recent Files */}
      <BaseCard title="الملفات الأخيرة" icon={<Paperclip className="w-4 h-4" />}>
        <div className="space-y-3">
          {mockFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                  file.type === 'design' ? 'bg-purple-500' :
                  file.type === 'document' ? 'bg-blue-500' :
                  file.type === 'database' ? 'bg-green-500' :
                  'bg-gray-500'
                }`}>
                  {file.name.split('.').pop()?.toUpperCase().slice(0, 3)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">{file.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>رفعه {file.uploadedBy}</span>
                    <span>•</span>
                    <span>{file.uploadDate}</span>
                    <span>•</span>
                    <span>إصدار {file.version}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <BaseBadge variant="info" size="sm">
                  {file.category}
                </BaseBadge>
                <div className="flex items-center gap-1">
                  <BaseActionButton variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </BaseActionButton>
                  <BaseActionButton variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </BaseActionButton>
                  <BaseActionButton variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </BaseActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* Storage Usage */}
      <BaseCard title="استخدام التخزين" icon={<Upload className="w-4 h-4" />}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">المساحة المستخدمة</span>
            <span className="text-sm font-bold">2.4 GB من 10 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">توزيع أنواع الملفات</h4>
              <div className="space-y-2">
                {[
                  { type: 'صور ومرئيات', size: '1.2 GB', percentage: 50 },
                  { type: 'مستندات', size: '0.8 GB', percentage: 33 },
                  { type: 'ملفات أخرى', size: '0.4 GB', percentage: 17 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{item.type}</span>
                    <span className="font-medium">{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">إحصائيات سريعة</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">أكبر ملف:</span>
                  <span className="font-medium">156 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">متوسط حجم الملف:</span>
                  <span className="font-medium">18.9 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">آخر رفع:</span>
                  <span className="font-medium">منذ ساعة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </BaseProjectTabLayout>
  );
};
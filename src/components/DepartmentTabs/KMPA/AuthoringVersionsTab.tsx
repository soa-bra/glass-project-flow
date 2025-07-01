
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Save, 
  Eye, 
  History, 
  GitBranch, 
  Users, 
  MessageCircle,
  FileText,
  Image,
  Link,
  Bold,
  Italic,
  List
} from 'lucide-react';

export const AuthoringVersionsTab: React.FC = () => {
  const [activeEditor, setActiveEditor] = useState('wysiwyg');
  const [content, setContent] = useState('');

  const recentDocuments = [
    {
      id: 'DOC-003',
      title: 'دليل قياس الأثر الثقافي',
      status: 'draft',
      lastModified: '2024-04-15',
      author: 'د. أحمد المحمد',
      version: '1.0',
      collaborators: 3
    },
    {
      id: 'DOC-004',
      title: 'بحث في التسويق الرقمي الثقافي',
      status: 'review',
      lastModified: '2024-04-14',
      author: 'د. فاطمة العلي',
      version: '2.1',
      collaborators: 2
    }
  ];

  const versionHistory = [
    {
      version: '2.1',
      date: '2024-04-15',
      author: 'د. أحمد المحمد',
      changes: 'إضافة قسم جديد حول المقاييس الكمية',
      status: 'current'
    },
    {
      version: '2.0',
      date: '2024-04-10',
      author: 'د. فاطمة العلي',
      changes: 'مراجعة شاملة للمحتوى وتحديث المراجع',
      status: 'previous'
    },
    {
      version: '1.5',
      date: '2024-04-05',
      author: 'د. أحمد المحمد',
      changes: 'إضافة أمثلة تطبيقية وحالات دراسية',
      status: 'previous'
    }
  ];

  const EditorToolbar = () => (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button size="sm" variant="outline">
        <Bold className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="outline">
        <Italic className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="outline">
        <List className="h-3 w-3" />
      </Button>
      <div className="w-px h-6 bg-gray-300 mx-2" />
      <Button size="sm" variant="outline">
        <Link className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="outline">
        <Image className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="outline">
        <FileText className="h-3 w-3" />
      </Button>
      <div className="mr-auto flex gap-2">
        <Button size="sm" variant="outline">
          <Save className="h-3 w-3 mr-1" />
          حفظ
        </Button>
        <Button size="sm">
          <Eye className="h-3 w-3 mr-1" />
          معاينة
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">التأليف والإصدارات</h3>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            تاريخ الإصدارات
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إنشاء وثيقة جديدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>محرر المحتوى</CardTitle>
              <Tabs value={activeEditor} onValueChange={setActiveEditor} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wysiwyg">محرر بصري</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <EditorToolbar />
              <TabsContent value="wysiwyg" className="m-0">
                <div className="min-h-[400px] p-4 border-none">
                  <textarea
                    className="w-full h-full min-h-[400px] resize-none border-none outline-none"
                    placeholder="ابدأ بكتابة المحتوى هنا..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="markdown" className="m-0">
                <div className="min-h-[400px] p-4 border-none">
                  <textarea
                    className="w-full h-full min-h-[400px] resize-none border-none outline-none font-mono"
                    placeholder="# عنوان رئيسي&#10;&#10;اكتب المحتوى بصيغة Markdown..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Document Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">خصائص الوثيقة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">العنوان</label>
                <input 
                  type="text" 
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="عنوان الوثيقة"
                />
              </div>
              <div>
                <label className="text-sm font-medium">الفئة</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>اختر الفئة</option>
                  <option>دليل</option>
                  <option>بحث</option>
                  <option>تقرير</option>
                  <option>قالب</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">الوسوم</label>
                <input 
                  type="text" 
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="أدخل الوسوم مفصولة بفاصلة"
                />
              </div>
              <div>
                <label className="text-sm font-medium">الحالة</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>مسودة</option>
                  <option>قيد المراجعة</option>
                  <option>جاهز للنشر</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Collaboration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                التعاون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    أ
                  </div>
                  <div>
                    <div className="font-medium text-sm">د. أحمد المحمد</div>
                    <div className="text-xs text-gray-600">مؤلف رئيسي</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                    ف
                  </div>
                  <div>
                    <div className="font-medium text-sm">د. فاطمة العلي</div>
                    <div className="text-xs text-gray-600">مراجع</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  إضافة متعاون
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                التعليقات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">د. فاطمة العلي</div>
                  <div className="text-xs text-gray-600 mb-1">منذ ساعتين</div>
                  <div className="text-sm">يُنصح بإضافة مثال تطبيقي في القسم الثالث</div>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">أ. محمد السالم</div>
                  <div className="text-xs text-gray-600 mb-1">أمس</div>
                  <div className="text-sm">المراجع تحتاج تحديث وفقاً لأحدث الدراسات</div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  إضافة تعليق
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>الوثائق الحديثة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h4 className="font-medium">{doc.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span>{doc.author}</span>
                    <span>•</span>
                    <span>{new Date(doc.lastModified).toLocaleDateString('ar-SA')}</span>
                    <span>•</span>
                    <span>الإصدار {doc.version}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={doc.status === 'draft' ? 'secondary' : 'default'}>
                    {doc.status === 'draft' ? 'مسودة' : 'قيد المراجعة'}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    {doc.collaborators}
                  </div>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    تحرير
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            تاريخ الإصدارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {versionHistory.map((version) => (
              <div key={version.version} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-2 ${version.status === 'current' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">الإصدار {version.version}</span>
                    {version.status === 'current' && (
                      <Badge variant="default" className="text-xs">الحالي</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {version.author} • {new Date(version.date).toLocaleDateString('ar-SA')}
                  </div>
                  <div className="text-sm">{version.changes}</div>
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  عرض
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

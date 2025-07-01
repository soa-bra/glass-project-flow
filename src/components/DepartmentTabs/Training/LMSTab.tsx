
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Play, FileText, CheckCircle, Clock, Users, Settings, Upload, Download } from 'lucide-react';

export const LMSTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('content');

  // Mock SCORM packages data
  const scormPackages = [
    {
      id: 1,
      title: 'مقدمة في علم اجتماع العلامة التجارية',
      version: '1.2',
      status: 'active',
      uploadDate: '2024-01-15',
      completions: 45,
      avgScore: 87
    },
    {
      id: 2,
      title: 'تحليل السلوك الاستهلاكي',
      version: '2.0',
      status: 'active',
      uploadDate: '2024-02-20',
      completions: 32, 
      avgScore: 92
    }
  ];

  // Mock xAPI statements
  const xapiStatements = [
    {
      id: 1,
      actor: 'أحمد محمد',
      verb: 'completed',
      object: 'دورة التسويق الرقمي',
      timestamp: '2024-03-15T10:30:00Z',
      score: 95
    },
    {
      id: 2,
      actor: 'فاطمة أحمد',
      verb: 'attempted',
      object: 'اختبار المهارات التقنية',
      timestamp: '2024-03-15T09:15:00Z',
      score: 78
    }
  ];

  const ContentManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">إدارة المحتوى التعليمي</h3>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          رفع حزمة SCORM
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-gray-600">حزم SCORM</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-gray-600">جلسات تفاعلية</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">89</div>
            <div className="text-sm text-gray-600">موارد تعليمية</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>حزم SCORM المرفوعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scormPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{pkg.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>الإصدار {pkg.version}</span>
                    <span>{pkg.uploadDate}</span>
                    <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                      {pkg.status === 'active' ? 'نشط' : 'معطل'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    <div>{pkg.completions} إكمال</div>
                    <div>متوسط النقاط: {pkg.avgScore}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TrackingAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">تتبع التقدم والتحليلات</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">847</div>
            <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">2,340</div>
            <div className="text-sm text-gray-600">ساعات التعلم</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-gray-600">معدل الإنجاز</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">456</div>
            <div className="text-sm text-gray-600">شهادة صادرة</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات xAPI الحديثة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {xapiStatements.map((statement) => (
              <div key={statement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{statement.actor}</span>
                    <Badge variant="outline">
                      {statement.verb === 'completed' ? 'أكمل' : 
                       statement.verb === 'attempted' ? 'حاول' : statement.verb}
                    </Badge>
                    <span className="text-gray-600">{statement.object}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(statement.timestamp).toLocaleString('ar-SA')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{statement.score}%</div>
                  <Progress value={statement.score} className="h-1 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Settings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">إعدادات نظام إدارة التعلم</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إعدادات SCORM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>دعم SCORM 1.2</span>
              <Badge variant="default">مفعل</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>دعم SCORM 2004</span>
              <Badge variant="default">مفعل</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>الحد الأقصى لحجم الحزمة</span>
              <span className="text-sm text-gray-600">500 MB</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إعدادات xAPI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Learning Record Store</span>
              <Badge variant="default">متصل</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>تتبع التفاعلات</span>
              <Badge variant="default">مفعل</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>حفظ البيانات</span>
              <span className="text-sm text-gray-600">6 أشهر</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات التتبع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">مدة الجلسة (دقيقة)</label>
              <input type="number" className="w-full p-2 border rounded" defaultValue={120} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">حد الخمول (دقيقة)</label>
              <input type="number" className="w-full p-2 border rounded" defaultValue={30} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">نظام إدارة التعلم</h3>
          <p className="text-gray-600">نظام إدارة التعلم المدمج يدعم معايير SCORM و xAPI مع تتبع الوقت والإنجاز</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير البيانات
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            الإعدادات
          </Button>
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
          <TabsTrigger value="tracking">التتبع والتحليلات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <ContentManagement />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <TrackingAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

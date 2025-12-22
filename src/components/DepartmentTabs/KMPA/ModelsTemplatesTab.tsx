
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  Download, 
  FileText, 
  BarChart3, 
  Eye, 
  Edit, 
  Plus,
  Calculator,
  FileSpreadsheet,
  Trophy,
  TrendingUp,
  Users,
  Heart,
  Wifi,
  Target
} from 'lucide-react';
import { mockSupraMetrics } from './data/mockData';

export const ModelsTemplatesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('metrics');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const metrics = mockSupraMetrics;
  
  const filteredMetrics = metrics.filter(metric => 
    metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cultural_identity': return Trophy;
      case 'social_responsibility': return Heart;
      case 'brand_community': return Users;
      case 'digital_communication': return Wifi;
      case 'independent': return Target;
      default: return BarChart3;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cultural_identity': return 'مؤشرات الهوية الثقافية';
      case 'social_responsibility': return 'مؤشرات المسؤولية الاجتماعية';
      case 'brand_community': return 'مؤشرات مجتمع العلامة';
      case 'digital_communication': return 'مؤشرات التواصل الرقمي الثقافي';
      case 'independent': return 'مؤشرات مستقلة';
      default: return category;
    }
  };

  const templates = [
    {
      id: 'TEMP-001',
      name: 'قالب التقرير الشهري',
      type: 'report',
      description: 'قالب موحد لإعداد التقارير الشهرية',
      downloads: 145,
      lastUpdated: '2024-04-10'
    },
    {
      id: 'TEMP-002',
      name: 'نموذج دراسة الحالة',
      type: 'case_study',
      description: 'نموذج لإعداد دراسات الحالة البحثية',
      downloads: 89,
      lastUpdated: '2024-04-08'
    },
    {
      id: 'TEMP-003',
      name: 'قالب الاستبيان',
      type: 'survey',
      description: 'قالب لإعداد الاستبيانات البحثية',
      downloads: 67,
      lastUpdated: '2024-04-05'
    }
  ];

  const MetricDetails = ({ metric }: { metric: any }) => {
    const IconComponent = getCategoryIcon(metric.category);
    
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <IconComponent className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{metric.name}</h3>
            <p className="text-gray-600 mb-2">{metric.nameEn}</p>
            <BaseBadge variant="outline">{getCategoryLabel(metric.category)}</BaseBadge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-3 w-3 mr-1" />
              معاينة
            </Button>
            <Button size="sm">
              <Download className="h-3 w-3 mr-1" />
              تحميل Excel
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>وصف المقياس</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{metric.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مستويات التقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metric.scale.levels.map((level: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-20 text-center">
                    <BaseBadge variant="outline">{level.range}</BaseBadge>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </div>
                  <Progress 
                    value={parseInt(level.range.split('-')[1] || level.range) || 0} 
                    className="w-24 h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معايير القياس</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metric.criteria.map((criterion: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">{criterion.name}</h4>
                  <div className="space-y-2">
                    {criterion.statements.map((statement: any, stIndex: number) => (
                      <div key={stIndex} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <div className="flex-1 text-sm">{statement.text}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">النقاط:</span>
                          <input 
                            type="number" 
                            min="0" 
                            max="5" 
                            value={statement.score}
                            className="w-16 p-1 border rounded text-center"
                            readOnly
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الاستخدام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metric.usage}</div>
                <div className="text-sm text-gray-600">مرة استخدام</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Date(metric.lastUpdated).toLocaleDateString('ar-SA')}
                </div>
                <div className="text-sm text-gray-600">آخر تحديث</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">النماذج والقوالب</h3>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            رفع قالب
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إنشاء نموذج جديد
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">مقاييس سوبرا</TabsTrigger>
          <TabsTrigger value="templates">القوالب والنماذج</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {selectedMetric ? (
            <div>
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={() => setSelectedMetric(null)}
              >
                ← العودة للمقاييس
              </Button>
              <MetricDetails metric={metrics.find(m => m.id === selectedMetric)} />
            </div>
          ) : (
            <>
              {/* Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{metrics.length}</div>
                    <div className="text-sm text-gray-600">إجمالي المقاييس</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileSpreadsheet className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{metrics.length}</div>
                    <div className="text-sm text-gray-600">ملفات Excel</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Download className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {metrics.reduce((sum, m) => sum + m.usage, 0)}
                    </div>
                    <div className="text-sm text-gray-600">إجمالي الاستخدامات</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-gray-600">فئات رئيسية</div>
                  </CardContent>
                </Card>
              </div>

              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Input
                      placeholder="البحث في مقاييس سوبرا..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <BarChart3 className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['cultural_identity', 'social_responsibility', 'brand_community', 'digital_communication', 'independent'].map((category) => {
                  const categoryMetrics = filteredMetrics.filter(m => m.category === category);
                  const IconComponent = getCategoryIcon(category);
                  
                  return (
                    <Card key={category} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <IconComponent className="h-5 w-5" />
                          {getCategoryLabel(category)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {categoryMetrics.map((metric) => (
                            <div 
                              key={metric.id}
                              className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                              onClick={() => setSelectedMetric(metric.id)}
                            >
                              <div className="font-medium text-sm">{metric.name}</div>
                              <div className="text-xs text-gray-600">{metric.nameEn}</div>
                              <div className="flex justify-between items-center mt-1">
                                <BaseBadge variant="secondary" className="text-xs">
                                  {metric.usage} استخدام
                                </BaseBadge>
                                <Button size="sm" variant="ghost" className="h-6 px-2">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>دليل استخدام مقاييس سوبرا</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium">خطوات الاستخدام:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>اختر المقياس المناسب لاحتياجاتك</li>
                          <li>حمل ملف Excel الخاص بالمقياس</li>
                          <li>اقرأ تعليمات الاستخدام في الملف</li>
                          <li>قم بتقييم العبارات من 0 إلى 5</li>
                          <li>راجع النتائج في لوحة التحكم</li>
                        </ol>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium">مقياس التقييم:</h4>
                        <div className="space-y-1 text-sm">
                          <div><strong>0:</strong> غير موجود إطلاقاً</div>
                          <div><strong>1:</strong> موجود بشكل ضعيف جداً</div>
                          <div><strong>2:</strong> موجود بشكل ضعيف</div>
                          <div><strong>3:</strong> موجود بشكل متوسط</div>
                          <div><strong>4:</strong> موجود بشكل جيد</div>
                          <div><strong>5:</strong> موجود بشكل ممتاز</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{templates.length}</div>
                <div className="text-sm text-gray-600">إجمالي القوالب</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + t.downloads, 0)}
                </div>
                <div className="text-sm text-gray-600">إجمالي التحميلات</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">أنواع القوالب</div>
              </CardContent>
            </Card>
          </div>

          {/* Templates List */}
          <Card>
            <CardHeader>
              <CardTitle>القوالب المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>آخر تحديث: {new Date(template.lastUpdated).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-sm font-medium">{template.downloads}</div>
                        <div className="text-xs text-gray-600">تحميل</div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          معاينة
                        </Button>
                        <Button size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          تحميل
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          تحرير
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

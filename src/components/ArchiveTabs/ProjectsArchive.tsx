
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { FolderOpen, CheckCircle, Clock, DollarSign } from 'lucide-react';

export const ProjectsArchive: React.FC = () => {
  const kpiStats = [
    {
      title: 'المشاريع المكتملة',
      value: 47,
      unit: 'مشروع',
      description: 'منذ بداية العام'
    },
    {
      title: 'القيمة الإجمالية',
      value: '12.5',
      unit: 'مليون ريال',
      description: 'قيمة المشاريع المنجزة'
    },
    {
      title: 'متوسط المدة',
      value: 6.2,
      unit: 'شهر',
      description: 'متوسط إنجاز المشروع'
    },
    {
      title: 'معدل النجاح',
      value: 94,
      unit: '%',
      description: 'المشاريع المنجزة بنجاح'
    }
  ];

  const completedProjects = [
    { name: 'تطوير هوية سوبرا الرقمية', completedDate: '2024-01-20', budget: '450,000', duration: '4 أشهر', status: 'مكتمل' },
    { name: 'حملة التسويق الثقافي Q4', completedDate: '2023-12-15', budget: '280,000', duration: '3 أشهر', status: 'مكتمل' },
    { name: 'تطوير منصة التدريب الداخلي', completedDate: '2023-11-30', budget: '680,000', duration: '6 أشهر', status: 'مكتمل' },
    { name: 'مشروع البحث الثقافي المجتمعي', completedDate: '2023-10-25', budget: '320,000', duration: '5 أشهر', status: 'مكتمل' }
  ];

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      <div className="grid grid-cols-1 gap-6">
        {/* Completed Projects List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              المشاريع المكتملة مؤخراً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedProjects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-lg">{project.name}</h4>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>تاريخ الإكمال: {project.completedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>الميزانية: {project.budget} ريال</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>المدة: {project.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Categories Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>المشاريع حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>التطوير التقني</span>
                    <span>15 مشروع</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>التسويق والعلامة التجارية</span>
                    <span>12 مشروع</span>
                  </div>
                  <Progress value={26} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>البحث والتطوير</span>
                    <span>8 مشاريع</span>
                  </div>
                  <Progress value={17} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>التدريب والتطوير</span>
                    <span>6 مشاريع</span>
                  </div>
                  <Progress value={13} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>أخرى</span>
                    <span>6 مشاريع</span>
                  </div>
                  <Progress value={13} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الأداء التاريخي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <div className="text-sm text-gray-600">معدل إكمال المشاريع في الوقت المحدد</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">96%</div>
                  <div className="text-sm text-gray-600">معدل الالتزام بالميزانية</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                  <div className="text-sm text-gray-600">متوسط تقييم رضا العملاء</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

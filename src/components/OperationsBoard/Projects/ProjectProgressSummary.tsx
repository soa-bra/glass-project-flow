import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, FolderOpen } from 'lucide-react';

interface ProjectSummary {
  totalProjects: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  completionRate: number;
}

interface ProjectProgressSummaryProps {
  summary: ProjectSummary;
}

export const ProjectProgressSummary: React.FC<ProjectProgressSummaryProps> = ({ summary }) => {
  const onTrackPercentage = (summary.onTrack / summary.totalProjects) * 100;
  const atRiskPercentage = (summary.atRisk / summary.totalProjects) * 100;
  const delayedPercentage = (summary.delayed / summary.totalProjects) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* إجمالي المشاريع */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 font-arabic">إجمالي المشاريع</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalProjects}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* المشاريع في المسار */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 font-arabic">في المسار</p>
              <p className="text-2xl font-bold text-green-600">{summary.onTrack}</p>
              <p className="text-xs text-gray-500">{onTrackPercentage.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* المشاريع في خطر */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 font-arabic">في خطر</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.atRisk}</p>
              <p className="text-xs text-gray-500">{atRiskPercentage.toFixed(1)}%</p>
            </div>
            <Users className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      {/* المشاريع المتأخرة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 font-arabic">متأخرة</p>
              <p className="text-2xl font-bold text-red-600">{summary.delayed}</p>
              <p className="text-xs text-gray-500">{delayedPercentage.toFixed(1)}%</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      {/* معدل الإنجاز الإجمالي */}
      <Card className="col-span-full">
        <CardContent className="p-4">
          <div className="text-right mb-4">
            <h3 className="text-lg font-semibold text-gray-800 font-arabic">معدل الإنجاز الإجمالي</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.completionRate}%</p>
          </div>
          <Progress value={summary.completionRate} className="h-3" />
          <div className="flex justify-between text-sm text-gray-500 mt-2 font-arabic">
            <span>مكتمل</span>
            <span>قيد التطوير</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
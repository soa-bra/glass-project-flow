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
export const ProjectProgressSummary: React.FC<ProjectProgressSummaryProps> = ({
  summary
}) => {
  const onTrackPercentage = summary.onTrack / summary.totalProjects * 100;
  const atRiskPercentage = summary.atRisk / summary.totalProjects * 100;
  const delayedPercentage = summary.delayed / summary.totalProjects * 100;
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* إجمالي المشاريع */}
      <Card className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-gray-600">إجمالي المشاريع</p>
              <p className="text-2xl font-bold">{summary.totalProjects}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* المشاريع في المسار */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff] py-[10px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">في المسار</p>
              <p className="text-2xl font-bold text-green-600">{summary.onTrack}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2">
            <Progress value={onTrackPercentage} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{onTrackPercentage.toFixed(0)}% من المشاريع</p>
          </div>
        </CardContent>
      </Card>

      {/* المشاريع في خطر */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff] py-[10px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">في خطر</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.atRisk}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-500 bg-transparent" />
          </div>
          <div className="mt-2">
            <Progress value={atRiskPercentage} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{atRiskPercentage.toFixed(0)}% من المشاريع</p>
          </div>
        </CardContent>
      </Card>

      {/* المشاريع المتأخرة */}
      <Card className="glass-enhanced rounded-[40px]">
        <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff] py-[10px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">متأخرة</p>
              <p className="text-2xl font-bold text-red-600">{summary.delayed}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2">
            <Progress value={delayedPercentage} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{delayedPercentage.toFixed(0)}% من المشاريع</p>
          </div>
        </CardContent>
      </Card>

      {/* معدل الإنجاز الإجمالي */}
      <Card className="glass-enhanced rounded-[40px] col-span-full my-0 py-0">
        <CardContent className="glass-enhanced rounded-[40px] bg-[#f3ffff]">
          <div className="text-right mb-4">
            <h3 className="text-lg font-semibold text-gray-800 font-arabic">معدل الإنجاز الإجمالي</h3>
            <p className="text-3xl font-bold text-primary">{summary.completionRate}%</p>
          </div>
          <Progress value={summary.completionRate} className="h-3" />
          <div className="grid grid-cols-3 gap-4 text-sm mt-0 my-0 text-center mx-0">
            <div>
              <p className="text-green-600 font-bold">{summary.onTrack}</p>
              <p className="text-gray-600">في المسار</p>
            </div>
            <div>
              <p className="text-yellow-600 font-bold">{summary.atRisk}</p>
              <p className="text-gray-600">في خطر</p>
            </div>
            <div>
              <p className="text-red-600 font-bold">{summary.delayed}</p>
              <p className="text-gray-600">متأخر</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
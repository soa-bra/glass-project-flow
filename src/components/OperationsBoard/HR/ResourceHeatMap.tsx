import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Star } from 'lucide-react';
interface ResourceUtilization {
  employeeId: string;
  name: string;
  department: string;
  utilization: number;
  capacity: number;
  projects: string[];
  skills: string[];
  performance: number;
}
interface ResourceHeatMapProps {
  resourceData: ResourceUtilization[];
}
export const ResourceHeatMap: React.FC<ResourceHeatMapProps> = ({
  resourceData
}) => {
  const getUtilizationVariant = (utilization: number) => {
    if (utilization >= 90) return 'error';
    if (utilization >= 80) return 'warning';
    if (utilization >= 60) return 'success';
    return 'info';
  };
  const getUtilizationText = (utilization: number) => {
    if (utilization >= 90) return 'مرهق';
    if (utilization >= 80) return 'مثقل';
    if (utilization >= 60) return 'مثالي';
    return 'متاح';
  };
  return <BaseCard
      variant="operations"
      size="md"
      className="w-full"
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
            <Users className="w-5 h-5" />
            خريطة استخدام الموارد
          </h3>
        </div>
      }
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resourceData.map(resource => <div key={resource.employeeId} className="bg-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-right">
                  <h4 className="font-medium">{resource.name}</h4>
                  <p className="text-sm text-gray-600">{resource.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{resource.performance}</span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span>الاستخدام: {resource.utilization}%</span>
                  <BaseBadge variant={getUtilizationVariant(resource.utilization)} size="sm">
                    {getUtilizationText(resource.utilization)}
                  </BaseBadge>
                </div>
                <Progress value={resource.utilization} className="h-2" />
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">المشاريع:</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.projects.slice(0, 2).map((project, idx) => <BaseBadge key={idx} variant="default" size="sm">
                        {project}
                      </BaseBadge>)}
                    {resource.projects.length > 2 && <BaseBadge variant="default" size="sm">
                        +{resource.projects.length - 2}
                      </BaseBadge>}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-600 mb-1">المهارات:</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.skills.slice(0, 2).map((skill, idx) => <BaseBadge key={idx} variant="info" size="sm">
                        {skill}
                      </BaseBadge>)}
                    {resource.skills.length > 2 && <BaseBadge variant="info" size="sm">
                        +{resource.skills.length - 2}
                      </BaseBadge>}
                  </div>
                </div>
              </div>
            </div>)}
        </div>
    </BaseCard>;
};
interface SkillGap {
  skill: string;
  current: number;
  required: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}
interface SkillGapRadarProps {
  skillGaps: SkillGap[];
}
export const SkillGapRadar: React.FC<SkillGapRadarProps> = ({
  skillGaps
}) => {
  const chartConfig = {
    current: {
      label: "المستوى الحالي",
      color: "hsl(var(--primary))"
    },
    required: {
      label: "المستوى المطلوب",
      color: "hsl(var(--secondary))"
    }
  };
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالية';
      case 'medium':
        return 'متوسطة';
      case 'low':
        return 'منخفضة';
      default:
        return priority;
    }
  };
  return <BaseCard
      variant="operations"
      size="md"
      className="w-full"
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black font-arabic">
            تحليل فجوات المهارات
          </h3>
        </div>
      }
    >
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillGaps}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{
              fontSize: 12
            }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{
              fontSize: 10
            }} />
              <Radar name="الحالي" dataKey="current" stroke="var(--color-current)" fill="var(--color-current)" fillOpacity={0.3} />
              <Radar name="المطلوب" dataKey="required" stroke="var(--color-required)" fill="var(--color-required)" fillOpacity={0.3} />
              <Tooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 space-y-3">
          {skillGaps.map((skill, index) => <div key={index} className="flex items-center justify-between p-3 bg-white/20 rounded-2xl">
              <div className="text-right">
                <p className="font-medium text-sm">{skill.skill}</p>
                <p className="text-xs text-gray-600">
                  الفجوة: {skill.gap} نقاط
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BaseBadge variant={getPriorityVariant(skill.priority)} size="sm">
                  {getPriorityText(skill.priority)}
                </BaseBadge>
                <div className="text-center">
                  <p className="text-xs text-gray-600">الحالي/المطلوب</p>
                  <p className="font-bold">{skill.current}/{skill.required}</p>
                </div>
              </div>
            </div>)}
        </div>
    </BaseCard>;
};
interface WorkloadData {
  department: string;
  current: number;
  capacity: number;
  efficiency: number;
}
interface WorkloadBalanceProps {
  workloadData: WorkloadData[];
}
export const WorkloadBalance: React.FC<WorkloadBalanceProps> = ({
  workloadData
}) => {
  const chartConfig = {
    current: {
      label: "الحمولة الحالية",
      color: "hsl(var(--primary))"
    },
    capacity: {
      label: "السعة الكاملة",
      color: "hsl(var(--secondary))"
    }
  };
  return <BaseCard
      variant="operations"
      size="md"
      className="w-full"
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black font-arabic">
            توازن أعباء العمل
          </h3>
        </div>
      }
    >
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadData} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" tick={{
              fontSize: 12
            }} interval={0} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="current" fill="var(--color-current)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity" fill="var(--color-capacity)" radius={[4, 4, 0, 0]} opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workloadData.map((dept, index) => {
          const utilizationRate = dept.current / dept.capacity * 100;
          const isOverloaded = utilizationRate > 90;
          return <div key={index} className="bg-white/20 rounded-2xl p-4">
                <div className="text-right mb-2">
                  <h4 className="font-medium text-sm">{dept.department}</h4>
                  <p className="text-xs text-gray-600">كفاءة: {dept.efficiency}%</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className={isOverloaded ? 'text-red-600' : 'text-gray-600'}>
                      الاستخدام: {utilizationRate.toFixed(1)}%
                    </span>
                    <span>{dept.current}/{dept.capacity}</span>
                  </div>
                  <Progress value={utilizationRate} className={`h-2 ${isOverloaded ? 'bg-red-100' : ''}`} />
                </div>

                <div className="mt-2 text-center">
                  <BaseBadge variant={isOverloaded ? 'error' : 'success'} size="sm">
                    {isOverloaded ? 'مرهق' : 'طبيعي'}
                  </BaseBadge>
                </div>
              </div>;
        })}
        </div>
    </BaseCard>;
};
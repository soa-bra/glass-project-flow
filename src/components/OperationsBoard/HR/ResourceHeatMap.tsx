import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export const ResourceHeatMap: React.FC<ResourceHeatMapProps> = ({ resourceData }) => {
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 80) return 'bg-yellow-500';
    if (utilization >= 60) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getUtilizationText = (utilization: number) => {
    if (utilization >= 90) return 'مرهق';
    if (utilization >= 80) return 'مثقل';
    if (utilization >= 60) return 'مثالي';
    return 'متاح';
  };

  return (
    <Card className="glass-enhanced rounded-[40px]">
      <CardHeader>
        <CardTitle className="text-right font-arabic flex items-center gap-2">
          <Users className="w-5 h-5" />
          خريطة استخدام الموارد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resourceData.map((resource) => (
            <div key={resource.employeeId} className="bg-white/20 rounded-2xl p-4">
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
                  <Badge className={`${getUtilizationColor(resource.utilization)} text-white`}>
                    {getUtilizationText(resource.utilization)}
                  </Badge>
                </div>
                <Progress value={resource.utilization} className="h-2" />
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">المشاريع:</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.projects.slice(0, 2).map((project, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                    {resource.projects.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{resource.projects.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-600 mb-1">المهارات:</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.skills.slice(0, 2).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {resource.skills.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{resource.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
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

export const SkillGapRadar: React.FC<SkillGapRadarProps> = ({ skillGaps }) => {
  const chartConfig = {
    current: {
      label: "المستوى الحالي",
      color: "hsl(var(--primary))",
    },
    required: {
      label: "المستوى المطلوب",
      color: "hsl(var(--secondary))",
    },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <Card className="glass-enhanced rounded-[40px]">
      <CardHeader>
        <CardTitle className="text-right font-arabic">تحليل فجوات المهارات</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillGaps}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Radar name="الحالي" dataKey="current" stroke="var(--color-current)" fill="var(--color-current)" fillOpacity={0.3} />
              <Radar name="المطلوب" dataKey="required" stroke="var(--color-required)" fill="var(--color-required)" fillOpacity={0.3} />
              <Tooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 space-y-3">
          {skillGaps.map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/20 rounded-2xl">
              <div className="text-right">
                <p className="font-medium text-sm">{skill.skill}</p>
                <p className="text-xs text-gray-600">
                  الفجوة: {skill.gap} نقاط
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(skill.priority)}>
                  {getPriorityText(skill.priority)}
                </Badge>
                <div className="text-center">
                  <p className="text-xs text-gray-600">الحالي/المطلوب</p>
                  <p className="font-bold">{skill.current}/{skill.required}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
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

export const WorkloadBalance: React.FC<WorkloadBalanceProps> = ({ workloadData }) => {
  const chartConfig = {
    current: {
      label: "الحمولة الحالية",
      color: "hsl(var(--primary))",
    },
    capacity: {
      label: "السعة الكاملة",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <Card className="glass-enhanced rounded-[40px]">
      <CardHeader>
        <CardTitle className="text-right font-arabic">توازن أعباء العمل</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="department" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="current" fill="var(--color-current)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity" fill="var(--color-capacity)" radius={[4, 4, 0, 0]} opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workloadData.map((dept, index) => {
            const utilizationRate = (dept.current / dept.capacity) * 100;
            const isOverloaded = utilizationRate > 90;

            return (
              <div key={index} className="bg-white/20 rounded-2xl p-4">
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
                  <Progress 
                    value={utilizationRate} 
                    className={`h-2 ${isOverloaded ? 'bg-red-100' : ''}`}
                  />
                </div>

                <div className="mt-2 text-center">
                  <Badge className={`${isOverloaded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {isOverloaded ? 'مرهق' : 'طبيعي'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
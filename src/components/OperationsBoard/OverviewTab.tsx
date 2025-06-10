
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface WidgetsData {
  budget: { total: number; spent: number };
  contracts: { signed: number; expired: number };
  hr: { members: number; vacancies: number; onLeave: number };
  satisfaction: number;
}

interface OverviewData {
  timeline: TimelineEvent[];
  widgets: WidgetsData;
}

interface OverviewTabProps {
  data?: OverviewData;
  loading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  // تنسيق الأرقام كنص عربي بالآلاف
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  return (
    <div className="flex h-full gap-6">
      {/* الخط الزمني - Timeline */}
      <div className="w-1/4 bg-white/40 backdrop-blur-sm rounded-2xl p-4 shadow-md">
        <h3 className="text-xl font-arabic font-medium mb-4 text-right">المواعيد القادمة</h3>
        
        <div className="relative mt-6">
          <div className="absolute h-full w-0.5 bg-gray-300 left-4"></div>
          
          {data.timeline.map((event, index) => (
            <div key={event.id} className="mb-8 relative">
              <div className={`absolute left-4 transform -translate-x-1/2 w-3 h-3 rounded-full ${event.color}`}></div>
              <div className="mr-10 text-right">
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString('ar-SA')}</p>
                <h4 className="text-base font-medium">{event.title}</h4>
                <p className="text-xs text-gray-600">{event.department}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* شبكة الويدجت */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* الميزانية/المصروفات */}
        <Card className="bg-white/40 hover:bg-white/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-arabic font-medium mb-4 text-right">الميزانية والمصروفات</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">الميزانية الإجمالية</span>
                  <span className="font-medium text-right">{formatNumber(data.widgets.budget.total)} ريال</span>
                </div>
                <Progress value={100} className="h-2 bg-gray-200" indicatorClassName="bg-blue-400" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">المصروفات</span>
                  <span className="font-medium text-right">
                    {formatNumber(data.widgets.budget.spent)} ريال 
                    ({Math.round((data.widgets.budget.spent / data.widgets.budget.total) * 100)}%)
                  </span>
                </div>
                <Progress 
                  value={(data.widgets.budget.spent / data.widgets.budget.total) * 100} 
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-green-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* العقود */}
        <Card className="bg-white/40 hover:bg-white/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-arabic font-medium mb-4 text-right">حالة العقود</h3>
            
            <div className="flex flex-col items-center mt-6">
              <div className="flex w-full justify-between mb-4">
                <div className="text-center">
                  <span className="text-3xl font-bold block">{data.widgets.contracts.signed}</span>
                  <span className="text-sm text-gray-600">موقّعة</span>
                </div>

                <div className="text-center text-orange-500">
                  <span className="text-3xl font-bold block">{data.widgets.contracts.expired}</span>
                  <span className="text-sm">منتهية</span>
                </div>
              </div>

              <Progress 
                value={
                  (data.widgets.contracts.signed / (data.widgets.contracts.signed + data.widgets.contracts.expired)) * 100
                } 
                className="h-3 w-full bg-orange-200"
                indicatorClassName="bg-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* الموارد البشرية */}
        <Card className="bg-white/40 hover:bg-white/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-arabic font-medium mb-4 text-right">الموارد البشرية</h3>
            
            <div className="flex justify-between mt-4">
              <div className="text-center">
                <span className="text-2xl font-bold block text-blue-600">{data.widgets.hr.members}</span>
                <span className="text-xs text-gray-600">أعضاء الفريق</span>
              </div>

              <div className="text-center">
                <span className="text-2xl font-bold block text-amber-500">{data.widgets.hr.onLeave}</span>
                <span className="text-xs text-gray-600">في إجازة</span>
              </div>

              <div className="text-center">
                <span className="text-2xl font-bold block text-purple-600">{data.widgets.hr.vacancies}</span>
                <span className="text-xs text-gray-600">شواغر</span>
              </div>
            </div>

            <div className="mt-4">
              <Progress 
                value={(data.widgets.hr.members / (data.widgets.hr.members + data.widgets.hr.vacancies)) * 100}
                className="h-2 bg-gray-200" 
                indicatorClassName="bg-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* رضا العملاء */}
        <Card className="bg-white/40 hover:bg-white/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-arabic font-medium mb-4 text-right">مؤشر رضا العملاء</h3>
            
            <div className="flex flex-col items-center justify-center mt-2">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={data.widgets.satisfaction > 80 ? "#4ADE80" : data.widgets.satisfaction > 60 ? "#FACC15" : "#F87171"}
                    strokeWidth="3"
                    strokeDasharray={`${data.widgets.satisfaction}, 100`}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-3xl font-bold">{data.widgets.satisfaction}%</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-sm text-gray-600">
                  {data.widgets.satisfaction > 80 
                    ? "ممتاز"
                    : data.widgets.satisfaction > 60 
                    ? "جيد"
                    : "بحاجة لتحسين"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

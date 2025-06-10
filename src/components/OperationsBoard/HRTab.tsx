
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface HRStats {
  active: number;
  onLeave: number;
  vacancies: number;
}

interface ProjectDistribution {
  project: string;
  members: number;
}

interface HRData {
  stats: HRStats;
  distribution: ProjectDistribution[];
}

interface HRTabProps {
  data?: HRData;
  loading: boolean;
}

export const HRTab: React.FC<HRTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  // حساب العدد الإجمالي للموظفين والشواغر
  const totalTeamSize = data.stats.active + data.stats.vacancies;
  const percentageFilled = Math.round((data.stats.active / totalTeamSize) * 100);

  // قم بترتيب المشاريع حسب عدد الأعضاء تنازليًا
  const sortedDistribution = [...data.distribution].sort((a, b) => b.members - a.members);
  
  // أقصى عدد من الأعضاء لتحديد نسبة العرض
  const maxMembers = Math.max(...sortedDistribution.map(item => item.members));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-arabic font-medium text-right">الموارد البشرية</h2>
      
      {/* بطاقات إحصائيات الفريق */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-all hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-600">{data.stats.active}</h3>
            <p className="text-gray-600">أعضاء نشطين</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-all hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-amber-600">{data.stats.onLeave}</h3>
            <p className="text-gray-600">في إجازة</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-all hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-purple-600">{data.stats.vacancies}</h3>
            <p className="text-gray-600">شواغر</p>
          </CardContent>
        </Card>
      </div>
      
      {/* نسبة ملء الشواغر */}
      <Card className="bg-white/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">{percentageFilled}% تم التوظيف</span>
            <h3 className="font-medium">نسبة ملء الشواغر</h3>
          </div>
          
          <Progress 
            value={percentageFilled} 
            className="h-3 bg-gray-200"
            indicatorClassName="bg-blue-500"
          />
          
          <div className="flex justify-between text-sm mt-2">
            <span className="text-blue-600">{data.stats.active} موظف</span>
            <span className="text-purple-600">{data.stats.vacancies} شاغر</span>
          </div>
        </CardContent>
      </Card>
      
      {/* توزيع الأعضاء على المشاريع */}
      <div>
        <h3 className="text-xl font-arabic font-medium text-right mb-4">توزيع الأعضاء على المشاريع</h3>
        
        <Card className="bg-white/40 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            {sortedDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{item.members}</span>
                  <span className="text-right">{item.project}</span>
                </div>
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                    style={{width: `${(item.members / maxMembers) * 100}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* زر إضافة عضو */}
      <div className="flex justify-center mt-6">
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          إضافة عضو جديد
        </button>
      </div>
    </div>
  );
};

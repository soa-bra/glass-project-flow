
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ActiveClient {
  id: number;
  name: string;
  projects: number;
}

interface NPSScore {
  id: number;
  score: number;
  client: string;
}

interface ClientsData {
  active: ActiveClient[];
  nps: NPSScore[];
}

interface ClientsTabProps {
  data?: ClientsData;
  loading: boolean;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  // دالة لتحديد لون مؤشر NPS بناءً على القيمة
  const getNPSColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-green-400';
    if (score >= 60) return 'bg-amber-400';
    return 'bg-red-500';
  };

  // دالة لتحديد تقييم NPS
  const getNPSRating = (score: number): string => {
    if (score >= 90) return 'ممتاز';
    if (score >= 75) return 'جيد جداً';
    if (score >= 60) return 'جيد';
    if (score >= 40) return 'مقبول';
    return 'ضعيف';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-arabic font-medium text-right">العملاء</h2>
      
      {/* قائمة العملاء النشطين */}
      <div>
        <h3 className="text-xl font-arabic font-medium text-right mb-4">العملاء النشطين</h3>
        
        <Card className="bg-white/40 backdrop-blur-sm">
          <CardContent className="p-4">
            <ul className="space-y-2">
              {data.active.map(client => (
                <li key={client.id} className="border-b border-gray-200/60 last:border-0 pb-2 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      {client.projects} مشروع
                    </span>
                    <h4 className="font-medium text-lg text-right">{client.name}</h4>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* بطاقات مؤشر NPS */}
      <div>
        <h3 className="text-xl font-arabic font-medium text-right mb-4">مؤشر رضا العملاء (NPS)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.nps.map(item => (
            <Card 
              key={item.id}
              className="bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-all"
            >
              <CardContent className="p-4">
                <div className="text-right mb-2">
                  <h4 className="font-medium">{item.client}</h4>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-sm font-medium px-2.5 py-1 rounded ${
                      item.score >= 75 ? 'bg-green-100 text-green-800' :
                      item.score >= 60 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getNPSRating(item.score)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{item.score}</span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNPSColor(item.score) }}></div>
                  </div>
                </div>
                
                <div className="mt-3 bg-gray-200 h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${getNPSColor(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* زر إضافة عميل */}
      <div className="flex justify-center mt-6">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          إضافة عميل جديد
        </button>
      </div>
    </div>
  );
};

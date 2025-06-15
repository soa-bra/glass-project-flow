
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Bell, Clock, User } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  author?: string;
}

interface NewsFeedWidgetProps {
  className?: string;
}

export const NewsFeedWidget: React.FC<NewsFeedWidgetProps> = ({
  className = ''
}) => {
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'تحديث نظام إدارة المشاريع',
      description: 'تم إطلاق التحديث الجديد بميزات محسنة لتتبع المهام',
      time: 'منذ ساعتين',
      type: 'info',
      author: 'فريق التطوير'
    },
    {
      id: 2,
      title: 'انتهاء مشروع التطوير الجديد',
      description: 'تم تسليم مشروع تطوير التطبيق بنجاح وفي الموعد المحدد',
      time: 'منذ 4 ساعات',
      type: 'success',
      author: 'إدارة المشاريع'
    },
    {
      id: 3,
      title: 'تنبيه: اقتراب موعد التسليم',
      description: 'مشروع العميل الجديد يحتاج متابعة عاجلة',
      time: 'منذ 6 ساعات',
      type: 'warning',
      author: 'مدير المشروع'
    }
  ];

  const getTypeColor = (type: NewsItem['type']) => {
    switch (type) {
      case 'info': return '#3B82F6';
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Bell size={16} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">
          الأخبار والتحديثات
        </h3>
      </header>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        {newsItems.map((item) => (
          <div 
            key={item.id} 
            className="p-3 bg-white/50 rounded-2xl border border-white/60 hover:bg-white/70 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: getTypeColor(item.type) }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#23272f] mb-1 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{item.time}</span>
                  </div>
                  {item.author && (
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{item.author}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GenericCard>
  );
};

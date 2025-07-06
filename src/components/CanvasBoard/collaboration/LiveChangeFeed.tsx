import React, { useEffect, useState } from 'react';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Clock, User, Activity } from 'lucide-react';

interface ChangeEvent {
  id: string;
  userId: string;
  userName: string;
  action: string;
  elementType?: string;
  timestamp: Date;
  color: string;
}

interface LiveChangeFeedProps {
  projectId: string;
  selectedTool: string;
  currentUserId?: string;
}

export const LiveChangeFeed: React.FC<LiveChangeFeedProps> = ({ 
  projectId, 
  selectedTool,
  currentUserId = 'user1'
}) => {
  const [events, setEvents] = useState<ChangeEvent[]>([
    {
      id: '1',
      userId: 'user2',
      userName: 'فاطمة علي',
      action: 'أضافت عنصر نص جديد',
      elementType: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      color: '#10b981'
    },
    {
      id: '2',
      userId: 'user3',
      userName: 'سارة أحمد',
      action: 'عدّلت موقع الملاحظة اللاصقة',
      elementType: 'sticky',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      color: '#f59e0b'
    }
  ]);

  if (selectedTool !== 'live-feed') return null;

  useEffect(() => {
    // محاكاة تدفق الأحداث المباشرة
    const interval = setInterval(() => {
      const actions = [
        'أضاف عنصر جديد',
        'حرّك العنصر',
        'غيّر لون العنصر',
        'أضاف تعليق',
        'حفظ المشروع',
        'انضم للجلسة',
        'غادر الجلسة'
      ];

      const users = [
        { id: 'user2', name: 'فاطمة علي', color: '#10b981' },
        { id: 'user3', name: 'سارة أحمد', color: '#f59e0b' },
        { id: 'user4', name: 'محمد حسن', color: '#3b82f6' }
      ];

      // إضافة حدث جديد عشوائياً
      if (Math.random() > 0.7) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const newEvent: ChangeEvent = {
          id: Date.now().toString(),
          userId: randomUser.id,
          userName: randomUser.name,
          action: randomAction,
          timestamp: new Date(),
          color: randomUser.color
        };

        setEvents(prev => [newEvent, ...prev.slice(0, 19)]); // الاحتفاظ بآخر 20 حدث
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [projectId]);

  const getActionIcon = (action: string) => {
    if (action.includes('أضاف') || action.includes('أضافت')) return '➕';
    if (action.includes('حرّك') || action.includes('عدّل')) return '↔️';
    if (action.includes('حفظ')) return '💾';
    if (action.includes('انضم')) return '👋';
    if (action.includes('غادر')) return '👋';
    return '📝';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return date.toLocaleDateString('ar');
  };

  return (
    <ToolPanelContainer title="تدفق التغييرات المباشر">
      <div className="space-y-3">
        {/* إحصائيات سريعة */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span className="font-arabic">{events.length} حدث</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="font-arabic">
              {new Set(events.map(e => e.userId)).size} نشط
            </span>
          </div>
        </div>

        {/* قائمة الأحداث */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-arabic">
                لا توجد أحداث حالياً
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div 
                key={event.id} 
                className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg border"
              >
                {/* أيقونة المستخدم */}
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                >
                  {event.userName.charAt(0)}
                </div>
                
                {/* تفاصيل الحدث */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium font-arabic truncate">
                      {event.userName}
                    </span>
                    <span className="text-lg">
                      {getActionIcon(event.action)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-700 font-arabic mb-1">
                    {event.action}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* معلومات إضافية */}
        <div className="border-t pt-3 mt-4">
          <div className="text-xs text-gray-500 font-arabic space-y-1">
            <div>• التحديث تلقائي كل 3 ثوانٍ</div>
            <div>• آخر 20 حدث فقط يتم عرضها</div>
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};
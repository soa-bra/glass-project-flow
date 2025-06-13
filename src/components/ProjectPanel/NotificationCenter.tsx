
import React, { useState } from 'react';
import { Bell, Check, X, Clock, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'مهمة جديدة تم تعيينها',
    message: 'تم تعيين مهمة "تطوير واجهة المستخدم" لك',
    type: 'info',
    timestamp: '2025-06-13T10:30:00',
    read: false,
    actionRequired: true
  },
  {
    id: '2', 
    title: 'تم إنجاز مهمة',
    message: 'أحمد محمد أنهى مهمة "تصميم الواجهة الرئيسية"',
    type: 'success',
    timestamp: '2025-06-13T09:15:00',
    read: false
  },
  {
    id: '3',
    title: 'تحذير الميزانية',
    message: 'تم استخدام 80% من ميزانية المشروع',
    type: 'warning',
    timestamp: '2025-06-12T16:45:00',
    read: true
  },
  {
    id: '4',
    title: 'موعد اجتماع قادم',
    message: 'اجتماع مراجعة التقدم غداً الساعة 10:00 ص',
    type: 'info',
    timestamp: '2025-06-12T14:20:00',
    read: false,
    actionRequired: true
  }
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = mockNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'actionRequired'>('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'actionRequired':
        return notification.actionRequired && !notification.read;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'error': return <X size={16} className="text-red-600" />;
      default: return <Info size={16} className="text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-r-green-500 bg-green-50';
      case 'warning': return 'border-r-yellow-500 bg-yellow-50';
      case 'error': return 'border-r-red-500 bg-red-50';
      default: return 'border-r-blue-500 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  return (
    <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
      {/* رأس مركز الإشعارات */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-800 font-arabic">مركز الإشعارات</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-sky-600 hover:text-sky-800 transition-colors"
          >
            قراءة الكل
          </button>
        )}
      </div>

      {/* فلاتر الإشعارات */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filter === 'all' 
              ? 'bg-sky-500 text-white' 
              : 'bg-white/20 text-gray-600 hover:bg-white/30'
          }`}
        >
          الكل ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filter === 'unread' 
              ? 'bg-sky-500 text-white' 
              : 'bg-white/20 text-gray-600 hover:bg-white/30'
          }`}
        >
          غير مقروءة ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('actionRequired')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filter === 'actionRequired' 
              ? 'bg-sky-500 text-white' 
              : 'bg-white/20 text-gray-600 hover:bg-white/30'
          }`}
        >
          تتطلب إجراء ({actionRequiredCount})
        </button>
      </div>

      {/* قائمة الإشعارات */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">لا توجد إشعارات</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                relative p-4 rounded-lg border-r-4 transition-all
                ${getNotificationColor(notification.type)}
                ${notification.read ? 'opacity-60' : 'opacity-100'}
                hover:shadow-md
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getNotificationIcon(notification.type)}
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {notification.title}
                    </h4>
                    {notification.actionRequired && !notification.read && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        يتطلب إجراء
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{formatTimestamp(notification.timestamp)}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => onMarkAsRead?.(notification.id)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      title="تعليم كمقروء"
                    >
                      <Check size={14} className="text-green-600" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDismiss?.(notification.id)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="حذف"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

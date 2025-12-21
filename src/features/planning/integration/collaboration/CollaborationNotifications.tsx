/**
 * CollaborationNotifications - Sprint 17
 * إشعارات التعاون اللحظي
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, UserMinus, MousePointer2, Edit3, 
  Trash2, Move, Maximize2, Lock, Unlock 
} from 'lucide-react';

export type NotificationType = 
  | 'user_joined'
  | 'user_left'
  | 'element_created'
  | 'element_updated'
  | 'element_deleted'
  | 'element_moved'
  | 'element_resized'
  | 'element_locked'
  | 'element_unlocked';

export interface CollaborationNotification {
  id: string;
  type: NotificationType;
  userName: string;
  userColor: string;
  message?: string;
  timestamp: number;
}

interface CollaborationNotificationsProps {
  notifications: CollaborationNotification[];
  onDismiss?: (id: string) => void;
  maxVisible?: number;
  autoDismissTime?: number;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'user_joined':
      return UserPlus;
    case 'user_left':
      return UserMinus;
    case 'element_created':
      return Edit3;
    case 'element_updated':
      return Edit3;
    case 'element_deleted':
      return Trash2;
    case 'element_moved':
      return Move;
    case 'element_resized':
      return Maximize2;
    case 'element_locked':
      return Lock;
    case 'element_unlocked':
      return Unlock;
    default:
      return MousePointer2;
  }
};

const getNotificationMessage = (type: NotificationType, userName: string): string => {
  switch (type) {
    case 'user_joined':
      return `${userName} انضم إلى اللوحة`;
    case 'user_left':
      return `${userName} غادر اللوحة`;
    case 'element_created':
      return `${userName} أنشأ عنصراً جديداً`;
    case 'element_updated':
      return `${userName} عدّل عنصراً`;
    case 'element_deleted':
      return `${userName} حذف عنصراً`;
    case 'element_moved':
      return `${userName} نقل عنصراً`;
    case 'element_resized':
      return `${userName} غيّر حجم عنصر`;
    case 'element_locked':
      return `${userName} قفل عنصراً`;
    case 'element_unlocked':
      return `${userName} فتح قفل عنصر`;
    default:
      return `${userName} قام بإجراء`;
  }
};

export const CollaborationNotifications: React.FC<CollaborationNotificationsProps> = ({
  notifications,
  onDismiss,
  maxVisible = 3,
  autoDismissTime = 3000,
}) => {
  const [localNotifications, setLocalNotifications] = useState<CollaborationNotification[]>([]);

  // إضافة إشعارات جديدة
  useEffect(() => {
    const newNotifications = notifications.filter(
      n => !localNotifications.find(ln => ln.id === n.id)
    );
    
    if (newNotifications.length > 0) {
      setLocalNotifications(prev => [...newNotifications, ...prev].slice(0, maxVisible));
    }
  }, [notifications, localNotifications, maxVisible]);

  // إزالة تلقائية
  useEffect(() => {
    if (localNotifications.length === 0) return;

    const timer = setTimeout(() => {
      setLocalNotifications(prev => prev.slice(0, -1));
    }, autoDismissTime);

    return () => clearTimeout(timer);
  }, [localNotifications, autoDismissTime]);

  const handleDismiss = useCallback((id: string) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== id));
    onDismiss?.(id);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 w-80">
      <AnimatePresence mode="popLayout">
        {localNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const message = notification.message || getNotificationMessage(
            notification.type, 
            notification.userName
          );

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className="bg-white rounded-xl border border-border shadow-lg p-3 
                         flex items-center gap-3 cursor-pointer hover:bg-muted/30 
                         transition-colors"
              onClick={() => handleDismiss(notification.id)}
            >
              {/* أيقونة المستخدم */}
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: notification.userColor }}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>

              {/* المحتوى */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink-80 truncate">{message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.timestamp).toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* خط الحالة */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 rounded-b-xl"
                style={{ backgroundColor: notification.userColor }}
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: autoDismissTime / 1000, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CollaborationNotifications;

import React, { useState } from 'react';
import { UserCheck, UserX, Edit3, MessageSquare, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JoinRequest } from '@/hooks/useBoardInvites';

interface JoinRequestNotificationProps {
  request: JoinRequest;
  onApprove: (requestId: string, role: 'editor' | 'commenter' | 'viewer') => void;
  onReject: (requestId: string) => void;
}

type RoleOption = {
  value: 'editor' | 'commenter' | 'viewer';
  label: string;
  icon: React.ReactNode;
  description: string;
};

const roles: RoleOption[] = [
  {
    value: 'editor',
    label: 'تحرير',
    icon: <Edit3 size={14} />,
    description: 'يمكنه التعديل والإضافة',
  },
  {
    value: 'commenter',
    label: 'تعليق',
    icon: <MessageSquare size={14} />,
    description: 'يمكنه التعليق فقط',
  },
  {
    value: 'viewer',
    label: 'مشاهدة',
    icon: <Eye size={14} />,
    description: 'يمكنه المشاهدة فقط',
  },
];

export const JoinRequestNotification: React.FC<JoinRequestNotificationProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [showRoles, setShowRoles] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="p-3 bg-[#FFF4CC] border border-[#F6C445] rounded-xl"
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F6C445] flex items-center justify-center text-white font-bold text-sm">
          {request.requester_name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-sb-ink">
            {request.requester_name}
          </p>
          <p className="text-[11px] text-sb-ink-60">
            يطلب الانضمام • {formatTime(request.created_at)}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showRoles ? (
          <motion.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2 mt-3"
          >
            <button
              onClick={() => setShowRoles(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#3DBE8B] text-white text-[12px] font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <UserCheck size={14} />
              قبول
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-sb-ink-20 text-sb-ink text-[12px] font-medium rounded-lg hover:bg-sb-ink-30 transition-colors"
            >
              <UserX size={14} />
              رفض
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="roles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 space-y-2"
          >
            <p className="text-[11px] text-sb-ink-60 font-medium">اختر مستوى الصلاحية:</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => onApprove(request.id, role.value)}
                  className="flex flex-col items-center gap-1 p-2 bg-white border border-sb-border rounded-lg hover:border-[#3DBE8B] hover:bg-[#3DBE8B]/5 transition-colors group"
                >
                  <span className="text-sb-ink-60 group-hover:text-[#3DBE8B]">
                    {role.icon}
                  </span>
                  <span className="text-[11px] font-medium text-sb-ink group-hover:text-[#3DBE8B]">
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRoles(false)}
              className="w-full text-[11px] text-sb-ink-40 hover:text-sb-ink-60 py-1"
            >
              إلغاء
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

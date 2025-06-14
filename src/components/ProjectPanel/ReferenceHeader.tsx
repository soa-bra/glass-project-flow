
import React from 'react';
import { X } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';
import { ProjectMetaBadges } from './ProjectMetaBadges';

interface ReferenceHeaderProps {
  title: string;
  status: 'success' | 'warning' | 'error' | 'info';
  client?: string;
  dueDate?: string;
  onClose: () => void;
}

const statusColors = {
  success: '#00bb88',
  warning: '#ffb500', 
  error: '#f4767f',
  info: '#2f6ead'
};

const statusLabels = {
  success: 'مكتمل',
  warning: 'تحذير',
  error: 'خطأ',
  info: 'قيد التنفيذ'
};

export const ReferenceHeader: React.FC<ReferenceHeaderProps> = ({
  title,
  status,
  client,
  dueDate,
  onClose
}) => {
  const config = useLovableConfig();

  return (
    <div
      className="p-6 rounded-t-[20px]"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        borderBottom: 'none'
      }}
    >
      {/* الصف الأول - زر الإغلاق والعنوان */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: config.theme.glass.bg,
            backdropFilter: config.theme.glass.backdrop,
            border: config.theme.glass.border
          }}
          aria-label="إغلاق"
        >
          <X size={18} style={{ color: config.theme.colors.textPrimary }} />
        </button>
        
        <h1
          className="text-2xl font-bold text-center flex-1 mr-4"
          style={{
            fontFamily: config.theme.font,
            color: config.theme.colors.textPrimary
          }}
        >
          {title}
        </h1>
      </div>

      {/* الصف الثاني - شارات المعلومات */}
      <div className="flex justify-center">
        <ProjectMetaBadges
          status={statusLabels[status]}
          statusColor={statusColors[status]}
          client={client}
          dueDate={dueDate}
        />
      </div>
    </div>
  );
};


import React from 'react';
import { X } from 'lucide-react';
import { ProjectMetaBadges } from './ProjectMetaBadges';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface RedesignedPanelHeaderProps {
  title: string;
  status: 'success' | 'warning' | 'error' | 'info';
  client?: string;
  dueDate?: string;
  onClose: () => void;
}

export const RedesignedPanelHeader: React.FC<RedesignedPanelHeaderProps> = ({
  title,
  status,
  client,
  dueDate,
  onClose,
}) => {
  const config = useLovableConfig();

  const statusLabel = {
    success: 'مكتمل',
    warning: 'تحذير',
    error: 'خطأ',
    info: 'قيد التنفيذ'
  }[status];

  const statusColor = {
    success: config.theme.colors.success,
    warning: '#FFB300',
    error: config.theme.colors.danger,
    info: config.theme.colors.accent
  }[status];

  return (
    <div
      className="relative px-6 pt-8 pb-4 flex flex-col gap-2 rounded-t-[20px]"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        fontFamily: config.theme.font,
        borderBottom: config.theme.glass.border
      }}
    >
      <button
        aria-label="إغلاق"
        className="absolute top-5 left-5 w-10 h-10 rounded-full flex items-center justify-center bg-white/50 hover:bg-white/90 border border-white/30 shadow z-10 transition-all"
        style={{ backdropFilter: 'blur(16px)' }}
        onClick={onClose}
      >
        <X size={20} color={config.theme.colors.textPrimary} />
      </button>
      <div className="flex flex-col gap-2 items-end">
        <span
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: config.theme.font, color: config.theme.colors.textPrimary }}
        >
          {title}
        </span>
        <ProjectMetaBadges
          status={statusLabel}
          statusColor={statusColor}
          client={client}
          dueDate={dueDate}
        />
      </div>
    </div>
  );
};


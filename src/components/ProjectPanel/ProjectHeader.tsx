
import React from 'react';
import { X } from 'lucide-react';

interface ProjectHeaderProps {
  title: string;
  status: 'success' | 'warning' | 'error' | 'info';
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

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  status,
  onClose
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/10 backdrop-blur-[10px]">
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        aria-label="إغلاق"
      >
        <X size={18} className="text-gray-700" />
      </button>

      <div className="flex items-center gap-4">
        <div
          className="px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: statusColors[status] }}
        >
          {statusLabels[status]}
        </div>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-800 font-arabic mb-1">
            {title}
          </h1>
          <p className="text-sm text-gray-600 font-arabic">
            تطوير موقع سوبرا
          </p>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { useLovableConfig } from '../../hooks/useLovableConfig';
import { 
  FileText, 
  Users, 
  Calendar, 
  MessageCircle, 
  Settings 
} from 'lucide-react';

const quickActions = [
  { icon: FileText, label: 'الملفات', color: '#E91E63' },
  { icon: Users, label: 'الفريق', color: '#9C27B0' },
  { icon: Calendar, label: 'التقويم', color: '#673AB7' },
  { icon: MessageCircle, label: 'الرسائل', color: '#3F51B5' },
  { icon: Settings, label: 'الإعدادات', color: '#2196F3' }
];

export const ReferenceQuickActions: React.FC = () => {
  const config = useLovableConfig();

  return (
    <div
      className="mx-6 p-4 rounded-[20px] mb-6"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      <div className="grid grid-cols-5 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="group flex flex-col items-center p-3 rounded-[15px] transition-all duration-200 hover:scale-105"
            style={{
              background: `${action.color}15`,
              border: `1px solid ${action.color}30`
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: `${action.color}20` }}
            >
              <action.icon 
                size={16} 
                style={{ color: action.color }}
              />
            </div>
            <span
              className="text-xs font-medium"
              style={{
                fontFamily: config.theme.font,
                color: action.color
              }}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

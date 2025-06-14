
import React from 'react';
import { SoaBraBadge } from '../ui/SoaBraBadge';
import { Calendar } from 'lucide-react';

interface ProjectMetaBadgesProps {
  status: string;
  statusColor: string;
  client?: string;
  dueDate?: string;
}

export const ProjectMetaBadges: React.FC<ProjectMetaBadgesProps> = ({
  status,
  statusColor,
  client,
  dueDate,
}) => {
  return (
    <div className="flex flex-row-reverse gap-3 items-center mt-2">
      {status && (
        <SoaBraBadge
          variant="success"
          size="sm"
          className={`shadow-md font-bold tracking-tight`}
          // Apply color with Tailwind ring or use inline style here if really needed (backgroundColor)
          style={{ backgroundColor: statusColor, color: 'white' }}
        >
          {status}
        </SoaBraBadge>
      )}

      {client && (
        <SoaBraBadge
          variant="secondary"
          size="sm"
          className="shadow-md"
        >
          {client}
        </SoaBraBadge>
      )}

      {dueDate && (
        <span className="inline-flex items-center gap-1 px-3 py-0.5 text-xs rounded-full bg-white/50 text-gray-900 shadow font-medium" style={{fontFamily: 'IBM Plex Sans Arabic'}}>
          <Calendar size={14} className="ml-1" />
          {dueDate}
        </span>
      )}
    </div>
  );
};

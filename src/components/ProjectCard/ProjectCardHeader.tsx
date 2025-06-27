
import React from 'react';

interface ProjectCardHeaderProps {
  owner: string;
  deadline: string;
  dropdown?: React.ReactNode;
}

export const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({
  owner,
  deadline,
  dropdown
}) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {dropdown}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600 font-arabic mb-1">
            {owner}
          </div>
          <div className="text-xs text-gray-500 font-arabic">
            {deadline}
          </div>
        </div>
      </div>
    </div>
  );
};

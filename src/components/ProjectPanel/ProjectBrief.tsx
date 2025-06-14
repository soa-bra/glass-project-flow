
import React from 'react';

interface ProjectBriefProps {
  brief?: string;
}

export const ProjectBrief: React.FC<ProjectBriefProps> = ({ brief }) => {
  if (!brief) return null;
  return (
    <div
      className="px-6 pb-2 text-base rounded-b-[20px]"
      style={{
        fontFamily: 'IBM Plex Sans Arabic',
        color: '#555',
        textAlign: 'right'
      }}
    >
      {brief}
    </div>
  );
};

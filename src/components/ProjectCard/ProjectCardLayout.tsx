
import { ReactNode } from 'react';

const statusColors = {
  success: '#00bb88',
  warning: '#ffb500',
  error: '#f4767f',
  info: '#2f6ead'
};

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const ProjectCardLayout = ({
  children,
  id,
  status
}: ProjectCardLayoutProps) => {
  return (
    <div
      className="w-full rounded-[40px] p-4 transition-all duration-200 ease-in-out"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div>
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;

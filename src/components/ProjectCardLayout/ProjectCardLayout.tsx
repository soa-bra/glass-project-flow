
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
      className="glass-enhanced rounded-[40px] p-2 mx-auto my-1 opacity-100 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
    >
      <div>
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;

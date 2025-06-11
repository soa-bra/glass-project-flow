
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
      className="glass-enhanced rounded-[40px] p-2 w-full my-1 opacity-100 transition-all duration-200 ease-in-out"
    >
      <div>
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;

import { ReactNode } from 'react';
interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: (projectId: string) => void;
}
const ProjectCardLayout = ({
  children,
  id,
  isSelected = false,
  isOtherSelected = false,
  onProjectSelect
}: ProjectCardLayoutProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onProjectSelect) {
      onProjectSelect(id);
    }
  };
  const getCardClasses = () => {
    const baseClasses = 'project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer';
    if (isSelected) {
      return `${baseClasses} project-card-selected`;
    }
    if (isOtherSelected) {
      return `${baseClasses} project-card-dimmed`;
    }
    return baseClasses;
  };
  return;
};
export default ProjectCardLayout;

import { useState } from 'react';

export const useDepartmentsSidebar = () => {
  const [isDepartmentsSidebarVisible, setIsDepartmentsSidebarVisible] = useState(false);

  const openDepartmentsSidebar = () => {
    setIsDepartmentsSidebarVisible(true);
  };

  const closeDepartmentsSidebar = () => {
    setIsDepartmentsSidebarVisible(false);
  };

  const toggleDepartmentsSidebar = () => {
    setIsDepartmentsSidebarVisible(prev => !prev);
  };

  return {
    isDepartmentsSidebarVisible,
    openDepartmentsSidebar,
    closeDepartmentsSidebar,
    toggleDepartmentsSidebar
  };
};

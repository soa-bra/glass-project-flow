
import React, { createContext, useContext, useState } from 'react';

interface DepartmentsPanelContextType {
  isPanelOpen: boolean;
  togglePanel: () => void;
  closePanelIfOpen: () => void;
}

const DepartmentsPanelContext = createContext<DepartmentsPanelContextType | undefined>(undefined);

export const useDepartmentsPanel = () => {
  const context = useContext(DepartmentsPanelContext);
  if (context === undefined) {
    throw new Error('useDepartmentsPanel must be used within a DepartmentsPanelProvider');
  }
  return context;
};

interface DepartmentsPanelProviderProps {
  children: React.ReactNode;
}

export const DepartmentsPanelProvider: React.FC<DepartmentsPanelProviderProps> = ({ children }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
  };

  const closePanelIfOpen = () => {
    if (isPanelOpen) {
      setIsPanelOpen(false);
    }
  };

  return (
    <DepartmentsPanelContext.Provider value={{
      isPanelOpen,
      togglePanel,
      closePanelIfOpen
    }}>
      {children}
    </DepartmentsPanelContext.Provider>
  );
};

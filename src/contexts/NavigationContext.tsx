import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationState {
  activeSection: string;
  selectedDepartment: string | null;
  selectedCustomer: string | null;
}

interface NavigationContextType {
  navigationState: NavigationState;
  setActiveSection: (section: string) => void;
  setSelectedDepartment: (department: string | null) => void;
  setSelectedCustomer: (customerId: string | null) => void;
  navigateToCustomerDetails: (customerId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    activeSection: 'home',
    selectedDepartment: null,
    selectedCustomer: null,
  });

  const setActiveSection = (section: string) => {
    setNavigationState(prev => ({ ...prev, activeSection: section }));
  };

  const setSelectedDepartment = (department: string | null) => {
    setNavigationState(prev => ({ ...prev, selectedDepartment: department }));
  };

  const setSelectedCustomer = (customerId: string | null) => {
    setNavigationState(prev => ({ ...prev, selectedCustomer: customerId }));
  };

  const navigateToCustomerDetails = (customerId: string) => {
    setNavigationState({
      activeSection: 'departments',
      selectedDepartment: 'crm',
      selectedCustomer: customerId,
    });
  };

  return (
    <NavigationContext.Provider
      value={{
        navigationState,
        setActiveSection,
        setSelectedDepartment,
        setSelectedCustomer,
        navigateToCustomerDetails,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
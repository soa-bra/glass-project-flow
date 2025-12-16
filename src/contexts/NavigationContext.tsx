// src/contexts/NavigationContext.tsx
import * as React from "react";

type NavigationStateData = {
  activeSection: string;
  selectedDepartment: string | null;
  selectedCustomer: string | null;
};

type NavigationState = {
  navigationState: NavigationStateData;
  setActiveSection: (section: string) => void;
  setSelectedDepartment: (department: string | null) => void;
  navigateToCustomerDetails: (customerId: string) => void;
};

const NavigationContext = React.createContext<NavigationState | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = React.useState<NavigationStateData>({
    activeSection: "home",
    selectedDepartment: null,
    selectedCustomer: null,
  });

  const setActiveSection = React.useCallback((section: string) => {
    setNavigationState((prev) => ({ ...prev, activeSection: section }));
  }, []);

  const setSelectedDepartment = React.useCallback((department: string | null) => {
    setNavigationState((prev) => ({ ...prev, selectedDepartment: department }));
  }, []);

  const navigateToCustomerDetails = React.useCallback((customerId: string) => {
    setNavigationState((prev) => ({
      ...prev,
      activeSection: "departments",
      selectedDepartment: "crm",
      selectedCustomer: customerId,
    }));
  }, []);

  const value = React.useMemo<NavigationState>(
    () => ({
      navigationState,
      setActiveSection,
      setSelectedDepartment,
      navigateToCustomerDetails,
    }),
    [navigationState, setActiveSection, setSelectedDepartment, navigateToCustomerDetails],
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = (): NavigationState => {
  const ctx = React.useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return ctx;
};

export default NavigationContext;

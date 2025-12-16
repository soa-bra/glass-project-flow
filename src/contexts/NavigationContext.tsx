// src/contexts/NavigationContext.tsx
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode, FC } from "react";

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

const NavigationContext = createContext<NavigationState | null>(null);

export const NavigationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationStateData>({
    activeSection: "home",
    selectedDepartment: null,
    selectedCustomer: null,
  });

  const setActiveSection = useCallback((section: string) => {
    setNavigationState((prev) => ({ ...prev, activeSection: section }));
  }, []);

  const setSelectedDepartment = useCallback((department: string | null) => {
    setNavigationState((prev) => ({ ...prev, selectedDepartment: department }));
  }, []);

  const navigateToCustomerDetails = useCallback((customerId: string) => {
    setNavigationState((prev) => ({
      ...prev,
      activeSection: "departments",
      selectedDepartment: "crm",
      selectedCustomer: customerId,
    }));
  }, []);

  const value = useMemo<NavigationState>(
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
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return ctx;
};

export default NavigationContext;

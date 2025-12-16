// src/contexts/NavigationContext.tsx
import * as React from "react";

type NavigationState = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const NavigationContext = React.createContext<NavigationState | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = React.useState<string>("home");

  const value = React.useMemo<NavigationState>(
    () => ({
      activeSection,
      setActiveSection,
    }),
    [activeSection],
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

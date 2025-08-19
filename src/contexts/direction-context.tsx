import React, { createContext, useContext, useEffect, useState } from 'react';

export type Direction = 'ltr' | 'rtl';

interface DirectionContextType {
  direction: Direction;
  setDirection: (direction: Direction) => void;
  isRTL: boolean;
  toggleDirection: () => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export interface DirectionProviderProps {
  children: React.ReactNode;
  defaultDirection?: Direction;
}

export function DirectionProvider({ children, defaultDirection = 'rtl' }: DirectionProviderProps) {
  const [direction, setDirection] = useState<Direction>(defaultDirection);
  const isRTL = direction === 'rtl';

  // Update document direction and lang attribute
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
    
    // Add direction class for CSS targeting
    document.documentElement.classList.remove('ltr', 'rtl');
    document.documentElement.classList.add(direction);
  }, [direction]);

  const toggleDirection = () => {
    setDirection(prev => prev === 'rtl' ? 'ltr' : 'rtl');
  };

  const value = {
    direction,
    setDirection,
    isRTL,
    toggleDirection,
  };

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
}

// Hook for conditional rendering based on direction
export function useDirectionClasses() {
  const { isRTL } = useDirection();
  
  return {
    float: {
      start: isRTL ? 'float-right' : 'float-left',
      end: isRTL ? 'float-left' : 'float-right',
    },
    text: {
      start: isRTL ? 'text-right' : 'text-left',
      end: isRTL ? 'text-left' : 'text-right',
    },
    margin: {
      start: isRTL ? 'mr' : 'ml',
      end: isRTL ? 'ml' : 'mr',
    },
    padding: {
      start: isRTL ? 'pr' : 'pl',
      end: isRTL ? 'pl' : 'pr',
    },
    border: {
      start: isRTL ? 'border-r' : 'border-l',
      end: isRTL ? 'border-l' : 'border-r',
    },
    rounded: {
      start: isRTL ? 'rounded-r' : 'rounded-l',
      end: isRTL ? 'rounded-l' : 'rounded-r',
    }
  };
}
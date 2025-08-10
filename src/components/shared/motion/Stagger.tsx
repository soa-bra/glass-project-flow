import React from 'react';
import { motion } from 'framer-motion';

interface StaggerProps {
  children: React.ReactNode;
  delay?: number;
  gap?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}

interface StaggerItemProps {
  children: React.ReactNode;
  y?: number;
  duration?: number;
  ease?: [number, number, number, number];
  className?: string;
}

const StaggerContext = React.createContext<{
  delay: number;
  gap: number;
  once: boolean;
  amount: number;
}>({
  delay: 0,
  gap: 0.08,
  once: true,
  amount: 0.2
});

export const Stagger: React.FC<StaggerProps> & {
  Item: React.FC<StaggerItemProps>;
} = ({
  children,
  delay = 0,
  gap = 0.08,
  once = true,
  amount = 0.2,
  className = ''
}) => {
  return (
    <StaggerContext.Provider value={{ delay, gap, once, amount }}>
      <div className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
};

const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  y = 24,
  duration = 0.7,
  ease = [0.22, 1, 0.36, 1],
  className = ''
}) => {
  const { delay, gap, once, amount } = React.useContext(StaggerContext);
  const [index, setIndex] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current && ref.current.parentElement) {
      const siblings = Array.from(ref.current.parentElement.children);
      const itemIndex = siblings.indexOf(ref.current);
      setIndex(itemIndex);
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: y
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: once,
        amount: amount
      }}
      transition={{
        duration: duration,
        delay: delay + (index * gap),
        ease: ease
      }}
    >
      {children}
    </motion.div>
  );
};

Stagger.Item = StaggerItem;
import React from 'react';
import { motion } from 'framer-motion';

interface SoaStaggerProps {
  children: React.ReactNode;
  delay?: number;
  gap?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}

interface SoaStaggerItemProps {
  children: React.ReactNode;
  y?: number;
  duration?: number;
  ease?: [number, number, number, number];
  className?: string;
}

const SoaStaggerContext = React.createContext<{
  delay: number;
  gap: number;
  once: boolean;
  amount: number;
}>({
  delay: 0,
  gap: 0.08, // Using SoaBra design token value
  once: true,
  amount: 0.2
});

export const SoaStagger: React.FC<SoaStaggerProps> & {
  Item: React.FC<SoaStaggerItemProps>;
} = ({
  children,
  delay = 0,
  gap = 0.08, // Using SoaBra design token value
  once = true,
  amount = 0.2,
  className = ''
}) => {
  return (
    <SoaStaggerContext.Provider value={{ delay, gap, once, amount }}>
      <div className={className}>
        {children}
      </div>
    </SoaStaggerContext.Provider>
  );
};

const SoaStaggerItem: React.FC<SoaStaggerItemProps> = ({
  children,
  y = 24, // Using SoaBra design token value
  duration = 0.7, // Using SoaBra design token value
  ease = [0.22, 1, 0.36, 1], // Using SoaBra design token value
  className = ''
}) => {
  const { delay, gap, once, amount } = React.useContext(SoaStaggerContext);
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

SoaStagger.Item = SoaStaggerItem;
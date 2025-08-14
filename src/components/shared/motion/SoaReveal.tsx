import React from 'react';
import { motion } from 'framer-motion';

interface SoaRevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  ease?: [number, number, number, number];
  once?: boolean;
  amount?: number;
  className?: string;
}

export const SoaReveal: React.FC<SoaRevealProps> = ({
  children,
  delay = 0,
  y = 24, // Using SoaBra design token value
  duration = 0.7, // Using SoaBra design token value
  ease = [0.22, 1, 0.36, 1], // Using SoaBra design token value
  once = true,
  amount = 0.2,
  className = ''
}) => {
  return (
    <motion.div
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
        delay: delay,
        ease: ease
      }}
    >
      {children}
    </motion.div>
  );
};
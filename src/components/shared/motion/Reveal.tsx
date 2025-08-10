import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  ease?: [number, number, number, number];
  once?: boolean;
  amount?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 48,
  duration = 1.2,
  ease = [0.25, 0.46, 0.45, 0.94],
  once = true,
  amount = 0.15,
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
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// SoaBra Motion Configuration
const soabraMotionConfig = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  reveal: {
    y: 24,
    duration: 0.7,
    delay: 0,
    once: true,
    amount: 0.2
  },
  stagger: {
    gap: 0.08,
    child: {
      y: 24,
      duration: 0.7
    }
  }
};

interface SoaMotionProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  variant?: 'reveal' | 'scale' | 'fade' | 'slide';
  delay?: number;
  duration?: number;
  y?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const SoaMotion: React.FC<SoaMotionProps> = ({
  children,
  className,
  variant = 'reveal',
  delay = 0,
  duration = 0.7,
  y = 24,
  direction = 'up',
  ...props
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'reveal':
        return {
          initial: { opacity: 0, y: y },
          animate: { opacity: 1, y: 0 },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case 'slide':
        const slideConfig = {
          up: { opacity: 0, y: y },
          down: { opacity: 0, y: -y },
          left: { opacity: 0, x: y },
          right: { opacity: 0, x: -y }
        };
        return {
          initial: slideConfig[direction],
          animate: { opacity: 1, x: 0, y: 0 },
        };
      default:
        return {
          initial: { opacity: 0, y: y },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const config = getVariantConfig();

  return (
    <motion.div
      className={className}
      initial={config.initial}
      whileInView={config.animate}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: soabraMotionConfig.ease
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Interactive Animation Components
interface SoaHoverProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export const SoaHover: React.FC<SoaHoverProps> = ({
  children,
  className,
  scale = 1.02
}) => {
  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      whileHover={{ scale }}
      transition={{ duration: 0.2, ease: soabraMotionConfig.ease }}
    >
      {children}
    </motion.div>
  );
};

// Press Animation
interface SoaPressProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export const SoaPress: React.FC<SoaPressProps> = ({
  children,
  className,
  scale = 0.98
}) => {
  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      whileTap={{ scale }}
      transition={{ duration: 0.1, ease: soabraMotionConfig.ease }}
    >
      {children}
    </motion.div>
  );
};

// Reveal Component
interface SoaRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export const SoaReveal: React.FC<SoaRevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.7,
  y = 24
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: soabraMotionConfig.ease
      }}
    >
      {children}
    </motion.div>
  );
};

// Combined Interactive Component
interface SoaInteractiveProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  pressScale?: number;
  disabled?: boolean;
}

export const SoaInteractive: React.FC<SoaInteractiveProps> = ({
  children,
  className,
  hoverScale = 1.02,
  pressScale = 0.98,
  disabled = false
}) => {
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: pressScale }}
      transition={{ duration: 0.2, ease: soabraMotionConfig.ease }}
    >
      {children}
    </motion.div>
  );
};

// Export Motion with Reveal attached
export const SoaMotionWithReveal = Object.assign(SoaMotion, {
  Reveal: SoaReveal
});
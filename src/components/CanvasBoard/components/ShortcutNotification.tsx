import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShortcutIndicator } from './ShortcutIndicator';

interface ShortcutNotificationProps {
  toolName: string;
  shortcut: string;
  show: boolean;
  onHide: () => void;
}

export const ShortcutNotification: React.FC<ShortcutNotificationProps> = ({
  toolName,
  shortcut,
  show,
  onHide
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 2000); // إخفاء الإشعار بعد ثانيتين

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-black/90 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{toolName}</span>
              <ShortcutIndicator 
                shortcut={shortcut} 
                className="bg-white/20 text-white border-white/30" 
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
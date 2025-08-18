import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MoreHorizontal, Edit, Archive, Trash } from 'lucide-react';
import { Project } from '@/types/project';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';

interface TabItem {
  id: string;
  label: string;
}

interface ProjectManagementHeaderProps {
  project: Project;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onEdit: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: TabItem[];
}

export const ProjectManagementHeader: React.FC<ProjectManagementHeaderProps> = ({
  onClose,
  onDelete,
  onArchive,
  onEdit,
  activeTab,
  onTabChange,
  tabs
}) => {
  const animatedTabItems = tabs.map(tab => ({
    value: tab.id,
    label: tab.label
  }));

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-shrink-0 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-[#2A3437] font-arabic text-3xl my-[12px]">
          إدارة المشروع
        </h1>

        <div className="flex-1 flex justify-center">
          <div className="w-fit">
            <AnimatedTabs tabs={animatedTabItems} activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* زر القائمة */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(v => !v)}
              className="w-[50px] h-[50px] bg-transparent border border-black rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20 text-black"
            >
              <motion.span
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut", type: "spring", stiffness: 300, damping: 20 }}
              >
                <MoreHorizontal className="w-5 h-5 text-black" strokeWidth={1.2} />
              </motion.span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, filter: "blur(16px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 8, filter: "blur(16px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute top-[60px] left-0 mt-2 z-[9999]"
                >
                  <div className="flex flex-col items-start gap-2 w-56">
                    <motion.button
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, delay: 0 }}
                      onClick={() => { onEdit(); setOpen(false); }}
                      className="flex items-center gap-2 text-gray-900 font-medium cursor-pointer px-4 py-3 w-full text-right rounded-2xl hover:bg-white/70"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(40px) saturate(200%)",
                        WebkitBackdropFilter: "blur(40px) saturate(200%)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        backgroundImage: "url('data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8DwQACfsD/QrF6eYAAAAASUVORK5CYII=')"
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      تعديل المشروع
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, delay: 0.05 }}
                      onClick={() => { onArchive(); setOpen(false); }}
                      className="flex items-center gap-2 text-gray-900 font-medium cursor-pointer px-4 py-3 w-full text-right rounded-2xl hover:bg-white/70"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(40px) saturate(200%)",
                        WebkitBackdropFilter: "blur(40px) saturate(200%)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        backgroundImage: "url('data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8DwQACfsD/QrF6eYAAAAASUVORK5CYII=')"
                      }}
                    >
                      <Archive className="w-4 h-4" />
                      أرشفة المشروع
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, delay: 0.1 }}
                      onClick={() => { onDelete(); setOpen(false); }}
                      className="flex items-center gap-2 text-red-600 font-medium cursor-pointer px-4 py-3 w-full text-right rounded-2xl hover:bg-red-100"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(40px) saturate(200%)",
                        WebkitBackdropFilter: "blur(40px) saturate(200%)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        backgroundImage: "url('data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8DwQACfsD/QrF6eYAAAAASUVORK5CYII=')"
                      }}
                    >
                      <Trash className="w-4 h-4" />
                      حذف المشروع
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="w-[50px] h-[50px] bg-transparent border border-black rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

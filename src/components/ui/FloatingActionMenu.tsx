"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
};

const FloatingActionMenu = ({ options = [], className = "" }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((v) => !v);

  return (
    <div className={cn("fixed bottom-8 right-8", className)}>
      <Button
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full bg-transparent border border-black shadow-sm flex items-center justify-center
                   hover:bg-transparent focus:bg-transparent active:bg-transparent focus-visible:ring-0"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {/* نقاط أنحف + سوداء */}
          <Ellipsis className="w-5 h-5 text-black" strokeWidth={1.2} />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="absolute top-12 right-0 mt-2"
          >
            <div className="flex flex-col items-end gap-2">
              {(options ?? []).map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Button
                    onClick={option.onClick}
                    size="sm"
                    className="flex items-center gap-2 border-none text-black
                               hover:bg-[rgba(255,255,255,0.4)]
                               focus:bg-[rgba(255,255,255,0.4)]
                               active:bg-[rgba(255,255,255,0.4)]
                               focus-visible:ring-0"
                    style={{
                      background: "rgba(255,255,255,0.4)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "24px",
                      boxShadow:
                        "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;
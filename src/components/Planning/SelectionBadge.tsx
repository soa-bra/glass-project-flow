/**
 * Selection Badge - شارة التحديد المحسّنة مثل Miro
 * 
 * تعرض:
 * - عدد العناصر المحددة
 * - أزرار إجراءات سريعة (تجميع، حذف، محاذاة، نسخ)
 * - تأثيرات حركية جميلة
 */

import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '@/stores/canvasStore';
import { canvasKernel, type Bounds } from '@/core/canvasKernel';
import { 
  Group, 
  Ungroup, 
  Trash2, 
  Copy, 
  AlignLeft, 
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  MoreHorizontal,
  Lock,
  Unlock,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

interface SelectionBadgeProps {
  viewport: { zoom: number; pan: { x: number; y: number } };
}

export const SelectionBadge: React.FC<SelectionBadgeProps> = ({ viewport }) => {
  const { 
    selectedElementIds, 
    elements,
    groupElements,
    ungroupElements,
    deleteElements,
    copyElements,
    alignElements,
    lockElements,
    unlockElements
  } = useCanvasStore();
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  // حساب العناصر المحددة
  const selectedElements = useMemo(() => 
    elements.filter(el => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds]
  );
  
  // التحقق من إمكانية التجميع
  const canGroup = useMemo(() => {
    if (selectedElements.length < 2) return false;
    // لا يمكن تجميع عناصر مجمعة بالفعل
    return !selectedElements.some(el => el.groupId);
  }, [selectedElements]);
  
  // التحقق من إمكانية فك التجميع
  const canUngroup = useMemo(() => {
    return selectedElements.some(el => el.groupId);
  }, [selectedElements]);
  
  // التحقق من حالة القفل
  const hasLockedElements = useMemo(() => 
    selectedElements.some(el => el.locked),
    [selectedElements]
  );
  
  const hasUnlockedElements = useMemo(() => 
    selectedElements.some(el => !el.locked),
    [selectedElements]
  );
  
  // حساب الحدود
  const bounds = useMemo((): Bounds & { centerX: number; centerY: number } => {
    if (selectedElements.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
    }
    return canvasKernel.calculateBounds(selectedElements);
  }, [selectedElements]);
  
  // ============= الإجراءات =============
  
  const handleGroup = useCallback(() => {
    if (canGroup) {
      groupElements(selectedElementIds);
    }
  }, [canGroup, groupElements, selectedElementIds]);
  
  const handleUngroup = useCallback(() => {
    if (canUngroup) {
      // نحصل على groupId من أول عنصر مجمع
      const groupedElement = selectedElements.find(el => el.groupId);
      if (groupedElement?.groupId) {
        ungroupElements(groupedElement.groupId);
      }
    }
  }, [canUngroup, ungroupElements, selectedElements]);
  
  const handleDelete = useCallback(() => {
    deleteElements(selectedElementIds);
  }, [deleteElements, selectedElementIds]);
  
  const handleCopy = useCallback(() => {
    copyElements(selectedElementIds);
  }, [copyElements, selectedElementIds]);
  
  const handleAlign = useCallback((alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    alignElements(selectedElementIds, alignment);
  }, [alignElements, selectedElementIds]);
  
  const handleLock = useCallback(() => {
    lockElements(selectedElementIds);
  }, [lockElements, selectedElementIds]);
  
  const handleUnlock = useCallback(() => {
    unlockElements(selectedElementIds);
  }, [unlockElements, selectedElementIds]);
  
  // ============= العرض =============
  
  if (selectedElements.length === 0) return null;
  
  // حساب موقع الشارة (أسفل الإطار المحيط)
  const badgeY = bounds.y + bounds.height + 16;
  const badgeX = bounds.centerX;
  
  const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
    variant?: 'default' | 'danger';
  }> = ({ onClick, icon, label, disabled = false, variant = 'default' }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        p-2 rounded-lg transition-colors touch-none
        ${disabled 
          ? 'opacity-40 cursor-not-allowed' 
          : variant === 'danger'
            ? 'hover:bg-[hsl(var(--accent-red)/0.15)] text-[hsl(var(--accent-red))]'
            : 'hover:bg-[hsl(var(--ink)/0.08)]'
        }
      `}
      title={label}
    >
      {icon}
    </motion.button>
  );
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute pointer-events-auto z-50"
        style={{
          left: badgeX,
          top: badgeY,
          transform: 'translateX(-50%)'
        }}
      >
        <div 
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-lg border touch-none"
          style={{
            background: 'hsl(var(--glass-modal-bg, var(--background)))',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderColor: 'hsl(var(--border) / 0.6)'
          }}
        >
          {/* عداد العناصر */}
          <div 
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer select-none"
            style={{ background: 'hsl(var(--accent-blue) / 0.1)' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span 
              className="text-sm font-semibold"
              style={{ color: 'hsl(var(--accent-blue))' }}
            >
              {selectedElements.length}
            </span>
            <span 
              className="text-xs"
              style={{ color: 'hsl(var(--ink-60))' }}
            >
              عنصر
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} style={{ color: 'hsl(var(--ink-60))' }} />
            </motion.div>
          </div>
          
          {/* الفاصل */}
          <div 
            className="w-px h-6 mx-1"
            style={{ background: 'hsl(var(--border))' }}
          />
          
          {/* أزرار الإجراءات الأساسية */}
          <div className="flex items-center gap-0.5">
            {/* تجميع / فك التجميع */}
            {canUngroup ? (
              <ActionButton
                onClick={handleUngroup}
                icon={<Ungroup size={18} />}
                label="فك التجميع"
              />
            ) : (
              <ActionButton
                onClick={handleGroup}
                icon={<Group size={18} />}
                label="تجميع"
                disabled={!canGroup}
              />
            )}
            
            {/* نسخ */}
            <ActionButton
              onClick={handleCopy}
              icon={<Copy size={18} />}
              label="نسخ"
            />
            
            {/* قائمة المحاذاة */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.08)] touch-none"
                  title="محاذاة"
                >
                  <AlignCenter size={18} />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="min-w-[160px]">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <AlignLeft className="ml-2 h-4 w-4" />
                    <span>أفقي</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleAlign('left')}>
                      <AlignLeft className="ml-2 h-4 w-4" />
                      <span>لليسار</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAlign('center')}>
                      <AlignCenter className="ml-2 h-4 w-4" />
                      <span>للوسط</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAlign('right')}>
                      <AlignRight className="ml-2 h-4 w-4" />
                      <span>لليمين</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <AlignStartVertical className="ml-2 h-4 w-4" />
                    <span>رأسي</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleAlign('top')}>
                      <AlignStartVertical className="ml-2 h-4 w-4" />
                      <span>للأعلى</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAlign('middle')}>
                      <AlignCenterVertical className="ml-2 h-4 w-4" />
                      <span>للوسط</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAlign('bottom')}>
                      <AlignEndVertical className="ml-2 h-4 w-4" />
                      <span>للأسفل</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* قفل / فتح القفل */}
            {hasLockedElements ? (
              <ActionButton
                onClick={handleUnlock}
                icon={<Unlock size={18} />}
                label="فتح القفل"
              />
            ) : (
              <ActionButton
                onClick={handleLock}
                icon={<Lock size={18} />}
                label="قفل"
              />
            )}
            
            {/* حذف */}
            <ActionButton
              onClick={handleDelete}
              icon={<Trash2 size={18} />}
              label="حذف"
              variant="danger"
            />
          </div>
        </div>
        
        {/* قائمة موسعة (اختياري) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-2 rounded-xl shadow-lg border overflow-hidden"
              style={{
                background: 'hsl(var(--glass-modal-bg, var(--background)))',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                borderColor: 'hsl(var(--border) / 0.6)'
              }}
            >
              <div className="text-xs space-y-1" style={{ color: 'hsl(var(--ink-60))' }}>
                <div className="flex justify-between">
                  <span>الموقع:</span>
                  <span className="font-mono">
                    ({Math.round(bounds.x)}, {Math.round(bounds.y)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>الحجم:</span>
                  <span className="font-mono">
                    {Math.round(bounds.width)} × {Math.round(bounds.height)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionBadge;

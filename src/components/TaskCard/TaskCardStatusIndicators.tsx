import React, { useState, useRef } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EllipsisVertical, Check, Edit, Archive, Trash, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TaskData } from '@/types';
interface TaskCardStatusIndicatorsProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  taskId: string;
  taskData?: TaskData;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onSelect?: (taskId: string) => void;
  onEdit?: (taskId: string, taskData?: TaskData) => void;
  onArchive?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}
const TaskCardStatusIndicators = ({
  status,
  statusColor,
  date,
  assignee,
  members,
  taskId,
  taskData,
  isSelected = false,
  isSelectionMode = false,
  onSelect,
  onEdit,
  onArchive,
  onDelete
}: TaskCardStatusIndicatorsProps) => {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pillStyle = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DADCE0',
    borderRadius: '15px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic',
    height: '20px'
  };
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // تعديل المهمة
    onEdit?.(taskId, taskData);
  };
  const handleArchive = () => {
    setShowArchiveDialog(false);
    // أرشفة المهمة
    onArchive?.(taskId);
  };
  const handleDelete = () => {
    setShowDeleteDialog(false);
    // حذف المهمة
    onDelete?.(taskId);
  };
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return <>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      flexWrap: 'wrap',
      marginTop: '8px'
    }}>
        <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
          <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColor
        }}></div>
          {status}
        </div>

        <div style={pillStyle}>{date}</div>
        <div style={pillStyle}>{assignee}</div>
        <div style={pillStyle}>{members}</div>
        
        {/* أيقونة التحديد أو قائمة النقاط الثلاث */}
        {isSelectionMode ? <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        padding: '0',
        border: isSelected ? 'none' : '1px solid #858789',
        backgroundColor: isSelected ? '#858789' : 'transparent',
        color: isSelected ? '#fff' : '#858789'
      }}>
            {isSelected ? <Check size={12} color="white" /> : null}
          </div> : <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(v => !v);
              }}
              style={{
                ...pillStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                padding: '0',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <motion.span
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut", type: "spring", stiffness: 300, damping: 20 }}
              >
                <EllipsisVertical size={12} color="#858789" />
              </motion.span>
            </button>
                
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute top-[25px] left-0 mt-2 z-[9999]"
                >
                  <div className="flex flex-col items-start gap-2 w-32">
                    {/*تعديل*/}
                    <motion.button
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, delay: 0 }}
                      onClick={(e) => { 
                        e.stopPropagation();
                        onEdit?.(taskId, taskData);
                        setOpen(false); 
                      }}
                      className="flex items-center gap-2 relative overflow-hidden text-gray-800 cursor-pointer px-3 py-2 w-full text-right rounded-3xl hover:bg-white/60 text-xs"
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px) saturate(1.1)',
                        WebkitBackdropFilter: 'blur(10px) saturate(1.1)',
                        border: '1px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.3)',
                      }}
                    >
                      {/* نويز خفيف فوق الزجاج */}
                      <span
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                          backgroundImage:
                            'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
                          backgroundSize: '3px 3px, 5px 5px',
                          mixBlendMode: 'overlay',
                          opacity: 0.8
                        }}
                      />
                      <Edit className="w-3 h-3" />
                      تعديل
                    </motion.button>
                        
                    {/* أرشفة*/}
                    <motion.button
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, delay: 0.05 }}
                      onClick={(e) => { 
                        e.stopPropagation();
                        setShowArchiveDialog(true);
                        setOpen(false); 
                      }}
                      className="flex items-center gap-2 relative overflow-hidden text-gray-800 cursor-pointer px-3 py-2 w-full text-right rounded-3xl hover:bg-white/60 text-xs"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.7)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.3)',
                      }}
                    >
                      <span
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                          backgroundImage:
                            'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
                          backgroundSize: '3px 3px, 5px 5px',
                          mixBlendMode: 'overlay',
                          opacity: 0.8
                        }}
                      />
                      <Archive className="w-3 h-3" />
                      أرشفة
                    </motion.button>
                        
                    {/*حذف*/}
                    <motion.button
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, delay: 0.1 }}
                      onClick={(e) => { 
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                        setOpen(false); 
                      }}
                      className="flex items-center gap-2 relative overflow-hidden text-red-600 cursor-pointer px-3 py-2 w-full text-right rounded-3xl hover:bg-red-50 text-xs"
                      style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px) saturate(1.1)',
                        WebkitBackdropFilter: 'blur(8px) saturate(1.1)',
                        border: '1px solid rgba(255,255,255,0.7)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.3)',
                      }}
                    >
                      <span
                        className="absolute inset-0 pointer-events-none rounded-3xl"
                        style={{
                          backgroundImage:
                            'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
                          backgroundSize: '3px 3px, 5px 5px',
                          mixBlendMode: 'overlay',
                          opacity: 0.8
                        }}
                      />
                      <Trash className="w-3 h-3" />
                      حذف
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>}
      </div>

      {/* حوار تأكيد الأرشفة */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent 
          className="font-arabic" 
          dir="rtl"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد أرشفة المهمة</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من أنك تريد أرشفة هذه المهمة؟ يمكنك استعادتها لاحقاً من الأرشيف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button 
              onClick={() => setShowArchiveDialog(false)} 
              className="bg-white/30 hover:bg-white/40 border border-black/20 text-black font-medium font-arabic rounded-full px-6 py-2 flex items-center gap-2"
            >
              <X size={16} />
              إلغاء
            </button>
            <button 
              onClick={handleArchive} 
              className="bg-black hover:bg-black/90 text-white font-medium font-arabic rounded-full px-6 py-2 flex items-center gap-2"
            >
              <Archive size={16} />
              أرشفة
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* حوار تأكيد الحذف */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent 
          className="font-arabic" 
          dir="rtl"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد حذف المهمة</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من أنك تريد حذف هذه المهمة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button 
              onClick={() => setShowDeleteDialog(false)} 
              className="bg-white/30 hover:bg-white/40 border border-black/20 text-black font-medium font-arabic rounded-full px-6 py-2 flex items-center gap-2"
            >
              <X size={16} />
              إلغاء
            </button>
            <button 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600 text-white font-medium font-arabic rounded-full px-6 py-2 flex items-center gap-2"
            >
              <Trash2 size={16} />
              حذف نهائي
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};
export default TaskCardStatusIndicators;
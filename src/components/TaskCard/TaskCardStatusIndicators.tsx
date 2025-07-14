
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EllipsisVertical, Check } from 'lucide-react';

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

  const pillStyle = {
    backgroundColor: '#F7FFFF',
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
    console.log('تعديل المهمة:', taskId);
    onEdit?.(taskId, taskData);
  };

  const handleArchive = () => {
    setShowArchiveDialog(false);
    console.log('أرشفة المهمة:', taskId);
    onArchive?.(taskId);
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    console.log('حذف المهمة:', taskId);
    onDelete?.(taskId);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
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
        
        {/* أيقونة التحديد */}
        <div
          style={{
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
          }}
        >
          {isSelected ? (
            <Check size={12} color="white" />
          ) : null}
        </div>
      </div>

      {/* حوار تأكيد الأرشفة */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="font-arabic" style={{ direction: 'rtl' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الأرشفة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد أرشفة هذه المهمة؟ يمكنك استعادتها لاحقاً من الأرشيف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>أرشفة</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* حوار تأكيد الحذف */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="font-arabic" style={{ direction: 'rtl' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد حذف هذه المهمة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskCardStatusIndicators;

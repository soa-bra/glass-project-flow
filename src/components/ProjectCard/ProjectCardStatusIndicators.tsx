
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
import { EllipsisVertical } from 'lucide-react';

const statusColors = {
  success: 'var(--status-colors-on-plan)',
  warning: 'var(--status-colors-delayed)',
  error: 'var(--status-colors-stopped)',
  info: 'var(--status-colors-in-preparation)'
};

interface ProjectCardStatusIndicatorsProps {
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
  projectId?: string;
  onEdit?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}

const ProjectCardStatusIndicators = ({
  status,
  date,
  owner,
  value,
  projectId,
  onEdit,
  onArchive,
  onDelete
}: ProjectCardStatusIndicatorsProps) => {
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
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (projectId && onEdit) {
      console.log('تعديل المشروع:', projectId);
      onEdit(projectId);
    }
  };

  const handleArchive = () => {
    setShowArchiveDialog(false);
    if (projectId && onArchive) {
      console.log('أرشفة المشروع:', projectId);
      onArchive(projectId);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    if (projectId && onDelete) {
      console.log('حذف المشروع:', projectId);
      onDelete(projectId);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="flex items-center justify-between py-0 mx-0 px-[28px] my-[24px]">
        {/* دائرة حالة المشروع - على الجانب الأيسر */}
        <div 
          style={{
            backgroundColor: statusColors[status],
            boxShadow: `0 2px 6px ${statusColors[status]}20, 0 0 12px ${statusColors[status]}15`
          }} 
          className="w-[20px] h-[20px] rounded-full my-0 py-0 px-0 mx-0" 
        />

        {/* الكبسولات - محاذاة إلى اليمين مع عنوان المشروع */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          {/* التاريخ */}
          <div style={pillStyle}>
            {date}
          </div>

          {/* المالك */}
          <div style={pillStyle}>
            {owner}
          </div>

          {/* القيمة */}
          <div style={pillStyle}>
            {value}
          </div>
          
          {/* قائمة النقاط الثلاث */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                data-dropdown-trigger
                onClick={handleDropdownClick}
                style={{
                  ...pillStyle,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  padding: '0',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <EllipsisVertical size={12} color="#858789" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="font-arabic bg-white shadow-lg border rounded-md min-w-[120px]"
              style={{ 
                direction: 'rtl', 
                zIndex: 9999,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb'
              }}
            >
              <DropdownMenuItem 
                onClick={handleEdit}
                className="text-right cursor-pointer hover:bg-gray-100 py-2 px-3"
              >
                تعديل المشروع
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowArchiveDialog(true);
                }}
                className="text-right cursor-pointer hover:bg-gray-100 py-2 px-3"
              >
                أرشفة المشروع
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="text-right cursor-pointer hover:bg-gray-100 text-red-600 py-2 px-3"
              >
                حذف المشروع
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* حوار تأكيد الأرشفة */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="font-arabic" style={{ direction: 'rtl' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الأرشفة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد أرشفة هذا المشروع؟ يمكنك استعادته لاحقاً من الأرشيف.
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
              هل أنت متأكد من أنك تريد حذف هذا المشروع نهائياً؟ سيتم حذف جميع المهام والبيانات المرتبطة به. لا يمكن التراجع عن هذا الإجراء.
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

export default ProjectCardStatusIndicators;


import React, { useState } from 'react';
import { MoreHorizontal, Edit, Archive, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectCardDropdownProps {
  projectId: number;
  projectName: string;
  onEdit: (projectId: number) => void;
  onArchive: (projectId: number) => void;
  onDelete: (projectId: number) => void;
}

export const ProjectCardDropdown: React.FC<ProjectCardDropdownProps> = ({
  projectId,
  projectName,
  onEdit,
  onArchive,
  onDelete,
}) => {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    onEdit(projectId);
  };

  const handleArchive = () => {
    onArchive(projectId);
    setShowArchiveDialog(false);
  };

  const handleDelete = () => {
    onDelete(projectId);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-black/10 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-white/95 backdrop-blur-sm border border-white/40 shadow-lg"
          style={{ zIndex: 1000 }}
        >
          <DropdownMenuItem 
            onClick={handleEdit}
            className="flex items-center gap-2 font-arabic cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            تعديل المشروع
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowArchiveDialog(true)}
            className="flex items-center gap-2 font-arabic cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            أرشفة المشروع
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 font-arabic cursor-pointer text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
            حذف المشروع
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* حوار تأكيد الأرشفة */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="font-arabic">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              تأكيد أرشفة المشروع
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من أنك تريد أرشفة مشروع "{projectName}"؟ يمكنك استعادته لاحقاً من الأرشيف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction onClick={handleArchive}>
              أرشفة
            </AlertDialogAction>
            <AlertDialogCancel>
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* حوار تأكيد الحذف */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="font-arabic">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right text-red-600">
              تأكيد حذف المشروع
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من أنك تريد حذف مشروع "{projectName}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف نهائي
            </AlertDialogAction>
            <AlertDialogCancel>
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

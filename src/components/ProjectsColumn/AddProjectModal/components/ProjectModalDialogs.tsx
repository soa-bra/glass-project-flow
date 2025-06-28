
import React from 'react';
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

interface ProjectModalDialogsProps {
  showConfirmDialog: boolean;
  onConfirmDialogChange: (open: boolean) => void;
  showCancelDialog: boolean;
  onCancelDialogChange: (open: boolean) => void;
  isEditMode: boolean;
  onConfirmSave: () => void;
  onConfirmCancel: () => void;
}

export const ProjectModalDialogs: React.FC<ProjectModalDialogsProps> = ({
  showConfirmDialog,
  onConfirmDialogChange,
  showCancelDialog,
  onCancelDialogChange,
  isEditMode,
  onConfirmSave,
  onConfirmCancel,
}) => {
  return (
    <>
      {/* حوار تأكيد الحفظ */}
      <AlertDialog open={showConfirmDialog} onOpenChange={onConfirmDialogChange}>
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
            <AlertDialogTitle className="text-right">
              {isEditMode ? 'تأكيد التعديل' : 'تأكيد الحفظ'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {isEditMode 
                ? 'هل أنت متأكد من حفظ التعديلات على هذا المشروع؟'
                : 'هل أنت متأكد من إنشاء هذا المشروع؟'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmSave} className="font-arabic">
              {isEditMode ? 'حفظ التعديلات' : 'إنشاء المشروع'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={onCancelDialogChange}>
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
            <AlertDialogTitle className="text-right">تأكيد الإلغاء</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {isEditMode 
                ? 'هل أنت متأكد من إلغاء التعديل؟ سيتم فقدان جميع التعديلات.'
                : 'هل أنت متأكد من إلغاء إضافة المشروع؟ سيتم فقدان جميع البيانات المدخلة.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">العودة</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmCancel} className="font-arabic">
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

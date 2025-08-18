
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
          <AlertDialogFooter className="flex items-center justify-end gap-3">
            <AlertDialogCancel className="bg-white/30 hover:bg-white/40 border border-black/20 text-black font-medium font-arabic rounded-full px-6 py-2">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmSave} 
              className="bg-black hover:bg-black/90 text-white font-medium font-arabic rounded-full px-6 py-2"
            >
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
          <AlertDialogFooter className="flex items-center justify-end gap-3">
            <AlertDialogCancel className="bg-white/30 hover:bg-white/40 border border-black/20 text-black font-medium font-arabic rounded-full px-6 py-2">
              العودة
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmCancel} 
              className="bg-black hover:bg-black/90 text-white font-medium font-arabic rounded-full px-6 py-2"
            >
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

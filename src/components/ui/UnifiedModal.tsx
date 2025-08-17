import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export interface UnifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export const UnifiedModal: React.FC<UnifiedModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  size = 'lg',
  children,
  className,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true
}) => {
  const { classes } = useDesignTokens();

  // إغلاق النافذة عند الضغط على Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // منع التمرير في الخلفية عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* خلفية النافذة */}
      <div 
        className={classes.backdrop}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* محتوى النافذة */}
      <div
        className={cn(classes.modal(size), className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        dir="rtl"
      >
        {/* زر الإغلاق */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className={classes.closeButton}
            aria-label="إغلاق النافذة"
          >
            <X className="text-black" size={18} />
          </button>
        )}

        {/* رأس النافذة */}
        <div className={classes.header}>
          <h2 id="modal-title" className={classes.title}>
            {icon && (
              <div className={classes.iconContainer}>
                {icon}
              </div>
            )}
            {title}
          </h2>
        </div>

        {/* محتوى النافذة */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

// مكون مبسط للنوافذ السريعة
export interface QuickModalProps extends Omit<UnifiedModalProps, 'title' | 'icon'> {
  title?: string;
  icon?: React.ReactNode;
}

export const QuickModal: React.FC<QuickModalProps> = ({
  title = "نافذة",
  icon,
  ...props
}) => {
  return (
    <UnifiedModal
      title={title}
      icon={icon}
      {...props}
    />
  );
};

// مكون للنوافذ مع تأكيد
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = 'default',
  icon
}) => {
  const { classes } = useDesignTokens();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={icon}
      size="sm"
    >
      <div className={classes.sections}>
        <p className="text-black font-arabic text-center leading-relaxed">
          {message}
        </p>
        
        <div className={classes.actionButtonsLayout}>
          <button
            onClick={onClose}
            className={classes.secondaryButton}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={variant === 'destructive' ? classes.destructiveButton : classes.primaryButton}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </UnifiedModal>
  );
};

export default UnifiedModal;
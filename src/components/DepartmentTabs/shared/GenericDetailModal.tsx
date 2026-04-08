/**
 * نافذة عرض تفاصيل عامة
 */
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BaseActionButton } from '@/components/shared/BaseActionButton';

export interface DetailField {
  label: string;
  value: string | number | React.ReactNode;
}

interface GenericDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: DetailField[];
  actions?: React.ReactNode;
}

export const GenericDetailModal: React.FC<GenericDetailModalProps> = ({
  isOpen, onClose, title, fields, actions
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black font-arabic text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {fields.map((field, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-white/30 rounded-2xl border border-black/5">
              <span className="text-sm font-medium text-black/60 font-arabic">{field.label}</span>
              <span className="text-sm font-semibold text-black font-arabic text-left max-w-[60%]">{field.value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          {actions}
          <BaseActionButton variant="outline" onClick={onClose}>إغلاق</BaseActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

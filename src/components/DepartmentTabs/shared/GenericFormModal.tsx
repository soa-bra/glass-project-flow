/**
 * نافذة نموذج عامة قابلة لإعادة الاستخدام
 */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

interface GenericFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
  successMessage?: string;
}

export const GenericFormModal: React.FC<GenericFormModalProps> = ({
  isOpen, onClose, title, fields, onSubmit, submitLabel = 'حفظ', successMessage = 'تم الحفظ بنجاح'
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    fields.forEach(f => { defaults[f.name] = f.defaultValue || ''; });
    return defaults;
  });

  const handleSubmit = () => {
    const missing = fields.filter(f => f.required && !formData[f.name]);
    if (missing.length > 0) {
      toast.error(`يرجى تعبئة: ${missing.map(f => f.label).join('، ')}`);
      return;
    }
    onSubmit(formData);
    toast.success(successMessage);
    setFormData(() => {
      const defaults: Record<string, string> = {};
      fields.forEach(f => { defaults[f.name] = f.defaultValue || ''; });
      return defaults;
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black font-arabic text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              <Label className="text-black font-arabic">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={formData[field.name] || ''}
                  onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="bg-white/40 border-black/10 text-black font-arabic min-h-[80px] rounded-2xl"
                />
              ) : field.type === 'select' ? (
                <Select value={formData[field.name] || ''} onValueChange={v => setFormData(prev => ({ ...prev, [field.name]: v }))}>
                  <SelectTrigger className="bg-white/40 border-black/10 text-black font-arabic rounded-2xl">
                    <SelectValue placeholder={field.placeholder || 'اختر...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="bg-white/40 border-black/10 text-black font-arabic rounded-2xl"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="font-arabic rounded-full">إلغاء</Button>
          <Button onClick={handleSubmit} className="bg-black text-white hover:bg-black/90 font-arabic rounded-full">{submitLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

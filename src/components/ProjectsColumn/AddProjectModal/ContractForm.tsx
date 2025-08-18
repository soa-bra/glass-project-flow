
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { ValidationSchemas, FormValidator, InputSanitizer } from '../../../utils/validation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ContractPayment {
  id: number;
  amount: string;
  date: string;
}

interface ContractFormProps {
  projectData: {
    hasContract: boolean;
    contractValue: string;
    contractPayments: ContractPayment[];
  };
  onInputChange: (field: string, value: unknown) => void;
  onAddPayment: () => void;
  onRemovePayment: (id: number) => void;
  onUpdatePayment: (id: number, field: string, value: string) => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({
  projectData,
  onInputChange,
  onAddPayment,
  onRemovePayment,
  onUpdatePayment,
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    let error: string | null = null;
    
    switch (field) {
      case 'contractValue':
        error = FormValidator.validateField(ValidationSchemas.contractValue, value);
        break;
      case 'paymentAmount':
        error = FormValidator.validateField(ValidationSchemas.currency, value);
        break;
      case 'paymentDate':
        error = FormValidator.validateField(ValidationSchemas.date, value);
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
    
    return !error;
  };
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="font-arabic text-right text-lg">نوع المشروع</Label>
        <div className="flex bg-transparent border border-black/10 rounded-full p-1 w-fit mx-auto">
          <button
            onClick={() => onInputChange('hasContract', false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${
              !projectData.hasContract ? 'bg-black text-white' : 'text-black hover:bg-black/5'
            }`}
          >
            بدون عقد
          </button>
          <button
            onClick={() => onInputChange('hasContract', true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${
              projectData.hasContract ? 'bg-black text-white' : 'text-black hover:bg-black/5'
            }`}
          >
            بعقد
          </button>
        </div>
      </div>

      {projectData.hasContract && (
        <div className="space-y-6 p-6 rounded-3xl bg-white/30 border border-black/20 text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
          <div className="space-y-2">
            <Label className="font-arabic text-right">قيمة العقد (ر.س)</Label>
            <Input
              type="text"
              value={projectData.contractValue}
              onChange={(e) => {
                const sanitized = InputSanitizer.sanitizeNumeric(e.target.value);
                onInputChange('contractValue', sanitized);
                validateField('contractValue', sanitized);
              }}
              className={`w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none ${validationErrors.contractValue ? 'border-red-500' : ''}`}
              placeholder="0"
            />
            {validationErrors.contractValue && (
              <p className="text-red-500 text-sm mt-1 text-right">{validationErrors.contractValue}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button
                type="button"
                onClick={onAddPayment}
                className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                إضافة دفعة +
              </Button>
              <Label className="font-arabic text-right text-lg">دفعات العقد</Label>
            </div>

            <div className="space-y-3">
              {projectData.contractPayments.map((payment: ContractPayment) => (
                <div key={payment.id} className="grid grid-cols-3 gap-4 p-3 bg-white/10 rounded-lg">
                  <Button
                    type="button"
                    onClick={() => onRemovePayment(payment.id)}
                    className="w-8 h-8 p-0 rounded-full bg-transparent border border-black/20 hover:bg-black/5 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-black" />
                  </Button>
                  
                  <div className="space-y-1">
                    <Label className="text-xs font-arabic">تاريخ الدفع</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none text-sm justify-start",
                            !payment.date && "text-black/50",
                            validationErrors[`paymentDate_${payment.id}`] && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {payment.date ? format(new Date(payment.date), "PPP") : <span>اختر التاريخ</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[10000]" align="start">
                        <Calendar 
                          mode="single" 
                          selected={payment.date ? new Date(payment.date) : undefined} 
                          onSelect={(date) => {
                            const dateString = date ? date.toISOString().split('T')[0] : '';
                            onUpdatePayment(payment.id, 'date', dateString);
                            validateField(`paymentDate_${payment.id}`, dateString);
                          }} 
                          initialFocus 
                          className="p-3 pointer-events-auto" 
                        />
                      </PopoverContent>
                    </Popover>
                    {validationErrors[`paymentDate_${payment.id}`] && (
                      <p className="text-red-500 text-xs mt-1 text-right">{validationErrors[`paymentDate_${payment.id}`]}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-arabic text-right">
                      المبلغ - دفعة {payment.id}
                    </Label>
                    <Input
                      type="text"
                      value={payment.amount}
                      onChange={(e) => {
                        const sanitized = InputSanitizer.sanitizeNumeric(e.target.value);
                        onUpdatePayment(payment.id, 'amount', sanitized);
                        validateField(`paymentAmount_${payment.id}`, sanitized);
                      }}
                      className={`w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none text-sm ${
                        validationErrors[`paymentAmount_${payment.id}`] ? 'border-red-500' : ''
                      }`}
                      placeholder="0"
                    />
                    {validationErrors[`paymentAmount_${payment.id}`] && (
                      <p className="text-red-500 text-xs mt-1 text-right">{validationErrors[`paymentAmount_${payment.id}`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

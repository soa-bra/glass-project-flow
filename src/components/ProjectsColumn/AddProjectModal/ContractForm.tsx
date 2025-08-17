
import React, { useState } from 'react';
import { UnifiedInput } from '@/components/ui/UnifiedInput';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { BinaryToggle } from '@/components/ui/UnifiedToggle';
import { ValidationSchemas, FormValidator, InputSanitizer } from '../../../utils/validation';

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
      <div className="space-y-3">
        <div className="font-medium text-ink text-right font-arabic">يوجد عقد لهذا المشروع</div>
        <BinaryToggle
          value={projectData.hasContract}
          onChange={(value) => onInputChange('hasContract', value)}
          trueLabel="نعم"
          falseLabel="لا"
        />
      </div>

      {projectData.hasContract && (
        <div className="space-y-6 p-6 rounded-lg border border-white/40" style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}>
          <div>
            <UnifiedInput
              label="قيمة العقد (ر.س)"
              type="text"
              value={projectData.contractValue}
              onChange={(e) => {
                const sanitized = InputSanitizer.sanitizeNumeric(e.target.value);
                onInputChange('contractValue', sanitized);
                validateField('contractValue', sanitized);
              }}
              placeholder="0"
              error={validationErrors.contractValue}
              fullWidth
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <UnifiedButton
                variant="primary"
                onClick={onAddPayment}
              >
                إضافة دفعة +
              </UnifiedButton>
              <div className="font-medium text-ink text-right font-arabic text-lg">دفعات العقد</div>
            </div>

            <div className="space-y-3">
              {projectData.contractPayments.map((payment: ContractPayment) => (
                <div key={payment.id} className="grid grid-cols-3 gap-4 p-3 bg-white/10 rounded-lg">
                  <UnifiedButton
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemovePayment(payment.id)}
                    className="w-8 h-8 p-0"
                  >
                    🗑️
                  </UnifiedButton>
                  
                  <div>
                    <UnifiedInput
                      label="تاريخ الدفع"
                      type="date"
                      value={payment.date}
                      onChange={(e) => {
                        onUpdatePayment(payment.id, 'date', e.target.value);
                        validateField(`paymentDate_${payment.id}`, e.target.value);
                      }}
                      error={validationErrors[`paymentDate_${payment.id}`]}
                      fullWidth
                    />
                  </div>

                  <div>
                    <UnifiedInput
                      label={`المبلغ - دفعة ${payment.id}`}
                      type="text"
                      value={payment.amount}
                      onChange={(e) => {
                        const sanitized = InputSanitizer.sanitizeNumeric(e.target.value);
                        onUpdatePayment(payment.id, 'amount', sanitized);
                        validateField(`paymentAmount_${payment.id}`, sanitized);
                      }}
                      placeholder="0"
                      error={validationErrors[`paymentAmount_${payment.id}`]}
                      fullWidth
                    />
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

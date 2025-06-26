import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  onUpdatePayment
}) => {
  return <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Label className="font-arabic text-right">يوجد عقد لهذا المشروع</Label>
        <input type="checkbox" checked={projectData.hasContract} onChange={e => onInputChange('hasContract', e.target.checked)} className="w-4 h-4" />
      </div>

      {projectData.hasContract && <div className="space-y-6 p-6 rounded-lg border border-white/40" style={{
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
          <div className="space-y-2">
            <Label className="font-arabic text-right">قيمة العقد (ر.س)</Label>
            <Input type="number" value={projectData.contractValue} onChange={e => onInputChange('contractValue', e.target.value)} className="text-right font-arabic" placeholder="0" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button type="button" onClick={onAddPayment} className="bg-black text-white hover:bg-gray-800 font-arabic">
                إضافة دفعة +
              </Button>
              <Label className="font-arabic text-right text-lg">دفعات العقد</Label>
            </div>

            <div className="space-y-3">
              {projectData.contractPayments.map((payment: ContractPayment) => <div key={payment.id} className="grid grid-cols-3 gap-4 p-3 bg-white/10 rounded-lg">
                  <Button type="button" variant="destructive" size="sm" onClick={() => onRemovePayment(payment.id)} className="w-8 h-8 font-normal rounded-full">
                    🗑️
                  </Button>
                  
                  <div className="space-y-1">
                    <Label className="text-xs font-arabic">تاريخ الدفع</Label>
                    <Input type="date" value={payment.date} onChange={e => onUpdatePayment(payment.id, 'date', e.target.value)} className="text-right font-arabic text-sm" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-arabic text-right">
                      المبلغ - دفعة {payment.id}
                    </Label>
                    <Input type="number" value={payment.amount} onChange={e => onUpdatePayment(payment.id, 'amount', e.target.value)} className="text-right font-arabic text-sm" placeholder="0" />
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
    </div>;
};
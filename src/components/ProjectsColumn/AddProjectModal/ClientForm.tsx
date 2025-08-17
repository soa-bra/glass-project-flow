
import React from 'react';
import { UnifiedInput, UnifiedSelect } from '@/components/ui/UnifiedInput';
import { UnifiedToggle } from '@/components/ui/UnifiedToggle';

interface ClientFormProps {
  projectData: {
    clientType: 'internal' | 'external';
    clientData?: {
      name: string;
      type: string;
      responsiblePerson: string;
      phone: string;
      email: string;
    };
  };
  onInputChange: (field: string, value: unknown) => void;
  onClientDataChange: (field: string, value: string) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  projectData,
  onInputChange,
  onClientDataChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="font-medium text-ink text-right font-arabic text-lg">نوع المشروع</div>
        <UnifiedToggle
          options={[
            { value: 'internal', label: 'مشروع داخلي' },
            { value: 'external', label: 'لصالح عميل' }
          ]}
          value={projectData.clientType}
          onChange={(value) => {
            onInputChange('clientType', value);
            if (value === 'external' && !projectData.clientData) {
              onInputChange('clientData', {
                name: '',
                type: '',
                responsiblePerson: '',
                phone: '',
                email: '',
              });
            }
          }}
        />
      </div>

      {projectData.clientType === 'external' && (
        <div className="space-y-6 p-6 rounded-lg border border-white/40" style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}>
          <h3 className="text-lg font-bold font-arabic text-right">بيانات العميل</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <UnifiedInput
                label="اسم الكيان *"
                value={projectData.clientData?.name || ''}
                onChange={(e) => onClientDataChange('name', e.target.value)}
                placeholder="أدخل اسم الكيان"
                fullWidth
              />
            </div>
            
            <div>
              <UnifiedSelect
                label="نوع الكيان"
                value={projectData.clientData?.type || ''}
                onChange={(e) => onClientDataChange('type', e.target.value)}
                placeholder="اختر نوع الكيان"
                options={[
                  { value: 'individual', label: 'فرد' },
                  { value: 'company', label: 'شركة' }
                ]}
                fullWidth
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <UnifiedInput
                label="اسم المسؤول *"
                value={projectData.clientData?.responsiblePerson || ''}
                onChange={(e) => onClientDataChange('responsiblePerson', e.target.value)}
                placeholder="أدخل اسم المسؤول"
                fullWidth
              />
            </div>
            
            <div>
              <UnifiedInput
                label="رقم التواصل *"
                value={projectData.clientData?.phone || ''}
                onChange={(e) => onClientDataChange('phone', e.target.value)}
                placeholder="+966xxxxxxxxx"
                fullWidth
              />
            </div>
          </div>

          <div>
            <UnifiedInput
              label="البريد الإلكتروني *"
              type="email"
              value={projectData.clientData?.email || ''}
              onChange={(e) => onClientDataChange('email', e.target.value)}
              placeholder="example@domain.com"
              fullWidth
            />
          </div>
        </div>
      )}
    </div>
  );
};

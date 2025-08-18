
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        <Label className="font-arabic text-right text-lg">نوع المشروع</Label>
        <div className="flex bg-transparent border border-black rounded-full p-1 w-fit mx-auto">
          <button
            onClick={() => onInputChange('clientType', 'internal')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${
              projectData.clientType === 'internal' ? 'bg-black text-white' : 'text-black hover:bg-black/5'
            }`}
          >
            مشروع داخلي
          </button>
          <button
            onClick={() => {
              onInputChange('clientType', 'external');
              if (!projectData.clientData) {
                onInputChange('clientData', {
                  name: '',
                  type: '',
                  responsiblePerson: '',
                  phone: '',
                  email: '',
                });
              }
            }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${
              projectData.clientType === 'external' ? 'bg-black text-white' : 'text-black hover:bg-black/5'
            }`}
          >
            لصالح عميل
          </button>
        </div>
      </div>

      {projectData.clientType === 'external' && (
        <div className="space-y-6 p-6 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
          <h3 className="text-lg font-bold font-arabic text-right">بيانات العميل</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-arabic text-right">اسم الكيان <span className="text-red-500">*</span></Label>
              <Input
                value={projectData.clientData?.name || ''}
                onChange={(e) => onClientDataChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
                placeholder="أدخل اسم الكيان"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-arabic text-right">نوع الكيان <span className="text-red-500">*</span></Label>
              <Select 
                value={projectData.clientData?.type || ''} 
                onValueChange={(value) => onClientDataChange('type', value)}
              >
                <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                  <SelectValue placeholder="اختر نوع الكيان" />
                </SelectTrigger>
                <SelectContent 
                  className="z-[10000] text-[#0B0F12] font-arabic"
                  style={{
                    background: 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <SelectItem value="individual">فرد</SelectItem>
                  <SelectItem value="government">مؤسسة حكومية</SelectItem>
                  <SelectItem value="semi-government">مؤسسة شبه حكومية</SelectItem>
                  <SelectItem value="commercial">مؤسسة تجارية</SelectItem>
                  <SelectItem value="charity">مؤسسة خيرية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-arabic text-right">اسم ممثل الكيان <span className="text-red-500">*</span></Label>
              <Input
                value={projectData.clientData?.responsiblePerson || ''}
                onChange={(e) => onClientDataChange('responsiblePerson', e.target.value)}
                className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
                placeholder="أدخل اسم المسؤول"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-arabic text-right">رقم التواصل</Label>
              <Input
                value={projectData.clientData?.phone || ''}
                onChange={(e) => onClientDataChange('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
                placeholder="+966xxxxxxxxx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-arabic text-right">البريد الإلكتروني <span className="text-red-500">*</span></Label>
            <Input
              type="email"
              value={projectData.clientData?.email || ''}
              onChange={(e) => onClientDataChange('email', e.target.value)}
              className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
              placeholder="example@domain.com"
            />
          </div>
        </div>
      )}
    </div>
  );
};

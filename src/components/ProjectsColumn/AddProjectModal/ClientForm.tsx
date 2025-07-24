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
  onClientDataChange
}) => {
  return <div className="space-y-6">
      <div className="space-y-4">
        <Label className="font-arabic text-right text-lg">نوع المشروع</Label>
        <div className="flex gap-4 justify-end">
          <Button type="button" variant={projectData.clientType === 'internal' ? 'default' : 'outline'} onClick={() => onInputChange('clientType', 'internal')} className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/50 font-arabic rounded-full">
            مشروع داخلي
          </Button>
          <Button type="button" variant={projectData.clientType === 'external' ? 'default' : 'outline'} onClick={() => {
          onInputChange('clientType', 'external');
          if (!projectData.clientData) {
            onInputChange('clientData', {
              name: '',
              type: '',
              responsiblePerson: '',
              phone: '',
              email: ''
            });
          }
        }} className="bg-black text-white hover:bg-gray-800 font-arabic rounded-full">
            لصالح عميل
          </Button>
        </div>
      </div>

      {projectData.clientType === 'external' && <div style={{
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }} className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors">
          <h3 className="text-lg font-bold font-arabic text-right">بيانات العميل</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-arabic text-right">اسم الكيان *</Label>
              <Input value={projectData.clientData?.name || ''} onChange={e => onClientDataChange('name', e.target.value)} placeholder="أدخل اسم الكيان" className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors" />
            </div>
            
            <div className="space-y-2">
              <Label className="font-arabic text-right">نوع الكيان</Label>
              <Select value={projectData.clientData?.type || ''} onValueChange={value => onClientDataChange('type', value)}>
                <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors">
                  <SelectValue placeholder="اختر نوع الكيان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">فرد</SelectItem>
                  <SelectItem value="company">شركة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-arabic text-right">اسم المسؤول *</Label>
              <Input value={projectData.clientData?.responsiblePerson || ''} onChange={e => onClientDataChange('responsiblePerson', e.target.value)} placeholder="أدخل اسم المسؤول" className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors" />
            </div>
            
            <div className="space-y-2">
              <Label className="font-arabic text-right">رقم التواصل *</Label>
              <Input value={projectData.clientData?.phone || ''} onChange={e => onClientDataChange('phone', e.target.value)} placeholder="+966xxxxxxxxx" className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-arabic text-right">البريد الإلكتروني *</Label>
            <Input type="email" value={projectData.clientData?.email || ''} onChange={e => onClientDataChange('email', e.target.value)} placeholder="example@domain.com" className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors" />
          </div>
        </div>}
    </div>;
};
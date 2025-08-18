
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface PartnerData {
  id: number;
  entityName: string;
  entityType: string;
  representativeName: string;
  phone: string;
  email: string;
  partnershipDescription: string;
}

interface PartnershipsTabProps {
  partnerships: PartnerData[];
  onAddPartnership: (partnership: PartnerData) => void;
  onEditPartnership: (id: number, partnership: PartnerData) => void;
  onDeletePartnership: (id: number) => void;
}

export const PartnershipsTab: React.FC<PartnershipsTabProps> = ({
  partnerships,
  onAddPartnership,
  onEditPartnership,
  onDeletePartnership
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<PartnerData, 'id'>>({
    entityName: '',
    entityType: '',
    representativeName: '',
    phone: '',
    email: '',
    partnershipDescription: ''
  });

  const resetForm = () => {
    setFormData({
      entityName: '',
      entityType: '',
      representativeName: '',
      phone: '',
      email: '',
      partnershipDescription: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.entityName || !formData.entityType || !formData.representativeName || !formData.email) {
      return;
    }

    const newPartnership: PartnerData = {
      id: editingId || Date.now(),
      ...formData
    };

    if (editingId) {
      onEditPartnership(editingId, newPartnership);
    } else {
      onAddPartnership(newPartnership);
    }

    resetForm();
  };

  const handleEdit = (partnership: PartnerData) => {
    setFormData(partnership);
    setEditingId(partnership.id);
    setShowForm(true);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="ml-1" />
            إضافة شريك
          </Button>
          <h3 className="text-lg font-bold font-arabic">الشراكات</h3>
        </div>

        {showForm && (
          <div className="p-6 rounded-3xl bg-white/30 border border-black/20 space-y-4">
            <h4 className="font-bold font-arabic text-right text-lg">
              {editingId ? 'تعديل الشريك' : 'إضافة شريك جديد'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-arabic text-right">اسم الكيان *</Label>
                <Input
                  value={formData.entityName}
                  onChange={(e) => handleInputChange('entityName', e.target.value)}
                  placeholder="أدخل اسم الكيان"
                  className="rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-arabic text-right">نوع الكيان *</Label>
                <Select value={formData.entityType} onValueChange={(value) => handleInputChange('entityType', value)}>
                  <SelectTrigger className="rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black text-right font-arabic transition-colors outline-none">
                    <SelectValue placeholder="اختر نوع الكيان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">شركة</SelectItem>
                    <SelectItem value="organization">منظمة</SelectItem>
                    <SelectItem value="institution">مؤسسة</SelectItem>
                    <SelectItem value="government">جهة حكومية</SelectItem>
                    <SelectItem value="nonprofit">جمعية خيرية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-arabic text-right">اسم ممثل الكيان *</Label>
                <Input
                  value={formData.representativeName}
                  onChange={(e) => handleInputChange('representativeName', e.target.value)}
                  placeholder="أدخل اسم ممثل الكيان"
                  className="rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-arabic text-right">رقم التواصل</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="أدخل رقم التواصل"
                  className="rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="font-arabic text-right">البريد الإلكتروني *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  className="rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="font-arabic text-right">وصف نوع الشراكة</Label>
                <Textarea
                  value={formData.partnershipDescription}
                  onChange={(e) => handleInputChange('partnershipDescription', e.target.value)}
                  placeholder="اكتب وصف نوع الشراكة"
                  className="rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-start">
              <Button
                onClick={handleSubmit}
                className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors"
              >
                {editingId ? 'تحديث' : 'إضافة'}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
        
        {partnerships.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-arabic">
            لا توجد شراكات مضافة بعد
          </div>
        ) : (
          <div className="space-y-3">
            {partnerships.map((partnership) => (
              <div key={partnership.id} className="p-4 rounded-3xl bg-white/30 border border-black/20 text-black hover:bg-white/40 font-arabic transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(partnership)}
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-black/10 rounded-full"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => onDeletePartnership(partnership.id)}
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-full"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold font-arabic text-right">{partnership.entityName}</h4>
                    <p className="text-sm text-gray-600 font-arabic text-right mt-1">{partnership.entityType}</p>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-700 font-arabic">
                      <span>الممثل: {partnership.representativeName}</span>
                      <span>البريد: {partnership.email}</span>
                    </div>
                    {partnership.partnershipDescription && (
                      <p className="text-sm text-gray-600 font-arabic text-right mt-1">{partnership.partnershipDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

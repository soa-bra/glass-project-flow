import React, { useState } from 'react';
import { Plus, Search, Download, Eye } from 'lucide-react';
import { mockContracts } from './data';
import type { Contract } from './types';
import { getStatusText, formatCurrency, formatDate } from './utils';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const ContractsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [contracts, setContracts] = useState(mockContracts);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingContract, setViewingContract] = useState<any>(null);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) || contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const createFields: FormField[] = [
    { name: 'title', label: 'عنوان العقد', type: 'text', required: true, placeholder: 'أدخل عنوان العقد' },
    { name: 'client', label: 'العميل', type: 'text', required: true, placeholder: 'اسم العميل' },
    { name: 'type', label: 'النوع', type: 'select', required: true, options: [
      { value: 'service', label: 'خدمات' },
      { value: 'employment', label: 'توظيف' },
      { value: 'partnership', label: 'شراكة' },
      { value: 'confidentiality', label: 'سرية' },
      { value: 'supplier', label: 'مورد' },
    ]},
    { name: 'value', label: 'القيمة (ر.س)', type: 'number', required: true, placeholder: '0' },
    { name: 'startDate', label: 'تاريخ البداية', type: 'date', required: true },
    { name: 'endDate', label: 'تاريخ الانتهاء', type: 'date', required: true },
    { name: 'description', label: 'الوصف', type: 'textarea', placeholder: 'وصف العقد...' },
  ];

  const handleCreateContract = (data: Record<string, string>) => {
    const newContract: Contract = {
      id: `CON-${Date.now().toString().slice(-4)}`,
      title: data.title,
      client: data.client,
      type: data.type as Contract['type'],
      status: 'draft',
      value: Number(data.value),
      startDate: data.startDate,
      endDate: data.endDate,
      signatories: [],
      riskLevel: 'low',
    };
    setContracts(prev => [newContract, ...prev]);
  };

  const handleDownloadContract = (contract: any) => {
    downloadAsCSV(
      ['رقم العقد', 'العنوان', 'العميل', 'النوع', 'القيمة', 'الحالة', 'تاريخ الانتهاء'],
      [[contract.id, contract.title, contract.client, getStatusText(contract.type), String(contract.value), getStatusText(contract.status), contract.endDate]],
      `عقد-${contract.id}`
    );
    toast.success(`تم تنزيل العقد ${contract.id}`);
  };

  const getViewFields = (contract: any): DetailField[] => [
    { label: 'رقم العقد', value: contract.id },
    { label: 'العنوان', value: contract.title },
    { label: 'العميل', value: contract.client },
    { label: 'النوع', value: getStatusText(contract.type) },
    { label: 'القيمة', value: formatCurrency(contract.value) },
    { label: 'الحالة', value: getStatusText(contract.status) },
    { label: 'تاريخ البداية', value: contract.startDate || 'غير محدد' },
    { label: 'تاريخ الانتهاء', value: formatDate(contract.endDate) },
  ];

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-[#bdeed3] text-black';
      case 'pending': return 'bg-[#fbe2aa] text-black';
      case 'expired': return 'bg-[#f1b5b9] text-black';
      case 'draft': return 'bg-[#d9d2fd] text-black';
      default: return 'bg-[#a4e2f6] text-black';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">إدارة العقود والاتفاقيات</h3>
        <button onClick={() => setIsCreateOpen(true)} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium mx-[25px] flex items-center gap-2 hover:bg-black/90 transition-colors">
          <Plus className="w-4 h-4" />
          عقد جديد
        </button>
      </div>

      <div className="bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-9 rounded-[40px] shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic">البحث والتصفية</h3>
        </div>
        <div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
              <input type="text" placeholder="البحث في العقود..." className="w-full pl-4 pr-10 py-3 bg-transparent border border-black/10 rounded-full focus:ring-2 focus:ring-black/20 focus:border-black/20 text-black font-arabic" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="px-4 py-3 bg-transparent border border-black/10 rounded-full focus:ring-2 focus:ring-black/20 text-black font-arabic" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">جميع الحالات</option>
              <option value="signed">موقع</option>
              <option value="pending">في الانتظار</option>
              <option value="expired">منتهي</option>
              <option value="draft">مسودة</option>
            </select>
            <select className="px-4 py-3 bg-transparent border border-black/10 rounded-full focus:ring-2 focus:ring-black/20 text-black font-arabic" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">جميع الأنواع</option>
              <option value="service">خدمات</option>
              <option value="employment">توظيف</option>
              <option value="partnership">شراكة</option>
              <option value="confidentiality">سرية</option>
              <option value="supplier">مورد</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-9 rounded-[40px] shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">إحصائيات العقود</h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-transparent ring-1 ring-[#DADCE0] rounded-[40px]">
              <div className="text-2xl font-bold text-black font-arabic">{contracts.filter(c => c.status === 'signed').length}</div>
              <div className="text-sm font-medium text-black font-arabic">عقود موقعة</div>
            </div>
            <div className="text-center p-4 bg-transparent ring-1 ring-[#DADCE0] rounded-[40px]">
              <div className="text-2xl font-bold text-black font-arabic">{contracts.filter(c => c.status === 'pending').length}</div>
              <div className="text-sm font-medium text-black font-arabic">في الانتظار</div>
            </div>
            <div className="text-center p-4 bg-transparent ring-1 ring-[#DADCE0] rounded-[40px]">
              <div className="text-2xl font-bold text-black font-arabic">{contracts.filter(c => c.status === 'expired').length}</div>
              <div className="text-sm font-medium text-black font-arabic">منتهية</div>
            </div>
            <div className="text-center p-4 bg-transparent ring-1 ring-[#DADCE0] rounded-[40px]">
              <div className="text-2xl font-bold text-black font-arabic">{contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}</div>
              <div className="text-sm font-medium text-black font-arabic">القيمة الإجمالية (ر.س)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-9 rounded-[40px] shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic">قائمة العقود ({filteredContracts.length})</h3>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-1 text-sm font-semibold text-black font-arabic py-[5px] bg-transparent">العقد</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic py-[5px] bg-transparent">العميل</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic py-[5px] bg-transparent">النوع</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic py-[5px] bg-transparent">الحالة</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic py-[5px] bg-transparent">القيمة</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic py-[5px] bg-transparent">تاريخ الانتهاء</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic py-[5px] bg-transparent">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map(contract => (
                  <tr key={contract.id} className="border-b border-black/10 hover:bg-white/10 transition-colors">
                    <td className="py-0 my-0 mx-0">
                      <div className="font-medium text-black font-arabic">{contract.title}</div>
                      <div className="text-sm text-black/70 font-arabic">{contract.id}</div>
                    </td>
                    <td className="py-4 text-black font-arabic">{contract.client}</td>
                    <td className="py-4 bg-transparent">
                      <span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">{getStatusText(contract.type)}</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-arabic ${getContractStatusColor(contract.status)}`}>{getStatusText(contract.status)}</span>
                    </td>
                    <td className="py-4 font-medium text-black font-arabic">{formatCurrency(contract.value)}</td>
                    <td className="py-4 text-black font-arabic">{formatDate(contract.endDate)}</td>
                    <td className="mx-0 px-0 py-[25px] my-0 bg-transparent">
                      <div className="flex items-center gap-2">
                        <div onClick={() => setViewingContract(contract)} className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                          <Eye className="w-4 h-4 text-black" />
                        </div>
                        <div onClick={() => handleDownloadContract(contract)} className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                          <Download className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <GenericFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="إنشاء عقد جديد"
        fields={createFields}
        onSubmit={handleCreateContract}
        submitLabel="إنشاء العقد"
        successMessage="تم إنشاء العقد بنجاح"
      />

      {viewingContract && (
        <GenericDetailModal
          isOpen={!!viewingContract}
          onClose={() => setViewingContract(null)}
          title={`تفاصيل العقد: ${viewingContract.title}`}
          fields={getViewFields(viewingContract)}
          actions={
            <Button onClick={() => { handleDownloadContract(viewingContract); }} variant="outline" className="font-arabic rounded-full">
              <Download className="w-4 h-4 ml-2" />
              تنزيل
            </Button>
          }
        />
      )}
    </div>
  );
};

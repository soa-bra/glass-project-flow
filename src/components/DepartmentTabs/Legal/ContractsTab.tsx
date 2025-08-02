import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Download, Eye } from 'lucide-react';
import { mockContracts } from './data';
import { getStatusColor, getStatusText, formatCurrency, formatDate } from './utils';
export const ContractsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) || contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-[#bdeed3] text-black';
      case 'pending':
        return 'bg-[#fbe2aa] text-black';
      case 'expired':
        return 'bg-[#f1b5b9] text-black';
      case 'draft':
        return 'bg-[#d9d2fd] text-black';
      default:
        return 'bg-[#a4e2f6] text-black';
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">إدارة العقود والاتفاقيات</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium mx-[25px] flex items-center gap-2 hover:bg-black/90 transition-colors">
          
          عقد جديد
        </button>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
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

      {/* إحصائيات العقود */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic flex items-center gap-2">
            
            إحصائيات العقود
          </h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="text-2xl font-bold text-black font-arabic">
                {mockContracts.filter(c => c.status === 'signed').length}
              </div>
              <div className="text-sm font-medium text-black font-arabic">عقود موقعة</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="text-2xl font-bold text-black font-arabic">
                {mockContracts.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm font-medium text-black font-arabic">في الانتظار</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="text-2xl font-bold text-black font-arabic">
                {mockContracts.filter(c => c.status === 'expired').length}
              </div>
              <div className="text-sm font-medium text-black font-arabic">منتهية</div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="text-2xl font-bold text-black font-arabic">
                {mockContracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
              </div>
              <div className="text-sm font-medium text-black font-arabic">القيمة الإجمالية (ر.س)</div>
            </div>
          </div>
        </div>
      </div>

      {/* جدول العقود */}
      <div className="bg-[#f2ffff] p-9 rounded-3xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black font-arabic">قائمة العقود</h3>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-1 text-sm font-semibold text-black font-arabic  py-[5px] bg-transparent">العقد</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic  py-[5px] bg-transparent">العميل</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic  py-[5px] bg-transparent">النوع</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic  py-[5px] bg-transparent">الحالة</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic  py-[5px] bg-transparent">القيمة</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic  py-[5px] bg-transparent">تاريخ الانتهاء</th>
                  <th className="pb-1 text-sm font-semibold text-black font-arabic  py-[5px] bg-transparent">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map(contract => <tr key={contract.id} className="border-b border-black/10 hover:bg-white/10 transition-colors">
                    <td className="py-0 my-0 mx-0">
                      <div className="font-medium text-black font-arabic">{contract.title}</div>
                      <div className="text-sm text-black/70 font-arabic">{contract.id}</div>
                    </td>
                    <td className="py-4 text-black font-arabic">{contract.client}</td>
                    <td className="py-4 bg-transparent">
                      <span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">
                        {getStatusText(contract.type)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-arabic ${getContractStatusColor(contract.status)}`}>
                        {getStatusText(contract.status)}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-black font-arabic">{formatCurrency(contract.value)}</td>
                    <td className="py-4 text-black font-arabic">{formatDate(contract.endDate)}</td>
                    <td className="mx-0 px-0 py-[25px] my-0 bg-transparent">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                          <Eye className="w-4 h-4 text-black" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                          <Download className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};

import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { FileText, Plus, Search, Filter, Download, Eye } from 'lucide-react';
import { mockContracts } from './data';
import { getStatusColor, getStatusText, formatCurrency, formatDate } from './utils';

export const ContractsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="h-full overflow-auto">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في العقود..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="signed">موقع</option>
            <option value="pending">في الانتظار</option>
            <option value="expired">منتهي</option>
            <option value="draft">مسودة</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">جميع الأنواع</option>
            <option value="service">خدمات</option>
            <option value="employment">توظيف</option>
            <option value="partnership">شراكة</option>
            <option value="confidentiality">سرية</option>
            <option value="supplier">مورد</option>
          </select>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          عقد جديد
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {mockContracts.filter(c => c.status === 'signed').length}
          </div>
          <div className="text-sm text-gray-600">عقود موقعة</div>
        </BaseCard>
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {mockContracts.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">في الانتظار</div>
        </BaseCard>
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {mockContracts.filter(c => c.status === 'expired').length}
          </div>
          <div className="text-sm text-gray-600">منتهية</div>
        </BaseCard>
        <BaseCard className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockContracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">القيمة الإجمالية (ر.س)</div>
        </BaseCard>
      </div>

      {/* Contracts Table */}
      <BaseCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-semibold text-gray-700">العقد</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">العميل</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">النوع</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">الحالة</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">القيمة</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">تاريخ الانتهاء</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">
                    <div className="font-medium text-gray-800">{contract.title}</div>
                    <div className="text-sm text-gray-600">{contract.id}</div>
                  </td>
                  <td className="py-4 text-gray-700">{contract.client}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {getStatusText(contract.type)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                      {getStatusText(contract.status)}
                    </span>
                  </td>
                  <td className="py-4 font-medium">{formatCurrency(contract.value)}</td>
                  <td className="py-4 text-gray-600">{formatDate(contract.endDate)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  );
};

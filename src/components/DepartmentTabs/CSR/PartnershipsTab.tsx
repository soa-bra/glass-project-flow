
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Building, 
  Users, 
  Phone, 
  Mail,
  Star,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit
} from 'lucide-react';
import { mockCSRPartners } from './data';
import { CSRPartner } from './types';

export const PartnershipsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getTypeColor = (type: CSRPartner['type']) => {
    switch (type) {
      case 'government': return 'bg-blue-100 text-blue-800';
      case 'ngo': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'international': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: CSRPartner['type']) => {
    switch (type) {
      case 'government': return 'حكومي';
      case 'ngo': return 'غير ربحي';
      case 'private': return 'قطاع خاص';
      case 'international': return 'دولي';
      default: return type;
    }
  };

  const getCapacityColor = (capacity: CSRPartner['capacity']) => {
    switch (capacity) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCapacityText = (capacity: CSRPartner['capacity']) => {
    switch (capacity) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return capacity;
    }
  };

  const getContractStatusIcon = (status?: CSRPartner['contractStatus']) => {
    switch (status) {
      case 'signed': return CheckCircle;
      case 'draft': return Clock;
      case 'expired': return AlertCircle;
      default: return FileText;
    }
  };

  const getContractStatusColor = (status?: CSRPartner['contractStatus']) => {
    switch (status) {
      case 'signed': return 'text-green-600';
      case 'draft': return 'text-yellow-600';
      case 'expired': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getContractStatusText = (status?: CSRPartner['contractStatus']) => {
    switch (status) {
      case 'signed': return 'موقع';
      case 'draft': return 'مسودة';
      case 'expired': return 'منتهي';
      default: return 'غير محدد';
    }
  };

  const filteredPartners = mockCSRPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || partner.type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في الشركاء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الأنواع</option>
            <option value="government">حكومي</option>
            <option value="ngo">غير ربحي</option>
            <option value="private">قطاع خاص</option>
            <option value="international">دولي</option>
          </select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" />
          إضافة شريك جديد
        </Button>
      </div>

      {/* Partners Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">{mockCSRPartners.length}</h3>
          <p className="text-gray-600 font-arabic">إجمالي الشركاء</p>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {mockCSRPartners.filter(p => p.contractStatus === 'signed').length}
          </h3>
          <p className="text-gray-600 font-arabic">عقود نشطة</p>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {(mockCSRPartners.reduce((sum, p) => sum + p.rating, 0) / mockCSRPartners.length).toFixed(1)}
          </h3>
          <p className="text-gray-600 font-arabic">متوسط التقييم</p>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {mockCSRPartners.filter(p => p.capacity === 'high').length}
          </h3>
          <p className="text-gray-600 font-arabic">قدرة عالية</p>
        </GenericCard>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPartners.map((partner) => {
          const ContractIcon = getContractStatusIcon(partner.contractStatus);
          
          return (
            <GenericCard key={partner.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold font-arabic text-gray-900">{partner.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(partner.type)}`}>
                      {getTypeText(partner.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(Math.floor(partner.rating))}
                      <span className="mr-2 text-sm text-gray-600 font-arabic">
                        {partner.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className={`text-sm font-arabic ${getCapacityColor(partner.capacity)}`}>
                      قدرة {getCapacityText(partner.capacity)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-arabic text-gray-700">{partner.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-arabic text-gray-700">{partner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-arabic text-gray-700">{partner.phone}</span>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="mb-4">
                <p className="text-sm font-semibold font-arabic text-gray-700 mb-2">مجالات الخبرة:</p>
                <div className="flex flex-wrap gap-1">
                  {partner.expertise.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-arabic">
                      {skill}
                    </span>
                  ))}
                  {partner.expertise.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded font-arabic">
                      +{partner.expertise.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Partnership Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500 font-arabic">المشاريع السابقة</p>
                  <p className="font-semibold font-arabic">{partner.previousProjects}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-arabic">بداية الشراكة</p>
                  <p className="font-semibold font-arabic">
                    {new Date(partner.partnership.startDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              {/* Contract Status */}
              {partner.contractStatus && (
                <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                  <ContractIcon className={`h-4 w-4 ${getContractStatusColor(partner.contractStatus)}`} />
                  <span className="text-sm font-arabic text-gray-700">
                    حالة العقد: <span className={`font-semibold ${getContractStatusColor(partner.contractStatus)}`}>
                      {getContractStatusText(partner.contractStatus)}
                    </span>
                  </span>
                  {partner.contractId && (
                    <span className="text-xs text-gray-500 font-arabic">
                      ({partner.contractId})
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 font-arabic">
                  <Eye className="h-3 w-3 ml-1" />
                  عرض التفاصيل
                </Button>
                <Button size="sm" variant="outline" className="font-arabic">
                  <Edit className="h-3 w-3 ml-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline" className="font-arabic">
                  <FileText className="h-3 w-3 ml-1" />
                  العقد
                </Button>
              </div>
            </GenericCard>
          );
        })}
      </div>

      {/* Resource Allocator */}
      <GenericCard>
        <h3 className="text-lg font-bold font-arabic mb-4">مخصص الموارد</h3>
        <p className="text-gray-600 font-arabic mb-4">
          ربط احتياجات المبادرات بالموارد المتاحة والموردين المعتمدين
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="font-arabic">
            <Building className="ml-2 h-4 w-4" />
            إدارة الموردين
          </Button>
          <Button variant="outline" className="font-arabic">
            <Users className="ml-2 h-4 w-4" />
            تخصيص الموارد
          </Button>
          <Button variant="outline" className="font-arabic">
            <FileText className="ml-2 h-4 w-4" />
            تقارير الموارد
          </Button>
        </div>
      </GenericCard>
    </div>
  );
};

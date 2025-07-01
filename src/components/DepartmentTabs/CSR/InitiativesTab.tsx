
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Play,
  Pause,
  CheckCircle,
  Clock
} from 'lucide-react';
import { mockCSRInitiatives } from './data';
import { CSRInitiative } from './types';

export const InitiativesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getStatusColor = (status: CSRInitiative['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: CSRInitiative['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'planning': return 'تخطيط';
      case 'completed': return 'مكتمل';
      case 'suspended': return 'معلق';
      default: return status;
    }
  };

  const getCategoryText = (category: CSRInitiative['category']) => {
    switch (category) {
      case 'education': return 'تعليم';
      case 'environment': return 'بيئة';
      case 'economic_empowerment': return 'تمكين اقتصادي';
      case 'health': return 'صحة';
      case 'community': return 'مجتمع';
      default: return category;
    }
  };

  const getCategoryColor = (category: CSRInitiative['category']) => {
    switch (category) {
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'environment': return 'bg-green-100 text-green-800';
      case 'economic_empowerment': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'community': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: CSRInitiative['status']) => {
    switch (status) {
      case 'active': return Play;
      case 'planning': return Clock;
      case 'completed': return CheckCircle;
      case 'suspended': return Pause;
      default: return Clock;
    }
  };

  const filteredInitiatives = mockCSRInitiatives.filter(initiative => {
    const matchesSearch = initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         initiative.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || initiative.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || initiative.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في المبادرات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="planning">تخطيط</option>
            <option value="completed">مكتمل</option>
            <option value="suspended">معلق</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الفئات</option>
            <option value="education">تعليم</option>
            <option value="environment">بيئة</option>
            <option value="economic_empowerment">تمكين اقتصادي</option>
            <option value="health">صحة</option>
            <option value="community">مجتمع</option>
          </select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" />
          إضافة مبادرة جديدة
        </Button>
      </div>

      {/* Initiatives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInitiatives.map((initiative) => {
          const StatusIcon = getStatusIcon(initiative.status);
          const progressPercentage = (initiative.allocatedBudget / initiative.budget) * 100;
          
          return (
            <GenericCard key={initiative.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold font-arabic text-gray-900">{initiative.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(initiative.status)}`}>
                      <StatusIcon className="inline h-3 w-3 ml-1" />
                      {getStatusText(initiative.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-arabic mb-3">{initiative.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(initiative.category)}`}>
                      {getCategoryText(initiative.category)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {initiative.sdgGoals.map((goal, index) => (
                        <span key={index} className="px-1 py-0.5 bg-blue-50 text-blue-700 rounded">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-arabic">المستفيدين</p>
                    <p className="font-semibold font-arabic">{initiative.beneficiaries.toLocaleString('ar-SA')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-arabic">الميزانية</p>
                    <p className="font-semibold font-arabic">{formatCurrency(initiative.budget)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-arabic">مؤشر الأثر</p>
                    <p className="font-semibold font-arabic">{initiative.impact.socialImpactIndex}/10</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-arabic">المدة</p>
                    <p className="font-semibold font-arabic text-xs">
                      {new Date(initiative.startDate).toLocaleDateString('ar-SA')} - {new Date(initiative.endDate).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-arabic text-gray-700">تقدم الميزانية</span>
                  <span className="text-sm font-arabic text-gray-600">{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Team and Manager */}
              <div className="flex items-center justify-between text-sm text-gray-600 font-arabic mb-4">
                <div>
                  <span className="font-semibold">المدير: </span>
                  <span>{initiative.manager}</span>
                </div>
                <div>
                  <span className="font-semibold">الفريق: </span>
                  <span>{initiative.team.length} أعضاء</span>
                </div>
              </div>

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
              </div>
            </GenericCard>
          );
        })}
      </div>

      {/* Theory of Change Builder */}
      <GenericCard>
        <h3 className="text-lg font-bold font-arabic mb-4">أداة بناء نظرية التغيير</h3>
        <p className="text-gray-600 font-arabic mb-4">
          استخدم هذه الأداة لتصميم وتطوير نظرية التغيير للمبادرات الجديدة
        </p>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" />
          بناء نظرية تغيير جديدة
        </Button>
      </GenericCard>
    </div>
  );
};

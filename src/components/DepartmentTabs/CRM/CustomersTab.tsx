
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Search, Plus, Filter, Mail, Phone, MapPin, Star, Calendar, TrendingUp } from 'lucide-react';
import { mockCustomers } from './data';

export const CustomersTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedCustomerData = selectedCustomer ? 
    mockCustomers.find(c => c.id === selectedCustomer) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'churned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'prospect': return 'محتمل';
      case 'inactive': return 'غير نشط';
      case 'churned': return 'منقطع';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في العملاء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="prospect">محتمل</option>
            <option value="inactive">غير نشط</option>
            <option value="churned">منقطع</option>
          </select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" />
          إضافة عميل جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className="lg:col-span-1">
          <GenericCard>
            <h3 className="text-lg font-bold font-arabic mb-4 flex items-center">
              <Users className="ml-2 h-5 w-5" />
              قائمة العملاء ({filteredCustomers.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedCustomer === customer.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold font-arabic text-gray-900">{customer.name}</h4>
                      <p className="text-sm text-gray-600 font-arabic">{customer.company}</p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-arabic ${getStatusColor(customer.status)}`}>
                          {getStatusText(customer.status)}
                        </span>
                        {customer.satisfaction.npsScore > 0 && (
                          <div className="mr-2 flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 ml-1" />
                            <span className="text-xs text-gray-600">{customer.satisfaction.npsScore}/10</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 font-arabic">
                      {customer.totalValue > 0 && (
                        <div className="text-green-600 font-semibold">
                          {(customer.totalValue / 1000).toFixed(0)}ك ر.س
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GenericCard>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2">
          {selectedCustomerData ? (
            <div className="space-y-6">
              {/* Customer Profile */}
              <GenericCard>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold font-arabic text-gray-900">
                      {selectedCustomerData.name}
                    </h2>
                    <p className="text-lg text-gray-600 font-arabic">{selectedCustomerData.company}</p>
                    <div className="flex items-center mt-2">
                      <span className={`px-3 py-1 text-sm rounded-full font-arabic ${getStatusColor(selectedCustomerData.status)}`}>
                        {getStatusText(selectedCustomerData.status)}
                      </span>
                      <div className="mr-4 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 ml-1" />
                        <span className="text-sm text-gray-600 font-arabic">
                          عميل منذ {selectedCustomerData.customerSince}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    {selectedCustomerData.totalValue > 0 && (
                      <div className="text-2xl font-bold text-green-600">
                        {(selectedCustomerData.totalValue / 1000).toFixed(0)}ك ر.س
                      </div>
                    )}
                    <div className="text-sm text-gray-500 font-arabic">إجمالي القيمة</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold font-arabic text-gray-900 mb-3">معلومات الاتصال</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 ml-2" />
                        <span className="text-sm font-arabic">{selectedCustomerData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 ml-2" />
                        <span className="text-sm font-arabic">{selectedCustomerData.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                        <span className="text-sm font-arabic">{selectedCustomerData.city}, {selectedCustomerData.country}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold font-arabic text-gray-900 mb-3">التفضيلات</h4>
                    <div className="space-y-2 text-sm font-arabic">
                      <div>قناة التواصل المفضلة: {selectedCustomerData.preferences.communicationChannel}</div>
                      <div>أوقات التواصل: {selectedCustomerData.preferences.contactTiming}</div>
                      <div>نوع اللقاءات: {selectedCustomerData.preferences.meetingPreference}</div>
                    </div>
                  </div>
                </div>
              </GenericCard>

              {/* Customer Journey & Projects */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GenericCard>
                  <h4 className="font-semibold font-arabic text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="ml-2 h-4 w-4" />
                    المشاريع الحالية
                  </h4>
                  {selectedCustomerData.projects.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomerData.projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-3">
                          <h5 className="font-semibold font-arabic">{project.name}</h5>
                          <p className="text-sm text-gray-600 font-arabic mt-1">{project.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-green-600 font-arabic">
                              {(project.value / 1000).toFixed(0)}ك ر.س
                            </span>
                            {project.satisfaction && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 ml-1" />
                                <span className="text-xs text-gray-600">{project.satisfaction}/10</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 font-arabic text-center py-4">لا توجد مشاريع حالية</p>
                  )}
                </GenericCard>

                <GenericCard>
                  <h4 className="font-semibold font-arabic text-gray-900 mb-4">رضا العميل</h4>
                  {selectedCustomerData.satisfaction.npsScore > 0 ? (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {selectedCustomerData.satisfaction.npsScore}/10
                      </div>
                      <div className="text-sm text-gray-600 font-arabic mb-4">
                        درجة NPS
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${
                              i < selectedCustomerData.satisfaction.overallRating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 font-arabic">
                        آخر تقييم: {selectedCustomerData.satisfaction.lastSurveyDate}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 font-arabic">لم يتم تقييم العميل بعد</p>
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-arabic">
                        إرسال استطلاع رضا
                      </Button>
                    </div>
                  )}
                </GenericCard>
              </div>

              {/* Interaction History */}
              <GenericCard>
                <h4 className="font-semibold font-arabic text-gray-900 mb-4">تاريخ التفاعلات</h4>
                {selectedCustomerData.interactionHistory.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCustomerData.interactionHistory.map((interaction) => (
                      <div key={interaction.id} className="border-r-4 border-blue-400 bg-blue-50 p-4 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold font-arabic">{interaction.subject}</h5>
                          <span className="text-sm text-gray-500">{interaction.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 font-arabic mb-2">{interaction.summary}</p>
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span className="font-arabic">{interaction.employeeName}</span>
                          <div className="flex items-center">
                            <span className="font-arabic ml-2">المشاعر:</span>
                            <span className={`px-2 py-1 rounded ${
                              interaction.sentimentScore >= 7 ? 'bg-green-200 text-green-800' :
                              interaction.sentimentScore >= 5 ? 'bg-yellow-200 text-yellow-800' :
                              'bg-red-200 text-red-800'
                            }`}>
                              {interaction.sentimentScore}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 font-arabic text-center py-4">لا توجد تفاعلات مسجلة</p>
                )}
              </GenericCard>
            </div>
          ) : (
            <GenericCard>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold font-arabic text-gray-500 mb-2">
                  اختر عميلاً لعرض التفاصيل
                </h3>
                <p className="text-gray-400 font-arabic">
                  قم بالنقر على أحد العملاء من القائمة لعرض ملفه الكامل
                </p>
              </div>
            </GenericCard>
          )}
        </div>
      </div>
    </div>
  );
};

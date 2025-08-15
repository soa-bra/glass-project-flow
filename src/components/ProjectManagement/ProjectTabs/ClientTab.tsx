import React from 'react';
import { BaseProjectTabLayout } from '../BaseProjectTabLayout';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { User, MessageSquare, Star, Calendar } from 'lucide-react';

interface ClientTabProps {
  clientData?: any;
}

export const ClientTab: React.FC<ClientTabProps> = ({ clientData }) => {
  const clientStats = [
    {
      title: 'مستوى الرضا',
      value: '9.2',
      unit: '/10',
      description: 'تقييم العميل للمشروع'
    },
    {
      title: 'عدد الاجتماعات',
      value: '12',
      unit: 'اجتماع',
      description: 'منذ بداية المشروع'
    },
    {
      title: 'المراجعات المطلوبة',
      value: '3',
      unit: 'مراجعة',
      description: 'مراجعات معلقة'
    },
    {
      title: 'وقت الاستجابة',
      value: '2.5',
      unit: 'ساعة',
      description: 'متوسط وقت الاستجابة'
    }
  ];

  const mockClient = {
    name: 'شركة التقنية المتطورة',
    contact: 'أحمد محمد الأحمد',
    email: 'ahmed@tech-company.com',
    phone: '+966501234567',
    satisfaction: 9.2,
    projectType: 'تطوير موقع إلكتروني'
  };

  const communications = [
    { 
      date: '2024-01-25', 
      type: 'email', 
      subject: 'مراجعة التصميم النهائي',
      status: 'pending'
    },
    { 
      date: '2024-01-24', 
      type: 'meeting', 
      subject: 'اجتماع مراجعة المرحلة الثانية',
      status: 'completed'
    },
    { 
      date: '2024-01-23', 
      type: 'call', 
      subject: 'مناقشة التعديلات المطلوبة',
      status: 'completed'
    }
  ];

  return (
    <BaseProjectTabLayout
      value="client"
      title="إدارة العميل"
      icon={<User className="w-4 h-4" />}
      kpiStats={clientStats}
    >
      {/* Client Information */}
      <BaseCard title="معلومات العميل" icon={<User className="w-4 h-4" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">اسم الشركة</label>
              <p className="text-lg font-semibold text-gray-800">{mockClient.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">الشخص المسؤول</label>
              <p className="text-lg font-semibold text-gray-800">{mockClient.contact}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
              <p className="text-sm text-blue-600">{mockClient.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">رقم الهاتف</label>
              <p className="text-sm text-gray-800">{mockClient.phone}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">تقييم الرضا:</span>
                <span className="text-lg font-bold text-green-600">{mockClient.satisfaction}/10</span>
              </div>
              <div className="text-sm text-gray-600">
                نوع المشروع: {mockClient.projectType}
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      {/* Client Actions */}
      <BaseCard title="العمليات مع العميل" icon={<MessageSquare className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4">
          <BaseActionButton 
            variant="primary" 
            icon={<MessageSquare className="w-4 h-4" />}
          >
            إرسال رسالة
          </BaseActionButton>
          <BaseActionButton 
            variant="outline" 
            icon={<Calendar className="w-4 h-4" />}
          >
            جدولة اجتماع
          </BaseActionButton>
          <BaseActionButton 
            variant="secondary" 
            icon={<Star className="w-4 h-4" />}
          >
            طلب تقييم
          </BaseActionButton>
          <BaseActionButton 
            variant="ghost" 
            icon={<User className="w-4 h-4" />}
          >
            عرض الملف الكامل
          </BaseActionButton>
        </div>
      </BaseCard>

      {/* Communications History */}
      <BaseCard title="سجل التواصل" icon={<Calendar className="w-4 h-4" />}>
        <div className="space-y-3">
          {communications.map((comm, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${comm.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{comm.subject}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{comm.date}</span>
                    <span>•</span>
                    <span>{comm.type === 'email' ? 'بريد إلكتروني' : comm.type === 'meeting' ? 'اجتماع' : 'مكالمة'}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                comm.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {comm.status === 'completed' ? 'مكتمل' : 'معلق'}
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </BaseProjectTabLayout>
  );
};
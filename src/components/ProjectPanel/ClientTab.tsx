
import React from 'react';
import { ProjectData } from './types';
import { User, Building, Mail, Phone, Star, MessageCircle } from 'lucide-react';

interface ClientTabProps {
  projectData: ProjectData;
  loading: boolean;
}

export const ClientTab: React.FC<ClientTabProps> = ({ projectData, loading }) => {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-[10px] rounded-[20px] p-4 animate-pulse">
            <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const satisfactionLevel = Math.round(projectData.client.satisfaction / 20);

  return (
    <div className="p-6 space-y-6">
      {/* معلومات العميل الأساسية */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 font-arabic">معلومات العميل</h3>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">اسم العميل</p>
              <p className="font-semibold text-gray-800">{projectData.client.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">الشركة</p>
              <p className="font-semibold text-gray-800">{projectData.client.company}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">البريد الإلكتروني</p>
              <p className="font-semibold text-blue-600">{projectData.client.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">رقم الهاتف</p>
              <p className="font-semibold text-gray-800" dir="ltr">{projectData.client.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* مستوى الرضا */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">مستوى رضا العميل</h3>
          <MessageCircle className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {projectData.client.satisfaction}%
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {renderStars(satisfactionLevel)}
          </div>
          <p className="text-sm text-gray-600">
            {satisfactionLevel === 5 ? 'ممتاز' : 
             satisfactionLevel === 4 ? 'جيد جداً' : 
             satisfactionLevel === 3 ? 'جيد' : 
             satisfactionLevel === 2 ? 'مقبول' : 'ضعيف'}
          </p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              projectData.client.satisfaction >= 80 ? 'bg-green-500' :
              projectData.client.satisfaction >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${projectData.client.satisfaction}%` }}
          ></div>
        </div>
      </div>

      {/* التفاعلات الأخيرة */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">التفاعلات الأخيرة</h3>
        
        <div className="space-y-3">
          <div className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-4 border border-white/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">اجتماع مراجعة المشروع</h4>
                <p className="text-sm text-gray-600 mb-2">مناقشة التقدم المحرز وتحديد الخطوات التالية</p>
                <p className="text-xs text-gray-500">منذ 3 أيام</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-4 border border-white/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">تأكيد موافقة التصميم</h4>
                <p className="text-sm text-gray-600 mb-2">تم الموافقة على التصميمات المقترحة</p>
                <p className="text-xs text-gray-500">منذ أسبوع</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

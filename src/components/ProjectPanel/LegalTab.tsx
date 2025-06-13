
import React from 'react';
import { ProjectData } from './types';
import { FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface LegalTabProps {
  projectData: ProjectData;
  loading: boolean;
}

export const LegalTab: React.FC<LegalTabProps> = ({ projectData, loading }) => {
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

  const legalDocuments = [
    { name: 'عقد المشروع الأساسي', status: 'signed', date: '2025-06-01' },
    { name: 'اتفاقية عدم الإفصاح', status: 'signed', date: '2025-06-01' },
    { name: 'تعديل العقد رقم 1', status: 'pending', date: '2025-06-15' },
    { name: 'شروط الدفع المحدثة', status: 'review', date: '2025-06-20' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'review': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'signed': return 'موقّع';
      case 'pending': return 'قيد الانتظار';
      case 'review': return 'قيد المراجعة';
      default: return 'غير محدد';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle size={16} />;
      case 'pending': return <AlertCircle size={16} />;
      case 'review': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ملخص الحالة القانونية */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 font-arabic">الحالة القانونية</h3>
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">2</p>
            <p className="text-sm text-gray-600">وثائق موقعة</p>
          </div>
          
          <div className="text-center p-3 bg-yellow-100 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">1</p>
            <p className="text-sm text-gray-600">قيد الانتظار</p>
          </div>
          
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">1</p>
            <p className="text-sm text-gray-600">قيد المراجعة</p>
          </div>
        </div>
      </div>

      {/* قائمة الوثائق القانونية */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">الوثائق القانونية</h3>
        
        <div className="space-y-3">
          {legalDocuments.map((doc, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-4 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(doc.status)}`}>
                  {getStatusIcon(doc.status)}
                  <span>{getStatusLabel(doc.status)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                تاريخ الإنشاء: {new Date(doc.date).toLocaleDateString('ar-SA')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* الإجراءات المطلوبة */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">الإجراءات المطلوبة</h3>
        
        <div className="space-y-3">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">مراجعة تعديل العقد</h4>
                <p className="text-sm text-yellow-700">يتطلب مراجعة وموافقة على التعديلات المقترحة في العقد</p>
                <p className="text-xs text-yellow-600 mt-1">الموعد النهائي: 25 يونيو 2025</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800">تحديث شروط الدفع</h4>
                <p className="text-sm text-blue-700">مراجعة وتوقيع شروط الدفع المحدثة</p>
                <p className="text-xs text-blue-600 mt-1">الموعد النهائي: 30 يونيو 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

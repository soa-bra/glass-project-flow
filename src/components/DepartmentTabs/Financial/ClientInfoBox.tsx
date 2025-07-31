import React from 'react';
import { X, Phone, Mail, MapPin, Calendar, Star, Building } from 'lucide-react';

interface ClientData {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalProjects: number;
  satisfaction: number;
  contractStatus: string;
}

interface ClientInfoBoxProps {
  client: ClientData | null;
  onClose: () => void;
}

const mockClientData: { [key: string]: ClientData } = {
  'شركة الأمل': {
    name: 'أحمد محمد',
    company: 'شركة الأمل للتجارة',
    email: 'ahmed@alamal.com',
    phone: '+966 50 123 4567',
    address: 'الرياض، المملكة العربية السعودية',
    joinDate: '2023-01-15',
    totalProjects: 5,
    satisfaction: 4.8,
    contractStatus: 'نشط'
  },
  'مؤسسة الرؤية': {
    name: 'فاطمة العلي',
    company: 'مؤسسة الرؤية للاستشارات',
    email: 'fatima@vision.com',
    phone: '+966 55 987 6543',
    address: 'جدة، المملكة العربية السعودية',
    joinDate: '2023-03-20',
    totalProjects: 3,
    satisfaction: 4.5,
    contractStatus: 'نشط'
  },
  'شركة النجاح': {
    name: 'محمد السعيد',
    company: 'شركة النجاح للتطوير',
    email: 'mohammed@success.com',
    phone: '+966 56 456 7890',
    address: 'الدمام، المملكة العربية السعودية',
    joinDate: '2022-11-10',
    totalProjects: 8,
    satisfaction: 4.2,
    contractStatus: 'نشط'
  },
  'مجموعة التقدم': {
    name: 'سارة أحمد',
    company: 'مجموعة التقدم',
    email: 'sara@progress.com',
    phone: '+966 50 321 6547',
    address: 'المدينة المنورة، المملكة العربية السعودية',
    joinDate: '2023-05-08',
    totalProjects: 2,
    satisfaction: 4.9,
    contractStatus: 'نشط'
  }
};

export const ClientInfoBox: React.FC<ClientInfoBoxProps> = ({ client, onClose }) => {
  if (!client) return null;

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'نشط':
        return 'bg-green-100 text-green-800';
      case 'منتهي':
        return 'bg-red-100 text-red-800';
      case 'معلق':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-black/10 rounded-3xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-black font-arabic">معلومات العميل</h3>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">الشركة</p>
              <p className="font-semibold text-black font-arabic">{client.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="font-medium text-black">{client.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">رقم الهاتف</p>
              <p className="font-medium text-black">{client.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">العنوان</p>
              <p className="font-medium text-black font-arabic">{client.address}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">تاريخ الانضمام</p>
              <p className="font-medium text-black">{client.joinDate}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">حالة العقد</p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getContractStatusColor(client.contractStatus)}`}>
              {client.contractStatus}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">إجمالي المشاريع</p>
            <p className="text-xl font-bold text-black">{client.totalProjects}</p>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <div>
              <p className="text-sm text-gray-500">مستوى الرضا</p>
              <p className="font-bold text-black">{client.satisfaction}/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getClientData = (clientName: string): ClientData | null => {
  return mockClientData[clientName] || null;
};
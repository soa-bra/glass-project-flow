import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Building, Calendar, User } from 'lucide-react';
interface ClientData {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  contractStatus: 'active' | 'pending' | 'expired';
  joinDate: string;
  totalProjects: number;
  sentiment?: number;
}
interface ClientProfileProps {
  client: ClientData;
}
export const ClientProfile: React.FC<ClientProfileProps> = ({
  client
}) => {
  const getContractStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'نشط'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'قيد المراجعة'
        };
      case 'expired':
        return {
          color: 'bg-red-100 text-red-800',
          text: 'منتهي'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'غير محدد'
        };
    }
  };
  const statusConfig = getContractStatusConfig(client.contractStatus);
  return <div className="space-y-4">
      {/* بيانات العميل الأساسية */}
      <div className="bg-[#FFFFFF] rounded-[41px] p-6 border border-[#DADCE0] relative">
        {/* زر عرض الملف في الزاوية العليا */}
        <div className="absolute top-4 left-4">
          <Button size="sm" className="gap-1 px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-black transition-colors">
            عرض الملف
          </Button>
        </div>

        {/* معلومات العميل الرئيسية */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src={client.avatar} alt={client.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <BaseBadge variant="secondary" className={statusConfig.color}>
                {statusConfig.text}
              </BaseBadge>
            </div>
            <div>
              <h3 className="font-bold text-lg">{client.name}</h3>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Building className="w-4 h-4" />
                {client.company}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm w-full">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{client.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>انضم في: {client.joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] rounded-[35px] p-6 text-center border border-[#DADCE0] ">
          <p className="text-2xl font-bold text-primary">{client.totalProjects}</p>
          <p className="text-xs text-gray-600">إجمالي المشاريع</p>
        </div>
        <div className="bg-[#FFFFFF] rounded-[35px] p-6 text-center border border-[#DADCE0] ">
          <p className="text-2xl font-bold text-black">
            {client.sentiment ? Math.round(client.sentiment * 100) : 0}%
          </p>
          <p className="text-xs text-gray-600">مستوى الرضا</p>
        </div>
        <div className="bg-[#FFFFFF] rounded-[35px] p-6 text-center border border-[#DADCE0] ">
          <p className="text-2xl font-bold text-primary">4.8</p>
          <p className="text-xs text-gray-600">التقييم العام</p>
        </div>
      </div>
    </div>;
};
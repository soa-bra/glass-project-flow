
import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Star, Building } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ClientInfoTabProps {
  project: ProjectCardProps;
  tint: string;
}

const mockClientData = {
  name: 'شركة سوبرا للتقنية',
  email: 'contact@soabra.com',
  phone: '+966 12 345 6789',
  company: 'SoaBra Tech Solutions',
  satisfaction: 85,
  projectsCount: 12,
  totalValue: 150000
};

export const ClientInfoTab: React.FC<ClientInfoTabProps> = ({ project, tint }) => {
  const satisfactionColor = mockClientData.satisfaction >= 80 ? '#22c55e' : 
                          mockClientData.satisfaction >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div 
      className="h-full p-6 overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Client Contact Card */}
      <motion.div 
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">بيانات الاتصال</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
              <Building size={20} className="text-gray-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-800 font-arabic">{mockClientData.name}</div>
              <div className="text-sm text-gray-600">{mockClientData.company}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/20 rounded-xl">
              <Mail size={18} className="text-gray-600" />
              <div>
                <div className="text-sm text-gray-600 font-arabic">البريد الإلكتروني</div>
                <div className="font-semibold text-gray-800">{mockClientData.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/20 rounded-xl">
              <Phone size={18} className="text-gray-600" />
              <div>
                <div className="text-sm text-gray-600 font-arabic">رقم الهاتف</div>
                <div className="font-semibold text-gray-800">{mockClientData.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Client Satisfaction */}
      <motion.div 
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">رضا العميل</h3>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-arabic text-gray-600">مستوى الرضا</span>
              <span className="font-bold text-gray-800">{mockClientData.satisfaction}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                className="h-3 rounded-full transition-all duration-1000"
                style={{ backgroundColor: satisfactionColor }}
                initial={{ width: 0 }}
                animate={{ width: `${mockClientData.satisfaction}%` }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={20} 
                className={`${
                  star <= Math.floor(mockClientData.satisfaction / 20) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/20 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">{mockClientData.projectsCount}</div>
            <div className="text-sm text-gray-600 font-arabic">مشاريع مُنجزة</div>
          </div>
          <div className="text-center p-3 bg-white/20 rounded-xl">
            <div className="text-2xl font-bold" style={{ color: tint }}>
              {mockClientData.totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-arabic">إجمالي القيمة</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

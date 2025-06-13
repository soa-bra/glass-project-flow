
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface Contract {
  id: string;
  title: string;
  status: 'signed' | 'pending' | 'expiring' | 'expired';
  expiryDate: string;
  value: string;
}

interface LegalTabProps {
  project: ProjectCardProps;
  tint: string;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    title: 'عقد التطوير الرئيسي',
    status: 'signed',
    expiryDate: '2025-12-31',
    value: '15,000'
  },
  {
    id: '2',
    title: 'اتفاقية الدعم الفني',
    status: 'expiring',
    expiryDate: '2025-02-15',
    value: '5,000'
  },
  {
    id: '3',
    title: 'عقد الاستضافة',
    status: 'pending',
    expiryDate: '2025-06-30',
    value: '2,000'
  }
];

export const LegalTab: React.FC<LegalTabProps> = ({ project, tint }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle size={20} className="text-green-600" />;
      case 'pending': return <Clock size={20} className="text-yellow-600" />;
      case 'expiring': return <AlertTriangle size={20} className="text-orange-600" />;
      case 'expired': return <AlertTriangle size={20} className="text-red-600" />;
      default: return <FileText size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expiring': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'signed': return 'موقع';
      case 'pending': return 'في الانتظار';
      case 'expiring': return 'ينتهي قريباً';
      case 'expired': return 'منتهي';
      default: return 'غير محدد';
    }
  };

  const expiringContracts = mockContracts.filter(contract => contract.status === 'expiring');

  return (
    <motion.div 
      className="h-full p-6 overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Expiring Contracts Alert */}
      {expiringContracts.length > 0 && (
        <motion.div 
          className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-red-600" />
            <div>
              <h3 className="font-bold text-red-800 font-arabic">تنبيه: عقود تنتهي قريباً</h3>
              <p className="text-red-700 font-arabic text-sm">
                {expiringContracts.length} عقود تحتاج إلى تجديد قبل انتهاء صلاحيتها
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockContracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/30 transition-all duration-200 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(contract.status)}
                <div>
                  <h3 className="font-semibold font-arabic text-gray-800">
                    {contract.title}
                  </h3>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-arabic border ${getStatusColor(contract.status)}`}>
                {getStatusText(contract.status)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 font-arabic">تاريخ الانتهاء:</span>
                <span className="text-sm font-semibold text-gray-800">{contract.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 font-arabic">القيمة:</span>
                <span className="text-sm font-semibold" style={{ color: tint }}>
                  {contract.value} ر.س
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

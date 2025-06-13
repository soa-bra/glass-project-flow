
import React from 'react';
import { Project } from '@/types/project';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface LegalTabProps {
  project: Project;
}

export const LegalTab: React.FC<LegalTabProps> = ({ project }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'expired': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'expired': return 'منتهي';
      default: return 'معلق';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {project.contracts.filter(c => c.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">عقود نشطة</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {project.contracts.filter(c => c.status === 'expired').length}
            </div>
            <p className="text-sm text-gray-600">عقود منتهية</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {project.contracts.filter(c => c.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">عقود معلقة</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4">العقود والمستندات</h3>
        <div className="space-y-3">
          {project.contracts.map((contract) => (
            <div
              key={contract.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(contract.status)}
                <div>
                  <div className="font-medium text-gray-800">{contract.name}</div>
                  <div className="text-sm text-gray-600">
                    انتهاء: {new Date(contract.expiryDate).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">
                  {contract.value.toLocaleString()} ر.س
                </div>
                <div className="text-xs text-gray-600">
                  {getStatusText(contract.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

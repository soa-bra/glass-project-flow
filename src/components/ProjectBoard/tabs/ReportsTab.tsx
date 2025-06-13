
import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface Report {
  id: string;
  title: string;
  type: 'pdf' | 'excel' | 'word';
  date: string;
  size: string;
}

interface ReportsTabProps {
  project: ProjectCardProps;
  tint: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'تقرير التقدم الشهري - يناير',
    type: 'pdf',
    date: '2025-01-15',
    size: '2.4 MB'
  },
  {
    id: '2',
    title: 'تحليل الميزانية والتكاليف',
    type: 'excel',
    date: '2025-01-10',
    size: '1.8 MB'
  },
  {
    id: '3',
    title: 'ملخص المشروع التنفيذي',
    type: 'word',
    date: '2025-01-05',
    size: '950 KB'
  }
];

const progressData = [
  { week: 'الأسبوع 1', progress: 15 },
  { week: 'الأسبوع 2', progress: 32 },
  { week: 'الأسبوع 3', progress: 48 },
  { week: 'الأسبوع 4', progress: 65 },
  { week: 'الأسبوع 5', progress: 78 },
  { week: 'الأسبوع 6', progress: 85 },
];

export const ReportsTab: React.FC<ReportsTabProps> = ({ project, tint }) => {
  const getFileIcon = (type: string) => {
    return <FileText size={20} className="text-gray-600" />;
  };

  return (
    <motion.div 
      className="h-full p-6 overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Progress Chart */}
      <motion.div 
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 size={24} className="text-gray-600" />
          <h3 className="text-xl font-bold font-arabic text-gray-800">مخطط الإنجاز</h3>
        </div>
        
        <div className="space-y-3">
          {progressData.map((item, index) => (
            <motion.div 
              key={item.week}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <div className="w-20 text-sm font-arabic text-gray-600">
                {item.week}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="h-2 rounded-full"
                  style={{ backgroundColor: tint }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                />
              </div>
              <div className="w-12 text-sm font-semibold text-gray-800">
                {item.progress}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div 
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">التقارير المتاحة</h3>
        
        <div className="space-y-3">
          {mockReports.map((report, index) => (
            <motion.div
              key={report.id}
              className="flex items-center justify-between p-4 bg-white/20 rounded-xl border border-white/20 hover:bg-white/30 transition-all duration-200 cursor-pointer group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-4">
                {getFileIcon(report.type)}
                <div>
                  <h4 className="font-semibold font-arabic text-gray-800">
                    {report.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{report.date}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors group-hover:scale-110"
                style={{ 
                  borderColor: tint,
                  color: tint 
                }}
              >
                <Download size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

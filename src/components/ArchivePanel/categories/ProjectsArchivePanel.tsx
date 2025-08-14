
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Briefcase, Calendar, User, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ProjectsArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockProjects = [
    {
      id: '1',
      title: 'حملة إعلانية للمنتج الجديد X',
      client: 'شركة التقنية المتقدمة',
      startDate: '2023-06-01',
      endDate: '2023-09-30',
      budget: '150,000',
      team: ['أحمد محمد', 'سارة أحمد', 'محمد عبدالله'],
      status: 'مكتمل',
      completion: 100,
      category: 'تسويق وإعلان',
      deliverables: 12
    },
    {
      id: '2', 
      title: 'تطوير نظام إدارة المحتوى الداخلي',
      client: 'سوبرا الداخلي',
      startDate: '2023-08-15',
      endDate: '2023-12-20',
      budget: '80,000',
      team: ['فاطمة علي', 'خالد سعد'],
      status: 'مكتمل',
      completion: 100,
      category: 'تطوير تقني',
      deliverables: 8
    },
    {
      id: '3',
      title: 'استراتيجية العلامة التجارية الجديدة',
      client: 'مجموعة الأعمال الكبرى',
      startDate: '2023-03-01',
      endDate: '2023-07-15',
      budget: '200,000',
      team: ['منى حسن', 'علي أحمد', 'نور محمد'],
      status: 'مكتمل',
      completion: 100,
      category: 'استراتيجية العلامة',
      deliverables: 15
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'متأخر': return 'bg-red-100 text-red-800';
      case 'قيد التنفيذ': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="text-display-m font-bold text-soabra-ink font-arabic">
          المشاريع المكتملة
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-soabra-ink text-soabra-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            تقرير المشاريع
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            تصفية حسب الفترة
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="bg-[#FFFFFF] p-4 rounded-[40px] ring-1 ring-[#DADCE0]">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في المشاريع المكتملة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full ring-1 ring-[#DADCE0] focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <div key={project.id} className="bg-[#FFFFFF] p-6 rounded-[40px] ring-1 ring-[#DADCE0]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-black font-arabic text-lg">{project.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      {project.status}
                    </div>
                    <Badge variant="secondary" className="font-arabic">
                      {project.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1 font-arabic">
                      <Briefcase className="w-4 h-4" />
                      {project.client}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {project.startDate} - {project.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {project.budget} ر.س
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-gray-600 font-arabic">
                      المسلمات: {project.deliverables}
                    </span>
                    <span className="text-sm text-gray-600 font-arabic">
                      الفريق: {project.team.length} أعضاء
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-arabic">
                      {project.team.join('، ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" className="bg-soabra-ink text-soabra-white rounded-full">
                    <Eye className="w-4 h-4 mr-1" />
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Download className="w-4 h-4 mr-1" />
                    تحميل الملفات
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 font-arabic">التقدم</span>
                  <span className="text-sm text-gray-600">{project.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

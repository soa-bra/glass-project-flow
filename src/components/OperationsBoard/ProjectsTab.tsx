
import React from 'react';

interface ProjectItem {
  id: number;
  name: string;
  status: string;
  manager: string;
}

interface ProjectsTabProps {
  data?: {
    projects: ProjectItem[];
  };
  loading: boolean;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 font-arabic">
        جاري تحميل المشاريع...
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">
          إدارة المشاريع
        </h2>
        <p className="text-gray-600 text-sm">رصد المشاريع وحالتها التشغيلية</p>
      </div>
      <div className="rounded-2xl bg-white/40 shadow-lg p-6 backdrop-blur-[20px] border border-white/40">
        <table className="w-full text-right font-arabic">
          <thead>
            <tr className="bg-[#eafae1]/60">
              <th className="py-2 px-4 rounded-l-2xl">المسؤول</th>
              <th className="py-2 px-4">الحالة</th>
              <th className="py-2 px-4 rounded-r-2xl">اسم المشروع</th>
            </tr>
          </thead>
          <tbody>
            {data.projects.map((project) => (
              <tr key={project.id} className="border-b last:border-b-0">
                <td className="py-2 px-4">{project.manager}</td>
                <td className="py-2 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs bg-soabra-status-${project.status === "نشط" ? "success" : project.status === "متأخر" ? "warning" : "neutral"} text-gray-800`}>
                    {project.status}
                  </span>
                </td>
                <td className="py-2 px-4">{project.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

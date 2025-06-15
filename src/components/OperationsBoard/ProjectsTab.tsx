import React from 'react';
import { ProjectsOverview } from './Projects/ProjectsOverview';
import { ProjectsProgress } from './Projects/ProjectsProgress';
import { TasksDistribution } from './Projects/TasksDistribution';
import { ProjectsDeadlines } from './Projects/ProjectsDeadlines';
import { ProjectKPICards } from "./Projects/ProjectKPICards";

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
    <div className="h-full w-full space-y-5 font-arabic px-1">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-[#23272F] mb-1">
          إدارة المشاريع
        </h2>
        <p className="text-soabra-text-secondary text-sm">
          رصد المشاريع وحالتها التشغيلية
        </p>
      </div>

      {/* KPIs Cards Row */}
      <ProjectKPICards />

      {/* شبكة البطاقات - المكونات الجديدة */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <ProjectsOverview />
        <ProjectsProgress />
        <TasksDistribution />
        <ProjectsDeadlines />
      </div>

      {/* جدول المشاريع - عرض تقليدي أسفل البطاقات*/}
      <div
        className="
          rounded-3xl glass-enhanced
          p-0 overflow-x-auto mx-auto
          border border-white/40 shadow-xl
          bg-white/40 backdrop-blur-[20px] font-arabic
          max-w-[670px]
        "
        style={{
          fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
          direction: 'rtl' as any
        }}
      >
        <table className="w-full text-right font-arabic">
          <thead>
            <tr className="bg-[#eafae1]/70 font-semibold text-[#29936c]">
              <th className="py-3 px-4 rounded-l-3xl text-base">المسؤول</th>
              <th className="py-3 px-4 text-base">الحالة</th>
              <th className="py-3 px-4 rounded-r-3xl text-base">اسم المشروع</th>
            </tr>
          </thead>
          <tbody>
            {data.projects.map((project, idx) => (
              <tr
                key={project.id}
                className={`
                  border-b last:border-b-0 transition-all duration-200
                  hover:bg-white/60 hover:backdrop-blur-md
                  ${idx % 2 ? 'bg-[#f6fbf3]/50' : ''}
                  animate-fade-in
                `}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <td className="py-2 px-4 text-gray-800 font-medium">{project.manager}</td>
                <td className="py-2 px-4 text-center">
                  <span
                    className={`
                      px-4 py-1 rounded-full text-xs font-semibold
                      ${
                        project.status === "نشط"
                          ? "bg-[#d8faf0]"
                          : project.status === "متأخر"
                          ? "bg-[#fff1d7]"
                          : "bg-[#f2f4f7]"
                      }
                      border border-white/50 shadow
                      transition-all
                      text-[#23272f]
                    `}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="py-2 px-4 text-[#222a29]">{project.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

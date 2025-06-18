
import React from 'react';

interface ProjectSummary {
  id: number;
  title: string;
  type: string;
  progress: number;
  status: 'active' | 'completed' | 'delayed';
  date: string;
}

interface ProjectSummaryPanelProps {
  projects: ProjectSummary[];
}

export const ProjectSummaryPanel: React.FC<ProjectSummaryPanelProps> = ({ projects }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#d9d2fd';
      case 'completed': return '#bdeed3';
      case 'delayed': return '#fbe2aa';
      default: return '#a4e2f6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🔄';
      case 'completed': return '✅';
      case 'delayed': return '⚠️';
      default: return '📋';
    }
  };

  return (
    <div className="project-summary-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">ملخص المشاريع</h3>
        <div className="text-right">
          <div className="text-xs text-gray-600 font-arabic">هذا النص هنا للشكل المرئي - 140</div>
          <div className="text-xs text-gray-600 font-arabic">هذا النص هنا للشكل المرئي - 50</div>
          <div className="text-xs text-gray-600 font-arabic">النص هنا - 02</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={project.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm shadow-sm">
                {getStatusIcon(project.status)}
              </div>
              <div>
                <h4 className="font-bold text-sm font-arabic text-gray-900">{project.title}</h4>
                <p className="text-xs text-gray-600 font-arabic">{project.type}</p>
              </div>
            </div>
            <div className="text-left flex items-center gap-4">
              {/* شريط التقدم البصري */}
              <div className="w-16 h-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, barIndex) => (
                  <div
                    key={barIndex}
                    className="flex-1 rounded-full"
                    style={{
                      backgroundColor: index === 1 && barIndex === 2 
                        ? '#000000'
                        : 'rgba(242,255,255,0.8)',
                      height: index === 1 && barIndex === 2 ? '8px' : '3px'
                    }}
                  />
                ))}
              </div>
              <div>
                <div 
                  className="px-2 py-1 rounded-full text-xs font-arabic text-white"
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {project.progress}%
                </div>
                <p className="text-xs text-gray-500 mt-1 font-arabic">{project.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

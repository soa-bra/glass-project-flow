
import React from 'react';
import { Project } from '@/types/project';
import { User, Clock } from 'lucide-react';

interface WorkInfoTabProps {
  project: Project;
}

export const WorkInfoTab: React.FC<WorkInfoTabProps> = ({ project }) => {
  const totalHours = project.team.reduce((sum, member) => sum + member.hoursAssigned, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <User className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">{project.team.length}</span>
          </div>
          <p className="text-sm text-gray-600">أعضاء الفريق</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-800">{totalHours}</span>
          </div>
          <p className="text-sm text-gray-600">إجمالي الساعات</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4">أعضاء الفريق</h3>
        <div className="space-y-3">
          {project.team.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.role}</div>
                </div>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">{member.hoursAssigned}h</div>
                <div className="text-xs text-gray-600">ساعات مخصصة</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

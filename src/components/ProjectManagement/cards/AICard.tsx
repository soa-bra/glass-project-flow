
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Project } from '@/types/project';

interface AICardProps {
  project: Project;
}

export const AICard: React.FC<AICardProps> = ({ project }) => {
  const suggestions = [
    {
      id: 1,
      type: 'team',
      title: 'إضافة مطور واجهات',
      description: 'يُنصح بإضافة مطور واجهات متخصص لتسريع العمل في المرحلة القادمة',
      priority: 'high'
    },
    {
      id: 2,
      type: 'budget',
      title: 'مراجعة الميزانية',
      description: 'تم صرف 75% من الميزانية، يُنصح بمراجعة المصروفات المتبقية',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'legal',
      title: 'تجديد التراخيص',
      description: 'ينتهي ترخيص البرمجيات المستخدمة في 15 يوماً',
      priority: 'high'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'team': return '👥';
      case 'budget': return '💰';
      case 'legal': return '⚖️';
      default: return '🤖';
    }
  };

  return (
    <div className="h-full rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
          🤖
        </div>
        <h3 className="text-lg font-arabic font-semibold">اقتراحات الذكاء الاصطناعي</h3>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="text-lg">{getTypeIcon(suggestion.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-arabic font-semibold text-gray-800">{suggestion.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority === 'high' ? 'عالي' : suggestion.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </span>
                </div>
                <p className="text-sm font-arabic text-gray-600">{suggestion.description}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors">
                تطبيق
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-colors">
                تجاهل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

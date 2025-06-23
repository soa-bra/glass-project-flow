
import React from 'react';
import { Project } from '@/types/project';
import { Plus } from 'lucide-react';

interface TaskListCardProps {
  project: Project;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ project }) => {
  const tasks = [
    {
      id: 1,
      title: 'تصميم الواجهة',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '28 May',
      assignee: 'د. أسامة',
      members: 'غير مضيف',
      daysLeft: 1,
      priority: 'urgent-not-important' // عاجل غير مهم
    },
    {
      id: 2,
      title: 'كتابة الكود',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '29 May',
      assignee: 'د. أسامة',
      members: 'عضو',
      daysLeft: 1,
      priority: 'urgent-important' // عاجل مهم
    },
    {
      id: 3,
      title: 'تطوير قواعد البيانات',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '01 Jun',
      assignee: 'د. أسامة',
      members: 'عضوين',
      daysLeft: 1,
      priority: 'not-urgent-important' // غير عاجل مهم
    },
    {
      id: 4,
      title: 'التسليم',
      description: 'تسليم الموقع النهائي',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '05 Jun',
      assignee: 'د. أسامة',
      members: 'غير مضيف',
      daysLeft: 1,
      priority: 'not-urgent-not-important' // غير عاجل غير مهم
    }
  ];

  const getPriorityBubbleStyle = (priority: string) => {
    switch (priority) {
      case 'urgent-important':
        return { backgroundColor: '#F2F9FB' };
      case 'urgent-not-important':
        return { backgroundColor: '#A4E2F6' };
      case 'not-urgent-important':
        return { backgroundColor: '#FBE2AA' };
      case 'not-urgent-not-important':
        return { backgroundColor: '#D9D2FD' };
      default:
        return { backgroundColor: '#F2F9FB' };
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent-important':
        return { line1: 'عاجل', line2: 'مهم' };
      case 'urgent-not-important':
        return { line1: 'عاجل', line2: 'غير مهم' };
      case 'not-urgent-important':
        return { line1: 'غير عاجل', line2: 'مهم' };
      case 'not-urgent-not-important':
        return { line1: 'غير عاجل', line2: 'غير مهم' };
      default:
        return { line1: 'عاجل', line2: 'مهم' };
    }
  };

  return (
    <div 
      style={{ background: '#A6BBC4' }} 
      className="h-full p-6 rounded-3xl"
    >
      {/* الرأس */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-arabic font-semibold text-gray-800">قائمة المهام</h3>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="w-8 h-8 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors">
            <span className="text-sm text-gray-600">•••</span>
          </button>
        </div>
      </div>

      {/* قائمة المهام */}
      <div className="space-y-4 max-h-[calc(100%-120px)] overflow-y-auto">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className="mx-auto font-arabic"
            style={{
              width: '360px',
              minHeight: '180px',
              backgroundColor: '#EAF2F5',
              borderRadius: '32px',
              padding: '24px',
              position: 'relative',
              direction: 'rtl'
            }}
          >
            {/* دائرة الأيام المتبقية - يسار أعلى */}
            <div 
              style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '2px solid #000000',
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#000000', lineHeight: 1 }}>
                {task.daysLeft.toString().padStart(2, '0')}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 400, color: '#000000', marginTop: '4px' }}>
                يوم
              </span>
            </div>

            {/* فقاعة الأولوية - يمين أعلى */}
            <div 
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                ...getPriorityBubbleStyle(task.priority),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000', lineHeight: 1 }}>
                {getPriorityText(task.priority).line1}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 400, color: '#000000', marginTop: '2px' }}>
                {getPriorityText(task.priority).line2}
              </span>
            </div>

            {/* العنوان الرئيسي */}
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <h4 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                color: '#000000', 
                marginBottom: '8px',
                lineHeight: 1.2
              }}>
                {task.title}
              </h4>
              
              {/* العنوان الفرعي */}
              <p style={{ 
                fontSize: '16px', 
                fontWeight: 400, 
                color: '#858789',
                marginBottom: '24px',
                lineHeight: 1.2
              }}>
                {task.description}
              </p>
            </div>

            {/* شريط الكبسولات السفلي */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {/* كبسولة التاريخ */}
              <div style={{
                backgroundColor: '#F7FFFF',
                borderRadius: '24px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#000000'
              }}>
                {task.date}
              </div>

              {/* كبسولة المسؤول */}
              <div style={{
                backgroundColor: '#F7FFFF',
                borderRadius: '24px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#000000'
              }}>
                {task.assignee}
              </div>

              {/* كبسولة الأعضاء */}
              <div style={{
                backgroundColor: '#F7FFFF',
                borderRadius: '24px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#000000'
              }}>
                {task.members}
              </div>

              {/* كبسولة الحالة مع النقطة */}
              <div style={{
                backgroundColor: '#F7FFFF',
                borderRadius: '24px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: task.statusColor
                }}></div>
                {task.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

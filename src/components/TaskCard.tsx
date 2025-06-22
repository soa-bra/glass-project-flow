
import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { Menu } from '@headlessui/react';
import type { TaskData } from '@/types';

type TaskCardProps = TaskData;

const getPriorityColor = (priority: TaskCardProps['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500 text-white';
    case 'medium':
      return 'bg-yellow-500 text-white';
    case 'low':
      return 'bg-gray-400 text-white';
    default:
      return 'bg-gray-300';
  }
};

const getStageLabel = (stage: TaskCardProps['stage']) => {
  switch (stage) {
    case 'planning':
      return 'تخطيط';
    case 'development':
      return 'تطوير';
    case 'testing':
      return 'اختبار';
    case 'review':
      return 'مراجعة';
    case 'completed':
      return 'مكتملة';
    default:
      return stage;
  }
};

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  dueDate,
  assignee,
  priority,
  stage,
}) => {
  return (
    <div className="bg-[#F4F6FA] rounded-t-2xl rounded-b-md px-4 py-3 shadow-sm border border-gray-200 relative font-arabic text-right">
      {/* النقاط الثلاثية */}
      <Menu as="div" className="absolute top-3 left-3">
        <Menu.Button>
          <HiDotsVertical className="w-5 h-5 text-gray-500" />
        </Menu.Button>
        <Menu.Items className="absolute z-10 bg-white border rounded-md shadow-md left-0 mt-2 text-sm">
          <Menu.Item>{({ active }) => <button className={`block w-full px-4 py-2 text-right ${active && 'bg-gray-100'}`}>تعديل</button>}</Menu.Item>
          <Menu.Item>{({ active }) => <button className={`block w-full px-4 py-2 text-right ${active && 'bg-gray-100'}`}>حذف</button>}</Menu.Item>
          <Menu.Item>{({ active }) => <button className={`block w-full px-4 py-2 text-right ${active && 'bg-gray-100'}`}>أرشفة</button>}</Menu.Item>
        </Menu.Items>
      </Menu>

      {/* الأولوية */}
      <div className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full ${getPriorityColor(priority)}`}>
        {priority === 'high' ? 'عاجل' : priority === 'medium' ? 'متوسطة' : 'منخفضة'}
      </div>

      <div className="text-lg font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-500">{description}</div>

      <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-700">
        <span className="bg-white px-2 py-1 rounded-full border">{dueDate}</span>
        <span className="bg-white px-2 py-1 rounded-full border">{assignee}</span>
        <span className="bg-white px-2 py-1 rounded-full border">{getStageLabel(stage)}</span>
      </div>
    </div>
  );
};

export default TaskCard;

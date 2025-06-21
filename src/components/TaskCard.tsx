import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { Menu } from '@headlessui/react';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  owner: string;
  members: string;
  status: 'مكتملة' | 'قيد التنفيذ' | 'متأخرة' | 'متوقفة' | 'تحت التجهيز';
  priority: 'عاجل مهم' | 'عاجل غير مهم' | 'غير عاجل مهم' | 'غير عاجل غير مهم';
}

const getPriorityStyle = (priority: TaskCardProps['priority']) => {
  switch (priority) {
    case 'عاجل مهم':
      return 'bg-red-500 text-white';
    case 'عاجل غير مهم':
      return 'bg-blue-400 text-white';
    case 'غير عاجل مهم':
      return 'bg-yellow-400 text-white';
    case 'غير عاجل غير مهم':
      return 'bg-purple-300 text-white';
  }
};

const TaskCard: React.FC<TaskCardProps> = (task) => {
  return (
    <div className="bg-[#F4F6FA] rounded-t-2xl rounded-b-md px-4 py-3 shadow-sm border border-gray-200 relative">
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
      <div className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full ${getPriorityStyle(task.priority)}`}>
        {task.priority}
      </div>

      <div className="text-lg font-semibold text-gray-800">{task.title}</div>
      <div className="text-sm text-gray-500">{task.description}</div>

      <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-700">
        <span className="bg-white px-2 py-1 rounded-full border">{task.dueDate}</span>
        <span className="bg-white px-2 py-1 rounded-full border">{task.owner}</span>
        <span className="bg-white px-2 py-1 rounded-full border">{task.members}</span>
        <span className="bg-green-200 px-2 py-1 rounded-full border">وفق الخطة</span>
      </div>
    </div>
  );
};

export default TaskCard;

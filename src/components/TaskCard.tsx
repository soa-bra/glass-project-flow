
import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { Menu } from '@headlessui/react';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  dueDate: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, dueDate }) => {
  return (
    <div className="relative p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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

      {/* محتوى البطاقة */}
      <div className="pr-8">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="text-xs text-gray-500">{dueDate}</div>
      </div>
    </div>
  );
};

export default TaskCard;

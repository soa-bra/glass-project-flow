import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { Menu } from '@headlessui/react';

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
      </div>
    </div>
  );
};

export default TaskCard;

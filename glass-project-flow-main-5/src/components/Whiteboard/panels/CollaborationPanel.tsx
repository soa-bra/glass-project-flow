import React, { useEffect } from 'react';
import { useWhiteboardStore } from '../../../store/whiteboard';


const CollaborationPanel: React.FC = () => {
  const { occupants, setOccupants } = useWhiteboardStore((state) => ({
    occupants: state.occupants,
    setOccupants: state.setOccupants,
  }));
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOccupants(['أنت']);
    }, 500);
    return () => clearTimeout(timeout);
  }, [setOccupants]);
  return (
    <div className="p-4 text-sm h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3">التعاون</h2>
      {occupants.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">لا يوجد مشاركون آخرون حالياً.</p>
      ) : (
        <ul className="space-y-2">
          {occupants.map((name) => (
            <li key={name} className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs uppercase">
                {name.slice(0, 2)}
              </div>
              <span>{name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollaborationPanel;
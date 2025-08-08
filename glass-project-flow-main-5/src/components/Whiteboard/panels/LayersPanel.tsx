import React from 'react';

const LayersPanel: React.FC = () => {
  return (
    <div className="p-4 h-full overflow-y-auto text-sm">
      <h2 className="text-lg font-semibold mb-3">الطبقات</h2>
      <p className="text-gray-500 dark:text-gray-400">لا توجد طبقات بعد.</p>
    </div>
  );
};

export default LayersPanel;
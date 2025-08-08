import React from 'react';
import { useWhiteboardStore } from '../../../store/whiteboard';

const AppearancePanel: React.FC = () => {
  const { theme, setTheme, showGrid, toggleGrid } = useWhiteboardStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
    showGrid: state.showGrid,
    toggleGrid: state.toggleGrid,
  }));
  return (
    <div className="p-4 text-sm h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3">المظهر</h2>
      <div className="mb-4">
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="form-checkbox h-4 w-4 text-blue-600 mr-2"
          />
          <span>الوضع الليلي</span>
        </label>
      </div>
      <div>
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={() => toggleGrid()}
            className="form-checkbox h-4 w-4 text-blue-600 mr-2"
          />
          <span>إظهار الشبكة</span>
        </label>
      </div>
    </div>
  );
};

export default AppearancePanel;
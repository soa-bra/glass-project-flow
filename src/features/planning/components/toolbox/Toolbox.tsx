import React from 'react';
import SelectionTool from './tools/SelectionTool';
import PanTool from './tools/PanTool';
import TextTool from './tools/TextTool';
import CommentTool from './tools/CommentTool';
import ZoomTool from './tools/ZoomTool';
import ShapesTool from './tools/ShapesTool';
import SmartElementTool from './tools/SmartElementTool';

export default function Toolbox() {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">الأدوات</h3>
        <div className="grid grid-cols-2 gap-2">
          <SelectionTool />
          <PanTool />
          <TextTool />
          <CommentTool />
          <ShapesTool onCategoryChange={setActiveCategory} />
          <SmartElementTool onCategoryChange={setActiveCategory} />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">التكبير</h3>
        <ZoomTool />
      </div>
      
      {activeCategory && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">{activeCategory}</h3>
          <div className="text-xs text-gray-500">
            اختر أداة أعلاه لعرض الخيارات
          </div>
        </div>
      )}
    </div>
  );
}
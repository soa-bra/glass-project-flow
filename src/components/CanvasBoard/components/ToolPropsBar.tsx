import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SMART_ELEMENTS, ZOOM_OPTIONS } from '../constants';

interface ToolPropsBarProps {
  selectedTool: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ToolPropsBar: React.FC<ToolPropsBarProps> = ({ selectedTool, zoom, onZoomChange }) => {
  return (
    <div className="fixed bottom-24 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg rounded-[40px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic">خصائص الأداة</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTool === 'select' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="الموقع X" />
                <Input placeholder="الموقع Y" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="العرض" />
                <Input placeholder="الارتفاع" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">قص</Button>
                <Button variant="outline" size="sm">نسخ</Button>
                <Button variant="outline" size="sm">لصق</Button>
                <Button variant="outline" size="sm">حذف</Button>
              </div>
            </div>
          )}
          
          {selectedTool === 'zoom' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Input 
                  value={zoom} 
                  onChange={(e) => onZoomChange(Number(e.target.value))} 
                />
                <Input placeholder="الأفقي" />
                <Input placeholder="العمودي" />
              </div>
              <select className="w-full p-2 border rounded">
                {ZOOM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedTool === 'smart-element' && (
            <div className="space-y-3">
              <h4 className="font-medium font-arabic">العناصر الذكية</h4>
              <div className="grid grid-cols-1 gap-2">
                {SMART_ELEMENTS.map((element) => {
                  const Icon = element.icon;
                  return (
                    <Button
                      key={element.id}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {element.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolPropsBar;
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { ELEMENT_COLORS } from '../constants';
import { CanvasElement } from '../types';

interface InspectorProps {
  selectedElementId: string | null;
  elements: CanvasElement[];
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (elementId: string) => void;
}

const Inspector: React.FC<InspectorProps> = ({ 
  selectedElementId, 
  elements, 
  onUpdateElement, 
  onDeleteElement 
}) => {
  const selectedElement = elements.find(el => el.id === selectedElementId);
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-yellow-200');

  useEffect(() => {
    if (selectedElement) {
      setText(selectedElement.content || '');
      setSelectedColor(selectedElement.style?.backgroundColor || 'bg-yellow-200');
    }
  }, [selectedElement]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (selectedElementId) {
      onUpdateElement(selectedElementId, { content: newText });
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedElementId) {
      onUpdateElement(selectedElementId, { 
        style: { ...selectedElement?.style, backgroundColor: color }
      });
    }
  };

  const handleDelete = () => {
    if (selectedElementId) {
      onDeleteElement(selectedElementId);
    }
  };
  return (
    <div className="fixed top-4 right-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-sm rounded-[40px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic">المفتش</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedElementId && selectedElement ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium font-arabic">النص</label>
                <Input 
                  placeholder="أدخل النص..." 
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium font-arabic">اللون</label>
                <div className="flex gap-2 mt-1">
                  {ELEMENT_COLORS.map((color) => (
                    <div 
                      key={color} 
                      className={`w-8 h-8 rounded cursor-pointer border-2 ${color} ${
                        selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium font-arabic">النوع</label>
                <p className="text-sm text-gray-600">{selectedElement.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium font-arabic">الموقع</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="X" 
                    value={Math.round(selectedElement.position.x)}
                    onChange={(e) => onUpdateElement(selectedElementId, {
                      position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                    })}
                  />
                  <Input 
                    type="number" 
                    placeholder="Y" 
                    value={Math.round(selectedElement.position.y)}
                    onChange={(e) => onUpdateElement(selectedElementId, {
                      position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                حذف العنصر
              </Button>
            </div>
          ) : (
            <p className="text-gray-500 text-center font-arabic">حدد عنصراً لتحريره</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inspector;
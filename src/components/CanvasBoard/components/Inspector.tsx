import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ELEMENT_COLORS } from '../constants';

interface InspectorProps {
  selectedElementId: string | null;
}

const Inspector: React.FC<InspectorProps> = ({ selectedElementId }) => {
  return (
    <div className="fixed top-4 right-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg rounded-[40px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic">المفتش</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedElementId ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium font-arabic">النص</label>
                <Input placeholder="أدخل النص..." />
              </div>
              <div>
                <label className="text-sm font-medium font-arabic">اللون</label>
                <div className="flex gap-2 mt-1">
                  {ELEMENT_COLORS.map((color) => (
                    <div key={color} className={`w-8 h-8 rounded cursor-pointer border-2 ${color}`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium font-arabic">الروابط</label>
                <Input placeholder="https://..." />
              </div>
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
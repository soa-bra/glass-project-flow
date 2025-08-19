import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Lightbulb, Users, Calendar, Target, Image } from 'lucide-react';
import { toast } from 'sonner';

interface SmartElementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement: string;
  onCreateElement: (elementData: any) => void;
}

const SmartElementsModal: React.FC<SmartElementsModalProps> = ({
  isOpen,
  onClose,
  selectedElement,
  onCreateElement
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال العنوان');
      return;
    }

    const elementData = {
      type: selectedElement,
      title,
      description,
      createdAt: new Date().toISOString()
    };

    onCreateElement(elementData);
    toast.success(`تم إنشاء ${getElementName(selectedElement)}`);
    onClose();
  };

  const getElementName = (elementId: string) => {
    const names = {
      brainstorm: 'محرك العصف الذهني',
      root: 'الجذر',
      timeline: 'الخط الزمني',
      mindmap: 'الخريطة الذهنية',
      moodboard: 'المودبورد الذكية'
    };
    return names[elementId as keyof typeof names] || elementId;
  };

  const getElementIcon = (elementId: string) => {
    const icons = {
      brainstorm: Lightbulb,
      root: Users,
      timeline: Calendar,
      mindmap: Target,
      moodboard: Image
    };
    return icons[elementId as keyof typeof icons] || Lightbulb;
  };

  const ElementIcon = getElementIcon(selectedElement);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 max-w-full mx-4">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2">
            <ElementIcon className="w-5 h-5" />
            إنشاء {getElementName(selectedElement)}
          </CardTitle>
          <button
            onClick={onClose}
            className="rounded-full bg-transparent hover:bg-black/5 border border-black w-8 h-8 flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none"
            aria-label="إغلاق"
          >
            <X className="text-black" size={18} />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">
              العنوان
            </label>
            <Input
              placeholder="أدخل العنوان..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">
              الوصف (اختياري)
            </label>
            <Input
              placeholder="أدخل الوصف..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {selectedElement === 'brainstorm' && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800 font-arabic">
                💡 سيتم إنشاء محرك عصف ذهني تفاعلي لتوليد وتنظيم الأفكار
              </p>
            </div>
          )}

          {selectedElement === 'timeline' && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800 font-arabic">
                📅 سيتم إنشاء خط زمني تفاعلي لتنظيم الأحداث والمهام
              </p>
            </div>
          )}

          {selectedElement === 'mindmap' && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-800 font-arabic">
                🧠 سيتم إنشاء خريطة ذهنية لربط الأفكار والمفاهيم
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreate} className="flex-1">
              إنشاء
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartElementsModal;
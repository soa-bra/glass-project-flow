import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';

interface TextPanelProps {
  onAddText: (type: string, config: any) => void;
}

const TextPanel: React.FC<TextPanelProps> = ({ onAddText }) => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type size={16} />
          أدوات النص
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onAddText('heading', { fontSize: 24, fontWeight: 'bold' })}
          >
            عنوان
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddText('paragraph', { fontSize: 16 })}
          >
            فقرة
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddText('label', { fontSize: 12 })}
          >
            تسمية
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddText('note', { fontSize: 14, style: 'italic' })}
          >
            ملاحظة
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">تنسيق النص</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm">
              <Bold size={14} />
            </Button>
            <Button variant="outline" size="sm">
              <Italic size={14} />
            </Button>
            <Button variant="outline" size="sm">
              <Underline size={14} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">محاذاة النص</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm">
              <AlignLeft size={14} />
            </Button>
            <Button variant="outline" size="sm">
              <AlignCenter size={14} />
            </Button>
            <Button variant="outline" size="sm">
              <AlignRight size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextPanel;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SimpleProjectFormProps {
  onSave: (data: { date: Date; title: string; type: string }) => void;
  onCancel: () => void;
}

export const SimpleProjectForm: React.FC<SimpleProjectFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [type, setType] = useState('مشروع');

  const handleSave = () => {
    if (title.trim()) {
      onSave({ date, title, type });
    }
  };

  return (
    <div className="space-y-6 text-right font-arabic">
      {/* حقل التاريخ */}
      <div className="space-y-2">
        <label className="font-bold text-black font-arabic">التاريخ</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-right rounded-3xl bg-white/30 border border-black/20 hover:bg-white/40 focus:border-black px-4 py-3 font-arabic"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{format(date, 'PPP', { locale: ar })}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[10000]" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
              locale={ar}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* حقل العنوان */}
      <div className="space-y-2">
        <label className="font-bold text-black font-arabic">عنوان المشروع</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="أدخل عنوان المشروع"
          className="w-full rounded-3xl bg-white/30 border border-black/20 focus:border-black px-4 py-3 text-right font-arabic placeholder-black/50"
        />
      </div>

      {/* أزرار النوع */}
      <div className="space-y-2">
        <label className="font-bold text-black font-arabic">نوع المشروع</label>
        <div className="border border-black/10 rounded-full p-1">
          <div className="flex gap-0">
            <button
              onClick={() => setType('مشروع')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${
                type === 'مشروع'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-black/5'
              }`}
            >
              مشروع
            </button>
            <button
              onClick={() => setType('مهمة')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${
                type === 'مهمة'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-black/5'
              }`}
            >
              مهمة
            </button>
            <button
              onClick={() => setType('حدث')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${
                type === 'حدث'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-black/5'
              }`}
            >
              حدث
            </button>
          </div>
        </div>
      </div>

      {/* أزرار العمل */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-black/10">
        <Button
          onClick={onCancel}
          variant="outline"
          className="bg-white/30 hover:bg-white/40 border border-black/20 text-black rounded-full font-arabic"
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSave}
          disabled={!title.trim()}
          className="bg-black hover:bg-black/90 text-white disabled:opacity-70 disabled:cursor-not-allowed rounded-full font-arabic"
        >
          حفظ
        </Button>
      </div>
    </div>
  );
};
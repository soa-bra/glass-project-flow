import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Brain, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BrainstormEnginePanelProps {
  selectedTool: string;
  onResult: (ideas: string[]) => void;
}

export const BrainstormEnginePanel: React.FC<BrainstormEnginePanelProps> = ({ 
  selectedTool, 
  onResult 
}) => {
  const [mode, setMode] = useState<'ghost' | 'oneword' | 'tree'>('ghost');
  const [inputs, setInputs] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (selectedTool !== 'brainstorm') return null;

  const modes = [
    { value: 'ghost', label: 'مشاركة شبحية', description: 'أفكار حرة ومتنوعة' },
    { value: 'oneword', label: 'كلمة واحدة', description: 'تركيز على كلمات مفتاحية' },
    { value: 'tree', label: 'تفرع شجري', description: 'أفكار متفرعة ومترابطة' }
  ];

  const handleAddInput = () => {
    if (!currentInput.trim()) {
      toast.error('يرجى كتابة فكرة أولاً');
      return;
    }
    setInputs(prev => [...prev, currentInput.trim()]);
    setCurrentInput('');
    toast.success('تم إضافة الفكرة');
  };

  const handleRunAI = async () => {
    if (inputs.length === 0) {
      toast.error('أضف بعض الأفكار أولاً');
      return;
    }

    setLoading(true);
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const ideas = inputs.flatMap(input => [
        `${input} - تطوير`,
        `${input} - تحليل`, 
        `${input} - تطبيق`,
        `ربط ${input} بالهدف الرئيسي`
      ]);
      
      setResult(ideas);
      onResult(ideas);
      toast.success('تم توليد الأفكار بنجاح');
    } catch (err) {
      console.error('💥 فشل توليد الأفكار:', err);
      toast.error('فشل في توليد الأفكار');
    } finally {
      setLoading(false);
    }
  };

  const removeInput = (index: number) => {
    setInputs(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ToolPanelContainer title="محرك العصف الذهني">
      <div className="space-y-4">
        {/* اختيار النمط */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نمط العصف الذهني</label>
          <div className="grid gap-2">
            {modes.map(m => (
              <button
                key={m.value}
                onClick={() => setMode(m.value as any)}
                className={`p-3 rounded-lg border text-sm text-right font-arabic transition-colors ${
                  mode === m.value 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{m.label}</div>
                <div className="text-xs opacity-80">{m.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* إدخال الأفكار */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">أضف أفكاراً</label>
          <Textarea 
            placeholder="اكتب فكرتك هنا..." 
            value={currentInput} 
            onChange={(e) => setCurrentInput(e.target.value)}
            className="resize-none"
            rows={3}
          />
          <Button 
            onClick={handleAddInput} 
            className="w-full mt-2 rounded-full" 
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة فكرة
          </Button>
        </div>

        {/* قائمة الأفكار المضافة */}
        {inputs.length > 0 && (
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">الأفكار المضافة ({inputs.length})</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {inputs.map((input, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-xs font-arabic flex-1">{input}</span>
                  <button
                    onClick={() => removeInput(index)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* زر التحليل */}
        <Button 
          onClick={handleRunAI} 
          disabled={!inputs.length || loading} 
          className="w-full mt-3 rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              تحليل الأفكار...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              تحليل وتوزيع
            </>
          )}
        </Button>

        {/* النتائج */}
        {result.length > 0 && (
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">الأفكار المولدة</label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-h-40 overflow-y-auto">
              {result.map((idea, index) => (
                <div key={index} className="text-xs font-arabic mb-1 last:mb-0">
                  • {idea}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPanelContainer>
  );
};
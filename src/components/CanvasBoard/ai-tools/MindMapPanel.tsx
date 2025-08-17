import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { GitBranch, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { MindMapData } from '../../../types/canvas-ai-tools';

interface MindMapPanelProps {
  selectedTool: string;
  projectId: string;
  onGenerated: (mindMap: MindMapData) => void;
}

export const MindMapPanel: React.FC<MindMapPanelProps> = ({ 
  selectedTool, 
  projectId, 
  onGenerated 
}) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  if (selectedTool !== 'mindmap') return null;

  const handleGenerateFromTopic = async () => {
    if (!topic.trim()) {
      toast.error('يرجى إدخال موضوع الخريطة الذهنية');
      return;
    }

    setLoading(true);
    try {
      // محاكاة توليد خريطة ذهنية
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mindMap = {
        centralTopic: topic,
        branches: [
          { id: '1', text: `${topic} - الأهداف`, x: 200, y: 100 },
          { id: '2', text: `${topic} - الخطوات`, x: 300, y: 200 },
          { id: '3', text: `${topic} - المتطلبات`, x: 100, y: 200 },
          { id: '4', text: `${topic} - النتائج`, x: 250, y: 300 }
        ],
        connections: [
          { from: 'center', to: '1' },
          { from: 'center', to: '2' },
          { from: 'center', to: '3' },
          { from: 'center', to: '4' }
        ]
      };
      
      onGenerated(mindMap);
      toast.success('تم توليد الخريطة الذهنية بنجاح');
    } catch (error) {
      toast.error('فشل في توليد الخريطة الذهنية');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromFile = async () => {
    if (!file) {
      toast.error('يرجى اختيار ملف أولاً');
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mindMap = {
        centralTopic: 'تحليل الملف',
        branches: [
          { id: '1', text: 'النقاط الرئيسية', x: 200, y: 100 },
          { id: '2', text: 'الأفكار المهمة', x: 300, y: 200 },
          { id: '3', text: 'الاستنتاجات', x: 100, y: 200 }
        ],
        connections: [
          { from: 'center', to: '1' },
          { from: 'center', to: '2' },
          { from: 'center', to: '3' }
        ]
      };
      
      onGenerated(mindMap);
      toast.success('تم تحليل الملف وتوليد الخريطة الذهنية');
    } catch (error) {
      toast.error('فشل في تحليل الملف');
    } finally {
      setLoading(false);
    }
  };

  const predefinedTopics = [
    'تطوير منتج جديد',
    'استراتيجية التسويق',
    'إدارة المشروع',
    'حل المشكلات',
    'التخطيط الاستراتيجي'
  ];

  return (
    <ToolPanelContainer title="توليد خريطة ذهنية">
      <div className="space-y-4">
        {/* الموضوع الرئيسي */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">الموضوع الرئيسي</label>
          <Input
            placeholder="أدخل موضوع الخريطة الذهنية..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="font-arabic"
          />
        </div>

        {/* مواضيع جاهزة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">مواضيع جاهزة</label>
          <div className="grid gap-1">
            {predefinedTopics.map((predefined, index) => (
              <button
                key={index}
                onClick={() => setTopic(predefined)}
                className="text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded text-right font-arabic border border-gray-200"
              >
                {predefined}
              </button>
            ))}
          </div>
        </div>

        {/* توليد من الموضوع */}
        <Button 
          onClick={handleGenerateFromTopic}
          disabled={loading || !topic.trim()}
          className="w-full rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <GitBranch className="w-4 h-4 mr-2" />
              توليد خريطة ذهنية
            </>
          )}
        </Button>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium font-arabic mb-2">توليد من ملف</h4>
          
          {/* رفع ملف */}
          <div className="mb-3">
            <input
              type="file"
              accept=".txt,.md,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span className="text-sm font-arabic">
                {file ? file.name : 'اختر ملف للتحليل'}
              </span>
            </label>
          </div>

          <Button 
            onClick={handleGenerateFromFile}
            disabled={loading || !file}
            variant="outline"
            className="w-full rounded-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <GitBranch className="w-4 h-4 mr-2" />
                تحليل وتوليد
              </>
            )}
          </Button>
        </div>
      </div>
    </ToolPanelContainer>
  );
};
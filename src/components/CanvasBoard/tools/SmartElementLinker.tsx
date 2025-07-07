import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Link, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SmartElementLinkerProps {
  selectedTool: string;
  sourceId: string | null;
  targetId: string | null;
  onLink: (linkData: {
    sourceId: string;
    targetId: string;
    relationshipType: string;
    description: string;
    aiSuggestion?: string;
  }) => void;
}

export const SmartElementLinker: React.FC<SmartElementLinkerProps> = ({
  selectedTool,
  sourceId,
  targetId,
  onLink
}) => {
  const [relationshipType, setRelationshipType] = useState('custom');
  const [description, setDescription] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (selectedTool !== 'link') return null;

  const relationshipTypes = [
    { value: 'cause-effect', label: 'سبب ← نتيجة', description: 'علاقة سببية' },
    { value: 'temporal', label: 'تسلسل زمني', description: 'يحدث قبل أو بعد' },
    { value: 'hierarchical', label: 'علاقة هرمية', description: 'تدرج في المستوى' },
    { value: 'dependency', label: 'اعتمادية', description: 'يعتمد على الآخر' },
    { value: 'similarity', label: 'تشابه', description: 'عناصر متشابهة' },
    { value: 'opposition', label: 'تضاد', description: 'عناصر متضادة' },
    { value: 'custom', label: 'علاقة مخصصة', description: 'تحديد العلاقة يدوياً' }
  ];

  const generateAISuggestion = async () => {
    if (!sourceId || !targetId) return;

    setLoading(true);
    try {
      // محاكاة تحليل ذكي للعلاقة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions = [
        'هذان العنصران يظهران علاقة تتابعية في العملية',
        'يمكن أن يكون هناك تأثير متبادل بين العنصرين',
        'العنصران يشتركان في نفس المجال الوظيفي',
        'قد تكون هناك علاقة سببية بين هذين العنصرين',
        'العنصران يكملان بعضهما البعض في السياق العام'
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setAiSuggestion(randomSuggestion);
      
      toast.success('تم توليد اقتراح ذكي للعلاقة');
    } catch (error) {
      toast.error('فشل في توليد الاقتراح');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = () => {
    if (!sourceId || !targetId) {
      toast.error('يرجى تحديد عنصرين أولاً');
      return;
    }

    if (relationshipType === 'custom' && !description.trim()) {
      toast.error('يرجى إدخال وصف للعلاقة المخصصة');
      return;
    }

    const linkData = {
      sourceId,
      targetId,
      relationshipType,
      description: description.trim(),
      aiSuggestion: aiSuggestion || undefined
    };

    onLink(linkData);
    
    // إعادة تعيين النموذج
    setDescription('');
    setAiSuggestion(null);
    setRelationshipType('custom');
    
    toast.success('تم إنشاء الرابط بنجاح');
  };

  return (
    <ToolPanelContainer title="أداة الربط الذكي">
      <div className="space-y-4">
        {/* حالة العناصر المحددة */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm font-arabic space-y-1">
            <div>العنصر الأول: {sourceId ? `✓ ${sourceId}` : '❌ غير محدد'}</div>
            <div>العنصر الثاني: {targetId ? `✓ ${targetId}` : '❌ غير محدد'}</div>
          </div>
        </div>

        {/* نوع العلاقة */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نوع العلاقة</label>
          <Select value={relationshipType} onValueChange={setRelationshipType}>
            <SelectTrigger className="font-arabic">
              <SelectValue placeholder="اختر نوع العلاقة" />
            </SelectTrigger>
            <SelectContent>
              {relationshipTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="text-right">
                    <div className="font-arabic">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* وصف العلاقة */}
        {relationshipType === 'custom' && (
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">وصف العلاقة</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصفاً للعلاقة بين العنصرين..."
              className="font-arabic"
            />
          </div>
        )}

        {/* اقتراح ذكي */}
        <div className="space-y-2">
          <Button
            onClick={generateAISuggestion}
            disabled={loading || !sourceId || !targetId}
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
                <Zap className="w-4 h-4 mr-2" />
                اقتراح ذكي للعلاقة
              </>
            )}
          </Button>

          {aiSuggestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium font-arabic mb-1">🧠 اقتراح ذكي:</h4>
              <p className="text-sm font-arabic text-blue-800">{aiSuggestion}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDescription(aiSuggestion)}
                className="mt-2 text-xs"
              >
                استخدام هذا الاقتراح
              </Button>
            </div>
          )}
        </div>

        {/* إنشاء الرابط */}
        <Button 
          onClick={handleCreateLink}
          disabled={!sourceId || !targetId || (relationshipType === 'custom' && !description.trim())}
          className="w-full rounded-full"
        >
          <Link className="w-4 h-4 mr-2" />
          إنشاء الرابط
        </Button>

        {/* تعليمات */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="text-sm font-medium font-arabic mb-1">📋 كيفية الاستخدام:</h4>
          <ul className="text-xs font-arabic text-yellow-800 space-y-1">
            <li>1. انقر على العنصر الأول لتحديده</li>
            <li>2. انقر على العنصر الثاني لتحديده</li>
            <li>3. اختر نوع العلاقة من القائمة</li>
            <li>4. أضف وصفاً إذا كان مطلوباً</li>
            <li>5. اضغط على "إنشاء الرابط"</li>
          </ul>
        </div>
      </div>
    </ToolPanelContainer>
  );
};
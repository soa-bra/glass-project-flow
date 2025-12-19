import React, { useState } from 'react';
import { 
  Lightbulb, 
  LayoutGrid, 
  Vote, 
  Zap, 
  Calendar, 
  Table2,
  Link,
  TrendingUp,
  FileSpreadsheet,
  Network,
  FolderKanban,
  DollarSign,
  Users,
  Building,
  Sparkles,
  Plus,
  Loader2
} from 'lucide-react';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementAI } from '@/hooks/useSmartElementAI';
import type { SmartElementType } from '@/types/smart-elements';
import type { MindMapNodeData } from '@/types/mindmap-canvas';
import { NODE_COLORS } from '@/types/mindmap-canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────────────────────
// Smart Element Configuration
// ─────────────────────────────────────────────────────────────────────────────

interface SmartElementConfig {
  id: SmartElementType;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  category: 'planning' | 'analysis' | 'collaboration' | 'cards';
  description: string;
  settings: SmartElementSetting[];
}

interface SmartElementSetting {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  defaultValue: string | number | boolean;
}

const SMART_ELEMENTS: SmartElementConfig[] = [
  // Collaboration Elements
  {
    id: 'thinking_board',
    name: 'Think Board',
    nameAr: 'لوحة التفكير',
    icon: <Lightbulb size={20} />,
    category: 'collaboration',
    description: 'تجميع الأفكار والمكونات ضمن لوحة واحدة مرنة',
    settings: [
      { key: 'backgroundColor', label: 'لون الخلفية', type: 'select', options: [
        { value: '#ffffff', label: 'أبيض' },
        { value: '#f0f9ff', label: 'أزرق فاتح' },
        { value: '#f0fdf4', label: 'أخضر فاتح' },
        { value: '#fefce8', label: 'أصفر فاتح' },
      ], defaultValue: '#ffffff' },
    ]
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    nameAr: 'لوحة كانبان',
    icon: <LayoutGrid size={20} />,
    category: 'collaboration',
    description: 'تنظيم المهام ضمن أعمدة حسب الحالة',
    settings: [
      { key: 'columnsCount', label: 'عدد الأعمدة', type: 'number', defaultValue: 3 },
      { key: 'columnNames', label: 'أسماء الأعمدة', type: 'text', defaultValue: 'للتنفيذ,قيد التنفيذ,مكتمل' },
    ]
  },
  {
    id: 'voting',
    name: 'Voting',
    nameAr: 'التصويت',
    icon: <Vote size={20} />,
    category: 'collaboration',
    description: 'جمع الآراء واتخاذ القرار الجماعي',
    settings: [
      { key: 'optionsCount', label: 'عدد الخيارات', type: 'number', defaultValue: 3 },
      { key: 'maxVotesPerUser', label: 'الأصوات لكل مستخدم', type: 'number', defaultValue: 1 },
      { key: 'allowMultiple', label: 'تصويت متعدد', type: 'checkbox', defaultValue: false },
      { key: 'showResults', label: 'عرض النتائج مباشرة', type: 'checkbox', defaultValue: true },
    ]
  },
  {
    id: 'brainstorming',
    name: 'Brainstorming',
    nameAr: 'العصف الذهني',
    icon: <Zap size={20} />,
    category: 'collaboration',
    description: 'تجميع الأفكار من عدة مشاركين',
    settings: [
      { key: 'mode', label: 'نمط العصف', type: 'select', options: [
        { value: 'collaborative', label: 'تعاوني' },
        { value: 'silent', label: 'صامت' },
        { value: 'rapid', label: 'سريع' },
        { value: 'branching', label: 'تشعبي' },
      ], defaultValue: 'collaborative' },
      { key: 'timeLimit', label: 'الوقت (دقائق)', type: 'number', defaultValue: 10 },
    ]
  },
  
  // Planning Elements
  {
    id: 'timeline',
    name: 'Timeline',
    nameAr: 'خط زمني',
    icon: <Calendar size={20} />,
    category: 'planning',
    description: 'تنظيم العناصر على محور زمني',
    settings: [
      { key: 'timeUnit', label: 'وحدة الوقت', type: 'select', options: [
        { value: 'day', label: 'يوم' },
        { value: 'week', label: 'أسبوع' },
        { value: 'month', label: 'شهر' },
      ], defaultValue: 'week' },
      { key: 'showMilestones', label: 'عرض المحطات', type: 'checkbox', defaultValue: true },
    ]
  },
  {
    id: 'decisions_matrix',
    name: 'Decision Matrix',
    nameAr: 'مصفوفة القرارات',
    icon: <Table2 size={20} />,
    category: 'planning',
    description: 'تقييم الخيارات بناءً على معايير محددة',
    settings: [
      { key: 'rowsCount', label: 'عدد الخيارات', type: 'number', defaultValue: 4 },
      { key: 'columnsCount', label: 'عدد المعايير', type: 'number', defaultValue: 3 },
      { key: 'showWeights', label: 'ترجيح المعايير', type: 'checkbox', defaultValue: true },
    ]
  },
  {
    id: 'gantt',
    name: 'Gantt Chart',
    nameAr: 'مخطط جانت',
    icon: <TrendingUp size={20} />,
    category: 'planning',
    description: 'عرض وتسلسل المهام عبر مستويات زمنية',
    settings: [
      { key: 'timeUnit', label: 'وحدة الوقت', type: 'select', options: [
        { value: 'day', label: 'يومي' },
        { value: 'week', label: 'أسبوعي' },
        { value: 'month', label: 'شهري' },
      ], defaultValue: 'week' },
      { key: 'showDependencies', label: 'عرض التبعيات', type: 'checkbox', defaultValue: true },
    ]
  },
  
  // Analysis Elements
  {
    id: 'interactive_sheet',
    name: 'Interactive Sheet',
    nameAr: 'ورقة تفاعلية',
    icon: <FileSpreadsheet size={20} />,
    category: 'analysis',
    description: 'إدارة بيانات مركبة داخل جدول تفاعلي',
    settings: [
      { key: 'rows', label: 'عدد الصفوف', type: 'number', defaultValue: 10 },
      { key: 'columns', label: 'عدد الأعمدة', type: 'number', defaultValue: 5 },
      { key: 'enableFormulas', label: 'تفعيل الصيغ', type: 'checkbox', defaultValue: true },
    ]
  },
  {
    id: 'mind_map',
    name: 'Mind Map',
    nameAr: 'خريطة ذهنية',
    icon: <Network size={20} />,
    category: 'analysis',
    description: 'تنظيم وربط الأفكار بصرياً',
    settings: [
      { key: 'layout', label: 'التخطيط', type: 'select', options: [
        { value: 'radial', label: 'شعاعي' },
        { value: 'tree', label: 'شجري' },
        { value: 'org', label: 'هيكلي' },
      ], defaultValue: 'radial' },
      { key: 'autoLayout', label: 'ترتيب تلقائي', type: 'checkbox', defaultValue: true },
    ]
  },
  {
    id: 'visual_diagram' as SmartElementType,
    name: 'Visual Diagram',
    nameAr: 'مخطط بصري',
    icon: <Link size={20} />,
    category: 'analysis',
    description: 'إنشاء مخططات بصرية مرنة مع عقد وروابط',
    settings: [
      { key: 'layout', label: 'التخطيط', type: 'select', options: [
        { value: 'horizontal', label: 'أفقي' },
        { value: 'vertical', label: 'عمودي' },
      ], defaultValue: 'horizontal' },
    ]
  },
  {
    id: 'interactive_document',
    name: 'Interactive Document',
    nameAr: 'مستند تفاعلي',
    icon: <FileSpreadsheet size={20} />,
    category: 'analysis',
    description: 'مستند نصي تفاعلي قابل للتحرير والتصدير',
    settings: [
      { key: 'format', label: 'التنسيق', type: 'select', options: [
        { value: 'plain', label: 'نص عادي' },
        { value: 'markdown', label: 'Markdown' },
      ], defaultValue: 'plain' },
      { key: 'showWordCount', label: 'عرض عدد الكلمات', type: 'checkbox', defaultValue: true },
    ]
  },
  
  // Smart Cards
  {
    id: 'project_card',
    name: 'Project Card',
    nameAr: 'بطاقة مشروع',
    icon: <FolderKanban size={20} />,
    category: 'cards',
    description: 'عرض المشاريع والمهام بشكل تفاعلي',
    settings: [
      { key: 'showProgress', label: 'عرض التقدم', type: 'checkbox', defaultValue: true },
      { key: 'showTasks', label: 'عرض المهام', type: 'checkbox', defaultValue: true },
    ]
  },
  {
    id: 'finance_card',
    name: 'Finance Card',
    nameAr: 'بطاقة مالية',
    icon: <DollarSign size={20} />,
    category: 'cards',
    description: 'تحليل مالي تفاعلي للميزانيات',
    settings: [
      { key: 'showCharts', label: 'عرض الرسوم البيانية', type: 'checkbox', defaultValue: true },
      { key: 'currency', label: 'العملة', type: 'select', options: [
        { value: 'SAR', label: 'ريال سعودي' },
        { value: 'USD', label: 'دولار أمريكي' },
        { value: 'EUR', label: 'يورو' },
      ], defaultValue: 'SAR' },
    ]
  },
  {
    id: 'csr_card',
    name: 'CSR Card',
    nameAr: 'بطاقة المسؤولية الاجتماعية',
    icon: <Users size={20} />,
    category: 'cards',
    description: 'تتبع مبادرات المسؤولية الاجتماعية',
    settings: [
      { key: 'showImpact', label: 'عرض التأثير', type: 'checkbox', defaultValue: true },
    ]
  },
  {
    id: 'crm_card',
    name: 'CRM Card',
    nameAr: 'بطاقة علاقات العملاء',
    icon: <Building size={20} />,
    category: 'cards',
    description: 'عرض وتحليل بيانات تفاعل العملاء',
    settings: [
      { key: 'showAnalytics', label: 'عرض التحليلات', type: 'checkbox', defaultValue: true },
    ]
  },
];

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'collaboration', label: 'تعاون' },
  { id: 'planning', label: 'تخطيط' },
  { id: 'analysis', label: 'تحليل' },
  { id: 'cards', label: 'بطاقات' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const SmartElementsPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<SmartElementConfig | null>(null);
  const [elementTitle, setElementTitle] = useState('');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [aiPrompt, setAiPrompt] = useState('');
  
  const { addSmartElement } = useSmartElementsStore();
  const { viewport } = useCanvasStore();
  const { generateElements, isLoading: aiLoading } = useSmartElementAI();

  const filteredElements = selectedCategory === 'all' 
    ? SMART_ELEMENTS 
    : SMART_ELEMENTS.filter(el => el.category === selectedCategory);

  // Initialize settings when element is selected
  const handleSelectElement = (element: SmartElementConfig) => {
    setSelectedElement(element);
    const initialSettings: Record<string, any> = {};
    element.settings.forEach(setting => {
      initialSettings[setting.key] = setting.defaultValue;
    });
    setSettings(initialSettings);
    setElementTitle('');
    setAiPrompt('');
    
    // ✅ إخبار canvasStore بالعنصر المختار وتفعيل الأداة
    useCanvasStore.getState().setSelectedSmartElement(element.id);
    useCanvasStore.getState().setActiveTool('smart_element_tool');
  };

  // Add element to canvas
  const handleAddElement = () => {
    if (!selectedElement) return;

    // Calculate center of viewport
    const centerX = (-viewport.pan.x + window.innerWidth / 2) / viewport.zoom;
    const centerY = (-viewport.pan.y + window.innerHeight / 2) / viewport.zoom;

    // ✅ إنشاء خريطة ذهنية كعقد مستقلة على الكانفس
    if (selectedElement.id === 'mind_map') {
      const { addElement } = useCanvasStore.getState();
      
      addElement({
        type: 'mindmap_node',
        position: { x: centerX - 80, y: centerY - 30 },
        size: { width: 180, height: 60 },
        data: {
          label: elementTitle || 'الفكرة الرئيسية',
          color: NODE_COLORS[0],
          nodeStyle: 'rounded',
          isRoot: true,
          fontSize: 16,
          textColor: '#FFFFFF'
        } as MindMapNodeData
      });
      
      toast.success('تم إنشاء خريطة ذهنية جديدة - انقر على العقدة واسحب من نقاط الربط لإضافة فروع');
      setSelectedElement(null);
      return;
    }

    // ✅ المخطط البصري يُنشأ كعنصر ذكي عادي (يُعرض بـ SmartElementRenderer)

    const initialData: Record<string, any> = {
      title: elementTitle || selectedElement.nameAr,
      ...settings,
    };

    // Add type-specific initial data
    if (selectedElement.id === 'kanban' && settings.columnNames) {
      const columnNames = (settings.columnNames as string).split(',');
      initialData.columns = columnNames.map((name, index) => ({
        id: `col-${index}`,
        title: name.trim(),
        cards: [],
        order: index,
      }));
    }

    if (selectedElement.id === 'voting') {
      initialData.options = Array.from({ length: settings.optionsCount || 3 }, (_, i) => ({
        id: `opt-${i}`,
        label: `خيار ${i + 1}`,
        votes: [],
        order: i,
      }));
      initialData.maxVotesPerUser = settings.maxVotesPerUser || 1;
      initialData.allowMultipleVotes = settings.allowMultiple || false;
    }

    addSmartElement(
      selectedElement.id,
      { x: centerX, y: centerY },
      initialData
    );

    toast.success(`تم إضافة ${selectedElement.nameAr}`);
    setSelectedElement(null);
  };

  // Generate with AI
  const handleGenerateWithAI = async () => {
    if (!selectedElement || !aiPrompt.trim()) {
      toast.error('يرجى كتابة وصف للعنصر');
      return;
    }

    const result = await generateElements(aiPrompt, selectedElement.id);
    
    if (result?.elements && result.elements.length > 0) {
      const centerX = (-viewport.pan.x + window.innerWidth / 2) / viewport.zoom;
      const centerY = (-viewport.pan.y + window.innerHeight / 2) / viewport.zoom;

      result.elements.forEach((element, index) => {
        addSmartElement(
          element.type as SmartElementType,
          { x: centerX + index * 50, y: centerY + index * 50 },
          element.data
        );
      });

      toast.success(`تم إنشاء ${result.elements.length} عنصر بالذكاء الاصطناعي`);
      setSelectedElement(null);
      setAiPrompt('');
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div>
        <h4 className="text-[13px] font-semibold text-foreground mb-3">
          فئة العناصر
        </h4>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[hsl(var(--accent-green))] text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Elements Grid */}
      <div>
        <h4 className="text-[13px] font-semibold text-foreground mb-3">
          اختر عنصر ذكي
        </h4>
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
          {filteredElements.map((element) => (
            <button
              key={element.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/smart-element', JSON.stringify({
                  type: element.id,
                  name: element.nameAr,
                }));
                e.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => handleSelectElement(element)}
              className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-all cursor-grab active:cursor-grabbing ${
                selectedElement?.id === element.id
                  ? 'bg-[hsl(var(--accent-green))] text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <span className={selectedElement?.id === element.id ? 'text-white' : 'text-foreground'}>
                {element.icon}
              </span>
              <span className="text-[10px] font-medium text-center">
                {element.nameAr}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Element Settings */}
      {selectedElement && (
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-semibold text-foreground">
              إعدادات {selectedElement.nameAr}
            </h4>
            <span className="text-[10px] text-muted-foreground">
              {selectedElement.description}
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Title */}
            <div>
              <label className="text-[11px] font-medium text-foreground mb-1 block">
                عنوان العنصر
              </label>
              <Input
                value={elementTitle}
                onChange={(e) => setElementTitle(e.target.value)}
                placeholder={selectedElement.nameAr}
                className="h-8 text-[12px]"
              />
            </div>

            {/* Dynamic Settings */}
            {selectedElement.settings.map(setting => (
              <div key={setting.key}>
                <label className="text-[11px] font-medium text-foreground mb-1 block">
                  {setting.label}
                </label>
                {setting.type === 'text' && (
                  <Input
                    value={settings[setting.key] || ''}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                    className="h-8 text-[12px]"
                  />
                )}
                {setting.type === 'number' && (
                  <Input
                    type="number"
                    value={settings[setting.key] || 0}
                    onChange={(e) => updateSetting(setting.key, parseInt(e.target.value))}
                    className="h-8 text-[12px]"
                    min={1}
                    max={20}
                  />
                )}
                {setting.type === 'select' && (
                  <select
                    value={settings[setting.key] || ''}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                    className="w-full h-8 px-2 text-[12px] border border-border rounded-lg bg-background"
                  >
                    {setting.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {setting.type === 'checkbox' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[setting.key] || false}
                      onChange={(e) => updateSetting(setting.key, e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-[11px] text-muted-foreground">تفعيل</span>
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* Add Button */}
          <Button
            onClick={handleAddElement}
            className="w-full bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/90"
          >
            <Plus size={16} className="ml-2" />
            إضافة {selectedElement.nameAr}
          </Button>

          {/* AI Generation Section */}
          <div className="pt-3 border-t border-border">
            <h5 className="text-[12px] font-semibold text-foreground mb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-[hsl(var(--accent-blue))]" />
              إنشاء بالذكاء الاصطناعي
            </h5>
            <div className="space-y-2">
              <Input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={`صف ${selectedElement.nameAr} الذي تريده...`}
                className="h-8 text-[12px]"
              />
              <Button
                onClick={handleGenerateWithAI}
                disabled={aiLoading || !aiPrompt.trim()}
                variant="outline"
                className="w-full h-8 text-[12px] border-[hsl(var(--accent-blue))] text-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/10"
              >
                {aiLoading ? (
                  <>
                    <Loader2 size={14} className="ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="ml-2" />
                    إنشاء تلقائي
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-[12px] font-semibold text-muted-foreground mb-2">
          اختصارات
        </h4>
        <div className="space-y-1.5 text-[11px] text-muted-foreground">
          <div className="flex justify-between">
            <span>شريط الأوامر</span>
            <code className="bg-muted px-1.5 py-0.5 rounded">Ctrl+K</code>
          </div>
          <div className="flex justify-between">
            <span>إدراج سريع</span>
            <code className="bg-muted px-1.5 py-0.5 rounded">Enter</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartElementsPanel;

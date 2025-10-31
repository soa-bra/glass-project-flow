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
  Palette,
  MessageSquare,
  Target,
  TrendingDown
} from 'lucide-react';

interface SmartElement {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'planning' | 'analysis' | 'collaboration' | 'business';
}

const smartElements: SmartElement[] = [
  { id: 'think-board', name: 'Think Board', icon: <Lightbulb size={20} />, category: 'planning' },
  { id: 'kanban', name: 'Kanban', icon: <LayoutGrid size={20} />, category: 'planning' },
  { id: 'voting', name: 'Voting', icon: <Vote size={20} />, category: 'collaboration' },
  { id: 'brainstorm', name: 'Brainstorm', icon: <Zap size={20} />, category: 'collaboration' },
  { id: 'timeline', name: 'Timeline', icon: <Calendar size={20} />, category: 'planning' },
  { id: 'decision-matrix', name: 'Decision Matrix', icon: <Table2 size={20} />, category: 'analysis' },
  { id: 'root-linker', name: 'Root Linker', icon: <Link size={20} />, category: 'analysis' },
  { id: 'gantt', name: 'Gantt', icon: <TrendingUp size={20} />, category: 'planning' },
  { id: 'spreadsheet', name: 'Spreadsheet', icon: <FileSpreadsheet size={20} />, category: 'analysis' },
  { id: 'mindmap', name: 'Mindmap', icon: <Network size={20} />, category: 'planning' },
  { id: 'project-cards', name: 'Project Cards', icon: <FolderKanban size={20} />, category: 'business' },
  { id: 'finance', name: 'Finance', icon: <DollarSign size={20} />, category: 'business' },
  { id: 'csr', name: 'CSR', icon: <Users size={20} />, category: 'business' },
  { id: 'crm', name: 'CRM', icon: <Building size={20} />, category: 'business' },
  { id: 'cultural-fit', name: 'Cultural Fit', icon: <Palette size={20} />, category: 'analysis' },
  { id: 'content-planner', name: 'Content Planner', icon: <MessageSquare size={20} />, category: 'planning' },
  { id: 'campaigns', name: 'Campaigns', icon: <Target size={20} />, category: 'business' },
  { id: 'csr-impact', name: 'CSR Impact', icon: <TrendingDown size={20} />, category: 'analysis' },
];

const SmartElementsPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'planning' | 'analysis' | 'collaboration' | 'business'>('all');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const filteredElements = selectedCategory === 'all' 
    ? smartElements 
    : smartElements.filter(el => el.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          فئة العناصر
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-[10px] text-[11px] font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            الكل ({smartElements.length})
          </button>
          <button
            onClick={() => setSelectedCategory('planning')}
            className={`px-3 py-2 rounded-[10px] text-[11px] font-medium transition-colors ${
              selectedCategory === 'planning'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            تخطيط
          </button>
          <button
            onClick={() => setSelectedCategory('analysis')}
            className={`px-3 py-2 rounded-[10px] text-[11px] font-medium transition-colors ${
              selectedCategory === 'analysis'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            تحليل
          </button>
          <button
            onClick={() => setSelectedCategory('collaboration')}
            className={`px-3 py-2 rounded-[10px] text-[11px] font-medium transition-colors ${
              selectedCategory === 'collaboration'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            تعاون
          </button>
          <button
            onClick={() => setSelectedCategory('business')}
            className={`px-3 py-2 rounded-[10px] text-[11px] font-medium transition-colors col-span-2 ${
              selectedCategory === 'business'
                ? 'bg-[hsl(var(--accent-green))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
            }`}
          >
            أعمال
          </button>
        </div>
      </div>

      {/* Smart Elements Grid */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          اختر عنصر ذكي
        </h4>
        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
          {filteredElements.map((element) => (
            <button
              key={element.id}
              onClick={() => setSelectedElement(element.id)}
              className={`group flex flex-col items-center gap-2 p-3 rounded-[10px] transition-all ${
                selectedElement === element.id
                  ? 'bg-[hsl(var(--accent-green))] text-white'
                  : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <span className={selectedElement === element.id ? 'text-white' : 'text-[hsl(var(--ink))]'}>
                {element.icon}
              </span>
              <span className="text-[10px] font-medium text-center">
                {element.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Element Settings */}
      {selectedElement && (
        <div className="pt-4 border-t border-[#DADCE0]">
          <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
            إعدادات العنصر المحدد
          </h4>
          <div className="p-4 bg-[hsl(var(--panel))] rounded-[10px]">
            <p className="text-[11px] text-[hsl(var(--ink-60))] mb-3">
              {smartElements.find(el => el.id === selectedElement)?.name}
            </p>
            
            {/* Dynamic settings based on element */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-[hsl(var(--ink))] mb-1 block">
                  عنوان العنصر
                </label>
                <input
                  type="text"
                  placeholder="اختياري..."
                  className="w-full px-2 py-1.5 text-[11px] border border-[#DADCE0] rounded-lg outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[hsl(var(--ink))] mb-1 block">
                  الحجم
                </label>
                <select className="w-full px-2 py-1.5 text-[11px] border border-[#DADCE0] rounded-lg outline-none focus:border-[hsl(var(--accent-green))] transition-colors bg-white">
                  <option value="small">صغير</option>
                  <option value="medium">متوسط</option>
                  <option value="large">كبير</option>
                  <option value="custom">مخصص</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5" />
                <span className="text-[11px] text-[hsl(var(--ink))]">
                  بيانات تجريبية
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h4 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          اختصارات الكيبورد
        </h4>
        <div className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <div className="flex justify-between">
            <span>نسبة متساوية</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Shift</code>
          </div>
          <div className="flex justify-between">
            <span>من المركز</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Alt</code>
          </div>
          <div className="flex justify-between">
            <span>إدراج</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Enter</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartElementsPanel;

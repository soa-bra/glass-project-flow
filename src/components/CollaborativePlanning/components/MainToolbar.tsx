import React from 'react';
import { 
  MousePointer, 
  Square, 
  Circle, 
  Type, 
  GitBranch,
  Layers,
  Download,
  Users,
  Sparkles,
  Menu,
  Grid3X3,
  MessageSquare,
  Undo,
  Redo,
  Play,
  Pause
} from 'lucide-react';

interface MainToolbarProps {
  currentTool: string;
  onToolSelect: (tool: string) => void;
  onToggleFloatingTools: () => void;
  onToggleAI: () => void;
  onExport: () => void;
}

const tools = [
  { id: 'select', icon: MousePointer, label: 'تحديد', category: 'basic' },
  { id: 'sticky-note', icon: Square, label: 'ملاحظة لاصقة', category: 'basic' },
  { id: 'shape', icon: Circle, label: 'شكل', category: 'basic' },
  { id: 'text', icon: Type, label: 'نص', category: 'basic' },
  { id: 'connection', icon: GitBranch, label: 'رابط', category: 'basic' },
  { id: 'mindmap-node', icon: GitBranch, label: 'عقدة خريطة ذهنية', category: 'advanced' }
];

export const MainToolbar: React.FC<MainToolbarProps> = ({
  currentTool,
  onToolSelect,
  onToggleFloatingTools,
  onToggleAI,
  onExport
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 glass-section border-b z-50 flex items-center justify-between px-6">
      {/* الأدوات الأساسية */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="flex items-center bg-white/20 rounded-lg p-1">
          {tools.filter(t => t.category === 'basic').map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`p-2 rounded-md transition-all duration-200 ${
                  currentTool === tool.id
                    ? 'bg-black text-white shadow-lg'
                    : 'hover:bg-white/30 text-gray-700'
                }`}
                title={tool.label}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        {/* فاصل */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* أدوات التحكم */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <button className="p-2 hover:bg-white/30 rounded-md text-gray-700" title="تراجع">
            <Undo size={16} />
          </button>
          <button className="p-2 hover:bg-white/30 rounded-md text-gray-700" title="إعادة">
            <Redo size={16} />
          </button>
        </div>
      </div>

      {/* العنوان والحالة */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="text-center">
          <h2 className="text-lg font-bold text-black">لوحة التخطيط التشاركي</h2>
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>متصل - 3 مستخدمين نشطين</span>
          </div>
        </div>
      </div>

      {/* الأدوات المتقدمة */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <button
          onClick={onToggleFloatingTools}
          className="p-2 hover:bg-white/30 rounded-md text-gray-700"
          title="لوحة الأدوات العائمة"
        >
          <Menu size={16} />
        </button>

        <button className="p-2 hover:bg-white/30 rounded-md text-gray-700" title="الشبكة">
          <Grid3X3 size={16} />
        </button>

        <button className="p-2 hover:bg-white/30 rounded-md text-gray-700" title="الطبقات">
          <Layers size={16} />
        </button>

        <button className="p-2 hover:bg-white/30 rounded-md text-gray-700" title="التعليقات">
          <MessageSquare size={16} />
        </button>

        <div className="w-px h-8 bg-gray-300"></div>

        <button
          onClick={onToggleAI}
          className="p-2 hover:bg-white/30 rounded-md text-purple-600 bg-purple-50"
          title="مساعد الذكاء الاصطناعي"
        >
          <Sparkles size={16} />
        </button>

        <button className="p-2 hover:bg-white/30 rounded-md text-gray-700" title="المستخدمين النشطين">
          <Users size={16} />
        </button>

        <button
          onClick={onExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Download size={16} className="ml-2" />
          تصدير
        </button>
      </div>
    </div>
  );
};
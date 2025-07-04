import React, { useState } from 'react';
import { 
  X, 
  Repeat, 
  Download, 
  Brain, 
  GitBranch, 
  Clock, 
  Link, 
  Grid3X3, 
  StickyNote, 
  Terminal, 
  Eye, 
  MessageCircle, 
  Layers, 
  History, 
  Calendar, 
  Quote, 
  Minimize, 
  Lightbulb,
  ChevronDown,
  Settings,
  Palette,
  Zap
} from 'lucide-react';

interface FloatingToolsPanelProps {
  onClose: () => void;
  currentTool: string;
  onToolSelect: (tool: string) => void;
}

interface ToolSection {
  title: string;
  tools: {
    id: string;
    icon: any;
    label: string;
    description: string;
    color: string;
  }[];
}

const toolSections: ToolSection[] = [
  {
    title: 'أدوات الذكاء الاصطناعي',
    tools: [
      { id: 'ai-insight', icon: Brain, label: 'رؤى ذكية', description: 'تحليل ذكي للمحتوى', color: 'purple' },
      { id: 'brainstorm', icon: Lightbulb, label: 'محرك العصف الذهني', description: 'توليد أفكار ذكية', color: 'yellow' },
      { id: 'ai-command', icon: Terminal, label: 'وحدة تحكم الذكاء الاصطناعي', description: 'أوامر نصية ذكية', color: 'blue' },
      { id: 'ai-review', icon: Eye, label: 'مراجع ذكي', description: 'مراجعة تلقائية للمحتوى', color: 'green' }
    ]
  },
  {
    title: 'أدوات التخطيط',
    tools: [
      { id: 'mindmap', icon: GitBranch, label: 'خريطة ذهنية', description: 'إنشاء خرائط ذهنية تفاعلية', color: 'indigo' },
      { id: 'timeline', icon: Clock, label: 'الجدول الزمني', description: 'تخطيط زمني للمشاريع', color: 'red' },
      { id: 'smart-linker', icon: Link, label: 'رابط ذكي', description: 'ربط العناصر تلقائياً', color: 'orange' },
      { id: 'project-generator', icon: Zap, label: 'مولد المشاريع الذكي', description: 'إنشاء مشاريع من الخطط', color: 'emerald' }
    ]
  },
  {
    title: 'أدوات التعاون',
    tools: [
      { id: 'comment-layer', icon: MessageCircle, label: 'طبقة التعليقات', description: 'عرض وإدارة التعليقات', color: 'pink' },
      { id: 'audio-comment', icon: MessageCircle, label: 'تعليق صوتي', description: 'إضافة تعليقات صوتية', color: 'teal' },
      { id: 'live-feed', icon: Calendar, label: 'تغذية التغييرات المباشرة', description: 'متابعة التحديثات فوراً', color: 'cyan' },
      { id: 'version-history', icon: History, label: 'تاريخ الإصدارات', description: 'تتبع تاريخ التغييرات', color: 'gray' }
    ]
  },
  {
    title: 'أدوات التصدير والتحليل',
    tools: [
      { id: 'export-project', icon: Download, label: 'تصدير للمشروع', description: 'تحويل للمشروع الفعلي', color: 'blue' },
      { id: 'citation', icon: Quote, label: 'مولد الاستشهادات', description: 'إنشاء استشهادات تلقائية', color: 'slate' },
      { id: 'weekly-summary', icon: Calendar, label: 'ملخص أسبوعي ذكي', description: 'تقرير أسبوعي بالذكاء الاصطناعي', color: 'violet' },
      { id: 'ai-shrink', icon: Minimize, label: 'ضغط ذكي', description: 'تبسيط المحتوى المعقد', color: 'rose' }
    ]
  }
];

export const FloatingToolsPanel: React.FC<FloatingToolsPanelProps> = ({
  onClose,
  currentTool,
  onToolSelect
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['أدوات الذكاء الاصطناعي']);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle)
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const filteredSections = toolSections.map(section => ({
    ...section,
    tools: section.tools.filter(tool => 
      tool.label.includes(searchTerm) || tool.description.includes(searchTerm)
    )
  })).filter(section => section.tools.length > 0);

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const colorMap: { [key: string]: string } = {
      purple: isActive ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100',
      yellow: isActive ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      green: isActive ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100',
      indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
      red: isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100',
      orange: isActive ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100',
      emerald: isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
      pink: isActive ? 'bg-pink-600 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100',
      teal: isActive ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100',
      cyan: isActive ? 'bg-cyan-600 text-white' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100',
      gray: isActive ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
      slate: isActive ? 'bg-slate-600 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100',
      violet: isActive ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700 hover:bg-violet-100',
      rose: isActive ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="fixed left-4 top-20 w-80 max-h-[calc(100vh-6rem)] glass-modal rounded-2xl overflow-hidden z-40 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h3 className="text-lg font-bold text-black">لوحة الأدوات الذكية</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-gray-600"
        >
          <X size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/20">
        <input
          type="text"
          placeholder="البحث في الأدوات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tools Sections */}
      <div className="p-2 max-h-96 overflow-y-auto">
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-4">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-right"
            >
              <span className="font-medium text-gray-800">{section.title}</span>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${
                  expandedSections.includes(section.title) ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSections.includes(section.title) && (
              <div className="mt-2 space-y-1">
                {section.tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = currentTool === tool.id;
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onToolSelect(tool.id)}
                      className={`w-full p-3 rounded-lg transition-all duration-200 text-right ${
                        getColorClasses(tool.color, isActive)
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <Icon size={16} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{tool.label}</div>
                          <div className="text-xs opacity-75 mt-1">{tool.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 bg-white/10">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>أدوات متقدمة</span>
          <button className="flex items-center space-x-1 space-x-reverse hover:text-gray-800">
            <Settings size={12} />
            <span>إعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
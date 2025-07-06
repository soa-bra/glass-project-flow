import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  Search, 
  Zap, 
  Target,
  TrendingUp,
  FileText,
  Send,
  Mic,
  Image
} from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'sticky-note' | 'shape' | 'text' | 'connection' | 'mindmap-node' | 'smart-element' | 'root-connector';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
  locked?: boolean;
  userId?: string;
  layer: number;
  rotation?: number;
  groupId?: string;
}

interface AIPanelProps {
  onClose: () => void;
  canvasElements: CanvasElement[];
  selectedCategory?: string | null;
}

const aiTools = [
  {
    id: 'analyze',
    icon: Brain,
    title: 'تحليل ذكي للمحتوى',
    description: 'تحليل العناصر الموجودة وتقديم اقتراحات للتحسين',
    color: 'purple'
  },
  {
    id: 'generate',
    icon: Lightbulb,
    title: 'توليد أفكار',
    description: 'إنشاء أفكار جديدة بناءً على المحتوى الحالي',
    color: 'yellow'
  },
  {
    id: 'connect',
    icon: Zap,
    title: 'ربط ذكي',
    description: 'اقتراح روابط بين العناصر وتنظيمها',
    color: 'blue'
  },
  {
    id: 'optimize',
    icon: Target,
    title: 'تحسين التخطيط',
    description: 'تحسين ترتيب وتنظيم العناصر',
    color: 'green'
  }
];

const quickPrompts = [
  'حلل هذا التخطيط واقترح تحسينات',
  'أنشئ خريطة ذهنية من العناصر الموجودة',
  'اربط العناصر المتشابهة',
  'اقترح مهام جديدة للمشروع',
  'حول هذا إلى جدول زمني',
  'أنشئ ملخص تنفيذي'
];

export const AIPanel: React.FC<AIPanelProps> = ({
  onClose,
  canvasElements,
  selectedCategory
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'tools' | 'insights'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'مرحباً! أنا مساعدك الذكي للتخطيط التشاركي. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // محاكاة استجابة الذكاء الاصطناعي
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        message: getAIResponse(inputMessage, canvasElements),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (message: string, elements: CanvasElement[]) => {
    if (message.includes('تحليل') || message.includes('حلل')) {
      return `بناءً على تحليل العناصر الـ${elements.length} في اللوحة، أرى أن لديك مزيج جيد من الأفكار. أقترح:
      
• تجميع العناصر المتشابهة في مجموعات
• إضافة روابط بين الأفكار ذات الصلة
• تحديد الأولويات باستخدام الألوان
• إنشاء جدول زمني للتنفيذ`;
    }
    
    if (message.includes('اقتراح') || message.includes('اقترح')) {
      return `إليك بعض الاقتراحات المفيدة:

• إضافة مرحلة تقييم المخاطر
• تحديد الموارد المطلوبة لكل مهمة
• وضع معايير نجاح واضحة
• إنشاء نقاط تحكم دورية للمراجعة`;
    }

    return `شكراً لك على سؤالك. بناءً على محتوى اللوحة الحالي، يمكنني مساعدتك في تحسين التخطيط وتنظيم الأفكار. هل تريد مني تحليل العناصر الموجودة أو اقتراح أفكار جديدة؟`;
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const tabs = [
    { id: 'chat', label: 'المحادثة', icon: MessageSquare },
    { id: 'tools', label: 'الأدوات', icon: Zap },
    { id: 'insights', label: 'الرؤى', icon: TrendingUp }
  ];

  return (
    <div className="fixed right-4 top-20 w-96 h-[calc(100vh-6rem)] glass-modal rounded-2xl overflow-hidden z-50 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Sparkles className="text-purple-600" size={20} />
          <h3 className="text-lg font-bold text-black">مساعد الذكاء الاصطناعي</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-gray-600"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex flex-col h-full">
        {activeTab === 'chat' && (
          <>
            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      chat.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/30 text-gray-800'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">{chat.message}</div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      chat.type === 'user' ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      {chat.timestamp.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/30 p-3 rounded-2xl">
                    <div className="flex space-x-1 space-x-reverse">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-4 border-t border-white/20 bg-white/10">
              <div className="text-xs text-gray-600 mb-2">اقتراحات سريعة:</div>
              <div className="flex flex-wrap gap-1">
                {quickPrompts.slice(0, 3).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-gray-700 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex space-x-2 space-x-reverse">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-gray-600">
                  <Mic size={16} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'tools' && (
          <div className="p-4 space-y-3 overflow-y-auto">
            {aiTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  className="w-full p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-right"
                >
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className={`p-2 rounded-lg bg-${tool.color}-100`}>
                      <Icon size={20} className={`text-${tool.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{tool.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{tool.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">إحصائيات اللوحة</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>عدد العناصر:</span>
                  <span className="font-medium">{canvasElements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>الملاحظات اللاصقة:</span>
                  <span className="font-medium">{canvasElements.filter(e => e.type === 'sticky-note').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>عقد الخريطة الذهنية:</span>
                  <span className="font-medium">{canvasElements.filter(e => e.type === 'mindmap-node').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">اقتراحات التحسين</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>تجميع العناصر المتشابهة في مجموعات</span>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>إضافة روابط بين الأفكار ذات الصلة</span>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>تحديد الأولويات باستخدام الألوان</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
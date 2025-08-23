import React, { useState } from 'react';
import { useAIStore } from '../../../store/ai.store';
import { useCanvasStore } from '../../../store/canvas.store';

export const AIToolsPanel: React.FC = () => {
  const { setProcessing, addChatMessage } = useAIStore();
  const { elements, addElement } = useCanvasStore();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const aiTools = [
    {
      id: 'finish',
      title: 'إنهاء ذكي',
      description: 'إكمال اللوحة بناءً على المحتوى الموجود',
      icon: '🎯',
      color: 'bg-accent-green'
    },
    {
      id: 'review',
      title: 'مراجعة ذكية',
      description: 'تحليل وتقييم محتوى اللوحة',
      icon: '🔍',
      color: 'bg-accent-blue'
    },
    {
      id: 'clean',
      title: 'تنظيف ذكي',
      description: 'ترتيب وتنظيم العناصر تلقائيًا',
      icon: '✨',
      color: 'bg-accent-yellow'
    },
    {
      id: 'organize',
      title: 'تنظيم العناصر',
      description: 'تجميع وترتيب العناصر بشكل منطقي',
      icon: '📁',
      color: 'bg-purple-400'
    },
    {
      id: 'connect',
      title: 'ربط ذكي',
      description: 'إنشاء روابط بين العناصر ذات الصلة',
      icon: '🔗',
      color: 'bg-orange-400'
    },
    {
      id: 'optimize',
      title: 'تحسين التخطيط',
      description: 'تحسين توزيع وترتيب العناصر',
      icon: '⚡',
      color: 'bg-pink-400'
    }
  ];

  const handleToolAction = async (toolId: string, toolTitle: string) => {
    setActiveAction(toolId);
    setProcessing(true);

    // Add chat message about the action
    addChatMessage({
      id: `tool_${Date.now()}`,
      type: 'system',
      content: `🤖 بدء تشغيل: ${toolTitle}`,
      timestamp: Date.now()
    });

    // Simulate AI processing
    setTimeout(() => {
      let resultMessage = '';
      
      switch (toolId) {
        case 'finish':
          resultMessage = '✅ تم إكمال اللوحة بنجاح!\n\nأضفت 3 عناصر جديدة وربطت العناصر المتشابهة.';
          // Simulate adding elements
          const newElement = {
            id: `ai_element_${Date.now()}`,
            type: 'thinking-board' as const,
            position: { x: Math.random() * 400, y: Math.random() * 300 },
            size: { width: 200, height: 150 },
            rotation: 0,
            data: {
              title: 'عنصر جديد من الذكاء الاصطناعي',
              content: 'تم إنشاء هذا العنصر تلقائيًا بواسطة المساعد الذكي'
            },
            style: {
              backgroundColor: '#f0f9ff',
              borderColor: '#0ea5e9',
              borderWidth: 2,
              borderRadius: 12
            },
            metadata: {
              createdBy: 'ai',
              createdAt: Date.now(),
              version: 1
            }
          };
          addElement(newElement);
          break;
          
        case 'review':
          resultMessage = '📊 تحليل اللوحة مكتمل!\n\nالنتائج:\n• عدد العناصر: ' + elements.length + '\n• التنظيم: جيد\n• الروابط: يمكن تحسينها';
          break;
          
        case 'clean':
          resultMessage = '🧹 تم تنظيف اللوحة!\n\n• إعادة ترتيب العناصر\n• توحيد التباعد\n• محاذاة العناصر';
          break;
          
        case 'organize':
          resultMessage = '📁 تم تنظيم العناصر!\n\n• تجميع العناصر المتشابهة\n• ترتيب حسب الأولوية\n• تحسين التدفق';
          break;
          
        case 'connect':
          resultMessage = '🔗 تم إنشاء الروابط!\n\n• ربط 4 عناصر ذات صلة\n• تحديد التبعيات\n• إضافة تسميات للروابط';
          break;
          
        case 'optimize':
          resultMessage = '⚡ تم تحسين التخطيط!\n\n• تحسين استخدام المساحة\n• تقليل التداخل\n• تحسين القراءة';
          break;
          
        default:
          resultMessage = 'تم تنفيذ العملية بنجاح!';
      }

      addChatMessage({
        id: `tool_result_${Date.now()}`,
        type: 'assistant',
        content: resultMessage,
        timestamp: Date.now()
      });

      setProcessing(false);
      setActiveAction(null);
    }, 2000 + Math.random() * 3000);
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-4">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-black mb-2">أدوات الذكاء الاصطناعي</h4>
          <p className="text-xs text-black/60">
            استخدم هذه الأدوات لتحسين وإكمال لوحة التخطيط تلقائيًا
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {aiTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolAction(tool.id, tool.title)}
              disabled={activeAction !== null}
              className={`relative p-4 bg-white/80 border border-black/10 rounded-2xl text-right transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
                activeAction === tool.id ? 'ring-2 ring-black' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 ${tool.color} rounded-full flex items-center justify-center text-white text-sm`}>
                  {tool.icon}
                </div>
                {activeAction === tool.id && (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              
              <h5 className="text-sm font-bold text-black mb-1">
                {tool.title}
              </h5>
              
              <p className="text-xs text-black/60">
                {tool.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-br from-accent-blue/10 to-accent-green/10 rounded-2xl border border-black/10">
          <div className="text-center">
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-sm font-medium text-black mb-2">
              نصيحة ذكية
            </p>
            <p className="text-xs text-black/60">
              جرب "الإنهاء الذكي" لإكمال لوحتك تلقائيًا بناءً على محتواها الحالي
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
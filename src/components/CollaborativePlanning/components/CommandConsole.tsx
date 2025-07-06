import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, X, Sparkles, Clock } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'sticky-note' | 'shape' | 'text' | 'connection' | 'mindmap-node' | 'smart-element' | 'root-connector';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
  layer: number;
  rotation?: number;
  groupId?: string;
}

interface CommandConsoleProps {
  onClose: () => void;
  canvasElements: CanvasElement[];
  onElementsUpdate: (elements: CanvasElement[]) => void;
}

interface Command {
  id: string;
  text: string;
  response: string;
  timestamp: Date;
  type: 'user' | 'ai' | 'system';
}

export const CommandConsole: React.FC<CommandConsoleProps> = ({
  onClose,
  canvasElements,
  onElementsUpdate
}) => {
  const [commands, setCommands] = useState<Command[]>([
    {
      id: '1',
      text: 'مرحباً! يمكنك استخدام الأوامر التالية للتحكم في اللوحة',
      response: '',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commands]);

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    
    // Add user command
    const userCommand: Command = {
      id: Date.now().toString(),
      text: command,
      response: '',
      timestamp: new Date(),
      type: 'user'
    };
    
    setCommands(prev => [...prev, userCommand]);

    // Process command
    let response = '';
    
    if (command.includes('أضف ملاحظة') || command.includes('add note')) {
      response = 'تم إضافة ملاحظة لاصقة جديدة في وسط اللوحة';
      const newElement: CanvasElement = {
        id: `note-${Date.now()}`,
        type: 'sticky-note',
        position: { x: 400, y: 300 },
        size: { width: 120, height: 80 },
        content: 'ملاحظة من الأوامر',
        color: '#FEF3C7',
        layer: 1
      };
      onElementsUpdate([...canvasElements, newElement]);
    } else if (command.includes('احذف الكل') || command.includes('clear all')) {
      response = 'تم حذف جميع العناصر من اللوحة';
      onElementsUpdate([]);
    } else if (command.includes('اعرض العناصر') || command.includes('show elements')) {
      response = `يوجد حالياً ${canvasElements.length} عنصر في اللوحة`;
    } else if (command.includes('نظم العناصر') || command.includes('organize')) {
      response = 'تم تنظيم العناصر في شبكة منتظمة';
      const organizedElements = canvasElements.map((el, index) => ({
        ...el,
        position: {
          x: 100 + (index % 5) * 150,
          y: 100 + Math.floor(index / 5) * 120
        }
      }));
      onElementsUpdate(organizedElements);
    } else if (command.includes('غير الألوان') || command.includes('change colors')) {
      response = 'تم تغيير ألوان جميع العناصر عشوائياً';
      const colors = ['#FEF3C7', '#DBEAFE', '#E0E7FF', '#F3E8FF', '#DCFCE7'];
      const coloredElements = canvasElements.map(el => ({
        ...el,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      onElementsUpdate(coloredElements);
    } else if (command.includes('مساعدة') || command.includes('help')) {
      response = `الأوامر المتاحة:
      • أضف ملاحظة - إضافة ملاحظة لاصقة
      • احذف الكل - حذف جميع العناصر
      • اعرض العناصر - عرض عدد العناصر
      • نظم العناصر - ترتيب العناصر في شبكة
      • غير الألوان - تغيير ألوان العناصر
      • مساعدة - عرض هذه القائمة`;
    } else {
      response = 'عذراً، لم أفهم هذا الأمر. اكتب "مساعدة" لرؤية الأوامر المتاحة.';
    }

    // Add AI response
    setTimeout(() => {
      const aiResponse: Command = {
        id: (Date.now() + 1).toString(),
        text: response,
        response: '',
        timestamp: new Date(),
        type: 'ai'
      };
      setCommands(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCommand.trim() && !isProcessing) {
      processCommand(currentCommand.trim());
      setCurrentCommand('');
    }
  };

  const quickCommands = [
    'أضف ملاحظة',
    'نظم العناصر',
    'اعرض العناصر',
    'مساعدة'
  ];

  return (
    <div className="absolute bottom-6 left-20 glass-section rounded-lg p-4 w-96 h-80 z-40 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Terminal size={16} className="text-purple-600" />
          <span className="text-sm font-medium text-gray-700">وحدة التحكم بالأوامر</span>
          <Sparkles size={14} className="text-purple-500" />
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/30 rounded"
        >
          <X size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-48">
        {commands.map((cmd) => (
          <div key={cmd.id} className={`p-2 rounded-lg text-xs ${
            cmd.type === 'user' 
              ? 'bg-blue-50 text-blue-800 mr-8' 
              : cmd.type === 'ai'
              ? 'bg-purple-50 text-purple-800 ml-8'
              : 'bg-gray-50 text-gray-600 text-center'
          }`}>
            <div className="flex items-start space-x-2 space-x-reverse">
              <div className="flex-1">
                <div className="whitespace-pre-wrap">{cmd.text}</div>
                <div className="flex items-center space-x-1 space-x-reverse mt-1 text-xs opacity-60">
                  <Clock size={10} />
                  <span>{cmd.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="bg-gray-50 text-gray-600 p-2 rounded-lg text-xs ml-8">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></div>
              <span>جاري المعالجة...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Commands */}
      <div className="flex flex-wrap gap-1 mb-3">
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => setCurrentCommand(cmd)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex space-x-2 space-x-reverse">
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          placeholder="اكتب أمرك هنا..."
          className="flex-1 px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={isProcessing || !currentCommand.trim()}
          className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={14} />
        </button>
      </form>

      <div className="mt-2 text-xs text-gray-500 text-center">
        استخدم الأوامر باللغة العربية أو الإنجليزية
      </div>
    </div>
  );
};
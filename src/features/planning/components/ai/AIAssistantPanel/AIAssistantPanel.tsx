import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIStore } from '../../../store/ai.store';
import { AIChatInterface } from '../AIChatInterface/AIChatInterface';
import { AISuggestionsPanel } from '../AISuggestionsPanel/AISuggestionsPanel';
import { AIToolsPanel } from '../AIToolsPanel/AIToolsPanel';
import { AIProjectGenerator } from '../AIProjectGenerator/AIProjectGenerator';

type AITabType = 'chat' | 'suggestions' | 'tools' | 'generator';

export const AIAssistantPanel: React.FC = () => {
  const { isVisible, isProcessing, suggestions } = useAIStore();
  const [activeTab, setActiveTab] = useState<AITabType>('chat');

  const tabs = [
    { id: 'chat' as const, label: 'محادثة', icon: '💬', count: 0 },
    { id: 'suggestions' as const, label: 'اقتراحات', icon: '💡', count: suggestions.length },
    { id: 'tools' as const, label: 'أدوات ذكية', icon: '🛠️', count: 0 },
    { id: 'generator' as const, label: 'مولد المشاريع', icon: '🏗️', count: 0 }
  ];

  if (!isVisible) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <AIChatInterface />;
      case 'suggestions':
        return <AISuggestionsPanel />;
      case 'tools':
        return <AIToolsPanel />;
      case 'generator':
        return <AIProjectGenerator />;
      default:
        return <AIChatInterface />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 w-80 h-[600px] bg-white/65 backdrop-blur-[18px] rounded-[18px] border border-white/60 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black/10">
          <h3 className="text-lg font-bold text-black">المساعد الذكي</h3>
          <div className="flex items-center gap-2">
            {isProcessing && (
              <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></div>
            )}
            <span className="text-sm font-medium text-black/60">
              {isProcessing ? 'يعمل...' : 'نشط'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 p-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-black/5 text-black border-b-2 border-black'
                  : 'text-black/60 hover:bg-black/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-accent-green text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="h-[calc(100%-120px)] overflow-hidden">
          {renderContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
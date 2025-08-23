import React from 'react';
import { useAIStore } from '../../../store/ai.store';
import { AISuggestion } from '../../../types/ai.types';

export const AISuggestionsPanel: React.FC = () => {
  const { suggestions, removeSuggestion } = useAIStore();

  // Mock suggestions for demonstration
  const mockSuggestions: AISuggestion[] = [
    {
      id: 'sug_1',
      type: 'layout',
      title: 'تحسين تخطيط العناصر',
      description: 'يمكن إعادة ترتيب العناصر لتحسين التدفق البصري وسهولة القراءة',
      confidence: 0.85,
      action: {
        type: 'arrange_elements',
        parameters: { layout: 'grid', spacing: 20 }
      }
    },
    {
      id: 'sug_2',
      type: 'connection',
      title: 'ربط العناصر ذات الصلة',
      description: 'تم اكتشاف عناصر يمكن ربطها لإظهار العلاقات والتبعيات',
      confidence: 0.78,
      action: {
        type: 'connect_elements',
        parameters: { connectionType: 'flow' }
      }
    },
    {
      id: 'sug_3',
      type: 'completion',
      title: 'إضافة عناصر مفقودة',
      description: 'يبدو أن هناك مراحل مفقودة في العملية. يمكنني اقتراح عناصر لإكمالها',
      confidence: 0.72,
      action: {
        type: 'create_element',
        parameters: { elementType: 'task', position: { x: 100, y: 200 } }
      }
    }
  ];

  const allSuggestions = [...suggestions, ...mockSuggestions];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-accent-green';
    if (confidence >= 0.6) return 'bg-accent-yellow';
    return 'bg-accent-red';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'layout': return '🎨';
      case 'connection': return '🔗';
      case 'completion': return '✨';
      case 'organization': return '📁';
      case 'optimization': return '⚡';
      default: return '💡';
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    console.log('Applying suggestion:', suggestion);
    // Here you would implement the actual suggestion logic
    removeSuggestion(suggestion.id);
  };

  const handleDismissSuggestion = (suggestion: AISuggestion) => {
    removeSuggestion(suggestion.id);
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      {allSuggestions.length === 0 ? (
        <div className="text-center text-black/60 mt-8">
          <div className="text-4xl mb-2">💡</div>
          <p className="text-sm">لا توجد اقتراحات حاليًا</p>
          <p className="text-xs text-black/40 mt-2">
            ابدأ بإضافة عناصر إلى اللوحة للحصول على اقتراحات ذكية
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-black">اقتراحات ذكية</h4>
            <span className="text-xs text-black/60">{allSuggestions.length} اقتراح</span>
          </div>

          {allSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white/80 border border-black/10 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                  <div>
                    <h5 className="text-sm font-bold text-black mb-1">
                      {suggestion.title}
                    </h5>
                    <p className="text-xs text-black/60">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getConfidenceColor(suggestion.confidence)}`}
                    title={`الثقة: ${Math.round(suggestion.confidence * 100)}%`}
                  />
                  <span className="text-xs text-black/60">
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="flex-1 bg-black text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-black/80 transition-colors"
                >
                  تطبيق
                </button>
                <button
                  onClick={() => handleDismissSuggestion(suggestion)}
                  className="px-3 py-2 bg-transparent border border-black/10 text-black rounded-xl text-xs font-medium hover:bg-black/5 transition-colors"
                >
                  تجاهل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
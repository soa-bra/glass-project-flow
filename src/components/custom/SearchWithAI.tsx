import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Bot, 
  FileText, 
  Clock, 
  Target, 
  Lightbulb,
  Sparkles,
  Filter
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'image' | 'video' | 'text';
  relevance: number;
  lastModified: string;
  path: string;
  highlights: string[];
}

interface AISuggestion {
  id: string;
  query: string;
  description: string;
  confidence: number;
}

export const SearchWithAI: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  // اقتراحات ذكية افتراضية
  const defaultSuggestions: AISuggestion[] = [
    {
      id: '1',
      query: 'متطلبات الأمان',
      description: 'البحث عن جميع الوثائق المتعلقة بمتطلبات الأمان والحماية',
      confidence: 95
    },
    {
      id: '2',
      query: 'تصاميم الواجهة',
      description: 'العثور على ملفات التصميم والنماذج الأولية للواجهات',
      confidence: 88
    },
    {
      id: '3',
      query: 'تقارير الاختبار',
      description: 'البحث في تقارير الاختبار ونتائج ضمان الجودة',
      confidence: 92
    },
    {
      id: '4',
      query: 'عقود العملاء',
      description: 'الوصول لجميع العقود والاتفاقيات مع العملاء',
      confidence: 98
    }
  ];

  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      title: 'وثيقة متطلبات الأمان - الإصدار 3.0',
      content: 'هذه الوثيقة تحتوي على جميع متطلبات الأمان والحماية المطلوبة للنظام...',
      type: 'document',
      relevance: 95,
      lastModified: '2024-01-15',
      path: '/documents/security-requirements-v3.pdf',
      highlights: ['متطلبات الأمان', 'كلمات مرور', 'تشفير البيانات']
    },
    {
      id: '2',
      title: 'دليل سياسات الأمان',
      content: 'دليل شامل لجميع السياسات والإجراءات الأمنية المتبعة في المؤسسة...',
      type: 'document',
      relevance: 87,
      lastModified: '2024-01-10',
      path: '/documents/security-policies.pdf',
      highlights: ['سياسات الأمان', 'إجراءات الحماية', 'صلاحيات المستخدمين']
    },
    {
      id: '3',
      title: 'تقرير تدقيق الأمان',
      content: 'تقرير مفصل حول نتائج تدقيق أنظمة الأمان والثغرات المكتشفة...',
      type: 'document',
      relevance: 82,
      lastModified: '2024-01-08',
      path: '/reports/security-audit-2024.pdf',
      highlights: ['تدقيق الأمان', 'نقاط الضعف', 'التوصيات']
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // محاكاة البحث الذكي
    setTimeout(() => {
      if (searchQuery.toLowerCase().includes('أمان') || searchQuery.toLowerCase().includes('حماية')) {
        setSearchResults(mockSearchResults);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    setSearchQuery(suggestion.query);
    handleSearch();
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return 'text-green-600';
    if (relevance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* شريط البحث الذكي */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="ابحث بذكاء في جميع المستندات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-12 text-right"
          />
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 gap-1"
          >
            {isSearching ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                جاري البحث...
              </>
            ) : (
              <>
                <Bot className="w-3 h-3" />
                بحث ذكي
              </>
            )}
          </Button>
        </div>
      </div>

      {/* الاقتراحات الذكية */}
      {!searchQuery && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-right flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            اقتراحات البحث الذكي
          </h4>
          <div className="space-y-2">
            {defaultSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-white/20 rounded-xl p-3 hover:bg-white/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <Badge className="bg-blue-100 text-blue-800">
                    {suggestion.confidence}% دقة
                  </Badge>
                  <div className="text-right flex-1 mr-2">
                    <h5 className="font-medium text-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      {suggestion.query}
                    </h5>
                    <p className="text-xs text-gray-600 mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* نتائج البحث */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <Filter className="w-3 h-3" />
                تصفية
              </Button>
              <Button size="sm" variant="outline" className="gap-1">
                <Target className="w-3 h-3" />
                ترتيب حسب الصلة
              </Button>
            </div>
            <h4 className="font-medium text-sm text-right">
              تم العثور على {searchResults.length} نتيجة
            </h4>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getRelevanceColor(result.relevance)} bg-white/50`}>
                          {result.relevance}% صلة
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.lastModified}
                        </span>
                      </div>
                      <div className="text-right flex-1 mr-2">
                        <h5 className="font-medium text-sm flex items-center gap-1">
                          <FileText className="w-4 h-4 text-blue-500" />
                          {result.title}
                        </h5>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed text-right">
                      {result.content}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {result.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="ghost" className="gap-1">
                        <FileText className="w-3 h-3" />
                        فتح
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1">
                        <Target className="w-3 h-3" />
                        إظهار في المجلد
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* رسالة عدم وجود نتائج */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-8 text-gray-500">
          <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="font-medium">لم يتم العثور على نتائج</p>
          <p className="text-sm">جرب كلمات مفتاحية مختلفة أو استخدم الاقتراحات الذكية</p>
        </div>
      )}
    </div>
  );
};
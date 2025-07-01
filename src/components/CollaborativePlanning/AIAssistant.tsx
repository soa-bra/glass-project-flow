
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Zap,
  MessageSquare,
  Sparkles,
  BarChart3,
  Users,
  Clock,
  Send,
  RefreshCw
} from 'lucide-react';
import { PlanningSession, CanvasElement } from './CollaborativePlanningModule';

interface AIAssistantProps {
  session: PlanningSession;
  canvasElements: CanvasElement[];
  onSuggestion: (suggestions: AISuggestion[]) => void;
}

interface AISuggestion {
  id: string;
  type: 'idea' | 'task' | 'optimization' | 'cultural' | 'strategy';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  culturalScore: number;
  implementation: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  session,
  canvasElements,
  onSuggestion
}) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'analysis' | 'chat'>('suggestions');

  // Mock AI suggestions
  const mockSuggestions: AISuggestion[] = [
    {
      id: '1',
      type: 'cultural',
      title: 'تعزيز الهوية الثقافية',
      description: 'اقتراح دمج عناصر من التراث السعودي في استراتيجية العلامة التجارية',
      priority: 'high',
      culturalScore: 95,
      implementation: 'إضافة عناصر بصرية تعكس التراث المحلي'
    },
    {
      id: '2',
      type: 'optimization',
      title: 'تحسين تدفق العمل',
      description: 'إعادة ترتيب المهام لتحسين الكفاءة وتقليل التأخير',
      priority: 'medium',
      culturalScore: 78,
      implementation: 'تجميع المهام المترابطة وتحديد التبعيات'
    },
    {
      id: '3',
      type: 'idea',
      title: 'مبادرة التواصل المجتمعي',
      description: 'اقتراح حملة للتواصل مع المجتمع المحلي لتعزيز الوعي بالعلامة',
      priority: 'high',
      culturalScore: 92,
      implementation: 'تطوير برنامج تطوعي مع الجمعيات المحلية'
    },
    {
      id: '4',
      type: 'strategy',
      title: 'تحليل الفرص السوقية',
      description: 'تحديد فرص جديدة في السوق بناءً على الاتجاهات الثقافية',
      priority: 'medium',
      culturalScore: 85,
      implementation: 'إجراء دراسة تفصيلية للسوق المحلي'
    }
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      onSuggestion(mockSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleQuery = () => {
    if (query.trim()) {
      // Handle AI query
      console.log('AI Query:', query);
      setQuery('');
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'idea': return <Lightbulb className="h-4 w-4" />;
      case 'task': return <Target className="h-4 w-4" />;
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      case 'cultural': return <Sparkles className="h-4 w-4" />;
      case 'strategy': return <Brain className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'idea': return 'bg-yellow-100 text-yellow-800';
      case 'task': return 'bg-blue-100 text-blue-800';
      case 'optimization': return 'bg-green-100 text-green-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'strategy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Control Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            مساعد الذكاء الاصطناعي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{canvasElements.length}</div>
              <div className="text-sm text-gray-600">عناصر الكانفاس</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{session.participants.length}</div>
              <div className="text-sm text-gray-600">المشاركون</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{session.culturalScore}%</div>
              <div className="text-sm text-gray-600">التوافق الثقافي</div>
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                تحليل الجلسة واقتراح تحسينات
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'suggestions' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('suggestions')}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              الاقتراحات
            </Button>
            <Button
              variant={activeTab === 'analysis' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('analysis')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              التحليل
            </Button>
            <Button
              variant={activeTab === 'chat' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              محادثة
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getSuggestionIcon(suggestion.type)}
                        <h3 className="font-medium">{suggestion.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSuggestionColor(suggestion.type)}>
                          {suggestion.type === 'idea' ? 'فكرة' :
                           suggestion.type === 'task' ? 'مهمة' :
                           suggestion.type === 'optimization' ? 'تحسين' :
                           suggestion.type === 'cultural' ? 'ثقافي' : 'استراتيجية'}
                        </Badge>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority === 'high' ? 'عالي' :
                           suggestion.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{suggestion.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">التوافق الثقافي:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={suggestion.culturalScore} className="w-20 h-2" />
                        <span className="text-sm font-medium">{suggestion.culturalScore}%</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <h4 className="font-medium text-blue-900 mb-1">خطة التنفيذ:</h4>
                      <p className="text-sm text-blue-700">{suggestion.implementation}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">تطبيق الاقتراح</Button>
                      <Button size="sm" variant="outline">حفظ لاحقاً</Button>
                      <Button size="sm" variant="outline">تجاهل</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد اقتراحات بعد</p>
                  <p className="text-sm">انقر على "تحليل الجلسة" للحصول على اقتراحات ذكية</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">تحليل المشاركة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">معدل المشاركة</span>
                        <span className="font-bold text-green-600">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-gray-500">مستوى مشاركة ممتاز من جميع الأعضاء</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">كفاءة الجلسة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">الإنتاجية</span>
                        <span className="font-bold text-blue-600">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <p className="text-xs text-gray-500">يمكن تحسين تنظيم الأفكار</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">تحليل الموضوعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الهوية الثقافية</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-20 h-2" />
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الابتكار</span>
                      <div className="flex items-center gap-2">
                        <Progress value={74} className="w-20 h-2" />
                        <span className="text-sm font-medium">74%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">التطبيق العملي</span>
                      <div className="flex items-center gap-2">
                        <Progress value={68} className="w-20 h-2" />
                        <span className="text-sm font-medium">68%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="h-64 bg-gray-50 rounded-lg p-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">مساعد الذكاء</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      مرحباً! كيف يمكنني مساعدتك في تحسين جلسة التخطيط؟
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="اسأل مساعد الذكاء..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                  className="flex-1"
                />
                <Button onClick={handleQuery}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

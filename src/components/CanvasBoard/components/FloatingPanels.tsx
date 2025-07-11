import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ChevronRight, 
  ChevronDown,
  Bot,
  Layers,
  Palette,
  Users,
  Wrench,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Move,
  RotateCcw,
  Trash2,
  Copy,
  Settings,
  Sparkles,
  Lightbulb,
  Zap
} from 'lucide-react';

interface FloatingPanelsProps {
  showSmartAssistant: boolean;
  showLayers: boolean;
  showAppearance: boolean;
  showCollaboration: boolean;
  showTools: boolean;
  onTogglePanel: (panel: string) => void;
  layers?: any[];
  selectedLayerId?: string;
  onLayerSelect?: (layerId: string) => void;
  onLayerToggle?: (layerId: string) => void;
  onLayerLock?: (layerId: string) => void;
  selectedElementId?: string | null;
  elements?: any[];
}

export const FloatingPanels: React.FC<FloatingPanelsProps> = ({
  showSmartAssistant,
  showLayers,
  showAppearance,
  showCollaboration,
  showTools,
  onTogglePanel,
  layers = [],
  selectedLayerId,
  onLayerSelect,
  onLayerToggle,
  onLayerLock,
  selectedElementId,
  elements = []
}) => {
  const [smartAssistantExpanded, setSmartAssistantExpanded] = useState(true);
  const [layersExpanded, setLayersExpanded] = useState(true);
  const [appearanceExpanded, setAppearanceExpanded] = useState(true);

  const smartSuggestions = [
    { id: 1, text: "إضافة عنوان للمشروع", action: "add_title", priority: "high" },
    { id: 2, text: "محاذاة العناصر", action: "align_elements", priority: "medium" },
    { id: 3, text: "تحسين الألوان", action: "improve_colors", priority: "low" },
    { id: 4, text: "إضافة خلفية", action: "add_background", priority: "medium" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Smart Assistant Panel */}
      {showSmartAssistant && (
        <Card className="fixed top-24 right-4 w-80 bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50 z-40 animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary animate-pulse" />
                <CardTitle className="text-sm font-arabic">المساعد الذكي</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSmartAssistantExpanded(!smartAssistantExpanded)}
                  className="w-6 h-6 p-0"
                >
                  {smartAssistantExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePanel('smartAssistant')}
                  className="w-6 h-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {smartAssistantExpanded && (
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground font-arabic">
                اقتراحات ذكية للتحسين:
              </div>
              {smartSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-arabic text-gray-800">{suggestion.text}</p>
                    </div>
                    <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority === 'high' ? 'عالي' : 
                       suggestion.priority === 'medium' ? 'متوسط' : 'منخفض'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" className="h-6 text-xs font-arabic" variant="outline">
                      تطبيق
                    </Button>
                    <Button size="sm" className="h-6 text-xs font-arabic" variant="ghost">
                      تجاهل
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <Button className="w-full h-8 text-xs font-arabic" variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  توليد اقتراحات جديدة
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Layers Panel */}
      {showLayers && (
        <Card className="fixed top-24 left-4 w-72 bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50 z-40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm font-arabic">الطبقات</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLayersExpanded(!layersExpanded)}
                  className="w-6 h-6 p-0"
                >
                  {layersExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePanel('layers')}
                  className="w-6 h-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {layersExpanded && (
            <CardContent className="space-y-2">
              {layers.length > 0 ? (
                layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      selectedLayerId === layer.id
                        ? 'bg-primary/10 border-primary/30'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                    onClick={() => onLayerSelect?.(layer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLayerToggle?.(layer.id);
                          }}
                          className="w-5 h-5 p-0"
                        >
                          {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>
                        <span className="text-sm font-arabic">{layer.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLayerLock?.(layer.id);
                        }}
                        className="w-5 h-5 p-0"
                      >
                        {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm font-arabic">
                  لا توجد طبقات
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Appearance Panel */}
      {showAppearance && (
        <Card className="fixed bottom-24 right-4 w-80 bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50 z-40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm font-arabic">المظهر</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAppearanceExpanded(!appearanceExpanded)}
                  className="w-6 h-6 p-0"
                >
                  {appearanceExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePanel('appearance')}
                  className="w-6 h-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {appearanceExpanded && (
            <CardContent className="space-y-4">
              {selectedElementId ? (
                <div>
                  <div className="text-xs text-muted-foreground font-arabic mb-2">
                    العنصر المحدد:
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-arabic text-gray-600">اللون:</label>
                      <div className="flex gap-2 mt-1">
                        {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map(color => (
                          <div
                            key={color}
                            className="w-6 h-6 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-arabic text-gray-600">الحجم:</label>
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" variant="outline" className="text-xs">صغير</Button>
                        <Button size="sm" variant="outline" className="text-xs">متوسط</Button>
                        <Button size="sm" variant="outline" className="text-xs">كبير</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm font-arabic">
                  حدد عنصراً لتعديل مظهره
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Collaboration Panel */}
      {showCollaboration && (
        <Card className="fixed bottom-24 left-4 w-64 bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50 z-40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm font-arabic">التعاون</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePanel('collaboration')}
                className="w-6 h-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground font-arabic">
              المتعاونون النشطون:
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  أ
                </div>
                <span className="text-sm font-arabic">أحمد محمد</span>
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  س
                </div>
                <span className="text-sm font-arabic">سارة أحمد</span>
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <Separator />
            <Button className="w-full h-8 text-xs font-arabic" variant="outline">
              دعوة متعاونين
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tools Panel */}
      {showTools && (
        <Card className="fixed top-1/2 left-4 transform -translate-y-1/2 w-64 bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50 z-40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm font-arabic">الأدوات</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePanel('tools')}
                className="w-6 h-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedElementId ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-arabic mb-2">
                  أدوات العنصر المحدد:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs font-arabic">
                    <Move className="w-3 h-3 mr-1" />
                    تحريك
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs font-arabic">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    دوران
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs font-arabic">
                    <Copy className="w-3 h-3 mr-1" />
                    نسخ
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs font-arabic text-red-600">
                    <Trash2 className="w-3 h-3 mr-1" />
                    حذف
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm font-arabic">
                حدد عنصراً لإظهار الأدوات
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
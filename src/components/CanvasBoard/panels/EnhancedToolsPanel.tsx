import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  Search, 
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Keyboard
} from 'lucide-react';
import { Tool } from '../types/index';
import { CANVAS_TOOLS } from '../constants/index';

interface EnhancedToolsPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  recentTools: string[];
  favoriteTools: string[];
  onToggleFavorite: (toolId: string) => void;
}

const EnhancedToolsPanel: React.FC<EnhancedToolsPanelProps> = ({
  isVisible,
  onToggle,
  selectedTool,
  onToolSelect,
  recentTools,
  favoriteTools,
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basic', 'content'])
  );

  const filteredTools = CANVAS_TOOLS.filter(tool =>
    tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categorizedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const categoryLabels = {
    basic: 'أساسية',
    content: 'محتوى',
    smart: 'ذكية',
    file: 'ملفات',
    project: 'مشاريع',
    navigation: 'تنقل',
    collaboration: 'تعاون',
    ai: 'ذكاء اصطناعي'
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const renderTool = (tool: Tool, showSubTools = true) => {
    const Icon = tool.icon;
    const isSelected = selectedTool === tool.id;
    const isFavorite = favoriteTools.includes(tool.id);
    const isRecent = recentTools.includes(tool.id);

    return (
      <div key={tool.id} className="space-y-1">
        <Button
          variant={isSelected ? "default" : "ghost"}
          size="sm"
          className={`w-full justify-start gap-2 text-xs h-8 ${
            isSelected 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
          onClick={() => onToolSelect(tool.id)}
        >
          <Icon className="w-3 h-3" />
          <span className="flex-1 text-left">{tool.label}</span>
          
          {/* Tool badges */}
          <div className="flex items-center gap-1">
            {isFavorite && (
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            )}
            {isRecent && (
              <Clock className="w-3 h-3 text-blue-500" />
            )}
            {tool.shortcut && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {tool.shortcut}
              </Badge>
            )}
          </div>
        </Button>

        {/* Sub-tools */}
        {showSubTools && tool.subTools && tool.subTools.length > 0 && (
          <div className="ml-4 space-y-1">
            {tool.subTools.map(subTool => renderTool(subTool, false))}
          </div>
        )}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <Card className="w-72 h-[600px] flex flex-col bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Wrench className="w-4 h-4 text-primary" />
          صندوق الأدوات
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-auto p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="البحث في الأدوات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-sm h-8"
          />
        </div>

        <Tabs defaultValue="all" className="flex-1">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="all" className="text-xs">الكل</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs">
              المفضلة
              {favoriteTools.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5">
                  {favoriteTools.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs">
              الحديثة
              {recentTools.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5">
                  {recentTools.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="all" className="space-y-3 mt-0">
              {searchQuery ? (
                /* Search results */
                <div className="space-y-1">
                  {filteredTools.map(tool => renderTool(tool))}
                  {filteredTools.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      لا توجد أدوات تطابق البحث
                    </div>
                  )}
                </div>
              ) : (
                /* Categorized tools */
                <div className="space-y-2">
                  {Object.entries(categorizedTools).map(([category, tools]) => (
                    <div key={category}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(category)}
                        className="w-full justify-start gap-2 text-xs h-6 font-medium"
                      >
                        {expandedCategories.has(category) ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                        <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
                        <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">
                          {tools.length}
                        </Badge>
                      </Button>

                      {expandedCategories.has(category) && (
                        <div className="space-y-1 mt-1">
                          {tools.map(tool => (
                            <div key={tool.id} className="flex items-center gap-1">
                              {renderTool(tool)}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onToggleFavorite(tool.id)}
                                className="p-1 h-6 w-6 hover:bg-muted"
                              >
                                <Star 
                                  className={`w-3 h-3 ${
                                    favoriteTools.includes(tool.id)
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-muted-foreground'
                                  }`} 
                                />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-1 mt-0">
              {favoriteTools.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد أدوات مفضلة</p>
                  <p className="text-xs mt-1">اضغط على النجمة لإضافة أداة للمفضلة</p>
                </div>
              ) : (
                favoriteTools.map(toolId => {
                  const tool = CANVAS_TOOLS.find(t => t.id === toolId);
                  return tool && renderTool(tool);
                })
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-1 mt-0">
              {recentTools.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد أدوات حديثة</p>
                  <p className="text-xs mt-1">ستظهر الأدوات المستخدمة مؤخرًا هنا</p>
                </div>
              ) : (
                recentTools.map(toolId => {
                  const tool = CANVAS_TOOLS.find(t => t.id === toolId);
                  return tool && renderTool(tool);
                })
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Tool Info */}
        {selectedTool && (
          <>
            <Separator className="my-3" />
            <div className="space-y-2">
              {(() => {
                const currentTool = CANVAS_TOOLS.find(t => t.id === selectedTool);
                return currentTool && (
                  <div className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{currentTool.label}</span>
                      {currentTool.shortcut && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Keyboard className="w-3 h-3" />
                          <span>{currentTool.shortcut}</span>
                        </div>
                      )}
                    </div>
                    {currentTool.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {currentTool.description}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedToolsPanel;
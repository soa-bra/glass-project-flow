import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Calendar, 
  CheckSquare, 
  Vote, 
  Lightbulb, 
  Users, 
  Target, 
  Workflow,
  Clock,
  BarChart3,
  Search,
  Settings,
  Sparkles,
  Grid3X3,
  List,
  Filter,
  Star,
  Plus,
  Zap,
  Palette,
  Layout,
  Database,
  MessageCircle,
  FileText,
  PieChart,
  TrendingUp,
  GitBranch,
  MapPin,
  Heart,
  Award,
  Bookmark
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartElement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'thinking' | 'planning' | 'collaboration' | 'analysis' | 'visualization';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  featured?: boolean;
  config: {
    defaultSize: { width: number; height: number };
    customizable: string[];
    requiredProps: string[];
  };
}

interface ElementConfig {
  size: { width: number; height: number };
  style: {
    theme: 'default' | 'minimal' | 'modern' | 'corporate';
    colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    borderRadius: number;
    padding: number;
  };
  behavior: {
    interactive: boolean;
    animated: boolean;
    collaborative: boolean;
  };
  content: {
    title: string;
    subtitle?: string;
    initialData?: any;
  };
}

interface EnhancedSmartElementsPanelProps {
  onAddSmartElement?: (elementId: string, config: ElementConfig) => void;
  selectedElementId?: string;
}

const smartElementsData: SmartElement[] = [
  {
    id: 'think-board',
    name: 'ثينك بورد',
    description: 'لوحة للعصف الذهني والأفكار الإبداعية',
    icon: Brain,
    category: 'thinking',
    difficulty: 'beginner',
    tags: ['عصف ذهني', 'أفكار', 'إبداع'],
    featured: true,
    config: {
      defaultSize: { width: 400, height: 300 },
      customizable: ['theme', 'size', 'columns'],
      requiredProps: ['title']
    }
  },
  {
    id: 'kanban-board',
    name: 'لوحة كانبان',
    description: 'لوحة إدارة المهام والمشاريع',
    icon: CheckSquare,
    category: 'planning',
    difficulty: 'intermediate',
    tags: ['مهام', 'إدارة', 'تنظيم'],
    featured: true,
    config: {
      defaultSize: { width: 600, height: 400 },
      customizable: ['columns', 'labels', 'workflow'],
      requiredProps: ['title', 'columns']
    }
  },
  {
    id: 'voting-tool',
    name: 'أداة التصويت',
    description: 'إنشاء استطلاعات رأي تفاعلية',
    icon: Vote,
    category: 'collaboration',
    difficulty: 'beginner',
    tags: ['تصويت', 'استطلاع', 'رأي'],
    config: {
      defaultSize: { width: 300, height: 250 },
      customizable: ['options', 'style', 'anonymous'],
      requiredProps: ['question', 'options']
    }
  },
  {
    id: 'timeline',
    name: 'خط زمني',
    description: 'إنشاء خطوط زمنية للمشاريع',
    icon: Calendar,
    category: 'planning',
    difficulty: 'intermediate',
    tags: ['وقت', 'جدولة', 'مراحل'],
    config: {
      defaultSize: { width: 500, height: 200 },
      customizable: ['scale', 'milestones', 'style'],
      requiredProps: ['startDate', 'endDate']
    }
  },
  {
    id: 'stakeholder-map',
    name: 'خريطة أصحاب المصلحة',
    description: 'تخطيط العلاقات والتأثيرات',
    icon: Users,
    category: 'analysis',
    difficulty: 'advanced',
    tags: ['علاقات', 'تأثير', 'تحليل'],
    config: {
      defaultSize: { width: 450, height: 350 },
      customizable: ['layout', 'connections', 'influence'],
      requiredProps: ['stakeholders']
    }
  },
  {
    id: 'goal-tracker',
    name: 'متتبع الأهداف',
    description: 'تتبع وقياس تقدم الأهداف',
    icon: Target,
    category: 'planning',
    difficulty: 'intermediate',
    tags: ['أهداف', 'تتبع', 'قياس'],
    config: {
      defaultSize: { width: 350, height: 280 },
      customizable: ['metrics', 'visualization', 'periods'],
      requiredProps: ['goals', 'metrics']
    }
  },
  {
    id: 'flowchart',
    name: 'مخطط انسيابي',
    description: 'رسم العمليات والمسارات',
    icon: Workflow,
    category: 'visualization',
    difficulty: 'intermediate',
    tags: ['عملية', 'مسار', 'تدفق'],
    config: {
      defaultSize: { width: 400, height: 300 },
      customizable: ['shapes', 'connectors', 'layout'],
      requiredProps: ['steps']
    }
  },
  {
    id: 'analytics-dashboard',
    name: 'لوحة تحليلات',
    description: 'عرض البيانات والمؤشرات',
    icon: BarChart3,
    category: 'analysis',
    difficulty: 'advanced',
    tags: ['تحليل', 'بيانات', 'مؤشرات'],
    featured: true,
    config: {
      defaultSize: { width: 550, height: 400 },
      customizable: ['charts', 'filters', 'layout'],
      requiredProps: ['dataSource', 'metrics']
    }
  }
];

const categories = [
  { id: 'all', name: 'الكل', icon: Grid3X3 },
  { id: 'thinking', name: 'تفكير', icon: Brain },
  { id: 'planning', name: 'تخطيط', icon: Calendar },
  { id: 'collaboration', name: 'تعاون', icon: Users },
  { id: 'analysis', name: 'تحليل', icon: BarChart3 },
  { id: 'visualization', name: 'تصور', icon: PieChart }
];

const defaultElementConfig: ElementConfig = {
  size: { width: 400, height: 300 },
  style: {
    theme: 'default',
    colorScheme: 'blue',
    borderRadius: 8,
    padding: 16
  },
  behavior: {
    interactive: true,
    animated: false,
    collaborative: true
  },
  content: {
    title: 'عنصر جديد',
    subtitle: ''
  }
};

export const EnhancedSmartElementsPanel: React.FC<EnhancedSmartElementsPanelProps> = ({
  onAddSmartElement,
  selectedElementId
}) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedElement, setSelectedElement] = useState<SmartElement | null>(null);
  const [elementConfig, setElementConfig] = useState<ElementConfig>(defaultElementConfig);

  // تصفية العناصر
  const filteredElements = useMemo(() => {
    return smartElementsData.filter(element => {
      const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
      const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           element.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           element.tags.some(tag => tag.includes(searchTerm));
      const matchesFeatured = !showFeaturedOnly || element.featured;
      
      return matchesCategory && matchesSearch && matchesFeatured;
    });
  }, [selectedCategory, searchTerm, showFeaturedOnly]);

  const handleElementSelect = (element: SmartElement) => {
    setSelectedElement(element);
    setElementConfig({
      ...defaultElementConfig,
      size: element.config.defaultSize,
      content: {
        title: element.name,
        subtitle: element.description
      }
    });
    setActiveTab('customize');
  };

  const handleAddElement = () => {
    if (selectedElement && onAddSmartElement) {
      onAddSmartElement(selectedElement.id, elementConfig);
      toast.success(`تم إضافة ${selectedElement.name} إلى الكانفاس`);
      setActiveTab('browse');
      setSelectedElement(null);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || Grid3X3;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          العناصر الذكية
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="browse" className="text-xs">تصفح العناصر</TabsTrigger>
            <TabsTrigger value="customize" className="text-xs">
              تخصيص ({selectedElement?.name || 'اختر عنصر'})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="flex-1 m-0 flex flex-col">
            {/* شريط البحث والتصفية */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  placeholder="البحث في العناصر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-8 text-xs"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    onClick={() => setViewMode('grid')}
                    className="h-7 w-7 p-0"
                  >
                    <Grid3X3 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    onClick={() => setViewMode('list')}
                    className="h-7 w-7 p-0"
                  >
                    <List className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={showFeaturedOnly}
                    onCheckedChange={setShowFeaturedOnly}
                    className="scale-75"
                  />
                  <Label className="text-xs">مميزة فقط</Label>
                </div>
              </div>

              {/* تصنيفات */}
              <div className="flex gap-1 overflow-x-auto">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      size="sm"
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="text-xs whitespace-nowrap"
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* قائمة العناصر */}
            <ScrollArea className="flex-1">
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 gap-3' 
                  : 'space-y-2'
              }>
                {filteredElements.map((element) => {
                  const IconComponent = element.icon;
                  const CategoryIcon = getCategoryIcon(element.category);
                  
                  return (
                    <Card
                      key={element.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/50"
                      onClick={() => handleElementSelect(element)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium truncate">
                                {element.name}
                              </h3>
                              {element.featured && (
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {element.description}
                            </p>

                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                <CategoryIcon className="w-2.5 h-2.5 mr-1" />
                                {categories.find(cat => cat.id === element.category)?.name}
                              </Badge>
                              <Badge 
                                className={`text-xs px-1.5 py-0.5 ${getDifficultyColor(element.difficulty)}`}
                              >
                                {element.difficulty === 'beginner' ? 'مبتدئ' : 
                                 element.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {element.tags.slice(0, 3).map((tag, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline" 
                                  className="text-xs px-1 py-0"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredElements.length === 0 && (
                <div className="text-center py-8">
                  <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    لم يتم العثور على عناصر مطابقة
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="customize" className="flex-1 m-0 flex flex-col">
            {selectedElement ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <selectedElement.icon className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium">{selectedElement.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedElement.description}
                  </p>
                </div>

                <ScrollArea className="flex-1">
                  <div className="space-y-4">
                    {/* إعدادات المحتوى */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">المحتوى</Label>
                      <div className="space-y-2">
                        <Input
                          placeholder="العنوان"
                          value={elementConfig.content.title}
                          onChange={(e) => setElementConfig(prev => ({
                            ...prev,
                            content: { ...prev.content, title: e.target.value }
                          }))}
                          className="h-8 text-xs"
                        />
                        <Input
                          placeholder="العنوان الفرعي (اختياري)"
                          value={elementConfig.content.subtitle || ''}
                          onChange={(e) => setElementConfig(prev => ({
                            ...prev,
                            content: { ...prev.content, subtitle: e.target.value }
                          }))}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    {/* إعدادات الحجم */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">الحجم</Label>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">العرض: {elementConfig.size.width}px</Label>
                          <Slider
                            value={[elementConfig.size.width]}
                            onValueChange={([value]) => setElementConfig(prev => ({
                              ...prev,
                              size: { ...prev.size, width: value }
                            }))}
                            max={800}
                            min={200}
                            step={20}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">الارتفاع: {elementConfig.size.height}px</Label>
                          <Slider
                            value={[elementConfig.size.height]}
                            onValueChange={([value]) => setElementConfig(prev => ({
                              ...prev,
                              size: { ...prev.size, height: value }
                            }))}
                            max={600}
                            min={150}
                            step={20}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* إعدادات المظهر */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">المظهر</Label>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">السمة</Label>
                          <div className="grid grid-cols-2 gap-1">
                            {['default', 'minimal', 'modern', 'corporate'].map((theme) => (
                              <Button
                                key={theme}
                                size="sm"
                                variant={elementConfig.style.theme === theme ? 'default' : 'outline'}
                                onClick={() => setElementConfig(prev => ({
                                  ...prev,
                                  style: { ...prev.style, theme: theme as any }
                                }))}
                                className="text-xs h-7"
                              >
                                {theme === 'default' ? 'افتراضي' :
                                 theme === 'minimal' ? 'بسيط' :
                                 theme === 'modern' ? 'عصري' : 'مؤسسي'}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">نظام الألوان</Label>
                          <div className="flex gap-1">
                            {['blue', 'green', 'purple', 'orange', 'red'].map((color) => (
                              <Button
                                key={color}
                                size="sm"
                                variant={elementConfig.style.colorScheme === color ? 'default' : 'outline'}
                                onClick={() => setElementConfig(prev => ({
                                  ...prev,
                                  style: { ...prev.style, colorScheme: color as any }
                                }))}
                                className="w-8 h-8 p-0"
                              >
                                <div className={`w-4 h-4 rounded-full bg-${color}-500`} />
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* إعدادات السلوك */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">السلوك</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">تفاعلي</Label>
                          <Switch
                            checked={elementConfig.behavior.interactive}
                            onCheckedChange={(checked) => setElementConfig(prev => ({
                              ...prev,
                              behavior: { ...prev.behavior, interactive: checked }
                            }))}
                            className="scale-75"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">متحرك</Label>
                          <Switch
                            checked={elementConfig.behavior.animated}
                            onCheckedChange={(checked) => setElementConfig(prev => ({
                              ...prev,
                              behavior: { ...prev.behavior, animated: checked }
                            }))}
                            className="scale-75"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">تعاوني</Label>
                          <Switch
                            checked={elementConfig.behavior.collaborative}
                            onCheckedChange={(checked) => setElementConfig(prev => ({
                              ...prev,
                              behavior: { ...prev.behavior, collaborative: checked }
                            }))}
                            className="scale-75"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <Separator className="my-3" />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddElement}
                    className="flex-1 text-xs"
                    size="sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    إضافة إلى الكانفاس
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveTab('browse');
                      setSelectedElement(null);
                    }}
                    className="text-xs"
                    size="sm"
                  >
                    إلغاء
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    اختر عنصراً لتخصيصه
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
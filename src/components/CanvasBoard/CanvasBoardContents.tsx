import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  Target, 
  Lightbulb,
  MessageSquare,
  Star,
  Clock,
  Archive,
  Trash2,
  Edit,
  Share,
  Download,
  Upload,
  Zap,
  Eye,
  Settings,
  Layout,
  Layers
} from 'lucide-react';

interface CanvasItem {
  id: string;
  type: 'sticky-note' | 'task' | 'idea' | 'goal' | 'timeline' | 'team';
  title: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  tags: string[];
  assignee?: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in-progress' | 'completed';
}

interface FloatingPanel {
  id: string;
  title: string;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const CanvasBoardContents: React.FC = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [floatingPanels, setFloatingPanels] = useState<FloatingPanel[]>([
    {
      id: 'tools',
      title: 'أدوات التخطيط',
      isVisible: true,
      position: { x: 20, y: 20 },
      size: { width: 280, height: 400 }
    },
    {
      id: 'ai-assistant',
      title: 'مساعد الذكاء الاصطناعي',
      isVisible: true,
      position: { x: 320, y: 20 },
      size: { width: 300, height: 350 }
    }
  ]);
  
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const tools = [
    { id: 'select', label: 'تحديد', icon: Layout },
    { id: 'sticky-note', label: 'ملاحظة لاصقة', icon: MessageSquare },
    { id: 'task', label: 'مهمة', icon: Target },
    { id: 'idea', label: 'فكرة', icon: Lightbulb },
    { id: 'timeline', label: 'جدول زمني', icon: Calendar },
    { id: 'team', label: 'فريق', icon: Users }
  ];

  const colors = [
    'bg-yellow-200', 'bg-blue-200', 'bg-green-200', 
    'bg-pink-200', 'bg-purple-200', 'bg-orange-200'
  ];

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem: CanvasItem = {
      id: Date.now().toString(),
      type: selectedTool as any,
      title: `عنصر جديد ${canvasItems.length + 1}`,
      content: 'اضغط للتحرير',
      position: { x, y },
      color: colors[Math.floor(Math.random() * colors.length)],
      tags: [],
      priority: 'medium',
      status: 'pending'
    };

    setCanvasItems(prev => [...prev, newItem]);
  }, [selectedTool, canvasItems.length]);

  const handleItemUpdate = (id: string, updates: Partial<CanvasItem>) => {
    setCanvasItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const handleItemDelete = (id: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = canvasItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ToolsPanel = () => (
    <Card className="bg-white/95 backdrop-blur-sm border-black/10">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-black mb-4">أدوات التخطيط</h3>
        <div className="space-y-2">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "outline"}
                className={`w-full justify-start gap-2 ${
                  selectedTool === tool.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-transparent border-black/20 text-black hover:bg-black/5'
                }`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <Icon className="w-4 h-4" />
                {tool.label}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-black mb-2">الألوان</h4>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-lg cursor-pointer border-2 border-black/10 ${color}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AIAssistantPanel = () => (
    <Card className="bg-white/95 backdrop-blur-sm border-black/10">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-black mb-4">مساعد الذكاء الاصطناعي</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">اقتراح ذكي</span>
            </div>
            <p className="text-sm text-blue-700">
              يمكنني مساعدتك في تنظيم المهام وإنشاء جدول زمني للمشروع
            </p>
          </div>
          
          <Textarea
            placeholder="اسأل المساعد الذكي..."
            className="resize-none"
            rows={3}
          />
          
          <Button className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            إرسال
          </Button>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-black">اختصارات سريعة</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                تحليل المشروع
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                تقسيم المهام
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CanvasItem = ({ item }: { item: CanvasItem }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editContent, setEditContent] = useState(item.content);

    const handleSave = () => {
      handleItemUpdate(item.id, { title: editTitle, content: editContent });
      setIsEditing(false);
    };

    return (
      <div
        className={`absolute ${item.color} p-3 rounded-lg shadow-md border border-black/10 min-w-48 max-w-64 cursor-move`}
        style={{ left: item.position.x, top: item.position.y }}
      >
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {item.type}
          </Badge>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6 text-red-600"
              onClick={() => handleItemDelete(item.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-sm"
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="text-sm resize-none"
              rows={2}
            />
            <Button size="sm" onClick={handleSave} className="w-full">
              حفظ
            </Button>
          </div>
        ) : (
          <div>
            <h4 className="font-medium text-black text-sm mb-1">{item.title}</h4>
            <p className="text-xs text-black/70">{item.content}</p>
            {item.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-black">لوحة التخطيط التفاعلية</h2>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-black/50" />
              <Input
                placeholder="البحث في العناصر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              تصفية
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              مشاركة
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              تصدير
            </Button>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              حفظ
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-20 cursor-crosshair"
        onClick={handleCanvasClick}
      >
        {filteredItems.map(item => (
          <CanvasItem key={item.id} item={item} />
        ))}
      </div>

      {/* Floating Panels */}
      {floatingPanels.map(panel => (
        panel.isVisible && (
          <div
            key={panel.id}
            className="absolute z-40"
            style={{
              left: panel.position.x,
              top: panel.position.y + 80, // Account for toolbar
              width: panel.size.width,
              height: panel.size.height
            }}
          >
            {panel.id === 'tools' && <ToolsPanel />}
            {panel.id === 'ai-assistant' && <AIAssistantPanel />}
          </div>
        )
      ))}

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-black/10 p-2">
        <div className="flex items-center justify-between text-sm text-black/70">
          <div className="flex items-center gap-4">
            <span>العناصر: {canvasItems.length}</span>
            <span>المحددة: {selectedItems.length}</span>
            <span>الأداة: {tools.find(t => t.id === selectedTool)?.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasBoardContents;
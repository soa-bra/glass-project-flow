import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Keyboard, Search, Command, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

interface Shortcut {
  id: string;
  action: string;
  keys: string[];
  description: string;
  category: 'general' | 'tools' | 'navigation' | 'selection';
  customizable: boolean;
}

interface KeyboardShortcutsPanelProps {
  shortcuts: Shortcut[];
  onUpdateShortcut: (shortcutId: string, newKeys: string[]) => void;
  onResetShortcuts: () => void;
}

export const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsPanelProps> = ({
  shortcuts,
  onUpdateShortcut,
  onResetShortcuts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newKeys, setNewKeys] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const defaultShortcuts: Shortcut[] = [
    // اختصارات عامة
    { id: '1', action: 'undo', keys: ['Ctrl', 'Z'], description: 'تراجع', category: 'general', customizable: true },
    { id: '2', action: 'redo', keys: ['Ctrl', 'Y'], description: 'إعادة', category: 'general', customizable: true },
    { id: '3', action: 'save', keys: ['Ctrl', 'S'], description: 'حفظ', category: 'general', customizable: true },
    { id: '4', action: 'copy', keys: ['Ctrl', 'C'], description: 'نسخ', category: 'general', customizable: true },
    { id: '5', action: 'paste', keys: ['Ctrl', 'V'], description: 'لصق', category: 'general', customizable: true },
    { id: '6', action: 'cut', keys: ['Ctrl', 'X'], description: 'قص', category: 'general', customizable: true },
    { id: '7', action: 'selectAll', keys: ['Ctrl', 'A'], description: 'تحديد الكل', category: 'selection', customizable: true },
    
    // أدوات
    { id: '8', action: 'select', keys: ['V'], description: 'أداة التحديد', category: 'tools', customizable: true },
    { id: '9', action: 'text', keys: ['T'], description: 'أداة النص', category: 'tools', customizable: true },
    { id: '10', action: 'shape', keys: ['R'], description: 'أداة الأشكال', category: 'tools', customizable: true },
    { id: '11', action: 'sticky', keys: ['S'], description: 'ملاحظة لاصقة', category: 'tools', customizable: true },
    
    // التنقل
    { id: '12', action: 'zoomIn', keys: ['Ctrl', '+'], description: 'تكبير', category: 'navigation', customizable: true },
    { id: '13', action: 'zoomOut', keys: ['Ctrl', '-'], description: 'تصغير', category: 'navigation', customizable: true },
    { id: '14', action: 'zoomFit', keys: ['Ctrl', '0'], description: 'ملء الشاشة', category: 'navigation', customizable: true },
    { id: '15', action: 'toggleGrid', keys: ['Ctrl', 'G'], description: 'إظهار/إخفاء الشبكة', category: 'navigation', customizable: true },
    
    // تحديد
    { id: '16', action: 'delete', keys: ['Delete'], description: 'حذف المحدد', category: 'selection', customizable: false },
    { id: '17', action: 'duplicate', keys: ['Ctrl', 'D'], description: 'تكرار', category: 'selection', customizable: true },
    { id: '18', action: 'group', keys: ['Ctrl', 'G'], description: 'تجميع', category: 'selection', customizable: true },
    { id: '19', action: 'ungroup', keys: ['Ctrl', 'Shift', 'G'], description: 'إلغاء التجميع', category: 'selection', customizable: true }
  ];

  const currentShortcuts = shortcuts.length > 0 ? shortcuts : defaultShortcuts;

  const categories = [    
    { id: 'all', label: 'الكل', count: currentShortcuts.length },
    { id: 'general', label: 'عام', count: currentShortcuts.filter(s => s.category === 'general').length },
    { id: 'tools', label: 'الأدوات', count: currentShortcuts.filter(s => s.category === 'tools').length },
    { id: 'navigation', label: 'التنقل', count: currentShortcuts.filter(s => s.category === 'navigation').length },
    { id: 'selection', label: 'التحديد', count: currentShortcuts.filter(s => s.category === 'selection').length }
  ];

  const filteredShortcuts = currentShortcuts.filter(shortcut => {
    const matchesSearch = shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shortcut.keys.join(' ').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || shortcut.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatKeys = (keys: string[]) => {
    return keys.map(key => {
      switch (key) {
        case 'Ctrl': return '⌃';
        case 'Shift': return '⇧';
        case 'Alt': return '⌥';
        case 'Cmd': return '⌘';
        default: return key;
      }
    }).join(' + ');
  };

  const handleEditShortcut = (shortcut: Shortcut) => {
    if (!shortcut.customizable) {
      toast.error('هذا الاختصار غير قابل للتخصيص');
      return;
    }
    setEditingId(shortcut.id);
    setNewKeys([...shortcut.keys]);
  };

  const handleSaveShortcut = () => {
    if (!editingId || newKeys.length === 0) return;
    
    // التحقق من تعارض الاختصارات
    const existingShortcut = currentShortcuts.find(s => 
      s.id !== editingId && 
      JSON.stringify(s.keys) === JSON.stringify(newKeys)
    );
    
    if (existingShortcut) {
      toast.error(`هذا الاختصار مستخدم بالفعل لـ: ${existingShortcut.description}`);
      return;
    }

    onUpdateShortcut(editingId, newKeys);
    setEditingId(null);
    setNewKeys([]);
    toast.success('تم تحديث الاختصار بنجاح');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewKeys([]);
  };

  const handleKeyCapture = (e: React.KeyboardEvent) => {
    e.preventDefault();
    const keys: string[] = [];
    
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.shiftKey) keys.push('Shift');
    if (e.altKey) keys.push('Alt');
    if (e.metaKey) keys.push('Cmd');
    
    if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
      keys.push(e.key.toUpperCase());
    }
    
    if (keys.length > 0) {
      setNewKeys(keys);
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Keyboard className="w-5 h-5" />
          اختصارات لوحة المفاتيح
        </CardTitle>
        
        {/* شريط البحث */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في الاختصارات..."
            className="pl-10 font-arabic"
          />
        </div>

        {/* فئات */}
        <div className="flex flex-wrap gap-1 mt-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1 rounded-full text-xs font-arabic transition-colors ${
                activeCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="max-h-80 overflow-y-auto space-y-1">
            {filteredShortcuts.map(shortcut => (
              <div
                key={shortcut.id}
                className={`p-3 border rounded-lg transition-colors ${
                  editingId === shortcut.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                {editingId === shortcut.id ? (
                  <div className="space-y-2">
                    <div className="text-sm font-arabic font-medium">
                      {shortcut.description}
                    </div>
                    <Input
                      value={newKeys.join(' + ')}
                      onKeyDown={handleKeyCapture}
                      placeholder="اضغط على المفاتيح الجديدة..."
                      className="font-mono text-center"
                      readOnly
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveShortcut}
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        حفظ
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-arabic font-medium">
                        {shortcut.description}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {shortcut.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {formatKeys(shortcut.keys)}
                      </code>
                      {shortcut.customizable && (
                        <button
                          onClick={() => handleEditShortcut(shortcut)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* إعادة تعيين */}
          <div className="border-t pt-3 mt-4">
            <Button
              onClick={onResetShortcuts}
              variant="outline"
              className="w-full text-sm"
            >
              <Command className="w-4 h-4 mr-2" />
              إعادة تعيين الاختصارات الافتراضية
            </Button>
          </div>

          {/* إرشادات */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="text-sm font-medium font-arabic mb-1">💡 إرشادات:</h4>
            <ul className="text-xs font-arabic text-yellow-800 space-y-1">
              <li>• انقر على رمز التحرير لتخصيص الاختصار</li>
              <li>• اضغط على المفاتيح المطلوبة معاً</li>
              <li>• بعض الاختصارات محجوزة ولا يمكن تغييرها</li>
              <li>• تجنب تعارض الاختصارات</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
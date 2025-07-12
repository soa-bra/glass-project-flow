import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MAIN_TOOLBAR_TOOLS } from '../constants';
import { ShortcutIndicator } from './ShortcutIndicator';
import { Keyboard } from 'lucide-react';

interface ShortcutsPanelProps {
  className?: string;
}

export const ShortcutsPanel: React.FC<ShortcutsPanelProps> = ({ className = "" }) => {
  const toolShortcuts = MAIN_TOOLBAR_TOOLS.filter(tool => tool.shortcut);
  
  const generalShortcuts = [
    { label: 'نسخ', shortcut: 'Ctrl+C', description: 'نسخ العنصر المحدد' },
    { label: 'لصق', shortcut: 'Ctrl+V', description: 'لصق العنصر المنسوخ' },
    { label: 'تراجع', shortcut: 'Ctrl+Z', description: 'تراجع عن آخر عملية' },
    { label: 'إعادة', shortcut: 'Ctrl+Y', description: 'إعادة آخر عملية' },
    { label: 'حذف', shortcut: 'Delete', description: 'حذف العنصر المحدد' },
    { label: 'إلغاء التحديد', shortcut: 'Esc', description: 'إلغاء تحديد العناصر' },
  ];
  
  return (
    <Card className={`w-80 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Keyboard className="w-4 h-4" />
          اختصارات لوحة المفاتيح
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* اختصارات الأدوات */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">الأدوات</h4>
          <div className="grid gap-2">
            {toolShortcuts.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <tool.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{tool.label}</span>
                </div>
                <ShortcutIndicator shortcut={tool.shortcut!} />
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* الاختصارات العامة */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">عام</h4>
          <div className="grid gap-2">
            {generalShortcuts.map((shortcut) => (
              <div key={shortcut.shortcut} className="flex items-center justify-between">
                <div>
                  <span className="text-sm block">{shortcut.label}</span>
                  <span className="text-xs text-muted-foreground">{shortcut.description}</span>
                </div>
                <ShortcutIndicator shortcut={shortcut.shortcut} />
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* اختصارات التحكم بالعناصر */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">تحريك العناصر</h4>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm block">تحريك دقيق</span>
                <span className="text-xs text-muted-foreground">تحريك العنصر بخطوات صغيرة</span>
              </div>
              <ShortcutIndicator shortcut="↑↓←→" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm block">تحريك سريع</span>
                <span className="text-xs text-muted-foreground">تحريك العنصر بخطوات كبيرة</span>
              </div>
              <ShortcutIndicator shortcut="Shift+↑↓←→" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
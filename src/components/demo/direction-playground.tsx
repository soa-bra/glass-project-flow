import React, { useState } from 'react';
import { DirectionProvider } from '@/contexts/direction-context';
import { DirectionToggle } from '@/components/ui/direction-toggle';
import { DirectionalIcon, ChevronStart, ChevronEnd, ArrowStart, ArrowEnd } from '@/components/ui/directional-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, SkipBack, SkipForward, Settings, Menu, Search } from 'lucide-react';

export function DirectionPlayground() {
  const [nodes, setNodes] = useState([
    { id: '1', x: 20, y: 20, type: 'start', title: 'البداية' },
    { id: '2', x: 200, y: 60, type: 'process', title: 'المعالجة' },
    { id: '3', x: 380, y: 100, type: 'end', title: 'النهاية' },
  ]);

  return (
    <DirectionProvider defaultDirection="rtl">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="logical-border-end bg-card logical-padding-start-6 logical-padding-end-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">محرك الرسم اللانهائي</h1>
              <span className="text-xs bg-secondary px-2 py-1 rounded-full">التجريبي</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute inset-inline-start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="البحث..."
                  className="logical-padding-start-9 w-64"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <DirectionToggle showText />
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar */}
          <aside className="w-64 logical-border-end bg-card logical-padding-start-4 logical-padding-end-4 py-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">الأدوات</Label>
                <div className="logical-margin-start-2 space-y-2">
                  <Button variant="ghost" size="sm" className="w-full logical-justify-start">
                    <ArrowStart className="logical-margin-end-2 h-4 w-4" />
                    تحديد
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full logical-justify-start">
                    <DirectionalIcon icon={Play} className="logical-margin-end-2 h-4 w-4" />
                    رسم
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full logical-justify-start">
                    <ChevronStart className="logical-margin-end-2 h-4 w-4" />
                    نص
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">العناصر</Label>
                <div className="logical-margin-start-2 space-y-2">
                  {['مستطيل', 'دائرة', 'خط', 'سهم', 'نص', 'ملاحظة'].map((tool) => (
                    <Button 
                      key={tool}
                      variant="ghost" 
                      size="sm" 
                      className="w-full logical-justify-start logical-text-start"
                    >
                      {tool}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">الطبقات</Label>
                <div className="logical-margin-start-2 space-y-1">
                  {nodes.map((node, index) => (
                    <div 
                      key={node.id}
                      className="flex items-center gap-2 logical-padding-start-2 logical-padding-end-2 py-1 rounded hover:bg-muted/50"
                    >
                      <div className="w-3 h-3 rounded bg-primary/20 border border-primary/40" />
                      <span className="text-sm flex-1 logical-text-start">{node.title}</span>
                      <ChevronEnd className="h-3 w-3 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="canvas-toolbar bg-card logical-border-end">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <ArrowStart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <ArrowEnd className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-border logical-margin-start-2 logical-margin-end-2" />
                <Button size="sm" variant="outline">
                  <DirectionalIcon icon={SkipBack} className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <DirectionalIcon icon={SkipForward} className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">100%</span>
                <Button size="sm" variant="ghost">
                  ملاءمة
                </Button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative bg-muted/5 overflow-hidden">
              {/* Canvas Grid Background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Canvas Nodes */}
              {nodes.map((node, index) => (
                <div
                  key={node.id}
                  className="canvas-node bg-card"
                  style={{
                    insetInlineStart: `${node.x}px`,
                    insetBlockStart: `${node.y}px`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {node.type === 'start' && <ChevronStart className="h-4 w-4 text-green-600" />}
                    {node.type === 'process' && <div className="w-4 h-4 rounded bg-blue-600" />}
                    {node.type === 'end' && <ChevronEnd className="h-4 w-4 text-red-600" />}
                    <span className="text-sm font-medium">{node.title}</span>
                  </div>

                  {/* Connection handles */}
                  <div className="absolute canvas-handle-right bg-primary rounded-full w-2 h-2 -translate-y-1/2 top-1/2" />
                  <div className="absolute canvas-handle-left bg-primary rounded-full w-2 h-2 -translate-y-1/2 top-1/2" />
                </div>
              ))}

              {/* Connection Lines */}
              {nodes.slice(0, -1).map((node, index) => {
                const nextNode = nodes[index + 1];
                return (
                  <div
                    key={`connector-${node.id}-${nextNode.id}`}
                    className="canvas-connector absolute bg-primary/60 rounded"
                    style={{
                      insetInlineStart: `${node.x + 100}px`,
                      insetBlockStart: `${node.y + 20}px`,
                      width: `${nextNode.x - node.x - 100}px`,
                      height: '2px',
                    }}
                  >
                    {/* Arrow head */}
                    <div 
                      className="absolute bg-primary w-0 h-0 canvas-connector-arrow"
                      style={{
                        insetInlineEnd: '-4px',
                        insetBlockStart: '-2px',
                        borderTop: '3px solid transparent',
                        borderBottom: '3px solid transparent',
                        borderInlineStart: '6px solid hsl(var(--primary))',
                      }}
                    />
                  </div>
                );
              })}

              {/* Minimap */}
              <div className="canvas-minimap">
                <div className="text-xs logical-padding-start-2 logical-padding-end-2 py-1 text-muted-foreground border-b">
                  خريطة مصغرة
                </div>
                <div className="p-2 relative flex-1">
                  {/* Minimap content */}
                  <div className="w-full h-full bg-muted/30 rounded relative">
                    {nodes.map((node) => (
                      <div
                        key={`mini-${node.id}`}
                        className="absolute w-2 h-2 bg-primary/60 rounded"
                        style={{
                          insetInlineStart: `${(node.x / 500) * 100}%`,
                          insetBlockStart: `${(node.y / 300) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Properties Panel */}
              <Card className="absolute inset-inline-start-4 inset-block-end-4 w-64">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">خصائص العنصر</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="node-title" className="text-xs">العنوان</Label>
                    <Input id="node-title" defaultValue="العقدة المحددة" className="h-8" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">العرض</Label>
                      <Input defaultValue="100" className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">الارتفاع</Label>
                      <Input defaultValue="40" className="h-8" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">تطبيق</Button>
                    <Button size="sm" variant="outline" className="flex-1">إلغاء</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </DirectionProvider>
  );
}
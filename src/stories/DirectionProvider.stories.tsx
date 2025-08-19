import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DirectionProvider } from '../contexts/direction-context';
import { DirectionToggle, DirectionToggleButton } from '../components/ui/direction-toggle';
import { DirectionalIcon, ChevronStart, ChevronEnd, ArrowStart, ArrowEnd } from '../components/ui/directional-icon';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Play, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const meta: Meta<typeof DirectionProvider> = {
  title: 'Layout/DirectionProvider',
  component: DirectionProvider,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    defaultDirection: {
      control: 'select',
      options: ['rtl', 'ltr'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DirectionProvider>;

// Demo component that shows RTL/LTR behavior
function DirectionDemo() {
  return (
    <div className="p-8 space-y-8 min-h-screen bg-background">
      {/* Header with direction toggle */}
      <div className="flex justify-between items-center logical-padding-start-4 logical-padding-end-4">
        <h1 className="text-2xl font-bold">Direction Test / اختبار الاتجاه</h1>
        <div className="flex gap-2">
          <DirectionToggleButton />
          <DirectionToggle showText />
        </div>
      </div>

      {/* Text and layout tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>النص العربي</CardTitle>
            <CardDescription>
              هذا نص عربي لاختبار الاتجاه. يجب أن يظهر من اليمين إلى اليسار بشكل صحيح.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="logical-text-start">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex gap-2 logical-justify-start">
              <Button size="sm">زر أول</Button>
              <Button size="sm" variant="outline">زر ثاني</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>English Text</CardTitle>
            <CardDescription>
              This is English text to test direction. Should display left-to-right correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="logical-text-start">
              هذا نص عربي مدمج مع النص الإنجليزي للتأكد من أن الاتجاهات تعمل بشكل صحيح.
            </p>
            <div className="flex gap-2 logical-justify-start">
              <Button size="sm">First Button</Button>
              <Button size="sm" variant="outline">Second Button</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Icon direction tests */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Direction Tests</CardTitle>
          <CardDescription>
            Icons should flip automatically in RTL mode when appropriate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Raw Icons</h4>
              <div className="flex gap-2">
                <ChevronLeft className="h-5 w-5" />
                <ChevronRight className="h-5 w-5" />
                <ArrowLeft className="h-5 w-5" />
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Directional Icons</h4>
              <div className="flex gap-2">
                <DirectionalIcon icon={ChevronLeft} />
                <DirectionalIcon icon={ChevronRight} />
                <DirectionalIcon icon={ArrowLeft} />
                <DirectionalIcon icon={ArrowRight} />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Semantic Icons</h4>
              <div className="flex gap-2">
                <ChevronStart />
                <ChevronEnd />
                <ArrowStart />
                <ArrowEnd />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Media Icons</h4>
              <div className="flex gap-2">
                <DirectionalIcon icon={SkipBack} />
                <DirectionalIcon icon={Play} />
                <DirectionalIcon icon={SkipForward} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout with logical properties */}
      <Card>
        <CardHeader>
          <CardTitle>Layout with Logical Properties</CardTitle>
          <CardDescription>
            Using CSS logical properties for proper RTL support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="logical-border-start logical-padding-start-4 bg-muted/50 rounded">
              <p className="text-sm">
                This box has logical border and padding start (right in RTL, left in LTR)
              </p>
            </div>
            
            <div className="logical-border-end logical-padding-end-4 bg-muted/50 rounded">
              <p className="text-sm">
                This box has logical border and padding end (left in RTL, right in LTR)
              </p>
            </div>

            <div className="flex justify-between">
              <div className="logical-margin-start-4 p-2 bg-primary/10 rounded">
                Margin Start
              </div>
              <div className="logical-margin-end-4 p-2 bg-primary/10 rounded">
                Margin End
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas-like layout */}
      <Card>
        <CardHeader>
          <CardTitle>Canvas Layout Simulation</CardTitle>
          <CardDescription>
            Simulating how canvas elements would behave with direction changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 bg-muted/20 border rounded-lg overflow-hidden">
            {/* Simulated canvas nodes */}
            <div className="canvas-node bg-blue-100 border-blue-200" 
                 style={{ insetInlineStart: '20px', insetBlockStart: '20px' }}>
              <div className="flex items-center gap-2">
                <ChevronStart className="h-4 w-4" />
                <span className="text-sm">Start Node</span>
              </div>
            </div>

            <div className="canvas-node bg-green-100 border-green-200" 
                 style={{ insetInlineEnd: '20px', insetBlockStart: '60px' }}>
              <div className="flex items-center gap-2">
                <span className="text-sm">End Node</span>
                <ChevronEnd className="h-4 w-4" />
              </div>
            </div>

            <div className="canvas-node bg-purple-100 border-purple-200" 
                 style={{ insetInlineStart: '50%', insetBlockStart: '120px', transform: 'translateX(-50%)' }}>
              <div className="flex items-center gap-2">
                <ArrowStart className="h-4 w-4" />
                <span className="text-sm">Center Node</span>
                <ArrowEnd className="h-4 w-4" />
              </div>
            </div>

            {/* Simulated connector line */}
            <div className="absolute bg-primary/30 rounded"
                 style={{ 
                   insetInlineStart: '120px', 
                   insetBlockStart: '35px', 
                   width: 'calc(100% - 240px)', 
                   height: '2px' 
                 }}>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// RTL Story
export const RTL: Story = {
  args: {
    defaultDirection: 'rtl',
  },
  render: (args) => (
    <DirectionProvider {...args}>
      <DirectionDemo />
    </DirectionProvider>
  ),
};

// LTR Story
export const LTR: Story = {
  args: {
    defaultDirection: 'ltr',
  },
  render: (args) => (
    <DirectionProvider {...args}>
      <DirectionDemo />
    </DirectionProvider>
  ),
};

// Interactive Story
export const Interactive: Story = {
  args: {
    defaultDirection: 'rtl',
  },
  render: (args) => (
    <DirectionProvider {...args}>
      <DirectionDemo />
    </DirectionProvider>
  ),
};

// Canvas Specific Story
export const CanvasLayoutTest: Story = {
  args: {
    defaultDirection: 'rtl',
  },
  render: (args) => (
    <DirectionProvider {...args}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Canvas Direction Test</h2>
          <DirectionToggle showText />
        </div>
        
        {/* Simulated canvas interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96">
          {/* Sidebar */}
          <div className="canvas-sidebar relative bg-card border rounded-lg p-4">
            <h3 className="text-sm font-medium logical-margin-bottom-3">Tools</h3>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full logical-justify-start">
                <ArrowStart className="h-4 w-4 logical-margin-end-2" />
                Select
              </Button>
              <Button variant="ghost" size="sm" className="w-full logical-justify-start">
                <DirectionalIcon icon={Play} className="h-4 w-4 logical-margin-end-2" />
                Draw
              </Button>
            </div>
          </div>

          {/* Main canvas area */}
          <div className="col-span-3 canvas-container bg-muted/10 border rounded-lg relative">
            {/* Toolbar */}
            <div className="canvas-toolbar bg-card border-b">
              <Button size="sm" variant="outline">
                <ArrowStart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <ArrowEnd className="h-4 w-4" />
              </Button>
              <div className="flex-1"></div>
              <DirectionToggleButton size="sm" />
            </div>

            {/* Canvas content */}
            <div className="p-4">
              <div className="relative h-64">
                {/* Simulated floating elements */}
                <div className="floating-panel floating-panel-start">
                  <div className="text-xs">Start Panel</div>
                </div>
                
                <div className="floating-panel floating-panel-end">
                  <div className="text-xs">End Panel</div>
                </div>

                {/* Minimap */}
                <div className="canvas-minimap">
                  <div className="text-xs p-2 text-muted-foreground">Minimap</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DirectionProvider>
  ),
};
import React, { useEffect, useState } from 'react';
import { useCanvasEngineContext } from './CanvasEngineProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface IntegrationTestResult {
  component: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
}

export const CanvasIntegrationTest: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [results, setResults] = useState<IntegrationTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  let engine = null;
  let isReady = false;

  try {
    const context = useCanvasEngineContext();
    engine = context.engine;
    isReady = context.isReady;
  } catch (error) {
    // Handle if used outside provider
  }

  const runTests = async () => {
    setIsRunning(true);
    const testResults: IntegrationTestResult[] = [];

    // Test 1: Canvas Engine
    testResults.push({
      component: 'Canvas Engine',
      status: engine && isReady ? 'pass' : 'fail',
      message: engine && isReady ? 'Canvas Engine initialized successfully' : 'Canvas Engine not available'
    });

    // Test 2: YJS Integration
    try {
      const yModule = await import('@/lib/yjs/y-supabase-provider');
      testResults.push({
        component: 'YJS Provider',
        status: yModule.YSupabaseProvider ? 'pass' : 'fail',
        message: yModule.YSupabaseProvider ? 'YJS Provider loaded successfully' : 'YJS Provider not found'
      });
    } catch (error) {
      testResults.push({
        component: 'YJS Provider',
        status: 'fail',
        message: `YJS Provider load error: ${error.message}`
      });
    }

    // Test 3: Smart Elements
    try {
      const smartModule = await import('@/components/smart-elements/enhanced-smart-element-renderer');
      testResults.push({
        component: 'Smart Elements',
        status: smartModule.EnhancedSmartElementRenderer ? 'pass' : 'fail',
        message: smartModule.EnhancedSmartElementRenderer ? 'Smart Elements renderer available' : 'Smart Elements renderer not found'
      });
    } catch (error) {
      testResults.push({
        component: 'Smart Elements',
        status: 'fail',
        message: `Smart Elements load error: ${error.message}`
      });
    }

    // Test 4: WF-01 Integration
    try {
      const wfModule = await import('@/hooks/useWF01Generator');
      testResults.push({
        component: 'WF-01 System',
        status: wfModule.useWF01Generator ? 'pass' : 'fail',
        message: wfModule.useWF01Generator ? 'WF-01 Generator hook available' : 'WF-01 Generator hook not found'
      });
    } catch (error) {
      testResults.push({
        component: 'WF-01 System',
        status: 'fail',
        message: `WF-01 load error: ${error.message}`
      });
    }

    // Test 5: Whiteboard Components
    try {
      const whiteboardModule = await import('@/components/Whiteboard/WhiteboardRoot');
      testResults.push({
        component: 'Whiteboard',
        status: whiteboardModule.default ? 'pass' : 'fail',
        message: whiteboardModule.default ? 'Whiteboard components available' : 'Whiteboard components not found'
      });
    } catch (error) {
      testResults.push({
        component: 'Whiteboard',
        status: 'fail',
        message: `Whiteboard load error: ${error.message}`
      });
    }

    // Test 6: Connection System
    try {
      const connectionModule = await import('@/lib/canvas/controllers/connection-manager');
      testResults.push({
        component: 'Connection Manager',
        status: connectionModule.ConnectionManager ? 'pass' : 'fail',
        message: connectionModule.ConnectionManager ? 'Connection Manager available' : 'Connection Manager not found'
      });
    } catch (error) {
      testResults.push({
        component: 'Connection Manager',
        status: 'fail',
        message: `Connection Manager load error: ${error.message}`
      });
    }

    // Test 7: Add sample nodes to engine if available
    if (engine && isReady) {
      try {
        const nodeId = engine.addNode({
          type: 'rect',
          transform: { position: { x: 100, y: 100 } },
          size: { width: 120, height: 80 },
          style: { fill: 'hsl(var(--primary))' }
        });
        
        const node = engine.getNode(nodeId);
        testResults.push({
          component: 'Node Operations',
          status: node ? 'pass' : 'fail',
          message: node ? 'Node creation and retrieval successful' : 'Node operations failed'
        });
        
        // Clean up test node
        engine.removeNode(nodeId);
      } catch (error) {
        testResults.push({
          component: 'Node Operations',
          status: 'fail',
          message: `Node operations error: ${error.message}`
        });
      }
    } else {
      testResults.push({
        component: 'Node Operations',
        status: 'pending',
        message: 'Canvas Engine not available for testing'
      });
    }

    setResults(testResults);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500';
      case 'fail': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pass': return 'نجح';
      case 'fail': return 'فشل';
      case 'pending': return 'معلق';
      default: return 'غير محدد';
    }
  };

  const passedCount = results.filter(r => r.status === 'pass').length;
  const totalCount = results.length;

  return (
    <Card className="w-96 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">اختبار تكامل اللوحة</CardTitle>
        {results.length > 0 && (
          <Badge variant={passedCount === totalCount ? "default" : "destructive"}>
            {passedCount}/{totalCount} نجح
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            size="sm"
            className="flex-1"
          >
            {isRunning ? 'جاري الاختبار...' : 'تشغيل الاختبارات'}
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline" 
            size="sm"
          >
            إغلاق
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 rounded-md border text-sm"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${getStatusColor(result.status)}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{result.component}</div>
                  <div className="text-xs text-muted-foreground">
                    {getStatusText(result.status)} - {result.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Canvas Integration Test v2.0
        </div>
      </CardContent>
    </Card>
  );
};
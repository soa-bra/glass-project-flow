/**
 * RunnerPanel - لوحة تحكم تشغيل Workflow
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Square,
  Settings,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LogsViewer } from './LogsViewer';
import { StatusBadge } from './StatusOverlay';
import type { 
  WorkflowInstance, 
  WorkflowRuntimeStatus,
  WorkflowEngineConfig 
} from '@/types/workflow-runtime';
import type { WorkflowDefinition } from '@/types/workflow';
import { workflowEngine } from '@/core/workflow';
import { defaultEngineConfig } from '@/types/workflow-runtime';

interface RunnerPanelProps {
  workflow: WorkflowDefinition;
  onInstanceUpdate?: (instance: WorkflowInstance) => void;
  className?: string;
}

export function RunnerPanel({ 
  workflow, 
  onInstanceUpdate,
  className = '' 
}: RunnerPanelProps) {
  const [instance, setInstance] = useState<WorkflowInstance | null>(null);
  const [config, setConfig] = useState<WorkflowEngineConfig>(defaultEngineConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(true);

  // تحديث المثيل
  const updateInstance = useCallback((updated: WorkflowInstance) => {
    setInstance({ ...updated });
    onInstanceUpdate?.(updated);
  }, [onInstanceUpdate]);

  // بدء التشغيل
  const handleStart = async () => {
    const newInstance = await workflowEngine.start(
      workflow,
      config,
      (event) => {
        const current = workflowEngine.getInstance(newInstance?.id || '');
        if (current) {
          updateInstance(current);
        }
      }
    );
    updateInstance(newInstance);
  };

  // إيقاف مؤقت
  const handlePause = () => {
    if (!instance) return;
    workflowEngine.pause(instance.id);
    const updated = workflowEngine.getInstance(instance.id);
    if (updated) updateInstance(updated);
  };

  // استئناف
  const handleResume = async () => {
    if (!instance) return;
    await workflowEngine.resume(instance.id);
    const updated = workflowEngine.getInstance(instance.id);
    if (updated) updateInstance(updated);
  };

  // خطوة
  const handleStep = async () => {
    if (!instance) return;
    
    // إذا لم يبدأ بعد، ابدأه أولاً
    if (instance.status === 'idle') {
      await handleStart();
      return;
    }
    
    await workflowEngine.step(instance.id);
    const updated = workflowEngine.getInstance(instance.id);
    if (updated) updateInstance(updated);
  };

  // إعادة تعيين
  const handleReset = () => {
    if (!instance) return;
    const reset = workflowEngine.reset(instance.id);
    if (reset) updateInstance(reset);
  };

  // إيقاف
  const handleStop = () => {
    if (!instance) return;
    workflowEngine.stop(instance.id);
    const updated = workflowEngine.getInstance(instance.id);
    if (updated) updateInstance(updated);
  };

  // مسح السجلات
  const handleClearLogs = () => {
    if (!instance) return;
    instance.logs = [];
    updateInstance({ ...instance });
  };

  const status: WorkflowRuntimeStatus = instance?.status || 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed' || status === 'error';

  return (
    <div className={`bg-background border border-border rounded-xl overflow-hidden ${className}`}>
      {/* الرأس */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{workflow.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={instance?.nodeStates?.[instance?.currentNodeIds?.[0] || '']?.status || 'idle'} />
              {instance?.startedAt && (
                <span className="text-xs text-muted-foreground">
                  بدأ: {new Date(instance.startedAt).toLocaleTimeString('ar-SA')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      {/* الإعدادات */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-b"
          >
            <div className="p-4 space-y-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="text-sm">التقدم التلقائي</Label>
                <Switch
                  checked={config.autoAdvance}
                  onCheckedChange={checked => 
                    setConfig(prev => ({ ...prev, autoAdvance: checked }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">تأخير الخطوة (ms)</Label>
                  <span className="text-xs text-muted-foreground">{config.stepDelay}</span>
                </div>
                <Slider
                  value={[config.stepDelay]}
                  min={0}
                  max={2000}
                  step={100}
                  onValueChange={([value]) => 
                    setConfig(prev => ({ ...prev, stepDelay: value }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">الحد الأقصى للمحاولات</Label>
                  <span className="text-xs text-muted-foreground">{config.maxRetries}</span>
                </div>
                <Slider
                  value={[config.maxRetries]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={([value]) => 
                    setConfig(prev => ({ ...prev, maxRetries: value }))
                  }
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* أزرار التحكم */}
      <div className="flex items-center justify-center gap-2 p-4 border-b">
        {/* زر البدء/الاستئناف */}
        {!isRunning ? (
          <Button
            onClick={isPaused ? handleResume : handleStart}
            disabled={isCompleted}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isPaused ? 'استئناف' : 'تشغيل'}
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            variant="secondary"
            className="gap-2"
          >
            <Pause className="w-4 h-4" />
            إيقاف مؤقت
          </Button>
        )}

        {/* خطوة */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleStep}
          disabled={isRunning || isCompleted}
          title="خطوة واحدة"
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        {/* إعادة تعيين */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          disabled={status === 'idle'}
          title="إعادة تعيين"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        {/* إيقاف */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleStop}
          disabled={!isRunning && !isPaused}
          title="إيقاف"
        >
          <Square className="w-4 h-4" />
        </Button>
      </div>

      {/* معلومات الحالة */}
      {instance && (
        <div className="px-4 py-3 border-b bg-muted/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {instance.currentNodeIds.length}
              </div>
              <div className="text-xs text-muted-foreground">عقد نشطة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(instance.nodeStates).filter(s => s.status === 'completed').length}
              </div>
              <div className="text-xs text-muted-foreground">مكتملة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {Object.values(instance.nodeStates).filter(s => s.status === 'blocked').length}
              </div>
              <div className="text-xs text-muted-foreground">محظورة</div>
            </div>
          </div>
        </div>
      )}

      {/* المتغيرات */}
      {instance && Object.keys(instance.variables).length > 0 && (
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">المتغيرات</span>
          </div>
          <div className="space-y-1">
            {Object.entries(instance.variables).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{key}</span>
                <span className="font-mono">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* السجلات */}
      {showLogs && instance && (
        <div className="p-3">
          <LogsViewer 
            logs={instance.logs} 
            onClear={handleClearLogs}
            maxHeight={200}
          />
        </div>
      )}
    </div>
  );
}

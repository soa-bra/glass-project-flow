/**
 * SceneManager - إدارة المشاهد (Scenes) والربط مع Workflow
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Link2, 
  Unlink,
  Play,
  Settings,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElementType } from '@/types/canvas-elements';

interface Scene {
  id: string;
  frameId: string;
  name: string;
  order: number;
  duration?: number; // بالثواني
  autoAdvance: boolean;
  transition: 'none' | 'fade' | 'slide' | 'zoom';
  linkedWorkflowNodeId?: string;
  triggers?: SceneTrigger[];
}

interface SceneTrigger {
  id: string;
  type: 'time' | 'click' | 'workflow_complete' | 'custom';
  config?: Record<string, unknown>;
}

interface SceneManagerProps {
  className?: string;
  onSceneSelect?: (sceneId: string) => void;
  onPlayScene?: (sceneId: string) => void;
}

export function SceneManager({ 
  className = '',
  onSceneSelect,
  onPlayScene
}: SceneManagerProps) {
  const { elements } = useCanvasStore();
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);

  // استخراج الإطارات
  const frames = useMemo(() => {
    return elements.filter(el => el.type === 'frame');
  }, [elements]);

  // استخراج عقد Workflow
  const workflowNodes = useMemo(() => {
    return elements.filter(el => el.type === 'workflow_node');
  }, [elements]);

  // إنشاء مشهد من إطار
  const createSceneFromFrame = (frame: CanvasElementType) => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      frameId: frame.id,
      name: (frame as any).name || `مشهد ${scenes.length + 1}`,
      order: scenes.length,
      autoAdvance: false,
      transition: 'fade'
    };
    setScenes(prev => [...prev, newScene]);
  };

  // تحديث مشهد
  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    setScenes(prev => prev.map(s => 
      s.id === sceneId ? { ...s, ...updates } : s
    ));
  };

  // حذف مشهد
  const deleteScene = (sceneId: string) => {
    setScenes(prev => prev.filter(s => s.id !== sceneId));
    if (selectedScene === sceneId) {
      setSelectedScene(null);
    }
  };

  // ربط مشهد بعقدة Workflow
  const linkToWorkflow = (sceneId: string, nodeId: string) => {
    updateScene(sceneId, { linkedWorkflowNodeId: nodeId });
  };

  const currentScene = scenes.find(s => s.id === selectedScene);

  return (
    <div className={`flex h-full ${className}`}>
      {/* قائمة المشاهد */}
      <div className="w-64 border-l bg-muted/30">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">المشاهد</span>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {scenes.length}
            </span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          <div className="p-2 space-y-1">
            {scenes.map((scene, index) => (
              <SceneItem
                key={scene.id}
                scene={scene}
                index={index}
                isSelected={selectedScene === scene.id}
                onSelect={() => {
                  setSelectedScene(scene.id);
                  onSceneSelect?.(scene.id);
                }}
                onPlay={() => onPlayScene?.(scene.id)}
                onDelete={() => deleteScene(scene.id)}
              />
            ))}

            {scenes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد مشاهد</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* إضافة مشهد من إطار */}
        <div className="p-2 border-t">
          <Select onValueChange={(frameId) => {
            const frame = frames.find(f => f.id === frameId);
            if (frame) createSceneFromFrame(frame);
          }}>
            <SelectTrigger className="h-8 text-xs">
              <Plus className="w-3.5 h-3.5 ml-1" />
              <SelectValue placeholder="إضافة مشهد من إطار" />
            </SelectTrigger>
            <SelectContent>
              {frames.map(frame => (
                <SelectItem key={frame.id} value={frame.id}>
                  {(frame as any).name || `إطار ${frame.id.slice(-4)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* تفاصيل المشهد المحدد */}
      {currentScene ? (
        <div className="flex-1 p-4">
          <div className="space-y-6">
            {/* الاسم */}
            <div className="space-y-2">
              <Label>اسم المشهد</Label>
              <Input
                value={currentScene.name}
                onChange={(e) => updateScene(currentScene.id, { name: e.target.value })}
              />
            </div>

            <Separator />

            {/* إعدادات التشغيل */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                إعدادات التشغيل
              </h4>

              <div className="flex items-center justify-between">
                <Label>التقدم التلقائي</Label>
                <Switch
                  checked={currentScene.autoAdvance}
                  onCheckedChange={(checked) => 
                    updateScene(currentScene.id, { autoAdvance: checked })
                  }
                />
              </div>

              {currentScene.autoAdvance && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    المدة (ثواني)
                  </Label>
                  <Input
                    type="number"
                    value={currentScene.duration || 5}
                    onChange={(e) => 
                      updateScene(currentScene.id, { duration: parseInt(e.target.value) })
                    }
                    min={1}
                    max={300}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>نوع الانتقال</Label>
                <Select
                  value={currentScene.transition}
                  onValueChange={(value: Scene['transition']) => 
                    updateScene(currentScene.id, { transition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون</SelectItem>
                    <SelectItem value="fade">تلاشي</SelectItem>
                    <SelectItem value="slide">انزلاق</SelectItem>
                    <SelectItem value="zoom">تكبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* ربط Workflow */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                ربط مع Workflow
              </h4>

              {currentScene.linkedWorkflowNodeId ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      مرتبط بعقدة Workflow
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateScene(currentScene.id, { linkedWorkflowNodeId: undefined })}
                  >
                    <Unlink className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Select
                  onValueChange={(nodeId) => linkToWorkflow(currentScene.id, nodeId)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر عقدة Workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowNodes.length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        لا توجد عقد Workflow
                      </div>
                    ) : (
                      workflowNodes.map(node => (
                        <SelectItem key={node.id} value={node.id}>
                          {(node as any).label || node.id.slice(-6)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}

              <p className="text-xs text-muted-foreground">
                عند ربط المشهد بعقدة Workflow، سيتم عرض هذا المشهد تلقائياً عندما تصل العقدة لحالة "نشط"
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>اختر مشهداً لعرض التفاصيل</p>
          </div>
        </div>
      )}
    </div>
  );
}

// مكون عنصر المشهد
interface SceneItemProps {
  scene: Scene;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onPlay: () => void;
  onDelete: () => void;
}

function SceneItem({ 
  scene, 
  index, 
  isSelected, 
  onSelect, 
  onPlay,
  onDelete 
}: SceneItemProps) {
  return (
    <motion.div
      layout
      className={`
        group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
        ${isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'}
      `}
      onClick={onSelect}
    >
      <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
        {index + 1}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{scene.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {scene.autoAdvance && (
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {scene.duration || 5}ث
            </span>
          )}
          {scene.linkedWorkflowNodeId && (
            <span className="flex items-center gap-0.5">
              <Link2 className="w-3 h-3" />
              مرتبط
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          <Play className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

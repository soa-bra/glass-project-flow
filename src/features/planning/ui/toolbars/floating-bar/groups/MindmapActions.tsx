/**
 * MindmapActions - إجراءات الخريطة الذهنية
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Palette,
  LayoutGrid,
  Trash2,
  ChevronDown,
  MoveHorizontal,
  MoveVertical,
  ArrowLeftRight,
  Columns,
  ArrowRightToLine,
  ArrowLeftToLine,
  Circle,
  Square,
  Pill,
  RectangleHorizontal,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ToolbarButton } from "../components";
import { NODE_COLORS, calculateConnectorBounds } from "@/types/mindmap-canvas";
import { applyLayoutWithSettings, DEFAULT_LAYOUT_SETTINGS, type LayoutSettings } from "@/utils/mindmap-layout";
import type { CanvasElement } from "@/types/canvas";
import type { MindMapNodeData } from "@/types/mindmap-canvas";

// أنماط العقد
const MINDMAP_NODE_STYLES: { type: string; icon: React.ReactNode; label: string }[] = [
  { type: "rounded", icon: <RectangleHorizontal size={16} />, label: "مستدير" },
  { type: "pill", icon: <Pill size={16} />, label: "كبسولة" },
  { type: "rectangle", icon: <Square size={16} />, label: "مستطيل" },
  { type: "circle", icon: <Circle size={16} />, label: "دائري" },
];

// زر راديو
const RadioOption: React.FC<{
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ selected, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      selected 
        ? 'bg-[hsl(var(--accent-blue))] text-white shadow-sm' 
        : 'bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))] hover:bg-[hsl(var(--border))]'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface MindmapActionsProps {
  selectedNodeIds: string[];
  elements: CanvasElement[];
  treeElements: CanvasElement[];
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElements: (ids: string[]) => void;
  onAddElement: (element: Partial<CanvasElement>) => void;
}

export const MindmapActions: React.FC<MindmapActionsProps> = ({
  selectedNodeIds,
  elements,
  treeElements,
  onUpdateElement,
  onDeleteElements,
  onAddElement,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(DEFAULT_LAYOUT_SETTINGS);

  // الحصول على العقدة المحددة
  const selectedNode = elements.find(el => 
    selectedNodeIds.includes(el.id) && el.type === 'mindmap_node'
  );
  const nodeData = selectedNode?.data as MindMapNodeData | undefined;

  // تطبيق التخطيط
  const handleLayoutSettingChange = useCallback((newSettings: Partial<LayoutSettings>) => {
    const updatedSettings = { ...layoutSettings, ...newSettings };
    setLayoutSettings(updatedSettings);
    applyLayoutWithSettings(updatedSettings, elements, onUpdateElement);
  }, [layoutSettings, elements, onUpdateElement]);

  // إضافة فرع
  const handleAddBranch = useCallback(() => {
    if (!selectedNode) return;

    const existingConnectors = elements.filter(el => 
      el.type === 'mindmap_connector' && 
      (el.data as any)?.startNodeId === selectedNode.id
    );
    const childCount = existingConnectors.length;
    
    const verticalSpacing = 80;
    const direction = childCount % 2 === 0 ? 1 : -1;
    const step = Math.ceil((childCount + 1) / 2);
    const yOffset = direction * step * verticalSpacing;
    const offset = 220;
    
    const newNodeId = `mindmap-node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newNodeData: MindMapNodeData = {
      label: 'فكرة جديدة',
      color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
      nodeStyle: 'rounded',
      isRoot: false,
    };
    
    const newNodePos = { 
      x: selectedNode.position.x + selectedNode.size.width + offset, 
      y: selectedNode.position.y + yOffset 
    };
    const newNodeSize = { width: 160, height: 60 };

    onAddElement({
      id: newNodeId,
      type: 'mindmap_node',
      position: newNodePos,
      size: newNodeSize,
      data: newNodeData
    });
    
    const connectorBounds = calculateConnectorBounds(
      { position: selectedNode.position, size: selectedNode.size },
      { position: newNodePos, size: newNodeSize }
    );
    
    onAddElement({
      type: 'mindmap_connector',
      position: connectorBounds.position,
      size: connectorBounds.size,
      data: {
        startNodeId: selectedNode.id,
        endNodeId: newNodeId,
        startAnchor: { nodeId: selectedNode.id, anchor: 'right' },
        endAnchor: { nodeId: newNodeId, anchor: 'left' },
        curveStyle: 'bezier',
        color: nodeData?.color || '#3DA8F5',
        strokeWidth: 2,
      }
    });
  }, [selectedNode, elements, nodeData, onAddElement]);

  // تغيير اللون
  const handleColorChange = useCallback((color: string) => {
    treeElements.forEach((el) => {
      if (el.type === "mindmap_node") {
        onUpdateElement(el.id, {
          data: { ...el.data, color },
        });
      }
    });
    setShowColorPicker(false);
  }, [treeElements, onUpdateElement]);

  // تغيير الشكل
  const handleStyleChange = useCallback((style: string) => {
    selectedNodeIds.forEach(id => {
      const node = elements.find(el => el.id === id);
      if (node && node.type === 'mindmap_node') {
        onUpdateElement(id, {
          data: { ...node.data, nodeStyle: style }
        });
      }
    });
    setShowStyleMenu(false);
  }, [selectedNodeIds, elements, onUpdateElement]);

  // حذف الشجرة
  const handleDeleteTree = useCallback(() => {
    const idsToDelete = treeElements.map(el => el.id);
    onDeleteElements(idsToDelete);
  }, [treeElements, onDeleteElements]);

  return (
    <>
      {/* إضافة فرع */}
      <ToolbarButton
        icon={<Plus size={16} />}
        onClick={handleAddBranch}
        title="إضافة فرع"
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* اللون */}
      <div className="relative">
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowLayoutMenu(false);
            setShowStyleMenu(false);
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[hsl(var(--ink)/0.1)] transition-colors"
          title="تغيير اللون"
        >
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: nodeData?.color || '#3DA8F5' }}
          />
          <ChevronDown size={14} className="text-[hsl(var(--ink-30))]" />
        </button>
        
        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-3 border border-[hsl(var(--border))] grid grid-cols-4 gap-2 min-w-[160px] z-[var(--z-popover)]"
            >
              {NODE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    nodeData?.color === color ? 'border-[hsl(var(--ink))] scale-110' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* الشكل */}
      <div className="relative">
        <button
          onClick={() => {
            setShowStyleMenu(!showStyleMenu);
            setShowColorPicker(false);
            setShowLayoutMenu(false);
          }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink-60))] transition-colors"
          title="شكل العقدة"
        >
          <RectangleHorizontal size={16} />
          <ChevronDown size={14} className="text-[hsl(var(--ink-30))]" />
        </button>
        
        <AnimatePresence>
          {showStyleMenu && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-2 border border-[hsl(var(--border))] min-w-[140px] z-[var(--z-popover)]"
            >
              {MINDMAP_NODE_STYLES.map((style) => (
                <button
                  key={style.type}
                  onClick={() => handleStyleChange(style.type)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    nodeData?.nodeStyle === style.type 
                      ? 'bg-[hsl(var(--accent-blue)/0.1)] text-[hsl(var(--accent-blue))]' 
                      : 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--ink-60))]'
                  }`}
                >
                  {style.icon}
                  <span>{style.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* التخطيط */}
      <div className="relative">
        <button
          onClick={() => {
            setShowLayoutMenu(!showLayoutMenu);
            setShowColorPicker(false);
            setShowStyleMenu(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink-60))] hover:text-[hsl(var(--accent-blue))] transition-colors text-sm font-medium"
          title="تخطيط تلقائي"
        >
          <LayoutGrid size={16} />
          <ChevronDown size={14} className="text-[hsl(var(--ink-30))]" />
        </button>
        
        <AnimatePresence>
          {showLayoutMenu && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl p-4 border border-[hsl(var(--border))] min-w-[280px] z-[var(--z-popover)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* التعامد */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-[hsl(var(--ink-60))] mb-2 block">
                  التعامد
                </label>
                <div className="flex gap-2">
                  <RadioOption 
                    selected={layoutSettings.orientation === 'horizontal'}
                    onClick={() => handleLayoutSettingChange({ orientation: 'horizontal' })}
                    icon={<MoveHorizontal size={14} />}
                    label="عرضي"
                  />
                  <RadioOption 
                    selected={layoutSettings.orientation === 'vertical'}
                    onClick={() => handleLayoutSettingChange({ orientation: 'vertical' })}
                    icon={<MoveVertical size={14} />}
                    label="طولي"
                  />
                </div>
              </div>
              
              {/* التناظر */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-[hsl(var(--ink-60))] mb-2 block">
                  التناظر
                </label>
                <div className="flex gap-2">
                  <RadioOption 
                    selected={layoutSettings.symmetry === 'symmetric'}
                    onClick={() => handleLayoutSettingChange({ symmetry: 'symmetric' })}
                    icon={<ArrowLeftRight size={14} />}
                    label="تناظري"
                  />
                  <RadioOption 
                    selected={layoutSettings.symmetry === 'unilateral'}
                    onClick={() => handleLayoutSettingChange({ symmetry: 'unilateral' })}
                    icon={<Columns size={14} />}
                    label="أحادي"
                  />
                </div>
              </div>
              
              {/* الاتجاه */}
              <div>
                <label className="text-xs font-semibold text-[hsl(var(--ink-60))] mb-2 block">
                  الاتجاه
                </label>
                <div className="flex gap-2">
                  <RadioOption 
                    selected={layoutSettings.direction === 'rtl'}
                    onClick={() => handleLayoutSettingChange({ direction: 'rtl' })}
                    icon={<ArrowRightToLine size={14} />}
                    label={layoutSettings.orientation === 'horizontal' ? 'يمين ← يسار' : 'أعلى ← أسفل'}
                  />
                  <RadioOption 
                    selected={layoutSettings.direction === 'ltr'}
                    onClick={() => handleLayoutSettingChange({ direction: 'ltr' })}
                    icon={<ArrowLeftToLine size={14} />}
                    label={layoutSettings.orientation === 'horizontal' ? 'يسار ← يمين' : 'أسفل ← أعلى'}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* حذف الشجرة */}
      <ToolbarButton
        icon={<Trash2 size={16} />}
        onClick={handleDeleteTree}
        title="حذف الخريطة"
        variant="destructive"
      />
    </>
  );
};

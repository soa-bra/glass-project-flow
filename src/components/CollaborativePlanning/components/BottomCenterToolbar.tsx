import React from 'react';
import { 
  MousePointer, 
  Repeat, 
  Type, 
  Square, 
  Sparkles,
  GitBranch,
  ZoomIn,
  ZoomOut,
  Move,
  Grid3X3,
  File,
  Download,
  Copy,
  Trash2,
  Group,
  Ungroup
} from 'lucide-react';

interface CanvasElement {
  id: string;
  type: string;
  groupId?: string;
}

interface BottomCenterToolbarProps {
  currentTool: string;
  onToolSelect: (tool: string) => void;
  showGrid: boolean;
  snapToGrid: boolean;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onExport: () => void;
  selectedElements: CanvasElement[];
  onGroup: () => void;
  onUngroup: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const mainTools = [
  { id: 'select', icon: MousePointer, label: 'تحديد', category: 'primary' },
  { id: 'repeat', icon: Repeat, label: 'تكرار', category: 'primary' },
  { id: 'text', icon: Type, label: 'نص', category: 'primary' },
  { id: 'shape', icon: Square, label: 'شكل', category: 'primary' },
  { id: 'smart-element', icon: Sparkles, label: 'عنصر ذكي', category: 'primary' },
  { id: 'root-connector', icon: GitBranch, label: 'موصل رئيسي', category: 'primary' }
];

const viewTools = [
  { id: 'zoom-in', icon: ZoomIn, label: 'تكبير' },
  { id: 'zoom-out', icon: ZoomOut, label: 'تصغير' },
  { id: 'pan', icon: Move, label: 'تحريك' },
  { id: 'toggle-grid', icon: Grid3X3, label: 'الشبكة' },
  { id: 'toggle-snap', icon: Grid3X3, label: 'المحاذاة' }
];

const fileTools = [
  { id: 'file', icon: File, label: 'ملف' },
  { id: 'export', icon: Download, label: 'تصدير' }
];

export const BottomCenterToolbar: React.FC<BottomCenterToolbarProps> = ({
  currentTool,
  onToolSelect,
  showGrid,
  snapToGrid,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onToggleSnap,
  onExport,
  selectedElements,
  onGroup,
  onUngroup,
  onDuplicate,
  onDelete
}) => {
  const handleToolClick = (toolId: string) => {
    switch (toolId) {
      case 'zoom-in':
        onZoomIn();
        break;
      case 'zoom-out':
        onZoomOut();
        break;
      case 'toggle-grid':
        onToggleGrid();
        break;
      case 'toggle-snap':
        onToggleSnap();
        break;
      case 'export':
        onExport();
        break;
      default:
        onToolSelect(toolId);
    }
  };

  const hasGroupedElements = selectedElements.some(el => el.groupId);
  const canGroup = selectedElements.length > 1;

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-section rounded-2xl p-2 flex items-center space-x-1 space-x-reverse shadow-lg">
        {/* Main Tools */}
        <div className="flex items-center bg-white/20 rounded-xl p-1">
          {mainTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  currentTool === tool.id
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'hover:bg-white/30 text-gray-700 hover:scale-105'
                }`}
                title={tool.label}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gray-300 mx-2"></div>

        {/* View Tools */}
        <div className="flex items-center space-x-1 space-x-reverse">
          {viewTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = 
              (tool.id === 'toggle-grid' && showGrid) ||
              (tool.id === 'toggle-snap' && snapToGrid) ||
              (tool.id === 'pan' && currentTool === 'pan');
            
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'hover:bg-white/30 text-gray-700'
                }`}
                title={tool.label}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        {/* Zoom Level Display */}
        <div className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium text-gray-700">
          {zoomLevel}%
        </div>

        {/* Selection Tools */}
        {selectedElements.length > 0 && (
          <>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <div className="flex items-center space-x-1 space-x-reverse bg-blue-50 rounded-lg p-1">
              <button
                onClick={onDuplicate}
                className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                title="نسخ"
              >
                <Copy size={14} />
              </button>
              
              {canGroup && (
                <button
                  onClick={onGroup}
                  className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                  title="تجميع"
                >
                  <Group size={14} />
                </button>
              )}
              
              {hasGroupedElements && (
                <button
                  onClick={onUngroup}
                  className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                  title="إلغاء التجميع"
                >
                  <Ungroup size={14} />
                </button>
              )}
              
              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                title="حذف"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="px-2 py-1 text-xs font-medium text-blue-700">
                {selectedElements.length} محدد
              </div>
            </div>
          </>
        )}

        {/* Separator */}
        <div className="w-px h-8 bg-gray-300 mx-2"></div>

        {/* File Tools */}
        <div className="flex items-center space-x-1 space-x-reverse">
          {fileTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="p-2 hover:bg-white/30 rounded-lg text-gray-700 transition-all duration-200 hover:scale-105"
                title={tool.label}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-2 space-x-reverse px-3">
          <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-600">
            <div className={`w-2 h-2 rounded-full ${showGrid ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span>شبكة</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-600">
            <div className={`w-2 h-2 rounded-full ${snapToGrid ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <span>محاذاة</span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        V: تحديد | T: نص | R: شكل | Z: تكبير | المسافة: تحريك
      </div>
    </div>
  );
};
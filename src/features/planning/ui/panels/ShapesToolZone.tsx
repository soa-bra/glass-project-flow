import React, { useState } from 'react';
import { 
  Circle, Square, Triangle, Hexagon, Star, Heart, Diamond, Pentagon, Octagon,
  Mail, Settings, User, Home, Phone, Calendar, Bell, Search, Camera, Folder,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft,
  MoveHorizontal, MoveVertical, Move, Maximize2,
  Shapes, StickyNote, FileText
} from 'lucide-react';
import { useCanvasStore, type ShapeType } from '@/stores/canvasStore';
import { toast } from 'sonner';
import { ColorPickerInput, InlineColorPicker } from '@/components/ui/color-picker';

type TabType = 'shapes' | 'icons' | 'arrows';

const ShapesPanel: React.FC = () => {
  const { toolSettings, updateToolSettings, setActiveTool } = useCanvasStore();
  const { fillColor, strokeColor, strokeWidth, opacity, shapeType } = toolSettings.shapes;
  const [activeTab, setActiveTab] = useState<TabType>('shapes');
  const [stickyText, setStickyText] = useState('');
  const [selectedStickyColor, setSelectedStickyColor] = useState('#FEF9C3');

  const tabs = [
    { id: 'shapes' as TabType, label: 'أشكال هندسية', icon: <Shapes size={16} /> },
    { id: 'icons' as TabType, label: 'مكتبة الأيقونات', icon: <Settings size={16} /> },
    { id: 'arrows' as TabType, label: 'الأسهم', icon: <ArrowRight size={16} /> },
  ];

  const geometricShapes: Array<{ icon: React.ReactNode; name: string; type: ShapeType }> = [
    { icon: <Square size={28} />, name: 'مربع', type: 'rectangle' },
    { icon: <Circle size={28} />, name: 'دائرة', type: 'circle' },
    { icon: <Triangle size={28} />, name: 'مثلث', type: 'triangle' },
    { icon: <Hexagon size={28} />, name: 'سداسي', type: 'hexagon' },
    { icon: <Pentagon size={28} />, name: 'خماسي', type: 'pentagon' as ShapeType },
    { icon: <Octagon size={28} />, name: 'ثماني', type: 'octagon' as ShapeType },
    { icon: <Diamond size={28} />, name: 'معين', type: 'diamond' as ShapeType },
    { icon: <Star size={28} />, name: 'نجمة', type: 'star' },
  ];

  const icons = [
    { icon: <Home size={28} />, name: 'منزل' },
    { icon: <User size={28} />, name: 'مستخدم' },
    { icon: <Settings size={28} />, name: 'إعدادات' },
    { icon: <Mail size={28} />, name: 'بريد' },
    { icon: <Phone size={28} />, name: 'هاتف' },
    { icon: <Calendar size={28} />, name: 'تقويم' },
    { icon: <Star size={28} />, name: 'نجمة' },
    { icon: <Heart size={28} />, name: 'قلب' },
    { icon: <Bell size={28} />, name: 'تنبيه' },
    { icon: <Search size={28} />, name: 'بحث' },
    { icon: <Camera size={28} />, name: 'كاميرا' },
    { icon: <Folder size={28} />, name: 'مجلد' },
  ];

  const arrows = [
    { icon: <ArrowRight size={28} />, name: 'يمين', type: 'arrow_right' },
    { icon: <ArrowLeft size={28} />, name: 'يسار', type: 'arrow_left' },
    { icon: <ArrowUp size={28} />, name: 'أعلى', type: 'arrow_up' },
    { icon: <ArrowDown size={28} />, name: 'أسفل', type: 'arrow_down' },
    { icon: <ArrowUpRight size={28} />, name: 'أعلى يمين', type: 'arrow_up_right' },
    { icon: <ArrowDownRight size={28} />, name: 'أسفل يمين', type: 'arrow_down_right' },
    { icon: <ArrowUpLeft size={28} />, name: 'أعلى يسار', type: 'arrow_up_left' },
    { icon: <ArrowDownLeft size={28} />, name: 'أسفل يسار', type: 'arrow_down_left' },
    { icon: <MoveHorizontal size={28} />, name: 'أفقي برأسين', type: 'arrow_double_horizontal' },
    { icon: <MoveVertical size={28} />, name: 'عمودي برأسين', type: 'arrow_double_vertical' },
    { icon: <Move size={28} />, name: 'أربع اتجاهات', type: 'arrow_four_way' },
    { icon: <Maximize2 size={28} />, name: 'قطري برأسين', type: 'arrow_double_diagonal' },
  ];

  const stickyColors = [
    '#3B82F6', '#F87171', '#FBBF24', '#E9D5FF', '#BBF7D0', '#93C5FD', '#FBCFE8', '#FEF9C3'
  ];

  const handleShapeSelect = (type: ShapeType, name: string) => {
    updateToolSettings('shapes', { shapeType: type });
    setActiveTool('shapes_tool');
    toast.success(`تم اختيار ${name} - انقر واسحب على الكانفاس`);
  };

  const handleIconSelect = (iconName: string, name: string) => {
    updateToolSettings('shapes', { 
      shapeType: 'icon' as ShapeType,
      iconName: iconName,
      fillColor: fillColor
    });
    setActiveTool('shapes_tool');
    toast.success(`تم اختيار أيقونة ${name} - انقر واسحب على الكانفاس`);
  };

  const handleArrowSelect = (arrowType: string, name: string) => {
    updateToolSettings('shapes', { 
      shapeType: arrowType as ShapeType 
    });
    setActiveTool('shapes_tool');
    toast.success(`تم اختيار سهم ${name} - انقر واسحب على الكانفاس`);
  };

  const handleAddStickyNote = () => {
    updateToolSettings('shapes', { 
      shapeType: 'sticky' as ShapeType,
      fillColor: selectedStickyColor,
      stickyText: stickyText
    });
    setActiveTool('shapes_tool');
    toast.success('انقر واسحب على الكانفاس لإضافة ستيكي نوت');
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-[hsl(var(--accent-blue))]">
        <Shapes size={24} />
        <h3 className="text-[16px] font-bold">أداة الأشكال</h3>
      </div>

      {/* Tabs */}
      <div className="flex bg-[hsl(var(--panel))] rounded-[12px] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-2 text-[11px] font-medium rounded-[10px] transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[hsl(var(--accent-blue))] shadow-sm'
                : 'text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'shapes' && (
        <div className="space-y-5">
          {/* Shapes Grid */}
          <div className="grid grid-cols-4 gap-2">
            {geometricShapes.map((shape) => (
              <button
                key={shape.type}
                onClick={() => handleShapeSelect(shape.type, shape.name)}
                className={`group flex flex-col items-center gap-1.5 p-3 rounded-[12px] border-2 transition-all ${
                  shapeType === shape.type
                    ? 'border-[hsl(var(--accent-blue))] bg-[hsl(var(--accent-blue))]/5'
                    : 'border-[hsl(var(--border))] hover:border-[hsl(var(--ink-30))] bg-white'
                }`}
              >
                <span className={`transition-colors ${
                  shapeType === shape.type ? 'text-[hsl(var(--accent-blue))]' : 'text-[hsl(var(--ink-60))]'
                }`}>
                  {shape.icon}
                </span>
                <span className={`text-[9px] font-medium ${
                  shapeType === shape.type ? 'text-[hsl(var(--accent-blue))]' : 'text-[hsl(var(--ink-60))]'
                }`}>
                  {shape.name}
                </span>
              </button>
            ))}
          </div>

          {/* Color Picker */}
          <ColorPickerInput 
            value={fillColor} 
            onChange={(color) => updateToolSettings('shapes', { fillColor: color })}
            label="اللون"
          />

          {/* Borders Section */}
          <div className="space-y-4">
            <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))]">
              الحواف
            </h4>

            {/* Stroke Width */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] text-[hsl(var(--ink-60))]">
                  سمك الحواف
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={strokeWidth}
                    onChange={(e) => updateToolSettings('shapes', { strokeWidth: Math.max(0, Number(e.target.value)) })}
                    className="w-12 px-2 py-1 text-[12px] border border-[hsl(var(--border))] rounded-[8px] bg-white text-[hsl(var(--ink))] text-center focus:outline-none focus:border-[hsl(var(--accent-blue))] transition-colors"
                  />
                  <span className="text-[11px] text-[hsl(var(--ink-60))]">px</span>
                </div>
              </div>
              <div className="relative h-6 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={strokeWidth}
                  onChange={(e) => updateToolSettings('shapes', { strokeWidth: Number(e.target.value) })}
                  className="w-full h-2 bg-[#E3E8F0] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-[#D1D5DB]
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border
                    [&::-moz-range-thumb]:border-[#D1D5DB]
                    [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
            </div>

            {/* Stroke Color */}
            <ColorPickerInput 
              value={strokeColor} 
              onChange={(color) => updateToolSettings('shapes', { strokeColor: color })}
              label="لون الحواف"
            />
          </div>
        </div>
      )}

      {activeTab === 'icons' && (
        <div className="space-y-5">
          {/* Color Picker */}
          <ColorPickerInput 
            value={fillColor} 
            onChange={(color) => updateToolSettings('shapes', { fillColor: color })}
            label="اللون"
          />

          {/* Icons Grid */}
          <div>
            <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
              مكتبة الأيقونات
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {icons.map((icon, index) => {
                const iconNames = ['Home', 'User', 'Settings', 'Mail', 'Phone', 'Calendar', 'Star', 'Heart', 'Bell', 'Search', 'Camera', 'Folder'];
                const iconName = iconNames[index];
                const isSelected = shapeType === 'icon' && toolSettings.shapes.iconName === iconName;
                return (
                  <button
                    key={index}
                    onClick={() => handleIconSelect(iconName, icon.name)}
                    className={`group flex flex-col items-center gap-1.5 p-3 rounded-[12px] border-2 transition-all ${
                      isSelected
                        ? 'border-[hsl(var(--accent-blue))] bg-[hsl(var(--accent-blue))]/5'
                        : 'border-[hsl(var(--border))] hover:border-[hsl(var(--ink-30))] bg-white'
                    }`}
                  >
                    <span className={`transition-colors ${
                      isSelected ? 'text-[hsl(var(--accent-blue))]' : 'text-[hsl(var(--accent-blue))]'
                    }`}>
                      {icon.icon}
                    </span>
                    <span className={`text-[9px] font-medium ${
                      isSelected ? 'text-[hsl(var(--accent-blue))]' : 'text-[hsl(var(--ink-60))]'
                    }`}>
                      {icon.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'arrows' && (
        <div className="space-y-5">
          {/* Color Picker */}
          <ColorPickerInput 
            value={fillColor} 
            onChange={(color) => updateToolSettings('shapes', { fillColor: color })}
            label="اللون"
          />

          {/* Stroke Width Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] text-[hsl(var(--ink-60))]">
                سمك السهم
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={strokeWidth}
                  onChange={(e) => updateToolSettings('shapes', { strokeWidth: Math.max(1, Math.min(10, Number(e.target.value))) })}
                  className="w-12 px-2 py-1 text-[12px] border border-[hsl(var(--border))] rounded-[8px] bg-white text-[hsl(var(--ink))] text-center focus:outline-none focus:border-[hsl(var(--accent-blue))] transition-colors"
                />
                <span className="text-[11px] text-[hsl(var(--ink-60))]">px</span>
              </div>
            </div>
            <div className="relative h-6 flex items-center">
              <input
                type="range"
                min={1}
                max={10}
                value={strokeWidth}
                onChange={(e) => updateToolSettings('shapes', { strokeWidth: Number(e.target.value) })}
                className="w-full h-2 bg-[#E3E8F0] rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border
                  [&::-webkit-slider-thumb]:border-[#D1D5DB]
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border
                  [&::-moz-range-thumb]:border-[#D1D5DB]
                  [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Arrows Grid */}
          <div>
            <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
              الأسهم والاتجاهات
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {arrows.map((arrow) => {
                const isSelected = shapeType === arrow.type;
                return (
                  <button
                    key={arrow.type}
                    onClick={() => handleArrowSelect(arrow.type, arrow.name)}
                    className={`group flex flex-col items-center gap-1.5 p-3 rounded-[12px] border-2 transition-all ${
                      isSelected
                        ? 'border-[hsl(var(--accent-blue))] bg-[hsl(var(--accent-blue))]/5'
                        : 'border-[hsl(var(--border))] hover:border-[hsl(var(--ink-30))] bg-white'
                    }`}
                  >
                    <span className={`transition-colors ${
                      isSelected ? 'text-[hsl(var(--accent-blue))]' : 'text-[hsl(var(--ink-60))]'
                    }`}>
                      {arrow.icon}
                    </span>
                    <span className={`text-[9px] font-medium ${
                      isSelected ? 'text-[hsl(var(--accent-blue))]' : 'text-[hsl(var(--ink-60))]'
                    }`}>
                      {arrow.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-[hsl(var(--accent-blue))]/5 rounded-[12px] p-4 space-y-2">
        <p className="text-[12px] text-[hsl(var(--accent-blue))] text-center">
          🎨 اختر الألوان المناسبة لتصميمك
        </p>
        <p className="text-[12px] text-[hsl(var(--accent-blue))] text-center">
          📐 الأشكال قابلة لتغيير الحجم
        </p>
        <p className="text-[12px] text-[hsl(var(--accent-blue))] text-center">
          📝 ستيكي نوت مفيدة للملاحظات السريعة
        </p>
      </div>
    </div>
  );
};

export default ShapesPanel;

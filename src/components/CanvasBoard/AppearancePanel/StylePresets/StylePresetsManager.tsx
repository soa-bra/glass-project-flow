import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { 
  Palette, 
  Save, 
  Star, 
  Download, 
  Upload, 
  Trash2, 
  Copy,
  Heart,
  Clock,
  Folder,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '@/components/shared/design-system/constants';

interface StyleProperty {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: string;
  backgroundColor?: string;
  boxShadow?: string;
  transform?: string;
}

interface StylePreset {
  id: string;
  name: string;
  description?: string;
  category: 'shapes' | 'text' | 'effects' | 'layouts' | 'custom';
  style: StyleProperty;
  thumbnail?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  usage: number;
}

interface StylePresetsManagerProps {
  currentStyle: StyleProperty;
  onApplyPreset: (preset: StylePreset) => void;
  onSavePreset?: (preset: Omit<StylePreset, 'id' | 'createdAt' | 'updatedAt' | 'usage'>) => void;
  savedPresets?: StylePreset[];
}

export const StylePresetsManager: React.FC<StylePresetsManagerProps> = ({
  currentStyle,
  onApplyPreset,
  onSavePreset,
  savedPresets = []
}) => {
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StylePreset['category']>('custom');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | StylePreset['category']>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentlyUsed, setRecentlyUsed] = useState<StylePreset[]>([]);

  // Default style presets
  const defaultPresets: StylePreset[] = [
    {
      id: 'modern-card',
      name: 'بطاقة حديثة',
      description: 'تصميم بطاقة مع ظلال ناعمة وحواف مدورة',
      category: 'shapes',
      style: {
        backgroundColor: COLORS.PRESET_CARD_WHITE,
        borderRadius: 16,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        stroke: '#e5e7eb',
        strokeWidth: 1
      },
      isFavorite: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      tags: ['بطاقة', 'حديث', 'ظل'],
      usage: 15
    },
    {
      id: 'gradient-button',
      name: 'زر متدرج',
      description: 'زر بتدرج ملون جذاب',
      category: 'shapes',
      style: {
        backgroundColor: `linear-gradient(135deg, ${COLORS.PRESET_GRADIENT_START} 0%, ${COLORS.PRESET_GRADIENT_END} 100%)`,
        borderRadius: 8,
        stroke: 'none',
        strokeWidth: 0,
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
      },
      isFavorite: true,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
      tags: ['زر', 'تدرج', 'ملون'],
      usage: 23
    },
    {
      id: 'elegant-text',
      name: 'نص أنيق',
      description: 'تنسيق نص أنيق للعناوين',
      category: 'text',
      style: {
        fontSize: 24,
        fontFamily: 'Arial, sans-serif',
        fontWeight: '600',
        fill: '#1f2937',
        textAlign: 'center'
      },
      isFavorite: false,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03',
      tags: ['نص', 'عنوان', 'أنيق'],
      usage: 8
    },
    {
      id: 'neon-glow',
      name: 'توهج نيون',
      description: 'تأثير توهج نيون مبهر',
      category: 'effects',
      style: {
        stroke: COLORS.PRESET_NEON_GREEN,
        strokeWidth: 3,
        boxShadow: `0 0 20px ${COLORS.PRESET_NEON_GREEN}, 0 0 40px ${COLORS.PRESET_NEON_GREEN}, 0 0 60px ${COLORS.PRESET_NEON_GREEN}`,
        backgroundColor: COLORS.CANVAS_TRANSPARENT
      },
      isFavorite: true,
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04',
      tags: ['نيون', 'توهج', 'تأثير'],
      usage: 31
    },
    {
      id: 'glass-morphism',
      name: 'زجاج ضبابي',
      description: 'تأثير الزجاج الضبابي العصري',
      category: 'effects',
      style: {
        backgroundColor: COLORS.PRESET_GLASS_WHITE,
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        stroke: COLORS.PRESET_GLASS_BORDER,
        strokeWidth: 1
      },
      isFavorite: false,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05',
      tags: ['زجاج', 'ضبابي', 'عصري'],
      usage: 12
    },
    {
      id: 'minimal-layout',
      name: 'تخطيط بسيط',
      description: 'تخطيط نظيف وبسيط',
      category: 'layouts',
      style: {
        backgroundColor: COLORS.PRESET_MINIMAL_BG,
        stroke: COLORS.PRESET_MINIMAL_BORDER,
        strokeWidth: 1,
        borderRadius: 4
      },
      isFavorite: false,
      createdAt: '2024-01-06',
      updatedAt: '2024-01-06',
      tags: ['بسيط', 'نظيف', 'تخطيط'],
      usage: 19
    }
  ];

  const allPresets = [...defaultPresets, ...savedPresets];

  // Filter presets based on search and category
  const filteredPresets = allPresets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         preset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         preset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || preset.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const favoritePresets = filteredPresets.filter(preset => 
    favorites.has(preset.id) || preset.isFavorite
  );

  const popularPresets = [...filteredPresets]
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 6);

  const saveCurrentAsPreset = () => {
    if (!presetName.trim()) {
      toast.error('يرجى إدخال اسم النمط');
      return;
    }

    const newPreset: Omit<StylePreset, 'id' | 'createdAt' | 'updatedAt' | 'usage'> = {
      name: presetName,
      description: presetDescription,
      category: selectedCategory,
      style: { ...currentStyle },
      isFavorite: false,
      tags: presetDescription.split(' ').filter(word => word.length > 2).slice(0, 3)
    };

    if (onSavePreset) {
      onSavePreset(newPreset);
      setPresetName('');
      setPresetDescription('');
      toast.success('تم حفظ النمط بنجاح');
    }
  };

  const applyPreset = (preset: StylePreset) => {
    onApplyPreset(preset);
    
    // Update recently used
    setRecentlyUsed(prev => {
      const filtered = prev.filter(p => p.id !== preset.id);
      return [preset, ...filtered].slice(0, 6);
    });
    
    toast.success(`تم تطبيق النمط: ${preset.name}`);
  };

  const toggleFavorite = (presetId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(presetId)) {
        newFavorites.delete(presetId);
        toast.success('تم إزالة من المفضلة');
      } else {
        newFavorites.add(presetId);
        toast.success('تم إضافة للمفضلة');
      }
      return newFavorites;
    });
  };

  const exportPresets = () => {
    const exportData = {
      presets: savedPresets,
      favorites: Array.from(favorites),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `style-presets-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('تم تصدير الأنماط');
  };

  const importPresets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (importData.presets && Array.isArray(importData.presets)) {
          // Here you would handle importing the presets
          toast.success('تم استيراد الأنماط بنجاح');
        }
      } catch (error) {
        toast.error('خطأ في استيراد الملف');
      }
    };
    reader.readAsText(file);
  };

  const getCategoryIcon = (category: StylePreset['category']) => {
    switch (category) {
      case 'shapes': return '⬛';
      case 'text': return '📝';
      case 'effects': return '✨';
      case 'layouts': return '📐';
      case 'custom': return '🎨';
      default: return '📁';
    }
  };

  const getCategoryLabel = (category: StylePreset['category']) => {
    switch (category) {
      case 'shapes': return 'أشكال';
      case 'text': return 'نصوص';
      case 'effects': return 'تأثيرات';
      case 'layouts': return 'تخطيطات';
      case 'custom': return 'مخصص';
      default: return 'عام';
    }
  };

  const PresetCard: React.FC<{ preset: StylePreset; showCategory?: boolean }> = ({ 
    preset, 
    showCategory = true 
  }) => (
    <div className="group relative p-3 border rounded-lg hover:shadow-md transition-all duration-200">
      {/* Preview */}
      <div className="mb-3">
        <div
          className="w-full h-16 rounded border flex items-center justify-center text-xs text-gray-600"
          style={{
            backgroundColor: preset.style.backgroundColor || COLORS.PRESET_MINIMAL_BG,
            borderColor: preset.style.stroke || '#d1d5db',
            borderWidth: preset.style.strokeWidth || 1,
            borderRadius: preset.style.borderRadius || 4,
            boxShadow: preset.style.boxShadow,
            fontSize: preset.style.fontSize ? `${Math.min(preset.style.fontSize, 12)}px` : '12px',
            fontFamily: preset.style.fontFamily,
            fontWeight: preset.style.fontWeight,
            color: preset.style.fill || '#6b7280'
          }}
        >
          {preset.category === 'text' ? 'نص تجريبي' : preset.name}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium truncate">{preset.name}</h4>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(preset.id);
            }}
          >
            <Heart 
              className={`w-3 h-3 ${
                favorites.has(preset.id) || preset.isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : ''
              }`} 
            />
          </Button>
        </div>
        
        {preset.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{preset.description}</p>
        )}

        <div className="flex items-center justify-between">
          {showCategory && (
            <BaseBadge variant="secondary" className="text-xs">
              {getCategoryIcon(preset.category)} {getCategoryLabel(preset.category)}
            </BaseBadge>
          )}
          
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {preset.usage}
          </div>
        </div>

        {/* Tags */}
        {preset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {preset.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <Button
        className="w-full mt-3 text-xs"
        size="sm"
        onClick={() => applyPreset(preset)}
      >
        تطبيق النمط
      </Button>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="w-5 h-5" />
          إدارة الأنماط الجاهزة
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="browse">تصفح</TabsTrigger>
            <TabsTrigger value="favorites">مفضلة</TabsTrigger>
            <TabsTrigger value="recent">حديثة</TabsTrigger>
            <TabsTrigger value="save">حفظ</TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-4">
            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="البحث في الأنماط..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex gap-1 flex-wrap">
                  {['all', 'shapes', 'text', 'effects', 'layouts', 'custom'].map((category) => (
                    <Button
                      key={category}
                      variant={filterCategory === category ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setFilterCategory(category as any)}
                    >
                      {category === 'all' ? 'الكل' : getCategoryLabel(category as StylePreset['category'])}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Presets */}
            {searchQuery === '' && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  الأنماط الشائعة
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {popularPresets.slice(0, 4).map((preset) => (
                    <PresetCard key={preset.id} preset={preset} />
                  ))}
                </div>
              </div>
            )}

            {/* All Presets */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Folder className="w-4 h-4" />
                جميع الأنماط ({filteredPresets.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredPresets.map((preset) => (
                  <PresetCard key={preset.id} preset={preset} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            {favoritePresets.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {favoritePresets.map((preset) => (
                  <PresetCard key={preset.id} preset={preset} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">لا توجد أنماط مفضلة</p>
                <p className="text-xs">اضغط على ♥ لإضافة أنماط للمفضلة</p>
              </div>
            )}
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent" className="space-y-4">
            {recentlyUsed.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {recentlyUsed.map((preset) => (
                  <PresetCard key={preset.id} preset={preset} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">لا توجد أنماط مستخدمة مؤخراً</p>
                <p className="text-xs">ستظهر الأنماط المستخدمة هنا</p>
              </div>
            )}
          </TabsContent>

          {/* Save Tab */}
          <TabsContent value="save" className="space-y-4">
            {/* Current Style Preview */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Label className="text-sm font-medium mb-2 block">معاينة النمط الحالي</Label>
              <div
                className={`w-full h-20 rounded border flex items-center justify-center text-sm bg-[${currentStyle.backgroundColor || '#f3f4f6'}] border-[${currentStyle.stroke || '#d1d5db'}]`}
                style={{
                  borderWidth: currentStyle.strokeWidth || 1,
                  borderRadius: currentStyle.borderRadius || 4,
                  boxShadow: currentStyle.boxShadow,
                  fontSize: currentStyle.fontSize,
                  fontFamily: currentStyle.fontFamily,
                  fontWeight: currentStyle.fontWeight,
                  color: currentStyle.fill || '#374151'
                }}
              >
                معاينة النمط
              </div>
            </div>

            {/* Save Form */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm">اسم النمط</Label>
                <Input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="أدخل اسم النمط..."
                />
              </div>

              <div>
                <Label className="text-sm">الوصف (اختياري)</Label>
                <Input
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  placeholder="وصف مختصر للنمط..."
                />
              </div>

              <div>
                <Label className="text-sm">الفئة</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(['shapes', 'text', 'effects', 'layouts', 'custom'] as const).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="justify-start"
                    >
                      {getCategoryIcon(category)} {getCategoryLabel(category)}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={saveCurrentAsPreset} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                حفظ النمط
              </Button>
            </div>

            {/* Import/Export */}
            <div className="pt-4 border-t space-y-2">
              <Label className="text-sm font-medium">استيراد/تصدير</Label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportPresets} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  تصدير
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={importPresets}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  استيراد
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Lock, Unlock, Trash2, Folder, Link, Search } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: 'layer' | 'folder';
  elements: string[];
  children?: Layer[];
  webLink?: string;
}

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerIds: string[];
  onLayerUpdate: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string, multiSelect?: boolean) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerIds,
  onLayerUpdate,
  onLayerSelect
}) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [webLinkDialog, setWebLinkDialog] = useState<{open: boolean, layerId?: string}>({open: false});
  const [linkUrl, setLinkUrl] = useState('');

  const toggleLayerVisibility = (layerId: string) => {
    const updateLayer = (layerList: Layer[]): Layer[] => {
      return layerList.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible };
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) };
        }
        return layer;
      });
    };
    onLayerUpdate(updateLayer(layers));
  };

  const toggleLayerLock = (layerId: string) => {
    const updateLayer = (layerList: Layer[]): Layer[] => {
      return layerList.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, locked: !layer.locked };
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) };
        }
        return layer;
      });
    };
    onLayerUpdate(updateLayer(layers));
  };

  const deleteLayer = (layerId: string) => {
    const removeLayer = (layerList: Layer[]): Layer[] => {
      return layerList.filter(layer => {
        if (layer.id === layerId) return false;
        if (layer.children) {
          layer.children = removeLayer(layer.children);
        }
        return true;
      });
    };
    onLayerUpdate(removeLayer(layers));
  };

  const deleteSelected = () => {
    if (selectedLayerIds.length === 0) return;
    
    const removeSelectedLayers = (layerList: Layer[]): Layer[] => {
      return layerList.filter(layer => {
        if (selectedLayerIds.includes(layer.id)) return false;
        if (layer.children) {
          layer.children = removeSelectedLayers(layer.children);
        }
        return true;
      });
    };
    onLayerUpdate(removeSelectedLayers(layers));
  };

  const groupSelected = () => {
    if (selectedLayerIds.length < 2) return;
    
    const selectedLayers: Layer[] = [];
    const remainingLayers: Layer[] = [];
    
    const extractSelected = (layerList: Layer[]) => {
      layerList.forEach(layer => {
        if (selectedLayerIds.includes(layer.id)) {
          selectedLayers.push(layer);
        } else {
          remainingLayers.push(layer);
        }
      });
    };
    
    extractSelected(layers);
    
    const newFolder: Layer = {
      id: `folder-${Date.now()}`,
      name: `مجلد ${Math.floor(Math.random() * 1000)}`,
      visible: true,
      locked: false,
      type: 'folder',
      elements: [],
      children: selectedLayers
    };
    
    onLayerUpdate([...remainingLayers, newFolder]);
  };

  const addWebLink = (layerId: string) => {
    setWebLinkDialog({open: true, layerId});
  };

  const saveWebLink = () => {
    if (!webLinkDialog.layerId || !linkUrl.trim()) return;
    
    const updateLayer = (layerList: Layer[]): Layer[] => {
      return layerList.map(layer => {
        if (layer.id === webLinkDialog.layerId) {
          return { ...layer, webLink: linkUrl.trim() };
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) };
        }
        return layer;
      });
    };
    
    onLayerUpdate(updateLayer(layers));
    setWebLinkDialog({open: false});
    setLinkUrl('');
  };

  const renderLayer = (layer: Layer, depth: number = 0) => {
    const isSelected = selectedLayerIds.includes(layer.id);
    const hasWebLink = !!layer.webLink;
    
    return (
      <div key={layer.id} style={{ marginLeft: depth * 16 }}>
        <div
          className={`flex items-center justify-between p-2 rounded-xl border transition-colors cursor-pointer ${
            isSelected
              ? 'border-black bg-gray-50'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onLayerSelect(layer.id, e.ctrlKey || e.metaKey);
          }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {layer.type === 'folder' ? (
              <Folder className="w-4 h-4 text-gray-600 flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded bg-blue-200 flex-shrink-0"></div>
            )}
            <span className="text-sm font-arabic truncate" title={layer.name}>
              {layer.name}
            </span>
            {hasWebLink && (
              <Link className="w-3 h-3 text-blue-500 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 rounded-full"
            >
              {layer.visible ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-400" />
              )}
            </Button>
            <Button
              onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 rounded-full"
            >
              {layer.locked ? (
                <Lock className="w-3 h-3 text-red-500" />
              ) : (
                <Unlock className="w-3 h-3" />
              )}
            </Button>
            <Button
              onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 rounded-full text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {layer.children && layer.children.map(child => renderLayer(child, depth + 1))}
      </div>
    );
  };

  const filteredLayers = layers.filter(layer => 
    !searchText || layer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Card className="w-80 bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic text-black">
            لوحة الطبقات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* صف أيقونات الإجراءات */}
          <div className="flex items-center justify-between">
            <Button
              onClick={groupSelected}
              disabled={selectedLayerIds.length < 2}
              size="sm"
              variant="ghost"
              className={`rounded-full ${
                selectedLayerIds.length >= 2 
                  ? 'text-black hover:bg-gray-200' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Folder className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => selectedLayerIds.length === 1 && addWebLink(selectedLayerIds[0])}
              disabled={selectedLayerIds.length !== 1}
              size="sm"
              variant="ghost"
              className={`rounded-full ${
                selectedLayerIds.length === 1 
                  ? 'text-black hover:bg-gray-200' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Link className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setSearchExpanded(!searchExpanded)}
              size="sm"
              variant="ghost"
              className="rounded-full text-black hover:bg-gray-200"
            >
              <Search className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={deleteSelected}
              disabled={selectedLayerIds.length === 0}
              size="sm"
              variant="ghost"
              className={`rounded-full ${
                selectedLayerIds.length > 0 
                  ? 'text-red-500 hover:text-red-700 hover:bg-red-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* شريط البحث */}
          {searchExpanded && (
            <div className="flex gap-2">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="بحث في الطبقات..."
                className="flex-1 text-sm font-arabic rounded-xl border-gray-300"
              />
            </div>
          )}

          <Separator className="bg-gray-200" />

          {/* قائمة الطبقات */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLayers.length > 0 ? (
              filteredLayers.map(layer => renderLayer(layer))
            ) : (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500 font-arabic">
                  لا توجد طبقات
                </div>
              </div>
            )}
          </div>

          {/* معلومات إضافية */}
          <div className="text-xs text-gray-500 font-arabic text-center">
            المجموع: {layers.length} طبقة
            {selectedLayerIds.length > 0 && ` • محدد: ${selectedLayerIds.length}`}
          </div>
        </CardContent>
      </Card>

      {/* نافذة إضافة رابط الويب */}
      {webLinkDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 bg-white rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-arabic">إضافة رابط ويب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setWebLinkDialog({open: false})}
                  variant="outline"
                  className="rounded-xl"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={saveWebLink}
                  className="rounded-xl bg-black text-white"
                >
                  حفظ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LayersPanel;

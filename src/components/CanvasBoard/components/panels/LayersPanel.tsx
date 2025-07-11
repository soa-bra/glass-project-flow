import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Layers, Eye, EyeOff, Lock, Unlock, Plus, Trash2, Folder, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { Layer } from '../CanvasPanelTypes';
import { CanvasElement } from '../../types';
interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerUpdate: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string) => void;
  elements: CanvasElement[];
}
interface LayerFolder {
  id: string;
  name: string;
  isOpen: boolean;
  layers: string[];
  subFolders: LayerFolder[];
}
export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerUpdate,
  onLayerSelect,
  elements
}) => {
  const [newLayerName, setNewLayerName] = useState('');
  const [folders, setFolders] = useState<LayerFolder[]>([]);

  // Auto-generate layers for elements that don't have them
  React.useEffect(() => {
    const existingLayerElements = layers.flatMap(layer => layer.elements);
    const elementsWithoutLayers = elements.filter(element => !existingLayerElements.includes(element.id));
    if (elementsWithoutLayers.length > 0) {
      const newLayers = elementsWithoutLayers.map(element => ({
        id: `layer-${element.id}`,
        name: `${element.type} - ${element.id.slice(0, 8)}`,
        visible: true,
        locked: false,
        elements: [element.id]
      }));
      onLayerUpdate([...layers, ...newLayers]);
    }
  }, [elements, layers, onLayerUpdate]);
  const addNewLayer = () => {
    const name = newLayerName.trim() || `طبقة ${layers.length + 1}`;
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name,
      visible: true,
      locked: false,
      elements: []
    };
    onLayerUpdate([...layers, newLayer]);
    setNewLayerName('');
  };
  const deleteLayer = (layerId: string) => {
    if (layers.length > 1) {
      const updatedLayers = layers.filter(layer => layer.id !== layerId);
      onLayerUpdate(updatedLayers);
      if (selectedLayerId === layerId) {
        onLayerSelect(updatedLayers[0]?.id || '');
      }
    }
  };
  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = layers.map(layer => layer.id === layerId ? {
      ...layer,
      visible: !layer.visible
    } : layer);
    onLayerUpdate(updatedLayers);
  };
  const toggleLayerLock = (layerId: string) => {
    const updatedLayers = layers.map(layer => layer.id === layerId ? {
      ...layer,
      locked: !layer.locked
    } : layer);
    onLayerUpdate(updatedLayers);
  };
  const updateLayerName = (layerId: string, newName: string) => {
    const updatedLayers = layers.map(layer => layer.id === layerId ? {
      ...layer,
      name: newName
    } : layer);
    onLayerUpdate(updatedLayers);
  };
  const createFolder = () => {
    const newFolder: LayerFolder = {
      id: `folder-${Date.now()}`,
      name: `ملف ${folders.length + 1}`,
      isOpen: true,
      layers: [],
      subFolders: []
    };
    setFolders([...folders, newFolder]);
  };
  const toggleFolder = (folderId: string) => {
    const updateFolders = (folders: LayerFolder[]): LayerFolder[] => folders.map(folder => folder.id === folderId ? {
      ...folder,
      isOpen: !folder.isOpen
    } : {
      ...folder,
      subFolders: updateFolders(folder.subFolders)
    });
    setFolders(updateFolders(folders));
  };
  const renderLayer = (layer: Layer) => <div key={layer.id} className={`p-3 rounded-[16px] border transition-colors cursor-pointer ${selectedLayerId === layer.id ? 'border-[#96d8d0] bg-[#96d8d0]/10' : 'border-[#d1e1ea] bg-white hover:bg-[#e9eff4]/50'}`} onClick={() => onLayerSelect(layer.id)}>
      <div className="flex items-center justify-between mb-2">
        <Input value={layer.name} onChange={e => updateLayerName(layer.id, e.target.value)} className="text-sm font-arabic border-none p-0 h-auto bg-transparent text-black" onClick={e => e.stopPropagation()} />
        <div className="flex items-center gap-1">
          <Button onClick={e => {
          e.stopPropagation();
          toggleLayerVisibility(layer.id);
        }} size="sm" variant="ghost" className="w-6 h-6 p-0 rounded-[8px]">
            {layer.visible ? <Eye className="w-3 h-3 text-[#96d8d0]" /> : <EyeOff className="w-3 h-3 text-black/40" />}
          </Button>
          <Button onClick={e => {
          e.stopPropagation();
          toggleLayerLock(layer.id);
        }} size="sm" variant="ghost" className="w-6 h-6 p-0 rounded-[8px]">
            {layer.locked ? <Lock className="w-3 h-3 text-[#f1b5b9]" /> : <Unlock className="w-3 h-3 text-black" />}
          </Button>
          <Button onClick={e => {
          e.stopPropagation();
          deleteLayer(layer.id);
        }} size="sm" variant="ghost" className="w-6 h-6 p-0 text-[#f1b5b9] hover:text-[#f1b5b9]/70 rounded-[8px]" disabled={layers.length <= 1}>
            <Trash2 className="w-3 h-2" />
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-black/70 font-arabic">
        {layer.elements.length} عنصر
      </div>
    </div>;
  const renderFolder = (folder: LayerFolder, depth = 0) => <div key={folder.id} style={{
    marginLeft: `${depth * 16}px`
  }}>
      <div className="p-2 rounded-[12px] border border-[#d1e1ea] bg-[#e9eff4]/30 mb-2">
        <div className="flex items-center gap-2">
          <Button onClick={() => toggleFolder(folder.id)} size="sm" variant="ghost" className="w-4 h-4 p-0">
            {folder.isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </Button>
          {folder.isOpen ? <FolderOpen className="w-4 h-4 text-[#fbe2aa]" /> : <Folder className="w-4 h-4 text-[#fbe2aa]" />}
          <span className="text-sm font-arabic text-black">{folder.name}</span>
        </div>
        
        {folder.isOpen && <div className="mt-2 space-y-1">
            {folder.layers.map(layerId => {
          const layer = layers.find(l => l.id === layerId);
          return layer ? renderLayer(layer) : null;
        })}
            {folder.subFolders.map(subFolder => renderFolder(subFolder, depth + 1))}
          </div>}
      </div>
    </div>;
  return <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden my-[140px] py-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          
          إدارة الطبقات
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-[calc(100%-4rem)] flex flex-col my-0">
        {/* Add New Layer/Folder */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input value={newLayerName} onChange={e => setNewLayerName(e.target.value)} placeholder="اسم الطبقة الجديدة" className="flex-1 font-arabic text-sm rounded-[16px] border-[#d1e1ea] text-black placeholder:text-black/50" onKeyPress={e => e.key === 'Enter' && addNewLayer()} />
            <Button onClick={addNewLayer} size="sm" className="rounded-[16px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={createFolder} size="sm" className="w-full rounded-[16px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none">
            <Folder className="w-4 h-4 mr-2" />
            إنشاء ملف جديد
          </Button>
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Layers and Folders List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-0">
          <h4 className="text-sm font-medium font-arabic mb-2 text-black">
            الطبقات والملفات ({layers.length + folders.length})
          </h4>
          
          {/* Folders */}
          {folders.map(folder => renderFolder(folder))}
          
          {/* Ungrouped Layers */}
          {layers.filter(layer => !folders.some(folder => folder.layers.includes(layer.id))).map(layer => renderLayer(layer))}
        </div>

        {/* Tips */}
        
      </CardContent>
    </Card>;
};
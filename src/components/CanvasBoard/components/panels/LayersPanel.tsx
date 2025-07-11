
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Eye, EyeOff, Lock, Unlock, X, Plus } from 'lucide-react';
import { CanvasLayer } from '../../types/index';

interface LayersPanelProps {
  layers: CanvasLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  onClose: () => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onClose
}) => {
  return (
    <Card className="w-64 max-h-80 shadow-xl border animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            الطبقات
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {layers.length} طبقات
          </span>
          <Button size="sm" variant="outline">
            <Plus className="w-3 h-3 mr-1" />
            جديد
          </Button>
        </div>

        <ScrollArea className="h-48">
          <div className="space-y-1">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                  selectedLayerId === layer.id 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {layer.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {layer.elements.length} عناصر
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle visibility
                      }}
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 opacity-50" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle lock
                      }}
                    >
                      {layer.locked ? (
                        <Lock className="w-3 h-3 text-red-500" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {layer.opacity < 1 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {Math.round(layer.opacity * 100)}% شفافية
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

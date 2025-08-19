import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, X } from 'lucide-react';
import { Connection } from '../../lib/canvas/types/connection';

interface LinkDialogProps {
  connection: Connection | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Connection>) => void;
  onAnalyze: () => Promise<any>;
  onDelete: (id: string) => void;
}

export function LinkDialog({
  connection,
  isOpen,
  onClose,
  onUpdate,
  onAnalyze,
  onDelete
}: LinkDialogProps) {
  const [title, setTitle] = useState(connection?.title || '');
  const [notes, setNotes] = useState(connection?.notes || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleSave = () => {
    if (!connection) return;
    
    onUpdate(connection.id, {
      title: title.trim() || undefined,
      notes: notes.trim() || undefined
    });
    onClose();
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await onAnalyze();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = () => {
    if (!connection) return;
    onDelete(connection.id);
    onClose();
  };

  if (!connection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>تفاصيل الرابط</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Info */}
          <div className="text-sm text-muted-foreground">
            <div>من: {connection.fromPoint.nodeId}</div>
            <div>إلى: {connection.toPoint.nodeId}</div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">العنوان</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الرابط"
            />
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">الملاحظات</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أضف ملاحظات حول هذا الرابط"
              rows={3}
            />
          </div>

          {/* AI Analysis Section */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">التحليل بالذكاء الصناعي</h4>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="sm"
                variant="outline"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-2" />
                    تحليل الروابط
                  </>
                )}
              </Button>
            </div>

            {analysisResult && (
              <div className="text-sm bg-muted/50 rounded p-3 space-y-2">
                {analysisResult.suggestions?.map((suggestion: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary pl-2">
                    <div className="font-medium">{suggestion.elementType}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.rationale}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
            >
              حذف الرابط
            </Button>

            <div className="space-x-2">
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
              >
                حفظ
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
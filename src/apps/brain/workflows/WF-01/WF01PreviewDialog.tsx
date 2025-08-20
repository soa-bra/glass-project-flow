import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Target,
  Link,
  Lightbulb,
  Download,
  Eye,
  Settings
} from 'lucide-react';
import { WF01Response, WF01MappingResult } from '../../../../hooks/useWF01Generator';

interface WF01PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: WF01Response;
  onApply: (projectStructure: any) => Promise<boolean>;
  onQuickFix?: (mappingId: string, fix: string) => void;
}

export function WF01PreviewDialog({
  isOpen,
  onClose,
  result,
  onApply,
  onQuickFix
}: WF01PreviewDialogProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const success = await onApply(result.projectStructure);
      if (success) {
        onClose();
      }
    } finally {
      setIsApplying(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phase': return <Target className="w-4 h-4 text-blue-500" />;
      case 'task': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'dependency': return <Link className="w-4 h-4 text-purple-500" />;
      case 'skipped': return <XCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge className="bg-green-100 text-green-700 text-xs">عالي</Badge>;
    if (confidence >= 0.6) return <Badge className="bg-yellow-100 text-yellow-700 text-xs">متوسط</Badge>;
    return <Badge className="bg-red-100 text-red-700 text-xs">منخفض</Badge>;
  };

  const { statistics, mappingResults, recommendations } = result;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            معاينة المشروع المولد - WF-01
          </DialogTitle>
          <DialogDescription>
            راجع النتائج وطبّق التحسينات قبل إنشاء المشروع النهائي
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="mappings">التطبيقات</TabsTrigger>
            <TabsTrigger value="structure">الهيكل</TabsTrigger>
            <TabsTrigger value="issues">المشاكل</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Success Rate */}
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {statistics.successRate}%
              </div>
              <div className="text-sm text-muted-foreground">معدل النجاح</div>
              <Progress value={statistics.successRate} className="w-full h-2" />
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">العناصر المطبقة</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.mappedElements}
                </div>
                <div className="text-xs text-muted-foreground">
                  من أصل {statistics.totalElements}
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">العناصر المتجاهلة</span>
                  <XCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-500">
                  {statistics.skippedElements}
                </div>
                <div className="text-xs text-muted-foreground">
                  غير قابلة للتطبيق
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium">تفصيل النتائج:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>المراحل:</span>
                  <span className="font-medium">{statistics.breakdown.phases}</span>
                </div>
                <div className="flex justify-between">
                  <span>المهام:</span>
                  <span className="font-medium">{statistics.breakdown.tasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>التبعيات:</span>
                  <span className="font-medium">{statistics.breakdown.dependencies}</span>
                </div>
                <div className="flex justify-between">
                  <span>المتجاهل:</span>
                  <span className="font-medium text-gray-500">{statistics.breakdown.skipped}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">توصيات:</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mappings">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {mappingResults.map((mapping, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(mapping.type)}
                        <span className="font-medium text-sm">
                          {mapping.sourceType} → {mapping.type}
                        </span>
                        {getConfidenceBadge(mapping.confidence)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(mapping.confidence * 100)}%
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {mapping.reason}
                    </div>

                    {mapping.targetData && (
                      <div className="text-xs bg-muted/50 rounded p-2">
                        {mapping.type === 'task' && (
                          <div>
                            <strong>العنوان:</strong> {mapping.targetData.title}
                          </div>
                        )}
                        {mapping.type === 'phase' && (
                          <div>
                            <strong>المرحلة:</strong> {mapping.targetData.name}
                          </div>
                        )}
                      </div>
                    )}

                    {mapping.suggestions && mapping.suggestions.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium">اقتراحات التحسين:</div>
                        {mapping.suggestions.map((suggestion, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">• {suggestion}</span>
                            {onQuickFix && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => onQuickFix(mapping.sourceId, suggestion)}
                              >
                                إصلاح
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="structure">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {/* Project Info */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">معلومات المشروع:</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>الاسم:</strong> {result.projectStructure?.project?.name}</div>
                    <div><strong>الوصف:</strong> {result.projectStructure?.project?.description}</div>
                    <div><strong>الحالة:</strong> {result.projectStructure?.project?.status}</div>
                  </div>
                </div>

                {/* Phases */}
                {result.projectStructure?.phases && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">المراحل ({result.projectStructure.phases.length}):</h4>
                    <div className="space-y-2">
                      {result.projectStructure.phases.map((phase: any, index: number) => (
                        <div key={index} className="bg-muted/50 rounded p-2 text-sm">
                          <div className="font-medium">{phase.name}</div>
                          <div className="text-muted-foreground text-xs">{phase.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks */}
                {result.projectStructure?.tasks && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">المهام ({result.projectStructure.tasks.length}):</h4>
                    <div className="space-y-2">
                      {result.projectStructure.tasks.slice(0, 5).map((task: any, index: number) => (
                        <div key={index} className="bg-muted/50 rounded p-2 text-sm">
                          <div className="font-medium">{task.title}</div>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline">{task.priority}</Badge>
                            <Badge variant="outline">{task.status}</Badge>
                            <span className="text-muted-foreground">{task.estimated_hours}س</span>
                          </div>
                        </div>
                      ))}
                      {result.projectStructure.tasks.length > 5 && (
                        <div className="text-xs text-muted-foreground text-center">
                          ... و {result.projectStructure.tasks.length - 5} مهمة أخرى
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="issues">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {mappingResults.filter(m => m.confidence < 0.6 || m.type === 'skipped').map((issue, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      {issue.type === 'skipped' ? (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <span className="font-medium text-sm">
                        {issue.type === 'skipped' ? 'عنصر متجاهل' : 'ثقة منخفضة'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {issue.sourceType}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {issue.reason}
                    </div>
                  </div>
                ))}

                {mappingResults.filter(m => m.confidence < 0.6 || m.type === 'skipped').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div>لا توجد مشاكل كبيرة!</div>
                    <div className="text-sm">جميع التطبيقات بثقة عالية</div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              معاينة تفصيلية
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                // Export functionality
                const dataStr = JSON.stringify(result, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `wf01-analysis-${Date.now()}.json`;
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              تصدير
            </Button>
            <Button 
              onClick={handleApply} 
              disabled={isApplying || !result.success}
              className="min-w-[100px]"
            >
              {isApplying ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  جاري التطبيق...
                </>
              ) : (
                'تطبيق المشروع'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Image, 
  FileText, 
  Sparkles, 
  X, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Heart,
  Tag,
  FileSearch
} from 'lucide-react';
import { useAIAnalysis } from '../../../hooks/useAIAnalysis';
import { AnalysisResult } from '../../../services/aiAnalysis';

interface AIAnalysisPanelProps {
  selectedFiles?: File[];
  selectedText?: string;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  selectedFiles = [],
  selectedText = ''
}) => {
  const {
    analyses,
    isAnalyzing,
    analyzeImage,
    analyzeText,
    analyzeDocument,
    cancelAnalysis,
    clearAnalyses
  } = useAIAnalysis();

  const [activeTab, setActiveTab] = useState('analyze');

  // تحليل الملفات المحددة
  const handleAnalyzeFiles = async () => {
    for (const file of selectedFiles) {
      if (file.type.startsWith('image/')) {
        await analyzeImage(file, {
          includeClassification: true,
          includeSegmentation: false,
          includeObjectDetection: false
        });
      } else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
        await analyzeDocument(file);
      }
    }
  };

  // تحليل النص المحدد
  const handleAnalyzeText = async () => {
    if (selectedText.trim()) {
      await analyzeText(selectedText, {
        includeSentiment: true,
        includeKeywords: true,
        includeSummary: true
      });
    }
  };

  // عرض نتائج التحليل
  const renderAnalysisResult = (analysis: AnalysisResult) => {
    const { results } = analysis;
    if (!results) return null;

    return (
      <div className="space-y-4">
        {/* تصنيف الصور */}
        {results.classification && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              تصنيف الصورة
            </h4>
            <div className="space-y-1">
              {results.classification.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-xs">{item.label}</span>
                  <BaseBadge variant="secondary" className="text-xs">
                    {(item.score * 100).toFixed(1)}%
                  </BaseBadge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تحليل المشاعر */}
        {results.sentiment && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Heart className="w-4 h-4" />
              تحليل المشاعر
            </h4>
            <div className="space-y-1">
              {results.sentiment.map((sentiment: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-xs">
                    {sentiment.label === 'POSITIVE' && '🟢 إيجابي'}
                    {sentiment.label === 'NEGATIVE' && '🔴 سلبي'}
                    {sentiment.label === 'NEUTRAL' && '🟡 محايد'}
                  </span>
                  <BaseBadge variant="outline" className="text-xs">
                    {(sentiment.score * 100).toFixed(1)}%
                  </BaseBadge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الكلمات المفتاحية */}
        {results.keywords && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4" />
              الكلمات المفتاحية
            </h4>
            <div className="flex flex-wrap gap-1">
              {results.keywords.slice(0, 8).map((keyword: string, index: number) => (
                <BaseBadge key={index} variant="outline" className="text-xs">
                  {keyword}
                </BaseBadge>
              ))}
            </div>
          </div>
        )}

        {/* معلومات الصورة */}
        {results.dimensions && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">معلومات الصورة</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>الأبعاد: {results.dimensions.width} × {results.dimensions.height}</div>
              <div>النسبة: {results.dimensions.aspectRatio}</div>
            </div>
          </div>
        )}

        {/* معلومات النص */}
        {results.textInfo && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">معلومات النص</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>عدد الأحرف: {results.textInfo.length}</div>
              <div>عدد الكلمات: {results.textInfo.wordCount}</div>
              <div>عدد الجمل: {results.textInfo.sentences}</div>
            </div>
          </div>
        )}

        {/* الملخص */}
        {results.summary && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileSearch className="w-4 h-4" />
              الملخص
            </h4>
            <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
              {results.summary}
            </p>
          </div>
        )}
      </div>
    );
  };

  const analysesArray = Array.from(analyses.values());
  const activeAnalyses = analysesArray.filter(a => a.status === 'processing');
  const completedAnalyses = analysesArray.filter(a => a.status === 'completed');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-arabic flex items-center gap-2">
            <Brain className="w-4 h-4" />
            التحليل الذكي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyze" className="text-xs">تحليل</TabsTrigger>
              <TabsTrigger value="results" className="text-xs">النتائج</TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-4">
              {/* تحليل الملفات */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">الملفات المحددة</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs p-2 bg-muted rounded">
                        {file.type.startsWith('image/') ? (
                          <Image className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleAnalyzeFiles}
                    disabled={isAnalyzing}
                    size="sm"
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isAnalyzing ? 'جاري التحليل...' : 'تحليل الملفات'}
                  </Button>
                </div>
              )}

              {/* تحليل النص */}
              {selectedText && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">النص المحدد</h4>
                  <div className="text-xs p-2 bg-muted rounded max-h-20 overflow-y-auto">
                    {selectedText.substring(0, 200)}
                    {selectedText.length > 200 && '...'}
                  </div>
                  <Button
                    onClick={handleAnalyzeText}
                    disabled={isAnalyzing}
                    size="sm"
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isAnalyzing ? 'جاري التحليل...' : 'تحليل النص'}
                  </Button>
                </div>
              )}

              {!selectedFiles.length && !selectedText && (
                <div className="text-center text-muted-foreground text-xs py-4">
                  اختر ملفات أو نص لبدء التحليل
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {/* التحليلات النشطة */}
              {activeAnalyses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">التحليلات الجارية</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAnalyses}
                      className="h-6 px-2"
                    >
                      إلغاء الكل
                    </Button>
                  </div>
                  {activeAnalyses.map((analysis) => (
                    <div key={analysis.id} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {analysis.type === 'image' && 'تحليل صورة'}
                          {analysis.type === 'text' && 'تحليل نص'}
                          {analysis.type === 'document' && 'تحليل مستند'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelAnalysis(analysis.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <Progress value={analysis.progress} className="h-1" />
                      <div className="text-xs text-muted-foreground">
                        {analysis.progress.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* التحليلات المكتملة */}
              {completedAnalyses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">النتائج</h4>
                  {completedAnalyses.map((analysis) => (
                    <div key={analysis.id} className="border rounded p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-medium">
                            {analysis.type === 'image' && 'صورة'}
                            {analysis.type === 'text' && 'نص'}
                            {analysis.type === 'document' && 'مستند'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(analysis.timestamp).toLocaleTimeString('ar')}
                        </span>
                      </div>
                      {renderAnalysisResult(analysis)}
                    </div>
                  ))}
                </div>
              )}

              {analysesArray.length === 0 && (
                <div className="text-center text-muted-foreground text-xs py-4">
                  لا توجد نتائج تحليل بعد
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* إحصائيات سريعة */}
      {analysesArray.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-arabic">الإحصائيات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{completedAnalyses.length}</div>
                <div className="text-xs text-muted-foreground">مكتمل</div>
              </div>
              <div>
                <div className="text-lg font-bold">{activeAnalyses.length}</div>
                <div className="text-xs text-muted-foreground">جاري</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
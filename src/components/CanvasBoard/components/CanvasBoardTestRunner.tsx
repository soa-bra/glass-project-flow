/**
 * @fileoverview Test runner component for Canvas Board validation
 * @author AI Assistant
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, Clock } from 'lucide-react';
import { runCompleteCanvasBoardTest } from '../utils/testing';

export const CanvasBoardTestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const results = runCompleteCanvasBoardTest();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        overall: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? 'نجح' : 'فشل'}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 اختبار لوحة الرسم التشاركي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                جاري التشغيل...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                تشغيل الاختبارات
              </>
            )}
          </Button>
        </div>

        {testResults && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">النتيجة الإجمالية:</h3>
              {getStatusIcon(testResults.overall)}
              {getStatusBadge(testResults.overall)}
            </div>

            {testResults.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700">{testResults.error}</p>
              </div>
            )}

            {testResults.core && (
              <div className="space-y-2">
                <h4 className="font-medium">الاختبارات الأساسية:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.core.validation)}
                    <span>التحقق من البيانات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.core.layerTransform)}
                    <span>تحويل الطبقات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.core.mockData)}
                    <span>البيانات التجريبية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.core.arabicSupport)}
                    <span>دعم اللغة العربية</span>
                  </div>
                </div>
                
                {testResults.core.errors.length > 0 && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-medium text-red-700 mb-1">أخطاء:</p>
                    <ul className="text-sm text-red-600 list-disc list-inside">
                      {testResults.core.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {testResults.visual && (
              <div className="space-y-2">
                <h4 className="font-medium">الاختبارات المرئية:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.visual.rtlSupport)}
                    <span>دعم الكتابة من اليمين</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.visual.arabicFonts)}
                    <span>الخطوط العربية</span>
                  </div>
                </div>
                
                {testResults.visual.errors.length > 0 && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm font-medium text-yellow-700 mb-1">تحذيرات مرئية:</p>
                    <ul className="text-sm text-yellow-600 list-disc list-inside">
                      {testResults.visual.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {testResults.performance && (
              <div className="space-y-2">
                <h4 className="font-medium">اختبارات الأداء:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">إنشاء العناصر:</span> {testResults.performance.elementCreation.toFixed(2)}ms
                  </div>
                  <div>
                    <span className="font-medium">تحديث العناصر:</span> {testResults.performance.elementUpdate.toFixed(2)}ms
                  </div>
                  {testResults.performance.memoryUsage > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium">استخدام الذاكرة:</span> {(testResults.performance.memoryUsage / 1024 / 1024).toFixed(2)}MB
                    </div>
                  )}
                </div>
                
                {testResults.performance.errors.length > 0 && (
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-sm font-medium text-orange-700 mb-1">تحذيرات الأداء:</p>
                    <ul className="text-sm text-orange-600 list-disc list-inside">
                      {testResults.performance.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
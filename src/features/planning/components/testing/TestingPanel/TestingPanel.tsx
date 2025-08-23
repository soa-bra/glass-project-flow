import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Bug,
  TestTube,
  Zap
} from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'running';
  duration: number;
  error?: string;
  details?: string;
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestResult[];
  status: 'idle' | 'running' | 'completed';
}

interface TestingPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TestingPanel: React.FC<TestingPanelProps> = ({
  isVisible,
  onClose
}) => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);

  // Initialize test suites
  useEffect(() => {
    setTestSuites([
      {
        id: 'unit',
        name: 'اختبارات الوحدة',
        status: 'idle',
        tests: [
          { id: 'canvas-render', name: 'رسم الكانفاس', status: 'passed', duration: 15 },
          { id: 'element-creation', name: 'إنشاء العناصر', status: 'passed', duration: 8 },
          { id: 'selection-logic', name: 'منطق التحديد', status: 'passed', duration: 12 },
          { id: 'tool-switching', name: 'تبديل الأدوات', status: 'warning', duration: 25, details: 'بطء طفيف في التبديل' }
        ]
      },
      {
        id: 'integration',
        name: 'اختبارات التكامل',
        status: 'idle',
        tests: [
          { id: 'canvas-tools', name: 'تكامل الكانفاس والأدوات', status: 'passed', duration: 32 },
          { id: 'realtime-sync', name: 'المزامنة اللحظية', status: 'passed', duration: 45 },
          { id: 'ai-integration', name: 'تكامل المساعد الذكي', status: 'failed', duration: 67, error: 'فشل في الاتصال بـ API' },
          { id: 'widget-data', name: 'بيانات الودجت', status: 'passed', duration: 23 }
        ]
      },
      {
        id: 'performance',
        name: 'اختبارات الأداء',
        status: 'idle',
        tests: [
          { id: 'fps-test', name: 'معدل الإطارات (FPS)', status: 'passed', duration: 120, details: '58 FPS متوسط' },
          { id: 'memory-usage', name: 'استخدام الذاكرة', status: 'passed', duration: 90, details: '245 MB متوسط' },
          { id: 'large-canvas', name: 'كانفاس كبير (1000+ عنصر)', status: 'warning', duration: 180, details: 'انخفاض طفيف في الأداء' },
          { id: 'collaboration-load', name: 'حمل التعاون (20 مستخدم)', status: 'passed', duration: 200 }
        ]
      },
      {
        id: 'accessibility',
        name: 'اختبارات الوصولية',
        status: 'idle',
        tests: [
          { id: 'rtl-support', name: 'دعم الكتابة من اليمين لليسار', status: 'passed', duration: 18 },
          { id: 'keyboard-nav', name: 'التنقل بلوحة المفاتيح', status: 'passed', duration: 25 },
          { id: 'screen-reader', name: 'قارئ الشاشة', status: 'passed', duration: 35 },
          { id: 'contrast-ratio', name: 'نسبة التباين', status: 'passed', duration: 8 }
        ]
      }
    ]);
  }, []);

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const suite of testSuites) {
      // Simulate running tests
      setTestSuites(prev => prev.map(s => 
        s.id === suite.id ? { ...s, status: 'running' as const } : s
      ));
      
      // Simulate test execution time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestSuites(prev => prev.map(s => 
        s.id === suite.id ? { ...s, status: 'completed' as const } : s
      ));
    }
    
    setIsRunning(false);
  };

  const runSingleSuite = async (suiteId: string) => {
    setTestSuites(prev => prev.map(s => 
      s.id === suiteId ? { ...s, status: 'running' as const } : s
    ));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTestSuites(prev => prev.map(s => 
      s.id === suiteId ? { ...s, status: 'completed' as const } : s
    ));
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'running':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const getSuiteStats = (suite: TestSuite) => {
    const passed = suite.tests.filter(t => t.status === 'passed').length;
    const failed = suite.tests.filter(t => t.status === 'failed').length;
    const warnings = suite.tests.filter(t => t.status === 'warning').length;
    
    return { passed, failed, warnings, total: suite.tests.length };
  };

  const getOverallStats = () => {
    const allTests = testSuites.flatMap(s => s.tests);
    const passed = allTests.filter(t => t.status === 'passed').length;
    const failed = allTests.filter(t => t.status === 'failed').length;
    const warnings = allTests.filter(t => t.status === 'warning').length;
    
    return { passed, failed, warnings, total: allTests.length };
  };

  if (!isVisible) return null;

  const overallStats = getOverallStats();

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 w-96 max-h-[80vh] overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-accent-blue" />
            <h3 className="font-bold text-sm">لوحة الاختبارات</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-green-50 rounded p-2">
            <div className="text-green-600 font-bold">{overallStats.passed}</div>
            <div className="text-green-700">نجح</div>
          </div>
          <div className="bg-red-50 rounded p-2">
            <div className="text-red-600 font-bold">{overallStats.failed}</div>
            <div className="text-red-700">فشل</div>
          </div>
          <div className="bg-yellow-50 rounded p-2">
            <div className="text-yellow-600 font-bold">{overallStats.warnings}</div>
            <div className="text-yellow-700">تحذير</div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-gray-600 font-bold">{overallStats.total}</div>
            <div className="text-gray-700">الكل</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-1 px-3 py-1 bg-accent-blue text-white rounded text-xs hover:bg-accent-blue/80 disabled:opacity-50"
          >
            {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isRunning ? 'جاري التشغيل...' : 'تشغيل الكل'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
          >
            <RotateCcw className="h-3 w-3" />
            إعادة تعيين
          </button>
        </div>
      </div>

      {/* Test Suites */}
      <div className="overflow-y-auto max-h-96">
        {testSuites.map(suite => {
          const stats = getSuiteStats(suite);
          
          return (
            <div key={suite.id} className="border-b border-gray-100 last:border-b-0">
              <div 
                className="p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedSuite(selectedSuite === suite.id ? null : suite.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{suite.name}</h4>
                  <div className="flex items-center gap-2">
                    {suite.status === 'running' && (
                      <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        runSingleSuite(suite.id);
                      }}
                      className="text-xs text-accent-blue hover:text-accent-blue/80"
                    >
                      تشغيل
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-600">✓ {stats.passed}</span>
                  <span className="text-red-600">✗ {stats.failed}</span>
                  <span className="text-yellow-600">⚠ {stats.warnings}</span>
                  <span className="text-gray-500">من {stats.total}</span>
                </div>
              </div>

              {/* Test Details */}
              {selectedSuite === suite.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 pb-3"
                >
                  <div className="space-y-2">
                    {suite.tests.map(test => (
                      <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span>{test.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <span>{test.duration}ms</span>
                          {(test.error || test.details) && (
                            <Bug 
                              className="h-3 w-3 cursor-pointer" 
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
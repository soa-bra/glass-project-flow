import React, { useState } from 'react';
import { useAIStore } from '../../../store/ai.store';
import { useCanvasStore } from '../../../store/canvas.store';
import { AIProjectGenerationRequest, AIProjectGenerationResult } from '../../../types/ai.types';

export const AIProjectGenerator: React.FC = () => {
  const { setProcessing, addChatMessage } = useAIStore();
  const { elements } = useCanvasStore();
  const [generatedProject, setGeneratedProject] = useState<AIProjectGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const projectTemplates = [
    { id: 'agile', name: 'مشروع أجايل', description: 'مشروع تطوير برمجيات بمنهجية أجايل' },
    { id: 'marketing', name: 'حملة تسويقية', description: 'مشروع حملة تسويقية متكاملة' },
    { id: 'research', name: 'بحث ودراسة', description: 'مشروع بحثي أو دراسة تحليلية' },
    { id: 'event', name: 'تنظيم فعالية', description: 'مشروع تنظيم فعالية أو مؤتمر' },
    { id: 'custom', name: 'مخصص', description: 'مشروع مخصص حسب محتوى اللوحة' }
  ];

  const generationOptions = [
    { key: 'generateTasks', label: 'إنشاء المهام', description: 'توليد مهام تفصيلية للمشروع' },
    { key: 'generateTimeline', label: 'إنشاء الجدول الزمني', description: 'توليد جدول زمني للمشروع' },
    { key: 'generateTeam', label: 'اقتراح الفريق', description: 'اقتراح أعضاء الفريق والأدوار' },
    { key: 'generateBudget', label: 'تقدير الميزانية', description: 'تقدير ميزانية المشروع' }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [selectedOptions, setSelectedOptions] = useState({
    generateTasks: true,
    generateTimeline: true,
    generateTeam: false,
    generateBudget: false
  });

  const handleGenerateProject = async () => {
    setIsGenerating(true);
    setProcessing(true);

    const request: AIProjectGenerationRequest = {
      boardId: 'current_board',
      includeElements: elements.map(el => el.id),
      projectTemplate: selectedTemplate,
      options: selectedOptions
    };

    addChatMessage({
      id: `gen_start_${Date.now()}`,
      type: 'system',
      content: `🏗️ بدء إنشاء مشروع من اللوحة...`,
      timestamp: Date.now()
    });

    // Simulate AI processing
    setTimeout(() => {
      const mockProject: AIProjectGenerationResult = {
        projectId: `proj_${Date.now()}`,
        name: 'مشروع تم إنشاؤه من لوحة التخطيط',
        description: `مشروع تم إنشاؤه تلقائيًا من ${elements.length} عنصر في اللوحة`,
        structure: {
          tasks: [
            {
              id: 'task_1',
              title: 'التحليل والتخطيط الأولي',
              description: 'تحليل المتطلبات ووضع الخطة الأولية للمشروع',
              priority: 'high',
              estimatedHours: 16,
              dependencies: [],
              tags: ['تحليل', 'تخطيط']
            },
            {
              id: 'task_2',
              title: 'تطوير النموذج الأولي',
              description: 'إنشاء نموذج أولي للحل المقترح',
              priority: 'medium',
              estimatedHours: 40,
              dependencies: ['task_1'],
              tags: ['تطوير', 'نموذج']
            },
            {
              id: 'task_3',
              title: 'الاختبار والمراجعة',
              description: 'اختبار النموذج ومراجعة النتائج',
              priority: 'medium',
              estimatedHours: 24,
              dependencies: ['task_2'],
              tags: ['اختبار', 'مراجعة']
            }
          ],
          timeline: selectedOptions.generateTimeline ? {
            startDate: '2024-01-01',
            endDate: '2024-03-31',
            milestones: [
              {
                id: 'milestone_1',
                name: 'إكمال التحليل',
                date: '2024-01-15',
                description: 'إنهاء مرحلة التحليل والتخطيط',
                taskIds: ['task_1']
              },
              {
                id: 'milestone_2',
                name: 'النموذج الأولي جاهز',
                date: '2024-02-28',
                description: 'إكمال النموذج الأولي',
                taskIds: ['task_2']
              }
            ]
          } : undefined,
          team: selectedOptions.generateTeam ? [
            {
              role: 'مدير المشروع',
              skills: ['إدارة', 'تخطيط', 'قيادة'],
              allocation: 0.5,
              taskIds: ['task_1', 'task_3']
            },
            {
              role: 'مطور رئيسي',
              skills: ['برمجة', 'تحليل', 'تصميم'],
              allocation: 1.0,
              taskIds: ['task_2', 'task_3']
            }
          ] : undefined,
          budget: selectedOptions.generateBudget ? {
            total: 75000,
            breakdown: [
              { category: 'الموارد البشرية', amount: 50000, tasks: ['task_1', 'task_2', 'task_3'] },
              { category: 'أدوات وتقنيات', amount: 15000, tasks: ['task_2'] },
              { category: 'تكاليف إضافية', amount: 10000, tasks: ['task_1', 'task_3'] }
            ]
          } : undefined
        },
        confidence: 0.82,
        metadata: {
          elementsAnalyzed: elements.length,
          template: selectedTemplate,
          generatedAt: Date.now()
        }
      };

      setGeneratedProject(mockProject);
      setIsGenerating(false);
      setProcessing(false);

      addChatMessage({
        id: `gen_complete_${Date.now()}`,
        type: 'assistant',
        content: `✅ تم إنشاء المشروع بنجاح!\n\n📊 إحصائيات المشروع:\n• ${mockProject.structure.tasks.length} مهام\n• ${mockProject.structure.timeline?.milestones.length || 0} معالم\n• ${mockProject.structure.team?.length || 0} أعضاء فريق\n• الثقة: ${Math.round(mockProject.confidence * 100)}%`,
        timestamp: Date.now()
      });
    }, 3000);
  };

  const handleOptionChange = (key: string, value: boolean) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      {!generatedProject ? (
        <div className="space-y-6">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-black mb-2">مولد المشاريع الذكي</h4>
            <p className="text-xs text-black/60">
              حول لوحة التخطيط إلى مشروع متكامل مع المهام والجدول الزمني
            </p>
          </div>

          {/* Template Selection */}
          <div>
            <h5 className="text-sm font-medium text-black mb-3">نوع المشروع</h5>
            <div className="space-y-2">
              {projectTemplates.map((template) => (
                <label
                  key={template.id}
                  className="flex items-start gap-3 p-3 bg-white/80 border border-black/10 rounded-xl cursor-pointer hover:bg-black/5"
                >
                  <input
                    type="radio"
                    name="template"
                    value={template.id}
                    checked={selectedTemplate === template.id}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-black">
                      {template.name}
                    </div>
                    <div className="text-xs text-black/60">
                      {template.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Generation Options */}
          <div>
            <h5 className="text-sm font-medium text-black mb-3">خيارات الإنشاء</h5>
            <div className="space-y-2">
              {generationOptions.map((option) => (
                <label
                  key={option.key}
                  className="flex items-start gap-3 p-3 bg-white/80 border border-black/10 rounded-xl cursor-pointer hover:bg-black/5"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions[option.key as keyof typeof selectedOptions]}
                    onChange={(e) => handleOptionChange(option.key, e.target.checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-black">
                      {option.label}
                    </div>
                    <div className="text-xs text-black/60">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Canvas Info */}
          <div className="p-4 bg-gradient-to-br from-accent-blue/10 to-accent-green/10 rounded-2xl border border-black/10">
            <h5 className="text-sm font-medium text-black mb-2">محتوى اللوحة الحالية</h5>
            <div className="text-xs text-black/60">
              <p>• عدد العناصر: {elements.length}</p>
              <p>• أنواع العناصر: {[...new Set(elements.map(el => el.type))].join(', ') || 'لا يوجد'}</p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateProject}
            disabled={isGenerating || elements.length === 0}
            className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>إنشاء المشروع...</span>
              </div>
            ) : (
              '🏗️ إنشاء مشروع من اللوحة'
            )}
          </button>

          {elements.length === 0 && (
            <p className="text-xs text-center text-black/60 mt-2">
              أضف عناصر إلى اللوحة أولاً لإنشاء مشروع منها
            </p>
          )}
        </div>
      ) : (
        /* Generated Project Display */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-black">المشروع المُنشأ</h4>
            <button
              onClick={() => setGeneratedProject(null)}
              className="text-xs text-black/60 hover:text-black"
            >
              إنشاء مشروع جديد
            </button>
          </div>

          <div className="bg-white/80 border border-black/10 rounded-2xl p-4">
            <h5 className="text-sm font-bold text-black mb-2">
              {generatedProject.name}
            </h5>
            <p className="text-xs text-black/60 mb-4">
              {generatedProject.description}
            </p>

            <div className="space-y-4">
              {/* Tasks */}
              <div>
                <h6 className="text-xs font-medium text-black mb-2">
                  المهام ({generatedProject.structure.tasks.length})
                </h6>
                <div className="space-y-2">
                  {generatedProject.structure.tasks.map((task) => (
                    <div key={task.id} className="p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-black">
                        {task.title}
                      </div>
                      <div className="text-xs text-black/60">
                        {task.estimatedHours}ساعة • {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              {generatedProject.structure.timeline && (
                <div>
                  <h6 className="text-xs font-medium text-black mb-2">
                    المعالم ({generatedProject.structure.timeline.milestones.length})
                  </h6>
                  <div className="space-y-2">
                    {generatedProject.structure.timeline.milestones.map((milestone) => (
                      <div key={milestone.id} className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-xs font-medium text-black">
                          {milestone.name}
                        </div>
                        <div className="text-xs text-black/60">
                          {milestone.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Button */}
              <button className="w-full bg-accent-green text-white py-2 px-4 rounded-xl text-xs font-medium hover:bg-accent-green/80 transition-colors">
                📤 تصدير إلى نظام إدارة المشاريع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
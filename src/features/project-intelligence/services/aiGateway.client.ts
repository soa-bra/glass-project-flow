import type { ProjectIntelligenceContext } from './projectContextBuilder';

export type SmartAssistantCommandId =
  | 'delay-budget-impact'
  | 'suggest-box-links'
  | 'ideas-to-tasks'
  | 'executive-summary'
  | 'extract-document-risks';

export interface SmartAssistantGatewayRequest {
  commandId: SmartAssistantCommandId;
  title: string;
  prompt: string;
  context: ProjectIntelligenceContext;
}

export interface SmartAssistantGatewayResponse {
  id: string;
  commandId: SmartAssistantCommandId;
  summary: string;
  recommendations: string[];
  proposedActions: string[];
  createdAt: string;
}

const COMMAND_RESPONSES: Record<SmartAssistantCommandId, Omit<SmartAssistantGatewayResponse, 'id' | 'createdAt'>> = {
  'delay-budget-impact': {
    commandId: 'delay-budget-impact',
    summary: 'تحليل أولي يربط التأخير الحالي بمخاطر زيادة التكلفة، إعادة جدولة الموارد، وتأثيره على الالتزامات القادمة.',
    recommendations: [
      'راجع المسار الحرج وحدد البنود التي ترفع معدل الحرق المالي.',
      'قارن أيام التأخير مع بنود الميزانية عالية الحساسية قبل اعتماد أي تعديل.',
      'أضف هامش احتياطي واضح عند تحديث توقعات الإغلاق.',
    ],
    proposedActions: [
      'إنشاء مسودة تقرير أثر التأخير على الميزانية.',
      'إضافة بند متابعة للمخاطر المالية في لوحة المشروع.',
    ],
  },
  'suggest-box-links': {
    commandId: 'suggest-box-links',
    summary: 'اقتراح روابط معرفية بين الصناديق بناءً على القسم النشط والسياق المتاح لتقليل التكرار وتحسين التتبع.',
    recommendations: [
      'اربط الصناديق التي تتشارك نفس المخرجات أو التبعيات الزمنية.',
      'ميّز الروابط المقترحة حسب قوة العلاقة قبل اعتمادها.',
      'ابدأ بروابط القراءة فقط ثم حوّل الروابط المؤكدة إلى علاقات تشغيلية.',
    ],
    proposedActions: [
      'إضافة روابط مقترحة بين صناديق المشروع.',
      'فتح مراجعة يدوية للروابط ذات الثقة المنخفضة.',
    ],
  },
  'ideas-to-tasks': {
    commandId: 'ideas-to-tasks',
    summary: 'تحويل الأفكار إلى مهام قابلة للتنفيذ مع عناوين واضحة، أولويات مبدئية، ومعايير قبول مختصرة.',
    recommendations: [
      'حوّل كل فكرة إلى مهمة واحدة قابلة للقياس.',
      'أضف مالكًا وموعدًا فقط بعد مراجعة بشرية.',
      'افصل الأفكار الاستكشافية عن المهام التشغيلية المباشرة.',
    ],
    proposedActions: [
      'إنشاء مسودة مهام من الأفكار المحددة.',
      'إضافة معايير قبول لكل مهمة مقترحة.',
    ],
  },
  'executive-summary': {
    commandId: 'executive-summary',
    summary: 'ملخص تنفيذي موجز يبرز الحالة العامة، الإنجازات، العوائق، والقرارات المطلوبة من الإدارة.',
    recommendations: [
      'ابدأ بالنتيجة الإدارية قبل التفاصيل التشغيلية.',
      'اذكر القرارات المطلوبة بصيغة مباشرة وقابلة للاعتماد.',
      'أضف مؤشرات المخاطر فقط عندما تؤثر على الموعد أو الميزانية أو النطاق.',
    ],
    proposedActions: [
      'حفظ مسودة الملخص التنفيذي للمراجعة.',
      'مشاركة الملخص مع أصحاب المصلحة بعد الاعتماد.',
    ],
  },
  'extract-document-risks': {
    commandId: 'extract-document-risks',
    summary: 'استخراج مخاطر محتملة من الوثائق والسياق المتاح، مع تصنيفها حسب الاحتمالية والأثر.',
    recommendations: [
      'راجع المخاطر التي لا تحتوي على مالك واضح.',
      'حوّل المخاطر عالية الأثر إلى عناصر متابعة منفصلة.',
      'اربط كل خطر بمصدره أو الوثيقة التي ظهر فيها.',
    ],
    proposedActions: [
      'إنشاء سجل مخاطر مبدئي من الوثائق.',
      'إضافة إشارات مراجعة للمخاطر عالية الأثر.',
    ],
  },
};

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const aiGatewayClient = {
  async runProjectIntelligenceCommand(
    request: SmartAssistantGatewayRequest,
  ): Promise<SmartAssistantGatewayResponse> {
    await wait(450);
    const response = COMMAND_RESPONSES[request.commandId];

    return {
      ...response,
      id: `${request.commandId}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  },
};

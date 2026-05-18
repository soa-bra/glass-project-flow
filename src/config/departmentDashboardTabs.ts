export type DashboardTabItem = { value: string; label: string };
export const dashboardTabsByKey: Record<string, DashboardTabItem[]> = {
  FinancialDashboard: [
    { value: 'overview', label: 'النظرة العامة' },{ value: 'budgets', label: 'الميزانيات' },{ value: 'transactions', label: 'النفقات والإيرادات' },{ value: 'invoices', label: 'الفواتير والمدفوعات' },{ value: 'analysis', label: 'التحليل والتقارير' },{ value: 'settings', label: 'الضبط' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
  LegalDashboard: [
    { value: 'overview', label: 'النظرة العامة' },{ value: 'contracts', label: 'العقود والاتفاقيات' },{ value: 'compliance', label: 'الامتثال' },{ value: 'risks', label: 'المخاطر والنزاعات' },{ value: 'licenses', label: 'التراخيص والملكية الفكرية' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
  MarketingDashboard: [
    { value: 'overview', label: 'نظرة عامة' },{ value: 'campaigns', label: 'الحملات والقنوات' },{ value: 'content', label: 'المحتوى والأصول' },{ value: 'performance', label: 'الأداء والتحليلات' },{ value: 'budgets', label: 'الميزانيات' },{ value: 'pr', label: 'العلاقات العامة' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
  HRDashboard: [
    { value: 'overview', label: 'نظرة عامة' },{ value: 'employees', label: 'ملفات الموظفين' },{ value: 'attendance', label: 'الحضور والإجازات' },{ value: 'performance', label: 'الأداء والتقييم' },{ value: 'recruitment', label: 'التوظيف والمواهب' },{ value: 'training', label: 'التدريب والتطوير' },{ value: 'partners', label: 'الشركاء' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
  CRMDashboard: [
    { value: 'overview', label: 'نظرة عامة' },{ value: 'customers', label: 'العملاء' },{ value: 'opportunities', label: 'الفرص والعروض' },{ value: 'service', label: 'خدمة العملاء والدعم' },{ value: 'analytics', label: 'التحليلات' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
  CSRDashboard: [
    { value: 'overview', label: 'نظرة عامة' },{ value: 'initiatives', label: 'المبادرات' },{ value: 'partnerships', label: 'الشراكات والموارد' },{ value: 'monitoring', label: 'المراقبة والتقييم' },{ value: 'stories', label: 'قصص الأثر' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
  TrainingDashboard: [
    { value: 'overview', label: 'نظرة عامة' },{ value: 'courses', label: 'الدورات التدريبية' },{ value: 'lms', label: 'نظام إدارة التعلم' },{ value: 'scheduling', label: 'الجدولة والتسجيل' },{ value: 'certifications', label: 'الشهادات والمهارات' },{ value: 'analytics', label: 'التحليلات والأداء' },{ value: 'corporate', label: 'البرامج المؤسسية' },{ value: 'partnerships', label: 'الشراكات الأكاديمية' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
  KMPADashboard: [
    { value: 'overview', label: 'نظرة عامة' },{ value: 'repository', label: 'مستودع المعرفة' },{ value: 'authoring', label: 'التأليف والإصدارات' },{ value: 'analytics', label: 'التحليلات والتأثير' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
  BrandDashboard: [
    { value: 'overview', label: 'نظرة عامة' },{ value: 'identity', label: 'الهوية الثقافية' },{ value: 'assets', label: 'الأصول البصرية' },{ value: 'content', label: 'المحتوى والرسائل' },{ value: 'research', label: 'البحث والتطوير الثقافي' },{ value: 'events', label: 'الفعاليات' },{ value: 'templates', label: 'النماذج والقوالب' },{ value: 'reports', label: 'التقارير' },],
};

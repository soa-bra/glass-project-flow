import { Project } from '@/pages/Index';
interface ProjectsListProps {
  onProjectSelect: (project: Project) => void;
  isCompressed: boolean;
}
const ProjectsList = ({
  onProjectSelect,
  isCompressed
}: ProjectsListProps) => {
  const projects: Project[] = [{
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    assignee: 'أحمد محمد',
    value: '15K',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#0099FF'
  }, {
    id: '2',
    title: 'حملة التعريف بسوءها وخدماتها',
    assignee: 'سارة أحمد',
    value: '8K',
    status: 'warning',
    phase: 'التخطيط',
    phaseColor: '#FBBF24'
  }, {
    id: '3',
    title: 'صفحات التواصل الاجتماعي',
    assignee: 'محمد علي',
    value: '12K',
    status: 'success',
    phase: 'النشر',
    phaseColor: '#34D399'
  }, {
    id: '4',
    title: 'المؤتمرات الثقافية للمهيل',
    assignee: 'فاطمة خالد',
    value: '25K',
    status: 'error',
    phase: 'متأخر',
    phaseColor: '#EF4444'
  }, {
    id: '5',
    title: 'العلامة الثقافية للمهيل',
    assignee: 'عبدالله سعد',
    value: '18K',
    status: 'neutral',
    phase: 'دراسة',
    phaseColor: '#6B7280'
  }, {
    id: '6',
    title: 'تطوير تطبيق الجوال',
    assignee: 'نورا حسن',
    value: '22K',
    status: 'success',
    phase: 'التطوير',
    phaseColor: '#A855F7'
  }, {
    id: '7',
    title: 'برنامج التدريب الصيفي',
    assignee: 'خالد العتيبي',
    value: '30K',
    status: 'warning',
    phase: 'التخطيط',
    phaseColor: '#F59E0B'
  }];
  return <div className="h-full bg-soabra-projects-bg rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white py-0 px-[240px]">
          <h2 className="text-2xl font-bold text-soabra-text-primary mb-2">المشاريع</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-soabra-text-secondary">
              {projects.length} مشروع نشط
            </span>
            <button className="px-4 py-2 bg-soabra-primary-blue text-white rounded-lg text-sm font-medium hover:bg-soabra-primary-blue-hover transition-colors">
              إضافة مشروع +
            </button>
          </div>
        </div>

        {/* Projects List */}
        
      </div>
    </div>;
};
export default ProjectsList;
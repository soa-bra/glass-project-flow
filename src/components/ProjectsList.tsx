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
  return;
};
export default ProjectsList;
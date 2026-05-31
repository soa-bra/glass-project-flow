
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  FileText,
  Search,
  Plus,
  BarChart3
} from 'lucide-react';

export const CulturalResearchTab: React.FC = () => {
  const [activeView, setActiveView] = useState('projects');

  const researchProjects = [
    {
      id: 1,
      title: 'تأثير الهوية الثقافية على سلوك المستهلك السعودي',
      type: 'أكاديمي',
      status: 'نشط',
      progress: 75,
      lead: 'د. فاطمة الزهراني',
      team: ['د. محمد الأحمد', 'سارة الخالد', 'أحمد البريك'],
      budget: { allocated: 150000, spent: 112500 },
      startDate: '2023-09-01',
      endDate: '2024-06-30',
      publications: 2,
      culturalImpact: 89
    },
    {
      id: 2,
      title: 'العلامات التجارية السعودية في العصر الرقمي',
      type: 'تطبيقي',
      status: 'مكتمل',
      progress: 100,
      lead: 'د. خالد الراجح',
      team: ['د. نورا العتيبي', 'محمد الشهري'],
      budget: { allocated: 200000, spent: 195000 },
      startDate: '2023-03-01',
      endDate: '2023-12-31',
      publications: 4,
      culturalImpact: 94
    },
    {
      id: 3,
      title: 'قياس الأثر الثقافي للعلامات التجارية',
      type: 'تعاوني',
      status: 'اقتراح',
      progress: 15,
      lead: 'د. ريم الحربي',
      team: ['د. عبدالله الشمري'],
      budget: { allocated: 300000, spent: 25000 },
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      publications: 0,
      culturalImpact: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-800';
      case 'مكتمل': return 'bg-blue-100 text-blue-800';
      case 'اقتراح': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'أكاديمي': return 'bg-purple-100 text-purple-800';
      case 'تطبيقي': return 'bg-orange-100 text-orange-800';
      case 'تعاوني': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Research Overview */}
      <AppDashboardGrid columns={12}>
        <AppGridItem colSpan={3}>
          <BaseBox>
            <div>
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">مشاريع بحثية</div>
            </div>
          </BaseBox>
        </AppGridItem>
        <AppGridItem colSpan={3}>
          <BaseBox>
            <div>
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">28</div>
              <div className="text-sm text-gray-600">باحث مشارك</div>
            </div>
          </BaseBox>
        </AppGridItem>
        <AppGridItem colSpan={3}>
          <BaseBox>
            <div>
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm text-gray-600">منشور علمي</div>
            </div>
          </BaseBox>
        </AppGridItem>
        <AppGridItem colSpan={3}>
          <BaseBox>
            <div>
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">91%</div>
              <div className="text-sm text-gray-600">متوسط الأثر الثقافي</div>
            </div>
          </BaseBox>
        </AppGridItem>
      </AppDashboardGrid>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <BaseActionButton 
            variant={activeView === 'projects' ? 'primary' : 'outline'}
            onClick={() => setActiveView('projects')}
          >
            المشاريع البحثية
          </BaseActionButton>
          <BaseActionButton 
            variant={activeView === 'publications' ? 'primary' : 'outline'}
            onClick={() => setActiveView('publications')}
          >
            المنشورات
          </BaseActionButton>
          <BaseActionButton 
            variant={activeView === 'insights' ? 'primary' : 'outline'}
            onClick={() => setActiveView('insights')}
          >
            الرؤى والتحليلات
          </BaseActionButton>
        </div>
        <BaseActionButton>
          <Plus className="h-4 w-4 mr-2" />
          مشروع بحثي جديد
        </BaseActionButton>
      </div>

      {/* Research Projects */}
      {activeView === 'projects' && (
        <div className="space-y-4">
          {researchProjects.map((project) => (
            <BaseBox key={project.id}>
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">{project.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <BaseBadge className={getTypeColor(project.type)}>
                        {project.type}
                      </BaseBadge>
                      <BaseBadge className={getStatusColor(project.status)}>
                        {project.status}
                      </BaseBadge>
                    </div>
                    <div className="text-sm text-gray-600">
                      باحث رئيسي: {project.lead}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">التقدم</div>
                    <div className="text-2xl font-bold text-blue-600">{project.progress}%</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">فريق البحث</h4>
                    <div className="space-y-1">
                      {project.team.map((member, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">الميزانية</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>المخصص:</span>
                        <span>{project.budget.allocated.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>المنفق:</span>
                        <span>{project.budget.spent.toLocaleString()} ر.س</span>
                      </div>
                      <Progress 
                        value={(project.budget.spent / project.budget.allocated) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">المؤشرات</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>المنشورات:</span>
                        <span>{project.publications}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>الأثر الثقافي:</span>
                        <span>{project.culturalImpact}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>المدة:</span>
                        <span>{project.startDate} - {project.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            </BaseBox>
          ))}
        </div>
      )}

      {/* Publications View */}
      {activeView === 'publications' && (
        <BaseBox>
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              المنشورات العلمية
            </h3>
          </div>
          <div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">تأثير الثقافة على قرارات الشراء في السوق السعودي</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>مجلة العلامات التجارية الثقافية</span>
                  <span>2024</span>
                  <BaseBadge variant="outline">مراجعة الأقران</BaseBadge>
                </div>
                <p className="text-sm text-gray-700">
                  دراسة شاملة تحلل كيفية تأثير العوامل الثقافية على سلوك المستهلكين في المملكة العربية السعودية...
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">نموذج قياس الهوية الثقافية للعلامات التجارية</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>المؤتمر الدولي لعلم الاجتماع التطبيقي</span>
                  <span>2023</span>
                  <BaseBadge variant="outline">مؤتمر</BaseBadge>
                </div>
                <p className="text-sm text-gray-700">
                  تطوير نموذج جديد لقياس مدى تطابق العلامات التجارية مع الهوية الثقافية للمجتمع...
                </p>
              </div>
            </div>
          </div>
        </BaseBox>
      )}

      {/* Insights View */}
      {activeView === 'insights' && (
        <AppDashboardGrid columns={12}>
          <BaseBox>
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                اتجاهات البحث
              </h3>
            </div>
            <div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">التراث الرقمي</span>
                  <span className="text-sm text-green-600">+45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">التسويق الثقافي</span>
                  <span className="text-sm text-green-600">+32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">الهوية البصرية</span>
                  <span className="text-sm text-blue-600">+18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">سلوك المستهلك</span>
                  <span className="text-sm text-orange-600">+12%</span>
                </div>
              </div>
            </div>
          </BaseBox>

          <BaseBox>
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                تحليل الأثر
              </h3>
            </div>
            <div>
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">2.3M</div>
                  <div className="text-sm text-gray-600">مشاهدات الأبحاث</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">847</div>
                  <div className="text-sm text-gray-600">استشهادات</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">15</div>
                  <div className="text-sm text-gray-600">جوائز بحثية</div>
                </div>
              </div>
            </div>
          </BaseBox>
        </AppDashboardGrid>
      )}
    </div>
  );
};

/**
 * @fileoverview Enhanced Project Panel for project management and templates
 * Provides project operations, templates, and data management
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FolderOpen,
  Save,
  Download,
  Upload,
  FileText,
  FileText as Template,
  Clock,
  Users,
  Star,
  Copy,
  Trash2,
  RefreshCw,
  Share2,
  Settings,
  Info,
  Calendar,
  BarChart3,
  Zap,
  BookOpen,
  Palette,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  elementsCount: number;
  collaborators: string[];
  version: number;
  size: string;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  elementsCount: number;
  featured: boolean;
  tags: string[];
}

interface EnhancedProjectPanelProps {
  projectInfo?: ProjectInfo;
  onProjectSave?: () => void;
  onProjectLoad?: (projectId: string) => void;
  onProjectExport?: () => void;
  onProjectImport?: (file: File) => void;
  onTemplateApply?: (templateId: string) => void;
  saving?: boolean;
  hasUnsavedChanges?: boolean;
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'brainstorm',
    name: 'قالب العصف الذهني',
    description: 'مناسب للجلسات الإبداعية وتوليد الأفكار الجديدة',
    category: 'تفكير',
    preview: '/templates/brainstorm.png',
    elementsCount: 8,
    featured: true,
    tags: ['أفكار', 'إبداع', 'جلسة']
  },
  {
    id: 'project-planning',
    name: 'تخطيط المشروع',
    description: 'لوحة كاملة لتخطيط وإدارة المشاريع',
    category: 'تخطيط',
    preview: '/templates/planning.png',
    elementsCount: 12,
    featured: true,
    tags: ['مشروع', 'خطة', 'إدارة']
  },
  {
    id: 'team-collaboration',
    name: 'تعاون الفريق',
    description: 'قالب للعمل الجماعي والتفاعل بين أعضاء الفريق',
    category: 'تعاون',
    preview: '/templates/collaboration.png',
    elementsCount: 6,
    featured: false,
    tags: ['فريق', 'تعاون', 'مشاركة']
  },
  {
    id: 'data-analysis',
    name: 'تحليل البيانات',
    description: 'لوحة متخصصة في عرض وتحليل البيانات',
    category: 'تحليل',
    preview: '/templates/analytics.png',
    elementsCount: 10,
    featured: true,
    tags: ['بيانات', 'تحليل', 'مخططات']
  },
  {
    id: 'ui-wireframe',
    name: 'إطار أولي للواجهة',
    description: 'قالب لتصميم الواجهات والتخطيط البصري',
    category: 'تصميم',
    preview: '/templates/wireframe.png',
    elementsCount: 15,
    featured: false,
    tags: ['تصميم', 'واجهة', 'تخطيط']
  }
];

const recentProjects = [
  {
    id: 'proj-1',
    name: 'خطة التسويق الرقمي',
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    elementsCount: 24
  },
  {
    id: 'proj-2',
    name: 'تحليل المنافسين',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    elementsCount: 18
  },
  {
    id: 'proj-3',
    name: 'جلسة العصف الذهني',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    elementsCount: 32
  }
];

export const EnhancedProjectPanel: React.FC<EnhancedProjectPanelProps> = ({
  projectInfo,
  onProjectSave,
  onProjectLoad,
  onProjectExport,
  onProjectImport,
  onTemplateApply,
  saving = false,
  hasUnsavedChanges = false
}) => {
  const [activeTab, setActiveTab] = useState('project');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState(projectInfo?.name || '');
  const [projectDescription, setProjectDescription] = useState(projectInfo?.description || '');

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onProjectImport) {
      onProjectImport(file);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = projectTemplates.find(t => t.id === templateId);
    if (template) {
      toast.success(`تم اختيار قالب ${template.name}`);
    }
  };

  const handleTemplateApply = () => {
    if (selectedTemplate && onTemplateApply) {
      onTemplateApply(selectedTemplate);
      setSelectedTemplate(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('ar', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'تفكير': return BookOpen;
      case 'تخطيط': return Target;
      case 'تعاون': return Users;
      case 'تحليل': return BarChart3;
      case 'تصميم': return Palette;
      default: return FileText;
    }
  };

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          إدارة المشروع
          {hasUnsavedChanges && (
            <BaseBadge variant="error" className="text-xs">
              غير محفوظ
            </BaseBadge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="project" className="text-xs">المشروع</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">القوالب</TabsTrigger>
            <TabsTrigger value="recent" className="text-xs">الأخيرة</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="project" className="mt-0 space-y-4">
              {/* معلومات المشروع */}
              {projectInfo && (
                <div>
                  <Label className="text-xs font-medium mb-2 block">معلومات المشروع</Label>
                  <Card className="p-3 bg-muted/30">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">العناصر:</span>
                        <BaseBadge variant="secondary" className="text-xs">
                          {projectInfo.elementsCount}
                        </BaseBadge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">الإصدار:</span>
                        <BaseBadge variant="outline" className="text-xs">
                          v{projectInfo.version}
                        </BaseBadge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">آخر تعديل:</span>
                        <span className="text-xs">{formatDate(projectInfo.updatedAt)}</span>
                      </div>
                      {projectInfo.collaborators.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">المتعاونون:</span>
                          <BaseBadge variant="secondary" className="text-xs">
                            <Users className="w-2 h-2 mr-1" />
                            {projectInfo.collaborators.length}
                          </BaseBadge>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* تحرير اسم المشروع */}
              <div>
                <Label className="text-xs font-medium mb-2 block">اسم المشروع</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="أدخل اسم المشروع..."
                  className="h-8 text-xs"
                />
              </div>

              {/* وصف المشروع */}
              <div>
                <Label className="text-xs font-medium mb-2 block">وصف المشروع</Label>
                <Textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="أضف وصفاً للمشروع..."
                  className="min-h-[80px] text-xs"
                />
              </div>

              <Separator />

              {/* عمليات المشروع */}
              <div>
                <Label className="text-xs font-medium mb-2 block">عمليات المشروع</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={onProjectSave}
                    disabled={saving}
                    className="text-xs"
                  >
                    {saving ? (
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3 mr-1" />
                    )}
                    حفظ
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onProjectExport}
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    تصدير
                  </Button>
                </div>
              </div>

              {/* استيراد مشروع */}
              <div>
                <Label className="text-xs font-medium mb-2 block">استيراد مشروع</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                    id="project-import"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById('project-import')?.click()}
                    className="w-full text-xs"
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    اختر ملف مشروع
                  </Button>
                </div>
              </div>

              <Separator />

              {/* مشاركة */}
              <div>
                <Label className="text-xs font-medium mb-2 block">مشاركة المشروع</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => toast.success('تم نسخ رابط المشاركة')}
                >
                  <Share2 className="w-3 h-3 mr-2" />
                  نسخ رابط المشاركة
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-0 space-y-4">
              {/* بحث القوالب */}
              <div>
                <Label className="text-xs font-medium mb-2 block">اختر قالباً</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  ابدأ بسرعة باستخدام أحد القوالب الجاهزة
                </p>
              </div>

              {/* قائمة القوالب */}
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {projectTemplates.map((template) => {
                    const CategoryIcon = getCategoryIcon(template.category);
                    const isSelected = selectedTemplate === template.id;

                    return (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                              <CategoryIcon className="w-4 h-4 text-primary" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-medium truncate">
                                  {template.name}
                                </h3>
                                {template.featured && (
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                )}
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {template.description}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                             <BaseBadge variant="secondary" className="text-xs">
                               {template.category}
                             </BaseBadge>
                                  <span className="text-xs text-muted-foreground">
                                    {template.elementsCount} عنصر
                                  </span>
                                </div>
                                
                                {isSelected && (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTemplateApply();
                                    }}
                                    className="text-xs h-6"
                                  >
                                    تطبيق
                                  </Button>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1 mt-2">
                                {template.tags.slice(0, 3).map((tag, index) => (
                                 <BaseBadge 
                                   key={index} 
                                   variant="outline" 
                                   className="text-xs px-1 py-0"
                                 >
                                   {tag}
                                 </BaseBadge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>

              {selectedTemplate && (
                <div className="pt-2">
                  <Button
                    onClick={handleTemplateApply}
                    className="w-full text-xs"
                  >
                    <Template className="w-3 h-3 mr-2" />
                    تطبيق القالب المحدد
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-0 space-y-4">
              {/* المشاريع الأخيرة */}
              <div>
                <Label className="text-xs font-medium mb-2 block">المشاريع الأخيرة</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  تابع العمل على مشاريعك السابقة
                </p>
              </div>

              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => onProjectLoad?.(project.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium mb-1">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(project.updatedAt)}
                            <span>•</span>
                            <span>{project.elementsCount} عنصر</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success('تم نسخ المشروع');
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success('تم حذف المشروع');
                            }}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {recentProjects.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    لا توجد مشاريع حديثة
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
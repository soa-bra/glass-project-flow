
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Target, 
  Users, 
  Calendar, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Download
} from 'lucide-react';
import { PlanningSession, CanvasElement } from './CollaborativePlanningModule';

interface ProjectConverterProps {
  canvasElements: CanvasElement[];
  session: PlanningSession;
}

interface ProjectStructure {
  name: string;
  description: string;
  objectives: string[];
  tasks: ConvertedTask[];
  milestones: ConvertedMilestone[];
  teamMembers: string[];
  budget: number;
  timeline: number;
  culturalScore: number;
}

interface ConvertedTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  deadline?: string;
  dependencies: string[];
  culturalAlignment: number;
}

interface ConvertedMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  tasks: string[];
}

export const ProjectConverter: React.FC<ProjectConverterProps> = ({
  canvasElements,
  session
}) => {
  const [isConverting, setIsConverting] = useState(false);
  const [convertedProject, setConvertedProject] = useState<ProjectStructure | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const convertToProject = async () => {
    setIsConverting(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const tasks: ConvertedTask[] = canvasElements
        .filter(el => el.type === 'idea' || el.type === 'task')
        .map((el, index) => ({
          id: el.id,
          title: el.content,
          description: `تم تحويلها من عنصر ${el.type} في الكانفاس`,
          priority: el.priority,
          assignee: el.assignee,
          deadline: el.deadline,
          dependencies: [],
          culturalAlignment: el.culturalAlignment
        }));

      const milestones: ConvertedMilestone[] = canvasElements
        .filter(el => el.type === 'milestone')
        .map(el => ({
          id: el.id,
          title: el.content,
          description: `معلم هام في المشروع`,
          dueDate: el.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tasks: tasks.slice(0, 2).map(t => t.id)
        }));

      const project: ProjectStructure = {
        name: session.title,
        description: session.description || 'مشروع تم إنشاؤه من جلسة التخطيط التشاركي',
        objectives: session.objectives,
        tasks,
        milestones,
        teamMembers: session.participants,
        budget: Math.floor(Math.random() * 100000) + 50000,
        timeline: Math.floor(Math.random() * 90) + 30,
        culturalScore: session.culturalScore
      };

      setConvertedProject(project);
      setIsConverting(false);
      setShowPreview(true);
    }, 3000);
  };

  const handleCreateProject = () => {
    if (convertedProject) {
      // Here you would integrate with your project management system
      console.log('Creating project:', convertedProject);
      // Reset state
      setConvertedProject(null);
      setShowPreview(false);
    }
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogTrigger asChild>
        <Button 
          onClick={convertToProject}
          disabled={isConverting || canvasElements.length === 0}
          className="bg-gradient-to-r from-green-600 to-blue-600"
        >
          {isConverting ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              جاري التحويل...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2" />
              تحويل لمشروع
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            معاينة المشروع المحول
          </DialogTitle>
        </DialogHeader>
        
        {convertedProject && (
          <div className="space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  نظرة عامة على المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المشروع
                    </label>
                    <Input value={convertedProject.name} readOnly />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المدة المتوقعة
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{convertedProject.timeline} يوم</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الميزانية المقدرة
                    </label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>{convertedProject.budget.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التوافق الثقافي
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-600">
                        {convertedProject.culturalScore}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وصف المشروع
                  </label>
                  <Textarea value={convertedProject.description} readOnly rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  أهداف المشروع ({convertedProject.objectives.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {convertedProject.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{objective}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  المهام المحولة ({convertedProject.tasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {convertedProject.tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getTaskPriorityColor(task.priority)}>
                          {task.priority === 'critical' ? 'حرج' :
                           task.priority === 'high' ? 'عالي' :
                           task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>التوافق الثقافي: {task.culturalAlignment}%</span>
                        {task.assignee && <span>المسؤول: {task.assignee}</span>}
                        {task.deadline && <span>الموعد: {task.deadline}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  أعضاء الفريق ({convertedProject.teamMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {convertedProject.teamMembers.map((member, index) => (
                    <Badge key={index} variant="secondary">
                      {member}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            {convertedProject.milestones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    المعالم الهامة ({convertedProject.milestones.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {convertedProject.milestones.map((milestone) => (
                      <div key={milestone.id} className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1">{milestone.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        <div className="text-xs text-gray-500">
                          تاريخ الاستحقاق: {milestone.dueDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleCreateProject} className="flex-1">
                <Rocket className="h-4 w-4 mr-2" />
                إنشاء المشروع
              </Button>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                تصدير
              </Button>
              
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

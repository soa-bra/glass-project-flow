
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Users, 
  Brain, 
  Target, 
  Zap, 
  Share2,
  Clock,
  Palette,
  Map,
  FileText,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { InteractiveCanvas } from './InteractiveCanvas';
import { CollaborationTools } from './CollaborationTools';
import { SessionManager } from './SessionManager';
import { AIAssistant } from './AIAssistant';
import { ProjectConverter } from './ProjectConverter';

export interface PlanningSession {
  id: string;
  title: string;
  description: string;
  type: 'brainstorming' | 'planning' | 'review' | 'strategy';
  status: 'active' | 'paused' | 'completed' | 'archived';
  participants: string[];
  duration: number;
  createdAt: string;
  culturalScore: number;
  objectives: string[];
}

export interface CanvasElement {
  id: string;
  type: 'idea' | 'task' | 'milestone' | 'connection' | 'note';
  position: { x: number; y: number };
  content: string;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  deadline?: string;
  tags: string[];
  culturalAlignment: number;
}

export const CollaborativePlanningModule: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<PlanningSession | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [activeTab, setActiveTab] = useState('canvas');
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);

  // Mock data for demonstration
  const mockSessions: PlanningSession[] = [
    {
      id: '1',
      title: 'استراتيجية تطوير العلامة التجارية 2024',
      description: 'جلسة تخطيط شاملة لتطوير هوية العلامة التجارية',
      type: 'strategy',
      status: 'active',
      participants: ['أحمد المطيري', 'فاطمة الزهراني', 'محمد الشريف'],
      duration: 90,
      createdAt: '2024-01-15',
      culturalScore: 92,
      objectives: ['تحديد الهوية الثقافية', 'وضع خطة التسويق', 'تحليل المنافسين']
    },
    {
      id: '2',
      title: 'تطوير خدمات جديدة',
      description: 'عصف ذهني لتطوير خدمات مبتكرة',
      type: 'brainstorming',
      status: 'completed',
      participants: ['سارة أحمد', 'علي العتيبي'],
      duration: 60,
      createdAt: '2024-01-12',
      culturalScore: 88,
      objectives: ['توليد أفكار جديدة', 'تقييم الجدوى', 'وضع خطة التنفيذ']
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startNewSession = () => {
    const newSession: PlanningSession = {
      id: Date.now().toString(),
      title: 'جلسة تخطيط جديدة',
      description: '',
      type: 'brainstorming',
      status: 'active',
      participants: [],
      duration: 0,
      createdAt: new Date().toISOString(),
      culturalScore: 0,
      objectives: []
    };
    setCurrentSession(newSession);
    setIsSessionActive(true);
    setSessionTimer(0);
  };

  const toggleSession = () => {
    setIsSessionActive(!isSessionActive);
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: isSessionActive ? 'paused' : 'active'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'brainstorming': return <Lightbulb className="h-4 w-4" />;
      case 'planning': return <Target className="h-4 w-4" />;
      case 'review': return <FileText className="h-4 w-4" />;
      case 'strategy': return <Brain className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">التخطيط التشاركي</h1>
            <p className="text-gray-600">بيئة تخطيط ذكية وتشاركية</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {currentSession && (
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-mono text-lg">{formatTime(sessionTimer)}</span>
              <Button
                size="sm"
                variant={isSessionActive ? "destructive" : "default"}
                onClick={toggleSession}
              >
                {isSessionActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          )}
          
          <Button onClick={startNewSession} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Zap className="h-4 w-4 mr-2" />
            جلسة جديدة
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {currentSession ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tools */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  أدوات التخطيط
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Lightbulb className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Map className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Palette className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <SessionManager 
              session={currentSession}
              onUpdateSession={setCurrentSession}
            />
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm min-h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(currentSession.type)}
                    <CardTitle className="text-xl">{currentSession.title}</CardTitle>
                    <Badge className={getStatusColor(currentSession.status)}>
                      {currentSession.status === 'active' ? 'نشط' : 
                       currentSession.status === 'paused' ? 'متوقف' :
                       currentSession.status === 'completed' ? 'مكتمل' : 'مؤرشف'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{currentSession.participants.length}</span>
                    </div>
                    <ProjectConverter 
                      canvasElements={canvasElements}
                      session={currentSession}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="canvas">الكانفاس</TabsTrigger>
                    <TabsTrigger value="collaboration">التعاون</TabsTrigger>
                    <TabsTrigger value="ai">مساعد الذكاء</TabsTrigger>
                    <TabsTrigger value="reports">التقارير</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="canvas" className="mt-6">
                    <InteractiveCanvas
                      elements={canvasElements}
                      onElementsChange={setCanvasElements}
                      session={currentSession}
                    />
                  </TabsContent>
                  
                  <TabsContent value="collaboration" className="mt-6">
                    <CollaborationTools
                      session={currentSession}
                      participants={currentSession.participants}
                    />
                  </TabsContent>
                  
                  <TabsContent value="ai" className="mt-6">
                    <AIAssistant
                      session={currentSession}
                      canvasElements={canvasElements}
                      onSuggestion={(suggestions) => {
                        // Handle AI suggestions
                        console.log('AI Suggestions:', suggestions);
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="reports" className="mt-6">
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">التقارير الذكية</h3>
                      <p className="text-gray-600 mb-4">
                        سيتم إنشاء تقارير ذكية تلقائية بناءً على محتوى الجلسة
                      </p>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        إنشاء تقرير
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Sessions Overview
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockSessions.map((session) => (
            <Card key={session.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(session.type)}
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status === 'active' ? 'نشط' : 
                     session.status === 'paused' ? 'متوقف' :
                     session.status === 'completed' ? 'مكتمل' : 'مؤرشف'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4">{session.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المشاركون:</span>
                    <span className="font-medium">{session.participants.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المدة:</span>
                    <span className="font-medium">{session.duration} دقيقة</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">النقاط الثقافية:</span>
                    <span className="font-medium text-purple-600">{session.culturalScore}%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setCurrentSession(session)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    فتح الجلسة
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

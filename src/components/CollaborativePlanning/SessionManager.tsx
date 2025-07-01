
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Target, 
  Clock, 
  Users, 
  Star,
  Save,
  Download,
  Share2,
  BarChart3
} from 'lucide-react';
import { PlanningSession } from './CollaborativePlanningModule';

interface SessionManagerProps {
  session: PlanningSession;
  onUpdateSession: (session: PlanningSession) => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  session,
  onUpdateSession
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSession, setEditedSession] = useState(session);

  const handleSave = () => {
    onUpdateSession(editedSession);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSession(session);
    setIsEditing(false);
  };

  const addObjective = () => {
    const newObjective = `هدف جديد ${editedSession.objectives.length + 1}`;
    setEditedSession({
      ...editedSession,
      objectives: [...editedSession.objectives, newObjective]
    });
  };

  const removeObjective = (index: number) => {
    setEditedSession({
      ...editedSession,
      objectives: editedSession.objectives.filter((_, i) => i !== index)
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...editedSession.objectives];
    newObjectives[index] = value;
    setEditedSession({
      ...editedSession,
      objectives: newObjectives
    });
  };

  return (
    <div className="space-y-4">
      {/* Session Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              معلومات الجلسة
            </CardTitle>
            <Button
              size="sm"
              variant={isEditing ? "destructive" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'إلغاء' : 'تحرير'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    عنوان الجلسة
                  </label>
                  <Input
                    value={editedSession.title}
                    onChange={(e) => setEditedSession({ ...editedSession, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    الوصف
                  </label>
                  <Textarea
                    value={editedSession.description}
                    onChange={(e) => setEditedSession({ ...editedSession, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    نوع الجلسة
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editedSession.type}
                    onChange={(e) => setEditedSession({ ...editedSession, type: e.target.value as any })}
                  >
                    <option value="brainstorming">عصف ذهني</option>
                    <option value="planning">تخطيط</option>
                    <option value="review">مراجعة</option>
                    <option value="strategy">استراتيجية</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    حفظ
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    إلغاء
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">النوع:</span>
                    <Badge variant="secondary">
                      {session.type === 'brainstorming' ? 'عصف ذهني' :
                       session.type === 'planning' ? 'تخطيط' :
                       session.type === 'review' ? 'مراجعة' : 'استراتيجية'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المدة المخططة:</span>
                    <span className="font-medium">{session.duration} دقيقة</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المشاركون:</span>
                    <span className="font-medium">{session.participants.length}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{session.description}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            أهداف الجلسة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(isEditing ? editedSession.objectives : session.objectives).map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Input
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeObjective(index)}
                    >
                      حذف
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">{objective}</span>
                  </div>
                )}
              </div>
            ))}
            
            {isEditing && (
              <Button size="sm" variant="outline" onClick={addObjective}>
                إضافة هدف
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Alignment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            التوافق الثقافي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">النقاط الثقافية</span>
              <span className="font-bold text-purple-600">{session.culturalScore}%</span>
            </div>
            
            <Progress value={session.culturalScore} className="h-2" />
            
            <div className="text-xs text-gray-500">
              يقيس مدى توافق الجلسة مع الهوية الثقافية لسوبرا
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              حفظ كقالب
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              تصدير الجلسة
            </Button>
            
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              مشاركة رابط
            </Button>
            
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              تقرير الأداء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

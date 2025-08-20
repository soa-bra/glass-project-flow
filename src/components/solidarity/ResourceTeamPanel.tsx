// Resource & Team Management Panel for Solidarity Planning
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Clock, 
  Target,
  Star,
  MapPin,
  Phone,
  Mail,
  Plus,
  X
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  skills: string[];
  availability: number; // percentage
  location: string;
  contact: {
    phone: string;
    email: string;
  };
}

interface Resource {
  id: string;
  type: 'human' | 'financial' | 'material';
  name: string;
  allocated: number;
  total: number;
  unit: string;
  status: 'available' | 'allocated' | 'exhausted';
}

interface ResourceTeamPanelProps {
  isOpen: boolean;
  onClose: () => void;
  'data-test-id'?: string;
}

const ResourceTeamPanel: React.FC<ResourceTeamPanelProps> = ({
  isOpen,
  onClose,
  'data-test-id': testId
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'resources'>('team');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for team members
  const [teamMembers] = useState<Team[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      role: 'منسق المشروع',
      skills: ['إدارة المشاريع', 'التواصل', 'القيادة'],
      availability: 85,
      location: 'الرياض',
      contact: { phone: '+966501234567', email: 'ahmed@example.com' }
    },
    {
      id: '2',
      name: 'فاطمة علي',
      role: 'أخصائية اجتماعية',
      skills: ['العمل الاجتماعي', 'التطوع', 'التدريب'],
      availability: 70,
      location: 'جدة',
      contact: { phone: '+966507654321', email: 'fatima@example.com' }
    },
    {
      id: '3',
      name: 'عبدالله سعد',
      role: 'محاسب المشروع',
      skills: ['المحاسبة', 'التخطيط المالي', 'التحليل'],
      availability: 90,
      location: 'الدمام',
      contact: { phone: '+966509876543', email: 'abdullah@example.com' }
    }
  ]);

  // Mock data for resources
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      type: 'financial',
      name: 'ميزانية المشروع',
      allocated: 150000,
      total: 200000,
      unit: 'ريال',
      status: 'available'
    },
    {
      id: '2', 
      type: 'human',
      name: 'ساعات العمل',
      allocated: 320,
      total: 500,
      unit: 'ساعة',
      status: 'allocated'
    },
    {
      id: '3',
      type: 'material',
      name: 'مواد التوزيع',
      allocated: 800,
      total: 1000,
      unit: 'قطعة',
      status: 'available'
    }
  ]);

  const filteredTeam = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'financial': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'human': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'material': return <Target className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: Resource['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800">متاح</Badge>;
      case 'allocated':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">مخصص</Badge>;
      case 'exhausted':
        return <Badge variant="destructive">مستنفد</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="w-80 h-full flex flex-col" data-test-id={testId}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          إدارة الموارد والفرق
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="mr-auto w-8 h-8 p-0"
            data-test-id="btn-close-panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
        
        <div className="flex gap-1 mt-2">
          <Button
            variant={activeTab === 'team' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('team')}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-2" />
            الفريق
          </Button>
          <Button
            variant={activeTab === 'resources' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('resources')}
            className="flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            الموارد
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {/* Search */}
        <div className="px-4 pb-3">
          <Input
            placeholder={activeTab === 'team' ? 'البحث عن عضو فريق...' : 'البحث عن مورد...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm"
          />
        </div>

        <ScrollArea className="h-full px-4">
          {activeTab === 'team' ? (
            <div className="space-y-4 pb-4">
              {/* Add Team Member Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2"
                data-test-id="btn-add-team-member"
              >
                <UserPlus className="w-4 h-4" />
                إضافة عضو جديد
              </Button>

              {/* Team Members List */}
              {filteredTeam.map((member) => (
                <Card key={member.id} className="p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{member.name}</h4>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.availability}% متاح
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {member.location}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{member.skills.length - 2}
                        </Badge>
                      )}
                    </div>

                    <Progress value={member.availability} className="h-1" />

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Phone className="w-3 h-3 mr-1" />
                        اتصال
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Mail className="w-3 h-3 mr-1" />
                        بريد
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {/* Add Resource Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2"
                data-test-id="btn-add-resource"
              >
                <Plus className="w-4 h-4" />
                إضافة مورد جديد
              </Button>

              {/* Resources List */}
              {resources.map((resource) => (
                <Card key={resource.id} className="p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {getResourceIcon(resource.type)}
                      <div>
                        <h4 className="font-medium text-sm">{resource.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {resource.allocated.toLocaleString()} / {resource.total.toLocaleString()} {resource.unit}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(resource.status)}
                  </div>

                  <Progress 
                    value={(resource.allocated / resource.total) * 100} 
                    className="h-2" 
                  />

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      متبقي: {(resource.total - resource.allocated).toLocaleString()} {resource.unit}
                    </span>
                    <span className="font-medium">
                      {Math.round((resource.allocated / resource.total) * 100)}%
                    </span>
                  </div>
                </Card>
              ))}

              <Separator />

              {/* Resource Summary */}
              <Card className="p-3 bg-muted/50">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  ملخص الموارد
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>إجمالي الميزانية:</span>
                    <span className="font-medium">200,000 ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المستخدم:</span>
                    <span className="text-green-600 font-medium">150,000 ريال (75%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المتبقي:</span>
                    <span className="text-blue-600 font-medium">50,000 ريال (25%)</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ResourceTeamPanel;
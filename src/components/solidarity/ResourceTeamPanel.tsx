import React, { useState } from 'react';
import { Users, DollarSign, Clock, ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  availability: 'متاح' | 'مشغول' | 'غير متاح';
  skills: string[];
}

interface Resource {
  id: string;
  name: string;
  type: 'مالي' | 'بشري' | 'مادي';
  amount: number;
  unit: string;
  status: 'متاح' | 'محجوز' | 'مستخدم';
}

interface ResourceTeamPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

const ResourceTeamPanel: React.FC<ResourceTeamPanelProps> = ({ isVisible, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'team' | 'resources'>('team');
  
  // Mock data - في التطبيق الحقيقي، ستأتي من API
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      role: 'مدير المشروع',
      availability: 'متاح',
      skills: ['إدارة', 'تخطيط', 'قيادة']
    },
    {
      id: '2',
      name: 'فاطمة أحمد',
      role: 'منسق المجتمع',
      availability: 'مشغول',
      skills: ['تواصل', 'تنظيم', 'تطوع']
    }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      name: 'ميزانية المشروع',
      type: 'مالي',
      amount: 50000,
      unit: 'ر.س',
      status: 'متاح'
    },
    {
      id: '2',
      name: 'قاعة المؤتمرات',
      type: 'مادي',
      amount: 1,
      unit: 'قاعة',
      status: 'محجوز'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متاح': return 'text-accent-green bg-accent-green/10';
      case 'مشغول':
      case 'محجوز': return 'text-accent-yellow bg-accent-yellow/10';
      case 'غير متاح':
      case 'مستخدم': return 'text-accent-red bg-accent-red/10';
      default: return 'text-ink/60 bg-ink/10';
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 hover:bg-panel/30 transition-all"
        >
          <div className="flex items-center gap-2">
            <Users size={16} className="text-ink/70" />
            <span className="text-sm font-medium text-ink">الموارد والفرق</span>
          </div>
          {isVisible ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Panel Content */}
        {isVisible && (
          <div className="border-t border-border">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('team')}
                className={`flex-1 px-4 py-2 text-xs font-medium transition-all ${
                  activeTab === 'team'
                    ? 'text-accent-blue bg-accent-blue/10 border-b-2 border-accent-blue'
                    : 'text-ink/60 hover:text-ink/80'
                }`}
              >
                الفريق
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 px-4 py-2 text-xs font-medium transition-all ${
                  activeTab === 'resources'
                    ? 'text-accent-blue bg-accent-blue/10 border-b-2 border-accent-blue'
                    : 'text-ink/60 hover:text-ink/80'
                }`}
              >
                الموارد
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-w-xs">
              {activeTab === 'team' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink">أعضاء الفريق</span>
                    <button className="text-accent-green hover:text-accent-green/80">
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-3 border border-border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-ink">{member.name}</p>
                          <p className="text-xs text-ink/70">{member.role}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(member.availability)}`}>
                          {member.availability}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-0.5 bg-panel text-xs text-ink/70 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink">الموارد المتاحة</span>
                    <button className="text-accent-green hover:text-accent-green/80">
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {resources.map((resource) => (
                    <div key={resource.id} className="p-3 border border-border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-ink">{resource.name}</p>
                          <p className="text-xs text-ink/70">{resource.type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(resource.status)}`}>
                          {resource.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign size={12} className="text-ink/50" />
                        <span className="text-xs font-medium text-ink">
                          {resource.amount.toLocaleString()} {resource.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceTeamPanel;
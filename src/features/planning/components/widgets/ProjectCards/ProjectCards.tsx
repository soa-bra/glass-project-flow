import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface ProjectCard {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  budget: number;
  spent_amount: number;
  completion_percentage: number;
  start_date: string;
  end_date?: string;
  team_size: number;
  priority: 'low' | 'medium' | 'high';
  client_name?: string;
  updated_at: string;
}

interface ProjectCardsProps {
  element: any;
  isSelected: boolean;
  onUpdate: (updates: any) => void;
}

export const ProjectCards: React.FC<ProjectCardsProps> = ({ 
  element, 
  isSelected, 
  onUpdate 
}) => {
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // Fetch project cards data
      const { data: projectsData, error: projectsError } = await supabase.rpc('get_widget_data', {
        widget_type: 'project_cards' as any,
        limit_count: 6 as any
      }) as { data: any[] | null; error: any };

      if (projectsError) throw projectsError;

      // Fetch project stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_widget_stats', {
        widget_type: 'project_cards' as any
      }) as { data: any; error: any };

      if (statsError) throw statsError;

      setProjects(projectsData?.map((item: any) => item.data) || []);
      setStats(statsData || {});
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('فشل في تحميل بيانات المشاريع');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent-green';
      case 'completed': return 'bg-accent-blue';
      case 'on_hold': return 'bg-accent-yellow';
      case 'planning': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'on_hold': return 'معلق';
      case 'planning': return 'تخطيط';
      default: return 'غير محدد';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-accent-red';
      case 'medium': return 'text-accent-yellow';
      case 'low': return 'text-accent-green';
      default: return 'text-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`w-full h-full bg-white rounded-2xl border-2 border-dashed ${isSelected ? 'border-black' : 'border-gray-300'} p-6`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full h-full bg-white rounded-2xl border-2 border-dashed ${isSelected ? 'border-black' : 'border-red-300'} p-6`}>
        <div className="text-center text-red-500">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchProjectData}
            className="mt-2 px-4 py-2 bg-accent-red text-white rounded-lg text-sm hover:bg-accent-red/80 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-white rounded-2xl border-2 ${isSelected ? 'border-black' : 'border-gray-200'} shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-blue to-accent-green p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">بطاقات المشاريع</h3>
          <div className="text-xs opacity-90">
            {projects.length} مشروع
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-lg font-bold">{stats.active_projects || 0}</div>
            <div className="text-xs opacity-90">نشط</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-lg font-bold">{Math.round(stats.avg_completion || 0)}%</div>
            <div className="text-xs opacity-90">متوسط الإنجاز</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="text-lg font-bold">{formatCurrency(stats.total_budget || 0)}</div>
            <div className="text-xs opacity-90">إجمالي الميزانية</div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-3">
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">لا توجد مشاريع</p>
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-black text-sm mb-1">
                    {project.name}
                  </h4>
                  {project.client_name && (
                    <p className="text-xs text-gray-600">
                      العميل: {project.client_name}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></span>
                  <span className="text-xs text-gray-600">
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>التقدم</span>
                  <span>{Math.round(project.completion_percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.completion_percentage}%` }}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-600">الميزانية:</span>
                  <div className="font-bold text-black">
                    {formatCurrency(project.budget)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">المُنفق:</span>
                  <div className="font-bold text-accent-red">
                    {formatCurrency(project.spent_amount)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">الفريق:</span>
                  <div className="font-bold text-black">
                    {project.team_size} عضو
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">الأولوية:</span>
                  <div className={`font-bold ${getPriorityColor(project.priority)}`}>
                    {project.priority === 'high' && 'عالية'}
                    {project.priority === 'medium' && 'متوسطة'}
                    {project.priority === 'low' && 'منخفضة'}
                  </div>
                </div>
              </div>

              {/* Dates */}
              {(project.start_date || project.end_date) && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                  {project.start_date && (
                    <span>بدء: {formatDate(project.start_date)}</span>
                  )}
                  {project.start_date && project.end_date && (
                    <span className="mx-2">•</span>
                  )}
                  {project.end_date && (
                    <span>انتهاء: {formatDate(project.end_date)}</span>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
        <button 
          onClick={fetchProjectData}
          className="text-xs text-accent-blue hover:text-accent-blue/80 transition-colors"
        >
          🔄 تحديث البيانات
        </button>
      </div>
    </div>
  );
};
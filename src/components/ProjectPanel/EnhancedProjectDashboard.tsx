
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from './types';
import { DashboardBudgetCard } from './DashboardBudgetCard';
import { DashboardProgressCard } from './DashboardProgressCard';
import { DashboardTasksCard } from './DashboardTasksCard';
import { DashboardCalendarCard } from './DashboardCalendarCard';
import { DashboardQuickActions } from './DashboardQuickActions';
import { StageMeter } from './StageMeter';

interface EnhancedProjectDashboardProps {
  projectData: ProjectData;
  loading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

export const EnhancedProjectDashboard: React.FC<EnhancedProjectDashboardProps> = ({
  projectData,
  loading
}) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {/* Stage Meter Skeleton */}
          <div className="bg-white/20 backdrop-blur-[10px] rounded-[20px] p-4 animate-pulse border border-white/30">
            <div className="h-4 bg-white/30 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-white/30 rounded"></div>
          </div>
          
          {/* Grid Skeleton */}
          <div 
            className="grid gap-6" 
            style={{ 
              gridTemplate: 'repeat(2, 1fr) / 35% 5% 60%',
              minHeight: '500px'
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/20 backdrop-blur-[10px] rounded-[20px] animate-pulse border border-white/30">
                <div className="p-6">
                  <div className="h-4 bg-white/30 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-white/30 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-white/30 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // حساب تقدم المشروع
  const completedTasks = projectData.tasks.filter(t => t.status === 'completed').length;
  const progressPercentage = projectData.tasks.length > 0 
    ? (completedTasks / projectData.tasks.length) * 100 
    : 0;

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stage Progress Meter */}
      <motion.div variants={cardVariants}>
        <StageMeter progress={progressPercentage} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={cardVariants}>
        <DashboardQuickActions />
      </motion.div>

      {/* Main Grid */}
      <div 
        className="grid gap-6" 
        style={{ 
          gridTemplate: 'repeat(2, 1fr) / 35% 5% 60%',
          minHeight: '500px'
        }}
      >
        {/* Budget Card - Left Column, Row 1 */}
        <motion.div 
          variants={cardVariants}
          style={{ gridArea: '1 / 1 / 2 / 2' }}
        >
          <DashboardBudgetCard
            totalBudget={projectData.budget.total}
            spentBudget={projectData.budget.spent}
          />
        </motion.div>

        {/* Calendar Card - Left Column, Row 2 */}
        <motion.div 
          variants={cardVariants}
          style={{ gridArea: '2 / 1 / 3 / 2' }}
        >
          <DashboardCalendarCard />
        </motion.div>

        {/* Progress Card - Middle Column, Row 1 */}
        <motion.div 
          variants={cardVariants}
          style={{ gridArea: '1 / 2 / 2 / 3' }}
        >
          <DashboardProgressCard
            completedTasks={completedTasks}
            totalTasks={projectData.tasks.length}
          />
        </motion.div>

        {/* Tasks Card - Right Column, Both Rows */}
        <motion.div 
          variants={cardVariants}
          style={{ gridArea: '1 / 3 / 3 / 4' }}
        >
          <DashboardTasksCard tasks={projectData.tasks} />
        </motion.div>
      </div>
    </motion.div>
  );
};

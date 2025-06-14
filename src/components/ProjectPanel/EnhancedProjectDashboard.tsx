
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from './types';
import { PhaseProgress } from './PhaseProgress';
import { EnhancedQuickActionsGrid } from './EnhancedQuickActionsGrid';
import { OvalBudgetCard } from './OvalBudgetCard';
import { DashboardCalendarCard } from './DashboardCalendarCard';
import { DashboardTasksCard } from './DashboardTasksCard';
import { DashboardProgressCard } from './DashboardProgressCard';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface EnhancedProjectDashboardProps {
  projectData: ProjectData;
  loading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
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
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
    }
  }
};

export const EnhancedProjectDashboard: React.FC<EnhancedProjectDashboardProps> = ({
  projectData,
  loading
}) => {
  const config = useLovableConfig();

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {/* Phase Progress Skeleton */}
          <div 
            className="rounded-[20px] p-6 animate-pulse"
            style={{
              background: config.theme.glass.bg,
              backdropFilter: config.theme.glass.backdrop,
              border: config.theme.glass.border
            }}
          >
            <div className="h-6 bg-white/30 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/30 rounded"></div>
          </div>
          
          {/* Quick Actions Skeleton */}
          <div 
            className="rounded-[20px] p-4 animate-pulse"
            style={{
              background: config.theme.glass.bg,
              backdropFilter: config.theme.glass.backdrop,
              border: config.theme.glass.border
            }}
          >
            <div className="grid grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white/30 rounded-[15px]"></div>
              ))}
            </div>
          </div>

          {/* Grid Skeleton */}
          <div 
            className="grid gap-6" 
            style={{ 
              gridTemplateColumns: '35% 5% 60%',
              gridTemplateRows: 'repeat(2, 1fr)',
              minHeight: '500px'
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="rounded-[20px] animate-pulse"
                style={{
                  background: config.theme.glass.bg,
                  backdropFilter: config.theme.glass.backdrop,
                  border: config.theme.glass.border
                }}
              >
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

  const completedTasks = projectData.tasks.filter(t => t.status === 'completed').length;

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Phase Progress */}
      <motion.div variants={cardVariants}>
        <PhaseProgress 
          completedTasks={completedTasks}
          totalTasks={projectData.tasks.length}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={cardVariants}>
        <EnhancedQuickActionsGrid />
      </motion.div>

      {/* Main Grid - Following the specified layout */}
      <div 
        className="grid gap-6" 
        style={{ 
          gridTemplateColumns: '35% 5% 60%',
          gridTemplateRows: 'repeat(2, 1fr)',
          minHeight: '500px'
        }}
      >
        {/* Budget Card - Area: budget (row 1, col 1) */}
        <motion.div 
          variants={cardVariants}
          style={{ gridArea: '1 / 1 / 2 / 2' }}
        >
          <OvalBudgetCard
            total={projectData.budget.total}
            spent={projectData.budget.spent}
            remaining={projectData.budget.remaining}
          />
        </motion.div>

        {/* Calendar Card - Area: calendar (row 2, col 1) */}
        <motion.div 
          variants={cardVariants}
          style={{ gridArea: '2 / 1 / 3 / 2' }}
        >
          <DashboardCalendarCard />
        </motion.div>

        {/* Progress Card - Area: gap (row 1, col 2) */}
        <motion.div 
          variants={cardVariants}
          style={{ gridArea: '1 / 2 / 2 / 3' }}
        >
          <DashboardProgressCard
            completedTasks={completedTasks}
            totalTasks={projectData.tasks.length}
          />
        </motion.div>

        {/* Tasks Card - Area: tasks (both rows, col 3) */}
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

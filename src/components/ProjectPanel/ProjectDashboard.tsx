
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from './types';
import { DashboardBudgetCard } from './DashboardBudgetCard';
import { DashboardProgressCard } from './DashboardProgressCard';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardTasksCard } from './DashboardTasksCard';
import { DashboardCalendarCard } from './DashboardCalendarCard';
import { DashboardTeamCard } from './DashboardTeamCard';
import { DashboardNotificationsCard } from './DashboardNotificationsCard';
import { DashboardFilesCard } from './DashboardFilesCard';
import { DashboardAnalyticsCard } from './DashboardAnalyticsCard';

interface ProjectDashboardProps {
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

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projectData,
  loading
}) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6" style={{ gridTemplateRows: 'repeat(3, 1fr)', height: 'calc(100vh - 200px)' }}>
          {[...Array(9)].map((_, i) => (
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
    );
  }

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div 
        className="grid grid-cols-3 gap-6" 
        style={{ 
          gridTemplateRows: 'repeat(3, 1fr)', 
          height: 'calc(100vh - 200px)',
          minHeight: '600px'
        }}
      >
        {/* الصف الأول */}
        <motion.div variants={cardVariants}>
          <DashboardBudgetCard
            totalBudget={projectData.budget.total}
            spentBudget={projectData.budget.spent}
          />
        </motion.div>

        <motion.div variants={cardVariants}>
          <DashboardProgressCard
            completedTasks={projectData.tasks.filter(t => t.status === 'completed').length}
            totalTasks={projectData.tasks.length}
          />
        </motion.div>

        <motion.div variants={cardVariants}>
          <DashboardQuickActions />
        </motion.div>

        {/* الصف الثاني */}
        <motion.div variants={cardVariants}>
          <DashboardTasksCard tasks={projectData.tasks} />
        </motion.div>

        <motion.div variants={cardVariants}>
          <DashboardCalendarCard />
        </motion.div>

        <motion.div variants={cardVariants}>
          <DashboardTeamCard />
        </motion.div>

        {/* الصف الثالث */}
        <motion.div variants={cardVariants}>
          <DashboardNotificationsCard />
        </motion.div>

        <motion.div variants={cardVariants}>
          <DashboardFilesCard />
        </motion.div>

        <motion.div variants={cardVariants}>
          <DashboardAnalyticsCard />
        </motion.div>
      </div>
    </motion.div>
  );
};

import React from 'react';

interface ResourceUtilization {
  employeeId: string;
  name: string;
  department: string;
  utilization: number;
  capacity: number;
  projects: string[];
  skills: string[];
  performance: number;
}

interface ResourceHeatMapProps {
  resourceData: ResourceUtilization[];
}

export const ResourceHeatMap: React.FC<ResourceHeatMapProps> = ({ resourceData }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};

interface SkillGap {
  skill: string;
  current: number;
  required: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

interface SkillGapRadarProps {
  skillGaps: SkillGap[];
}

export const SkillGapRadar: React.FC<SkillGapRadarProps> = ({ skillGaps }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};

interface WorkloadData {
  department: string;
  current: number;
  capacity: number;
  efficiency: number;
}

interface WorkloadBalanceProps {
  workloadData: WorkloadData[];
}

export const WorkloadBalance: React.FC<WorkloadBalanceProps> = ({ workloadData }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};
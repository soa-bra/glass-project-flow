import React from 'react';

interface AIReportSuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  dataPoints: string[];
  estimatedTime: string;
}

interface AIReportGeneratorProps {
  suggestions: AIReportSuggestion[];
}

export const AIReportGenerator: React.FC<AIReportGeneratorProps> = ({ suggestions }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};
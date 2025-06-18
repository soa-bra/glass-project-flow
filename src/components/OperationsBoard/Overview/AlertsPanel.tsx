import React, { useState } from 'react';
import { Plus, MoreHorizontal, Star } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';
interface Alert {
  id: number;
  title: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
}
interface AlertsPanelProps {
  alerts: Alert[];
}
export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f1b5b9';
      case 'medium':
        return '#fbe2aa';
      case 'low':
        return '#bdeed3';
      default:
        return '#d9d2fd';
    }
  };
  return;
};
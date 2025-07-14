import React from 'react';
import { Check } from 'lucide-react';

interface TaskCardFooterSimpleProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  isSelected?: boolean;
}

const TaskCardFooterSimple = ({
  status,
  statusColor,
  date,
  assignee,
  members,
  isSelected = false
}: TaskCardFooterSimpleProps) => {
  const pillStyle = {
    backgroundColor: '#F7FFFF',
    borderRadius: '15px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic',
    height: '20px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '6px',
      flexWrap: 'wrap',
      marginTop: '8px'
    }}>
      <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColor
        }}></div>
        {status}
      </div>

      <div style={pillStyle}>{date}</div>
      <div style={pillStyle}>{assignee}</div>
      <div style={pillStyle}>{members}</div>
    </div>
  );
};

export default TaskCardFooterSimple;
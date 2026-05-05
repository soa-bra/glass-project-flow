import React from 'react';

interface TaskCardFooterSimpleProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  isSelected?: boolean;
}

const pillStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #DADCE0',
  borderRadius: '9999px',
  padding: '4px 12px',
  fontSize: '12px',
  fontFamily: 'IBM Plex Sans Arabic',
  color: '#0B0F12',
  whiteSpace: 'nowrap',
};

const TaskCardFooterSimple: React.FC<TaskCardFooterSimpleProps> = ({
  status,
  statusColor,
  date,
  assignee,
  members,
}) => {
  return (
    <div
      className="flex items-center justify-between gap-2 mt-3 px-1"
      style={{ direction: 'rtl' }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span style={{ ...pillStyle, backgroundColor: statusColor, color: '#FFFFFF' }}>
          {status}
        </span>
        <span style={pillStyle}>{date}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span style={pillStyle}>{assignee}</span>
        <span style={pillStyle}>{members}</span>
      </div>
    </div>
  );
};

export default TaskCardFooterSimple;

import React from 'react';

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
  void isSelected;
  const pillStyle = {
    backgroundColor: '#F7FFFF',
    borderRadius: '15px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic',
    height: '20px',
    minWidth: 0
  };
  const pillTextClassName = "block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap";
  const basePillClassName = "min-w-0 flex items-center w-full";

  return (
    <div className="mt-2 grid w-full grid-cols-2 items-stretch gap-1.5 lg:grid-cols-[minmax(140px,1.35fr)_minmax(110px,1fr)_minmax(120px,1fr)_minmax(90px,0.9fr)]">
      <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        maxWidth: '240px'
      }} className={basePillClassName} title={status}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColor,
          flexShrink: 0
        }}></div>
        <span className={pillTextClassName} dir="auto">{status}</span>
      </div>

      <div style={{ ...pillStyle, maxWidth: '180px' }} className={basePillClassName} title={date}>
        <span className={pillTextClassName} dir="auto">{date}</span>
      </div>
      <div style={{ ...pillStyle, maxWidth: '210px' }} className={basePillClassName} title={assignee}>
        <span className={pillTextClassName} dir="auto">{assignee}</span>
      </div>
      <div style={{ ...pillStyle, maxWidth: '150px' }} className={basePillClassName} title={members}>
        <span className={pillTextClassName} dir="auto">{members}</span>
      </div>
    </div>
  );
};

export default TaskCardFooterSimple;

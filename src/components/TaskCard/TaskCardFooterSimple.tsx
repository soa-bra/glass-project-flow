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
  members
}: TaskCardFooterSimpleProps) => {

  const pillStyle = {
    backgroundColor: '#F7FFFF',
    borderRadius: tokens.pillRadiusPx,
    padding: `${tokens.pillPaddingBlockPx} ${tokens.pillPaddingInlinePx}`,
    fontSize: tokens.pillFontSizePx,
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic',

  };
  const pillTextClassName = "block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap";
  const basePillClassName = "min-w-0 flex items-center w-full";

  return (

      <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        maxWidth: '240px'
      }} className={basePillClassName} title={status}>
        <div style={{
          width: tokens.statusDotSizePx,
          height: tokens.statusDotSizePx,
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

import React from 'react';
import { taskCardSingleLineTextStyle, taskCardSizeTokens } from './taskCardSizeTokens';

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
    borderRadius: taskCardSizeTokens.pillRadius,
    padding: `${taskCardSizeTokens.pillPaddingBlock} ${taskCardSizeTokens.pillPaddingInline}`,
    fontSize: taskCardSizeTokens.pillFontSize,
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic',
    height: taskCardSizeTokens.pillHeight,
    minWidth: 0,
    maxWidth: '100%',
    ...taskCardSingleLineTextStyle
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: taskCardSizeTokens.footerGap,
      flexWrap: 'wrap',
      marginTop: taskCardSizeTokens.footerMarginTop,
      width: '100%',
      overflow: 'hidden'
    }}>
      <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{
          width: taskCardSizeTokens.statusDotSize,
          height: taskCardSizeTokens.statusDotSize,
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

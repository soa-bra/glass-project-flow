import React from 'react';
import { taskCardSingleLineTextStyle, useTaskCardSizeTokens } from './taskCardSizeTokens';

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
  const tokens = useTaskCardSizeTokens();

  const pillStyle = {
    backgroundColor: '#F7FFFF',
    borderRadius: tokens.pillRadiusPx,
    padding: `${tokens.pillPaddingBlockPx} ${tokens.pillPaddingInlinePx}`,
    fontSize: tokens.pillFontSizePx,
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic',
    height: tokens.pillHeightPx,
    minWidth: 0,
    maxWidth: '100%',
    ...taskCardSingleLineTextStyle
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: tokens.footerGapPx,
      flexWrap: 'wrap',
      marginTop: tokens.footerMarginTopPx,
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
          width: tokens.statusDotSizePx,
          height: tokens.statusDotSizePx,
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

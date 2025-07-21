import React from 'react';
interface SelectionPanelInfoProps {
  selectedElementsCount: number;
}
export const SelectionPanelInfo: React.FC<SelectionPanelInfoProps> = ({
  selectedElementsCount
}) => {
  const hasSelection = selectedElementsCount > 0;
  return;
};
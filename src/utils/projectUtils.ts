
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return '#00B894';
    case 'warning':
      return '#FDCB6E';
    case 'error':
      return '#E84393';
    case 'neutral':
      return '#6C5CE7';
    default:
      return '#74B9FF';
  }
};

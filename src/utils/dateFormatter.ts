
export const formatDateToMonthDay = (dateString: string): string => {
  const date = new Date(dateString);
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${month} ${day}`;
};

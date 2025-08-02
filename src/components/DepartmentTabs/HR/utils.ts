export const getHRStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'active':
    case 'completed':
    case 'present':
    case 'passed':
    case 'excellent':
    case 'good':
      return 'bg-[#bdeed3] text-black';
    case 'pending':
    case 'in_progress':
    case 'late':
    case 'warning':
    case 'average':
      return 'bg-[#fbe2aa] text-black';
    case 'rejected':
    case 'inactive':
    case 'failed':
    case 'absent':
    case 'poor':
    case 'critical':
      return 'bg-[#f1b5b9] text-black';
    case 'review':
    case 'scheduled':
    case 'info':
    case 'draft':
    case 'new':
      return 'bg-[#a4e2f6] text-black';
    case 'important':
    case 'priority':
      return 'bg-[#d9d2fd] text-black';
    default:
      return 'bg-[#d9d2fd] text-black';
  }
};

export const getHRStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'approved': 'معتمد',
    'pending': 'في الانتظار',
    'review': 'قيد المراجعة',
    'rejected': 'مرفوض',
    'active': 'نشط',
    'inactive': 'غير نشط',
    'completed': 'مكتمل',
    'in_progress': 'قيد التنفيذ',
    'present': 'حاضر',
    'absent': 'غائب',
    'late': 'متأخر',
    'scheduled': 'مجدول',
    'passed': 'نجح',
    'failed': 'فشل',
    'excellent': 'ممتاز',
    'good': 'جيد',
    'average': 'متوسط',
    'poor': 'ضعيف',
    'new': 'جديد',
    'draft': 'مسودة'
  };
  return statusMap[status.toLowerCase()] || status;
};

export const getHRBadgeProps = (status: string) => {
  const colorClass = getHRStatusColor(status);
  const text = getHRStatusText(status);
  return { className: colorClass, children: text };
};
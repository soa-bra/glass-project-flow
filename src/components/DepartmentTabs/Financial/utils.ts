
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'review':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'approved': 'معتمد',
    'pending': 'في الانتظار',
    'review': 'قيد المراجعة',
    'rejected': 'مرفوض',
    'paid': 'مدفوع',
    'overdue': 'متأخر',
    'draft': 'مسودة',
    'completed': 'مكتمل'
  };
  return statusMap[status] || status;
};

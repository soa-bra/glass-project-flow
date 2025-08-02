
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
    case 'paid':
      return 'bg-[#bdeed3] text-black';
    case 'pending':
      return 'bg-[#fbe2aa] text-black';
    case 'review':
    case 'draft':
      return 'bg-[#a4e2f6] text-black';
    case 'rejected':
    case 'overdue':
      return 'bg-[#f1b5b9] text-black';
    case 'completed':
      return 'bg-[#bdeed3] text-black';
    default:
      return 'bg-[#d9d2fd] text-black';
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

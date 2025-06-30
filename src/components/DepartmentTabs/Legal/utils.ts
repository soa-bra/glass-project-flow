
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'signed':
    case 'active':
    case 'compliant':
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'under_review':
    case 'pending_review':
      return 'bg-yellow-100 text-yellow-800';
    case 'expired':
    case 'non_compliant':
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'draft':
    case 'identified':
      return 'bg-gray-100 text-gray-800';
    case 'escalated':
    case 'critical':
      return 'bg-red-200 text-red-900';
    case 'suspended':
    case 'terminated':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'signed': 'موقع',
    'pending': 'في الانتظار',
    'expired': 'منتهي',
    'draft': 'مسودة',
    'active': 'نشط',
    'resolved': 'محلول',
    'escalated': 'مصعد',
    'compliant': 'متوافق',
    'non_compliant': 'غير متوافق',
    'pending_review': 'قيد المراجعة',
    'under_review': 'قيد المراجعة',
    'action_required': 'يتطلب إجراء',
    'critical': 'حرج',
    'high': 'مرتفع',
    'medium': 'متوسط',
    'low': 'منخفض',
    'identified': 'محدد',
    'mitigated': 'مخفف',
    'accepted': 'مقبول',
    'suspended': 'معلق',
    'terminated': 'منتهي',
    'urgent': 'عاجل',
    'acknowledged': 'مقر',
    'business': 'تجاري',
    'professional': 'مهني',
    'software': 'برمجي',
    'intellectual_property': 'ملكية فكرية'
  };
  return statusMap[status] || status;
};

export const getRiskColor = (level: string): string => {
  switch (level) {
    case 'critical':
      return 'bg-red-500';
    case 'high':
      return 'bg-red-400';
    case 'medium':
      return 'bg-yellow-400';
    case 'low':
      return 'bg-green-400';
    default:
      return 'bg-gray-400';
  }
};

export const calculateRiskScore = (probability: number, impact: number): number => {
  return probability * impact;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getDaysUntil = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

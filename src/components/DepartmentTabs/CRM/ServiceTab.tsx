
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Star,
  TrendingUp,
  Users,
  Timer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockCustomerService } from './data';

export const ServiceTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'مرتفع';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'مفتوح';
      case 'in-progress': return 'قيد المعالجة';
      case 'resolved': return 'محلول';
      case 'closed': return 'مغلق';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <Timer className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTickets = mockCustomerService.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Mock data for charts
  const responseTimeData = [
    { month: 'يناير', avgTime: 2.1, target: 2.0 },
    { month: 'فبراير', avgTime: 1.9, target: 2.0 },
    { month: 'مارس', avgTime: 2.3, target: 2.0 },
    { month: 'أبريل', avgTime: 1.8, target: 2.0 },
    { month: 'مايو', avgTime: 1.7, target: 2.0 },
    { month: 'يونيو', avgTime: 1.6, target: 2.0 }
  ];

  const ticketCategoryData = [
    { category: 'تقني', count: 45 },
    { category: 'فوترة', count: 23 },
    { category: 'عام', count: 18 },
    { category: 'طلبات تغيير', count: 15 },
    { category: 'تدريب', count: 8 }
  ];

  const satisfactionData = [
    { month: 'يناير', rating: 4.2 },
    { month: 'فبراير', rating: 4.3 },
    { month: 'مارس', rating: 4.1 },
    { month: 'أبريل', rating: 4.5 },
    { month: 'مايو', rating: 4.4 },
    { month: 'يونيو', rating: 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في التذاكر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الأولويات</option>
            <option value="urgent">عاجل</option>
            <option value="high">مرتفع</option>
            <option value="medium">متوسط</option>
            <option value="low">منخفض</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="open">مفتوح</option>
            <option value="in-progress">قيد المعالجة</option>
            <option value="resolved">محلول</option>
            <option value="closed">مغلق</option>
          </select>
        </div>
        <Button 
          onClick={() => setShowNewTicketForm(!showNewTicketForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-arabic"
        >
          <Plus className="ml-2 h-4 w-4" />
          تذكرة جديدة
        </Button>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4">إنشاء تذكرة جديدة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold font-arabic mb-2">العميل</label>
              <Input placeholder="اسم العميل أو الشركة" />
            </div>
            <div>
              <label className="block text-sm font-semibold font-arabic mb-2">الأولوية</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
                <option value="low">منخفض</option>
                <option value="medium">متوسط</option>
                <option value="high">مرتفع</option>
                <option value="urgent">عاجل</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold font-arabic mb-2">الموضوع</label>
            <Input placeholder="موضوع التذكرة" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold font-arabic mb-2">الوصف</label>
            <Textarea placeholder="وصف تفصيلي للمشكلة أو الطلب" className="min-h-[100px]" />
          </div>
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-arabic">
              إنشاء التذكرة
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowNewTicketForm(false)}
              className="font-arabic"
            >
              إلغاء
            </Button>
          </div>
        </GenericCard>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {mockCustomerService.filter(t => t.status === 'open').length}
          </h3>
          <p className="text-gray-600 font-arabic">تذاكر مفتوحة</p>
          <div className="mt-2 text-sm text-blue-600 font-arabic">
            من أصل {mockCustomerService.length} إجمالي
          </div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">1.6</h3>
          <p className="text-gray-600 font-arabic">متوسط وقت الاستجابة</p>
          <div className="mt-2 text-sm text-green-600 font-arabic">ساعة</div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">4.6</h3>
          <p className="text-gray-600 font-arabic">تقييم الرضا</p>
          <div className="mt-2 text-sm text-green-600 font-arabic">من 5</div>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">92%</h3>
          <p className="text-gray-600 font-arabic">معدل الحل في الوقت</p>
          <div className="mt-2 text-sm text-green-600 font-arabic">هذا الشهر</div>
        </GenericCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Response Time Trend */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4">اتجاه وقت الاستجابة</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="font-arabic" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth={2} name="الفعلي" />
              <Line type="monotone" dataKey="target" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="المستهدف" />
            </LineChart>
          </ResponsiveContainer>
        </GenericCard>

        {/* Tickets by Category */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4">التذاكر حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ticketCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" className="font-arabic" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </GenericCard>

        {/* Satisfaction Trend */}
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4">اتجاه الرضا</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="font-arabic" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="#F59E0B" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </GenericCard>
      </div>

      {/* Tickets List */}
      <GenericCard>
        <h3 className="text-xl font-bold font-arabic mb-4 flex items-center">
          <MessageSquare className="ml-2 h-5 w-5" />
          قائمة التذاكر ({filteredTickets.length})
        </h3>
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold font-arabic text-gray-900">{ticket.subject}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityText(ticket.priority)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      {getStatusText(ticket.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 font-arabic text-sm mb-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-arabic">
                    <span>العميل: {ticket.customerName}</span>
                    <span>المسؤول: {ticket.assignedTo}</span>
                    <span>تاريخ الإنشاء: {ticket.createdDate}</span>
                    {ticket.responseTime && (
                      <span className="text-blue-600">
                        وقت الاستجابة: {ticket.responseTime} ساعة
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="font-arabic">
                    عرض
                  </Button>
                  {ticket.status === 'open' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
                      معالجة
                    </Button>
                  )}
                </div>
              </div>
              
              {ticket.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {ticket.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-arabic">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </GenericCard>
    </div>
  );
};

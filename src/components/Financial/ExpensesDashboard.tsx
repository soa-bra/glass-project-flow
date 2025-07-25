// Enhanced Expenses Dashboard with Approvals
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { expensesAPI } from '@/api/expenses/expenses';
import { Expense } from '@/lib/prisma';
import { Plus, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const statusLabels: Record<string, string> = {
  draft: 'مسودة',
  waiting: 'بانتظار الموافقة',
  approved: 'موافق عليه',
  rejected: 'مرفوض',
  reimbursed: 'تم الاستلام'
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  waiting: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  reimbursed: 'bg-blue-100 text-blue-800'
};

export const ExpensesDashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    projectId: '',
    employeeId: 'current-user'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, statsData] = await Promise.all([
        expensesAPI.getExpenses(),
        expensesAPI.getExpenseStats()
      ]);
      setExpenses(expensesData);
      setStats(statsData);
    } catch (error) {
      toast.error('فشل في تحميل بيانات المصروفات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExpense = async () => {
    try {
      await expensesAPI.submitExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        createdById: 'current-user',
        approvers: ['manager-1', 'finance-admin']
      });
      toast.success('تم تقديم طلب المصروف للموافقة');
      setIsCreateModalOpen(false);
      setFormData({ amount: '', description: '', projectId: '', employeeId: 'current-user' });
      loadData();
    } catch (error) {
      toast.error('فشل في تقديم طلب المصروف');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المصروفات</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 ml-2" />طلب مصروف</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>طلب مصروف جديد</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>المبلغ (ر.س)</Label>
                <Input type="number" value={formData.amount} 
                  onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))} />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} />
              </div>
              <Button onClick={handleSubmitExpense} className="w-full">تقديم الطلب</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">المعتمد</p>
                <p className="text-xl font-bold">{stats.totalApproved?.toLocaleString('ar-SA')} ر.س</p>
              </div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">في الانتظار</p>
                <p className="text-xl font-bold">{stats.pendingCount}</p>
              </div>
            </div>
          </CardContent></Card>
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>قائمة المصروفات</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوصف</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.amount.toLocaleString('ar-SA')} ر.س</TableCell>
                  <TableCell>{new Date(expense.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[expense.status]}>
                      {statusLabels[expense.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
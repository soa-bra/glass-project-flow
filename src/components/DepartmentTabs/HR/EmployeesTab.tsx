import React, { useMemo, useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { Users, Search, Filter, Plus, Eye, Edit, Phone, Mail, Trash2 } from 'lucide-react';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { Input } from '@/components/ui/input';
import { getHRStatusText } from './utils';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal } from '../shared/GenericDetailModal';
import { GenericFilterPopover, FilterOption } from '../shared/GenericFilterPopover';
import { HrEmployees } from '@/hooks/departments';
import type { HrEmployee } from '@/types/departments';
import { toast } from 'sonner';

/**
 * EmployeesTab — wired to public.hr_employees via @/hooks/departments.
 * Rich sub-fields (skills, documents, emergencyContact) live in `metadata` jsonb.
 */
export const EmployeesTab: React.FC = () => {
  const { data: employees = [], isLoading } = HrEmployees.useList();
  const createEmp = HrEmployees.useCreate();
  const updateEmp = HrEmployees.useUpdate();
  const removeEmp = HrEmployees.useRemove();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('الكل');
  const [selectedEmployee, setSelectedEmployee] = useState<HrEmployee | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<HrEmployee | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, string>>({});

  // Derive department list from current data + a default set
  const departments = useMemo(() => {
    const set = new Set<string>(['الكل']);
    employees.forEach((e) => {
      const dept = (e.metadata as Record<string, unknown> | null | undefined)?.department_label;
      if (typeof dept === 'string' && dept) set.add(dept);
    });
    ['التقنية', 'التصميم', 'المالية', 'التسويق', 'الموارد البشرية'].forEach((d) => set.add(d));
    return Array.from(set);
  }, [employees]);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const meta = (employee.metadata ?? {}) as Record<string, unknown>;
        const deptLabel = (meta.department_label as string | undefined) ?? '';
        const matchesSearch =
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (employee.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (employee.role ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === 'الكل' || deptLabel === selectedDepartment;
        const matchesStatus =
          !advancedFilters.status || advancedFilters.status === 'all' || employee.status === advancedFilters.status;
        return matchesSearch && matchesDepartment && matchesStatus;
      }),
    [employees, searchTerm, selectedDepartment, advancedFilters],
  );

  const employeeFields: FormField[] = [
    { name: 'name', label: 'الاسم الكامل', type: 'text', required: true, placeholder: 'أدخل اسم الموظف' },
    { name: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'example@soapra.com' },
    { name: 'phone', label: 'رقم الهاتف', type: 'tel', placeholder: '+966...' },
    { name: 'role', label: 'المنصب', type: 'text', required: true, placeholder: 'المسمى الوظيفي' },
    {
      name: 'department_label',
      label: 'القسم',
      type: 'select',
      required: true,
      options: departments.filter((d) => d !== 'الكل').map((d) => ({ value: d, label: d })),
    },
    { name: 'hire_date', label: 'تاريخ التعيين', type: 'date', required: true },
    { name: 'salary', label: 'الراتب', type: 'number', placeholder: '0' },
    {
      name: 'status',
      label: 'الحالة',
      type: 'select',
      options: [
        { value: 'active', label: 'نشط' },
        { value: 'inactive', label: 'غير نشط' },
        { value: 'on_leave', label: 'في إجازة' },
      ],
    },
  ];

  const filterOptions: FilterOption[] = [
    {
      name: 'status',
      label: 'الحالة',
      options: [
        { value: 'active', label: 'نشط' },
        { value: 'inactive', label: 'غير نشط' },
        { value: 'on_leave', label: 'في إجازة' },
      ],
    },
  ];

  const handleAddEmployee = (data: Record<string, string>) => {
    createEmp.mutate(
      {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        role: data.role,
        hire_date: data.hire_date || null,
        salary: data.salary ? Number(data.salary) : null,
        status: data.status || 'active',
        metadata: { department_label: data.department_label },
      },
      {
        onSuccess: () => {},
        onError: (e) => toast.error('فشل الإضافة: ' + (e as Error).message),
      },
    );
  };

  const handleEditEmployee = (data: Record<string, string>) => {
    if (!editingEmployee) return;
    updateEmp.mutate(
      {
        id: editingEmployee.id,
        patch: {
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          role: data.role,
          hire_date: data.hire_date || null,
          salary: data.salary ? Number(data.salary) : null,
          status: data.status || editingEmployee.status,
          metadata: {
            ...(editingEmployee.metadata as Record<string, unknown> | null | undefined),
            department_label: data.department_label,
          },
        },
      },
      {
        onSuccess: () => {
          setEditingEmployee(null);
          if (selectedEmployee?.id === editingEmployee.id) setSelectedEmployee(null);
        },
        onError: (e) => toast.error('فشل التحديث: ' + (e as Error).message),
      },
    );
  };

  const handleRemove = (id: string) => {
    if (!confirm('حذف هذا الموظف؟')) return;
    removeEmp.mutate(id, {
      onSuccess: () => {
        if (selectedEmployee?.id === id) setSelectedEmployee(null);
      },
      onError: (e) => toast.error('فشل الحذف: ' + (e as Error).message),
    });
  };

  const getStatusBadge = (status: string) => (
    <UnifiedBadge variant={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'warning'}>
      {getHRStatusText(status)}
    </UnifiedBadge>
  );

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);

  if (selectedEmployee) {
    const meta = (selectedEmployee.metadata ?? {}) as Record<string, unknown>;
    return (
      <div className="space-y-6 bg-transparent">
        <div className="flex items-center gap-4">
          <UnifiedButton variant="outline" onClick={() => setSelectedEmployee(null)}>← العودة</UnifiedButton>
          <h3 className="text-2xl font-bold text-gray-800 font-arabic">ملف الموظف</h3>
        </div>

        <BaseBox variant="operations" className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {initials(selectedEmployee.name)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-800 font-arabic">{selectedEmployee.name}</h2>
                {getStatusBadge(selectedEmployee.status)}
              </div>
              <p className="text-xl text-gray-600 font-arabic mb-4">{selectedEmployee.role ?? '—'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{selectedEmployee.email ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{selectedEmployee.phone ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-arabic">{(meta.department_label as string) ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-arabic">تاريخ التعيين:</span>
                  <span className="text-gray-700">{selectedEmployee.hire_date ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-arabic">الراتب:</span>
                  <span className="text-gray-700">{selectedEmployee.salary ?? '—'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <UnifiedButton variant="outline" onClick={() => setEditingEmployee(selectedEmployee)}>
                <Edit className="h-4 w-4" /> تعديل
              </UnifiedButton>
              <UnifiedButton variant="outline" onClick={() => handleRemove(selectedEmployee.id)}>
                <Trash2 className="h-4 w-4" /> حذف
              </UnifiedButton>
            </div>
          </div>
        </BaseBox>

        {editingEmployee && (
          <GenericFormModal
            isOpen={!!editingEmployee}
            onClose={() => setEditingEmployee(null)}
            title={`تعديل بيانات ${editingEmployee.name}`}
            fields={employeeFields.map((f) => {
              const m = (editingEmployee.metadata ?? {}) as Record<string, unknown>;
              const fromRow = (editingEmployee as unknown as Record<string, unknown>)[f.name];
              const fromMeta = m[f.name];
              return { ...f, defaultValue: String(fromRow ?? fromMeta ?? '') };
            })}
            onSubmit={handleEditEmployee}
            submitLabel="حفظ التعديلات"
            successMessage="تم تحديث بيانات الموظف"
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-transparent">
      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">ملفات الموظفين</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في الموظفين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-arabic"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <GenericFilterPopover
              filters={filterOptions}
              onApply={(values) => setAdvancedFilters(values)}
              onReset={() => setAdvancedFilters({})}
              resultCount={filteredEmployees.length}
              triggerButton={
                <UnifiedButton variant="outline">
                  <Filter className="h-4 w-4 mr-2" /> تصفية
                </UnifiedButton>
              }
            />
            <UnifiedButton onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> إضافة موظف
            </UnifiedButton>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 font-arabic">
          {isLoading ? 'جارٍ التحميل…' : `${filteredEmployees.length} موظف`}
        </div>
      </BaseBox>

      <BaseBox variant="operations" className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-arabic">الموظف</th>
                <th className="text-right py-3 px-4 font-arabic">المنصب</th>
                <th className="text-right py-3 px-4 font-arabic">القسم</th>
                <th className="text-right py-3 px-4 font-arabic">تاريخ التعيين</th>
                <th className="text-right py-3 px-4 font-arabic">الحالة</th>
                <th className="text-right py-3 px-4 font-arabic">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => {
                const meta = (employee.metadata ?? {}) as Record<string, unknown>;
                return (
                  <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {initials(employee.name)}
                        </div>
                        <div>
                          <p className="font-medium font-arabic">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.email ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-arabic">{employee.role ?? '—'}</td>
                    <td className="py-3 px-4 font-arabic">{(meta.department_label as string) ?? '—'}</td>
                    <td className="py-3 px-4">{employee.hire_date ?? '—'}</td>
                    <td className="py-3 px-4">{getStatusBadge(employee.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <UnifiedButton variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                          <Eye className="h-4 w-4" />
                        </UnifiedButton>
                        <UnifiedButton variant="outline" size="sm" onClick={() => setEditingEmployee(employee)}>
                          <Edit className="h-4 w-4" />
                        </UnifiedButton>
                        <UnifiedButton variant="outline" size="sm" onClick={() => handleRemove(employee.id)}>
                          <Trash2 className="h-4 w-4" />
                        </UnifiedButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-arabic">
                    لا يوجد موظفون. ابدأ بإضافة موظف جديد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </BaseBox>

      <GenericFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="إضافة موظف جديد"
        fields={employeeFields}
        onSubmit={handleAddEmployee}
        submitLabel="إضافة الموظف"
        successMessage="تمت إضافة الموظف"
      />

      {editingEmployee && !selectedEmployee && (
        <GenericFormModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          title={`تعديل بيانات ${editingEmployee.name}`}
          fields={employeeFields.map((f) => {
            const m = (editingEmployee.metadata ?? {}) as Record<string, unknown>;
            const fromRow = (editingEmployee as unknown as Record<string, unknown>)[f.name];
            const fromMeta = m[f.name];
            return { ...f, defaultValue: String(fromRow ?? fromMeta ?? '') };
          })}
          onSubmit={handleEditEmployee}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث بيانات الموظف"
        />
      )}
    </div>
  );
};

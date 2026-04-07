
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { Users, Search, Filter, Plus, Eye, Edit, Phone, Mail, MapPin, Download } from 'lucide-react';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { Input } from '@/components/ui/input';
import { mockEmployees } from './data';
import { Employee } from './types';
import { getHRStatusColor, getHRStatusText } from './utils';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { GenericFilterPopover, FilterOption } from '../shared/GenericFilterPopover';
import { toast } from 'sonner';

export const EmployeesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('الكل');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState(mockEmployees);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, string>>({});

  const departments = ['الكل', 'التقنية', 'التصميم', 'المالية', 'التسويق', 'الموارد البشرية'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'الكل' || employee.department === selectedDepartment;
    const matchesStatus = !advancedFilters.status || advancedFilters.status === 'all' || employee.status === advancedFilters.status;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const addEmployeeFields: FormField[] = [
    { name: 'name', label: 'الاسم الكامل', type: 'text', required: true, placeholder: 'أدخل اسم الموظف' },
    { name: 'email', label: 'البريد الإلكتروني', type: 'email', required: true, placeholder: 'example@soapra.com' },
    { name: 'phone', label: 'رقم الهاتف', type: 'tel', required: true, placeholder: '+966...' },
    { name: 'position', label: 'المنصب', type: 'text', required: true, placeholder: 'المسمى الوظيفي' },
    { name: 'department', label: 'القسم', type: 'select', required: true, options: departments.filter(d => d !== 'الكل').map(d => ({ value: d, label: d })) },
    { name: 'hireDate', label: 'تاريخ التعيين', type: 'date', required: true },
    { name: 'salary', label: 'الراتب', type: 'number', placeholder: '0' },
  ];

  const addDocFields: FormField[] = [
    { name: 'name', label: 'اسم الوثيقة', type: 'text', required: true, placeholder: 'اسم الوثيقة' },
    { name: 'type', label: 'نوع الوثيقة', type: 'select', required: true, options: [
      { value: 'contract', label: 'عقد' },
      { value: 'certificate', label: 'شهادة' },
      { value: 'evaluation', label: 'تقييم' },
      { value: 'other', label: 'أخرى' },
    ]},
    { name: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'ملاحظات إضافية...' },
  ];

  const filterOptions: FilterOption[] = [
    { name: 'status', label: 'الحالة', options: [
      { value: 'active', label: 'نشط' },
      { value: 'inactive', label: 'غير نشط' },
      { value: 'on_leave', label: 'في إجازة' },
    ]},
    { name: 'department', label: 'القسم', options: departments.filter(d => d !== 'الكل').map(d => ({ value: d, label: d })) },
  ];

  const handleAddEmployee = (data: Record<string, string>) => {
    const newEmp: Employee = {
      id: `emp-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position,
      department: data.department,
      hireDate: data.hireDate,
      employeeId: `SUP-${employees.length + 1}`,
      status: 'active',
      salary: Number(data.salary) || 0,
      manager: '',
      skills: [],
      emergencyContact: { name: '', relationship: '', phone: '' },
      documents: [],
    };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const handleEditEmployee = (data: Record<string, string>) => {
    if (!editingEmployee) return;
    setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? {
      ...emp, name: data.name, email: data.email, phone: data.phone, position: data.position, department: data.department, salary: Number(data.salary) || emp.salary,
    } : emp));
    if (selectedEmployee?.id === editingEmployee.id) {
      setSelectedEmployee(prev => prev ? { ...prev, name: data.name, email: data.email, phone: data.phone, position: data.position, department: data.department } : prev);
    }
    setEditingEmployee(null);
  };

  const handleAddDoc = (data: Record<string, string>) => {
    if (!selectedEmployee) return;
    const newDoc = { name: data.name, type: data.type as any, uploadDate: new Date().toISOString().split('T')[0], url: '#' };
    setEmployees(prev => prev.map(emp => emp.id === selectedEmployee.id ? { ...emp, documents: [...emp.documents, newDoc] } : emp));
    setSelectedEmployee(prev => prev ? { ...prev, documents: [...prev.documents, newDoc] } : prev);
  };

  const getStatusBadge = (status: string) => (
    <UnifiedBadge variant={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'warning'}>
      {getHRStatusText(status)}
    </UnifiedBadge>
  );

  if (selectedEmployee) {
    return (
      <div className="space-y-6 bg-transparent">
        <div className="flex items-center gap-4">
          <UnifiedButton variant="outline" onClick={() => setSelectedEmployee(null)}>← العودة</UnifiedButton>
          <h3 className="text-2xl font-bold text-gray-800 font-arabic">ملف الموظف</h3>
        </div>

        <BaseBox variant="operations" className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {selectedEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-800 font-arabic">{selectedEmployee.name}</h2>
                {getStatusBadge(selectedEmployee.status)}
              </div>
              <p className="text-xl text-gray-600 font-arabic mb-4">{selectedEmployee.position}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /><span className="text-gray-700">{selectedEmployee.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /><span className="text-gray-700">{selectedEmployee.phone}</span></div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-500" /><span className="text-gray-700 font-arabic">{selectedEmployee.department}</span></div>
                <div className="flex items-center gap-2"><span className="text-gray-500 font-arabic">رقم الموظف:</span><span className="text-gray-700">{selectedEmployee.employeeId}</span></div>
              </div>
            </div>
            <UnifiedButton variant="outline" onClick={() => setEditingEmployee(selectedEmployee)}>
              <Edit className="h-4 w-4" /> تعديل
            </UnifiedButton>
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-6">
          <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">المهارات والكفاءات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedEmployee.skills.map((skill, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium font-arabic">{skill.name}</h4>
                  <UnifiedBadge variant={skill.level === 'expert' ? 'success' : skill.level === 'advanced' ? 'info' : skill.level === 'intermediate' ? 'warning' : 'default'}>
                    {skill.level === 'expert' ? 'خبير' : skill.level === 'advanced' ? 'متقدم' : skill.level === 'intermediate' ? 'متوسط' : 'مبتدئ'}
                  </UnifiedBadge>
                </div>
                <p className="text-sm text-gray-600 font-arabic mb-1">الفئة: {skill.category}</p>
                <p className="text-xs text-gray-500">آخر تقييم: {skill.lastAssessed}</p>
              </div>
            ))}
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-6">
          <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">جهة الاتصال في الطوارئ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-600 font-arabic">الاسم</label><p className="text-lg font-medium">{selectedEmployee.emergencyContact.name}</p></div>
            <div><label className="text-sm text-gray-600 font-arabic">صلة القرابة</label><p className="text-lg font-medium font-arabic">{selectedEmployee.emergencyContact.relationship}</p></div>
            <div><label className="text-sm text-gray-600 font-arabic">رقم الهاتف</label><p className="text-lg font-medium">{selectedEmployee.emergencyContact.phone}</p></div>
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 font-arabic">الوثائق</h3>
            <UnifiedButton variant="outline" size="sm" onClick={() => setIsAddDocOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> إضافة وثيقة
            </UnifiedButton>
          </div>
          <div className="space-y-3">
            {selectedEmployee.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium font-arabic">{doc.name}</p>
                  <p className="text-sm text-gray-600">
                    {doc.type === 'contract' ? 'عقد' : doc.type === 'certificate' ? 'شهادة' : doc.type === 'evaluation' ? 'تقييم' : 'أخرى'} • تم الرفع في {doc.uploadDate}
                  </p>
                </div>
                <UnifiedButton variant="outline" size="sm" onClick={() => setViewingDoc(doc)}>
                  <Eye className="h-4 w-4" />
                </UnifiedButton>
              </div>
            ))}
          </div>
        </BaseBox>

        {editingEmployee && (
          <GenericFormModal
            isOpen={!!editingEmployee}
            onClose={() => setEditingEmployee(null)}
            title={`تعديل بيانات ${editingEmployee.name}`}
            fields={addEmployeeFields.map(f => ({ ...f, defaultValue: String((editingEmployee as any)[f.name] || '') }))}
            onSubmit={handleEditEmployee}
            submitLabel="حفظ التعديلات"
            successMessage="تم تحديث بيانات الموظف"
          />
        )}

        <GenericFormModal
          isOpen={isAddDocOpen}
          onClose={() => setIsAddDocOpen(false)}
          title="إضافة وثيقة جديدة"
          fields={addDocFields}
          onSubmit={handleAddDoc}
          submitLabel="إضافة الوثيقة"
          successMessage="تمت إضافة الوثيقة بنجاح"
        />

        {viewingDoc && (
          <GenericDetailModal
            isOpen={!!viewingDoc}
            onClose={() => setViewingDoc(null)}
            title={`وثيقة: ${viewingDoc.name}`}
            fields={[
              { label: 'اسم الوثيقة', value: viewingDoc.name },
              { label: 'النوع', value: viewingDoc.type === 'contract' ? 'عقد' : viewingDoc.type === 'certificate' ? 'شهادة' : viewingDoc.type === 'evaluation' ? 'تقييم' : 'أخرى' },
              { label: 'تاريخ الرفع', value: viewingDoc.uploadDate },
            ]}
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
            <Input placeholder="البحث في الموظفين..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
          </div>
          <div className="flex gap-2">
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-arabic">
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <GenericFilterPopover
              filters={filterOptions}
              onApply={(values) => setAdvancedFilters(values)}
              onReset={() => setAdvancedFilters({})}
              resultCount={filteredEmployees.length}
              triggerButton={<UnifiedButton variant="outline"><Filter className="h-4 w-4 mr-2" /> تصفية</UnifiedButton>}
            />
            <UnifiedButton onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> إضافة موظف
            </UnifiedButton>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 font-arabic">{filteredEmployees.length} موظف</div>
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
              {filteredEmployees.map((employee, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium font-arabic">{employee.name}</p>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-arabic">{employee.position}</td>
                  <td className="py-3 px-4 font-arabic">{employee.department}</td>
                  <td className="py-3 px-4">{employee.hireDate}</td>
                  <td className="py-3 px-4">{getStatusBadge(employee.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <UnifiedButton variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                        <Eye className="h-4 w-4" />
                      </UnifiedButton>
                      <UnifiedButton variant="outline" size="sm" onClick={() => setEditingEmployee(employee)}>
                        <Edit className="h-4 w-4" />
                      </UnifiedButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseBox>

      <GenericFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="إضافة موظف جديد"
        fields={addEmployeeFields}
        onSubmit={handleAddEmployee}
        submitLabel="إضافة الموظف"
        successMessage="تمت إضافة الموظف بنجاح"
      />

      {editingEmployee && !selectedEmployee && (
        <GenericFormModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          title={`تعديل بيانات ${editingEmployee.name}`}
          fields={addEmployeeFields.map(f => ({ ...f, defaultValue: String((editingEmployee as any)[f.name] || '') }))}
          onSubmit={handleEditEmployee}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث بيانات الموظف"
        />
      )}
    </div>
  );
};

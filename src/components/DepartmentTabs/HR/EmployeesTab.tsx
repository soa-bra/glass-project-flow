
import React, { useState } from 'react';
import { InnerCard } from '@/components/ui/InnerCard';
import { Users, Search, Filter, Plus, Eye, Edit, Phone, Mail, MapPin } from 'lucide-react';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { Input } from '@/components/ui/input';
import { mockEmployees } from './data';
import { Employee } from './types';
import { getHRStatusColor, getHRStatusText } from './utils';

export const EmployeesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('الكل');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const departments = ['الكل', 'التقنية', 'التصميم', 'المالية', 'التسويق', 'الموارد البشرية'];

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'الكل' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const text = getHRStatusText(status);
    
    let variant: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        variant = 'success';
        break;
      case 'pending':
      case 'in_progress':
        variant = 'warning';
        break;
      case 'inactive':
      case 'rejected':
        variant = 'error';
        break;
      case 'review':
      case 'draft':
        variant = 'info';
        break;
      default:
        variant = 'default';
    }
    
    return (
      <UnifiedBadge variant={variant} size="sm">
        {text}
      </UnifiedBadge>
    );
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-[#bdeed3] text-black border-[#bdeed3]';
      case 'advanced': return 'bg-[#a4e2f6] text-black border-[#a4e2f6]';
      case 'intermediate': return 'bg-[#fbe2aa] text-black border-[#fbe2aa]';
      case 'beginner': return 'bg-[#f1b5b9] text-black border-[#f1b5b9]';
      default: return 'bg-gray-200 text-gray-800 border-gray-200';
    }
  };

  if (selectedEmployee) {
    return (
      <div className="space-y-6 bg-transparent">
        {/* عودة إلى قائمة الموظفين */}
        <div className="flex items-center gap-4">
          <UnifiedButton 
            variant="outline" 
            onClick={() => setSelectedEmployee(null)}
            size="sm"
          >
            ← العودة
          </UnifiedButton>
          <h3 className="text-2xl font-bold text-black font-arabic">ملف الموظف</h3>
        </div>

        {/* معلومات الموظف الأساسية */}
        <InnerCard className="p-6">
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
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-arabic">{selectedEmployee.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-arabic">رقم الموظف:</span>
                  <span className="text-gray-700">{selectedEmployee.employeeId}</span>
                </div>
              </div>
            </div>
            <UnifiedButton variant="outline" size="sm">
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </UnifiedButton>
          </div>
        </InnerCard>

        {/* المهارات */}
        <InnerCard 
          title="المهارات والكفاءات"
          className="p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedEmployee.skills.map((skill, index) => (
              <div key={index} className="p-4 bg-black/5 rounded-xl border border-black/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium font-arabic">{skill.name}</h4>
                  <UnifiedBadge 
                    variant={
                      skill.level === 'expert' ? 'success' :
                      skill.level === 'advanced' ? 'info' :
                      skill.level === 'intermediate' ? 'warning' : 'error'
                    }
                    size="sm"
                  >
                    {skill.level === 'expert' ? 'خبير' :
                     skill.level === 'advanced' ? 'متقدم' :
                     skill.level === 'intermediate' ? 'متوسط' : 'مبتدئ'}
                  </UnifiedBadge>
                </div>
                <p className="text-sm text-black/70 font-arabic mb-1">الفئة: {skill.category}</p>
                <p className="text-xs text-black/60">آخر تقييم: {skill.lastAssessed}</p>
              </div>
            ))}
          </div>
        </InnerCard>

        {/* جهة الاتصال في الطوارئ */}
        <InnerCard 
          title="جهة الاتصال في الطوارئ"
          className="p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-black/70 font-arabic">الاسم</label>
              <p className="text-lg font-medium">{selectedEmployee.emergencyContact.name}</p>
            </div>
            <div>
              <label className="text-sm text-black/70 font-arabic">صلة القرابة</label>
              <p className="text-lg font-medium font-arabic">{selectedEmployee.emergencyContact.relationship}</p>
            </div>
            <div>
              <label className="text-sm text-black/70 font-arabic">رقم الهاتف</label>
              <p className="text-lg font-medium">{selectedEmployee.emergencyContact.phone}</p>
            </div>
            {selectedEmployee.emergencyContact.email && (
              <div>
                <label className="text-sm text-black/70 font-arabic">البريد الإلكتروني</label>
                <p className="text-lg font-medium">{selectedEmployee.emergencyContact.email}</p>
              </div>
            )}
          </div>
        </InnerCard>

        {/* الوثائق */}
        <InnerCard 
          title="الوثائق"
          className="p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <UnifiedButton variant="outline" size="sm">
              <Plus className="h-4 w-4 ml-2" />
              إضافة وثيقة
            </UnifiedButton>
          </div>
          <div className="space-y-3">
            {selectedEmployee.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                <div>
                  <p className="font-medium font-arabic">{doc.name}</p>
                  <p className="text-sm text-black/70">
                    {doc.type === 'contract' ? 'عقد' :
                     doc.type === 'certificate' ? 'شهادة' :
                     doc.type === 'evaluation' ? 'تقييم' : 'أخرى'} • 
                    تم الرفع في {doc.uploadDate}
                  </p>
                </div>
                <UnifiedButton variant="secondary" size="sm">
                  <Eye className="h-4 w-4" />
                </UnifiedButton>
              </div>
            ))}
          </div>
        </InnerCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-transparent">
      {/* أدوات البحث والتصفية */}
      <InnerCard 
        title="ملفات الموظفين"
        icon={<Users className="h-4 w-4 text-white" />}
        className="p-6"
      >
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
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <UnifiedButton variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-2" />
              تصفية
            </UnifiedButton>
            
            <UnifiedButton size="sm">
              <Plus className="h-4 w-4 ml-2" />
              إضافة موظف
            </UnifiedButton>
          </div>
        </div>
      </InnerCard>

      {/* جدول الموظفين */}
      <InnerCard className="p-6">
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
                      <UnifiedButton 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </UnifiedButton>
                      <UnifiedButton variant="secondary" size="sm">
                        <Edit className="h-4 w-4" />
                      </UnifiedButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InnerCard>
    </div>
  );
};

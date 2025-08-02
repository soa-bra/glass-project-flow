
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Users, Search, Filter, Plus, Eye, Edit, Phone, Mail, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockEmployees } from './data';
import { Employee } from './types';

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
    switch (status) {
      case 'active':
        return <Badge variant="default" className="text-xs">نشط</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="text-xs">غير نشط</Badge>;
      case 'onLeave':
        return <Badge variant="outline" className="text-xs">في إجازة</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">غير معروف</Badge>;
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-green-600 bg-green-100';
      case 'advanced': return 'text-blue-600 bg-blue-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'beginner': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (selectedEmployee) {
    return (
      <div className="space-y-6 bg-transparent">
        {/* عودة إلى قائمة الموظفين */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedEmployee(null)}
            className="flex items-center gap-2"
          >
            <span>← العودة</span>
          </Button>
          <h3 className="text-2xl font-bold text-gray-800 font-arabic">ملف الموظف</h3>
        </div>

        {/* معلومات الموظف الأساسية */}
        <BaseCard variant="operations" className="p-6">
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
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span className="font-arabic">تعديل</span>
            </Button>
          </div>
        </BaseCard>

        {/* المهارات */}
        <BaseCard variant="operations" className="p-6">
          <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">المهارات والكفاءات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedEmployee.skills.map((skill, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium font-arabic">{skill.name}</h4>
                  <Badge className={`text-xs ${getSkillLevelColor(skill.level)}`}>
                    {skill.level === 'expert' ? 'خبير' :
                     skill.level === 'advanced' ? 'متقدم' :
                     skill.level === 'intermediate' ? 'متوسط' : 'مبتدئ'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 font-arabic mb-1">الفئة: {skill.category}</p>
                <p className="text-xs text-gray-500">آخر تقييم: {skill.lastAssessed}</p>
              </div>
            ))}
          </div>
        </BaseCard>

        {/* جهة الاتصال في الطوارئ */}
        <BaseCard variant="operations" className="p-6">
          <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">جهة الاتصال في الطوارئ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-arabic">الاسم</label>
              <p className="text-lg font-medium">{selectedEmployee.emergencyContact.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-arabic">صلة القرابة</label>
              <p className="text-lg font-medium font-arabic">{selectedEmployee.emergencyContact.relationship}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-arabic">رقم الهاتف</label>
              <p className="text-lg font-medium">{selectedEmployee.emergencyContact.phone}</p>
            </div>
            {selectedEmployee.emergencyContact.email && (
              <div>
                <label className="text-sm text-gray-600 font-arabic">البريد الإلكتروني</label>
                <p className="text-lg font-medium">{selectedEmployee.emergencyContact.email}</p>
              </div>
            )}
          </div>
        </BaseCard>

        {/* الوثائق */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 font-arabic">الوثائق</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="font-arabic">إضافة وثيقة</span>
            </Button>
          </div>
          <div className="space-y-3">
            {selectedEmployee.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium font-arabic">{doc.name}</p>
                  <p className="text-sm text-gray-600">
                    {doc.type === 'contract' ? 'عقد' :
                     doc.type === 'certificate' ? 'شهادة' :
                     doc.type === 'evaluation' ? 'تقييم' : 'أخرى'} • 
                    تم الرفع في {doc.uploadDate}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </BaseCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-transparent">
      {/* أدوات البحث والتصفية */}
      <BaseCard variant="operations" className="p-6">
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
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              <span className="font-arabic">تصفية</span>
            </Button>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              <span className="font-arabic">إضافة موظف</span>
            </Button>
          </div>
        </div>
      </BaseCard>

      {/* جدول الموظفين */}
      <BaseCard variant="operations" className="p-6">
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  );
};

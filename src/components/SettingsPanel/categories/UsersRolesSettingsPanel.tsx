import React, { useState } from 'react';
import { Users, UserPlus, Shield, Key, Crown, Edit3, Trash2, Eye } from 'lucide-react';
import { useAutosave } from '../hooks/useAutosave';

interface UsersRolesSettingsPanelProps {
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  level: number;
}

export const UsersRolesSettingsPanel: React.FC<UsersRolesSettingsPanelProps> = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'أحمد محمد السعيد',
      email: 'ahmed.alsaeid@soabra.com',
      role: 'Owner',
      department: 'الإدارة',
      status: 'active',
      lastLogin: '2024-01-20 10:30',
      permissions: ['*:*']
    },
    {
      id: '2',
      name: 'فاطمة أحمد العلي',
      email: 'fatma.alali@soabra.com',
      role: 'Department Manager',
      department: 'التسويق',
      status: 'active',
      lastLogin: '2024-01-20 09:15',
      permissions: ['task:*', 'budget:manage']
    }
  ]);

  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'Owner',
      description: 'المالك - وصول كامل للنظام',
      permissions: ['*:*'],
      userCount: 1,
      level: 0
    },
    {
      id: '2',
      name: 'Department Manager',
      description: 'مدير القسم - إدارة الوحدة',
      permissions: ['task:*', 'budget:manage', 'report:dept'],
      userCount: 5,
      level: 2
    }
  ]);

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'users-roles',
    data: { users, roles },
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const handleUserStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleSave = async () => {
    try {
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'users-roles', data: { users, roles } }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Error handled silently
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (level: number) => {
    if (level === 0) return 'bg-purple-100 text-purple-800';
    if (level === 1) return 'bg-blue-100 text-blue-800';
    if (level === 2) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--sb-column-3-bg)' }}>
      {/* Header with Title */}
      <div className="py-[45px] px-6">
        <h2 className="font-medium text-black font-arabic text-3xl whitespace-nowrap px-[24px]">
          المستخدمون والأدوار
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6 px-6" style={{ background: 'var(--sb-column-3-bg)' }}>
        <div className="space-y-6">

          {/* Users Management Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-bold text-black">إدارة المستخدمين</h3>
              <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                إضافة مستخدم جديد
              </button>
            </div>
            
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-bold text-black">{user.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'معلق'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role === 'Owner' ? 0 : 2)}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.department} | آخر دخول: {user.lastLogin}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles Management Card */}
          <div className="rounded-[41px] p-6 ring-1" style={{ background: 'var(--sb-box-standard)', borderColor: 'var(--sb-box-border)' }}>
            <h3 className="text-md font-bold text-black mb-4">إدارة الأدوار</h3>
            
            <div className="space-y-3">
              {roles.map(role => (
                <div key={role.id} className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className={`w-5 h-5 ${role.level === 0 ? 'text-purple-600' : 'text-gray-600'}`} />
                        <h4 className="text-sm font-bold text-black">{role.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(role.level)}`}>
                          مستوى {role.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{role.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{role.userCount} مستخدم</span>
                        <span>{role.permissions.length} صلاحية</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">{users.length}</div>
              <p className="text-xs font-normal text-gray-400">إجمالي المستخدمين</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">
                {users.filter(u => u.status === 'active').length}
              </div>
              <p className="text-xs font-normal text-gray-400">مستخدمين نشطين</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">{roles.length}</div>
              <p className="text-xs font-normal text-gray-400">أدوار مُعرّفة</p>
            </div>
            <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-4 text-center">
              <div className="text-2xl font-bold text-black mb-1">15</div>
              <p className="text-xs font-normal text-gray-400">صلاحيات فريدة</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-xs font-normal text-gray-400">
              {lastAutosave ? `آخر حفظ تلقائي: ${lastAutosave}` : 'لم يتم الحفظ بعد'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  clearDraft();
                }}
                style={{ backgroundColor: '#F2FFFF', color: '#000000' }}
                className="px-6 py-2 rounded-full text-sm font-medium border border-black/20 hover:bg-gray-50 transition-colors"
              >
                إعادة تعيين
              </button>
              <button
                onClick={handleSave}
                style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
                className="px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
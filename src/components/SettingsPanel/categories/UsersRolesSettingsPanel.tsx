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
      name: 'فاطمة أحمد الزهراني',
      email: 'fatima.alzahrani@soabra.com',
      role: 'Finance Admin',
      department: 'المالية',
      status: 'active',
      lastLogin: '2024-01-20 09:15',
      permissions: ['finance:*', 'budget:approve']
    },
    {
      id: '3',
      name: 'محمد عبدالله القحطاني',
      email: 'm.alqahtani@soabra.com',
      role: 'Project Manager',
      department: 'المشاريع',
      status: 'active',
      lastLogin: '2024-01-19 16:45',
      permissions: ['project:*', 'task:manage']
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Owner',
      description: 'مالك النظام - صلاحيات كاملة',
      permissions: ['*:*', 'break-glass:override'],
      userCount: 1,
      level: 0
    },
    {
      id: '2',
      name: 'CISO',
      description: 'مسؤول الأمن والمعلومات',
      permissions: ['sec:event:read', 'sec:policy:update', 'incident:trigger'],
      userCount: 1,
      level: 1
    },
    {
      id: '3',
      name: 'Finance Admin',
      description: 'مدير المالية',
      permissions: ['finance:*', 'budget:approve', 'report:export'],
      userCount: 2,
      level: 1
    },
    {
      id: '4',
      name: 'Project Manager',
      description: 'مدير المشاريع',
      permissions: ['project:*', 'task:manage', 'expense:request'],
      userCount: 5,
      level: 2
    }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: ''
  });

  const [aiRoleAssignment, setAiRoleAssignment] = useState({
    enabled: true,
    smartRecommendations: true,
    riskAssessment: true,
    autoProvisioning: false
  });

  const [lastAutosave, setLastAutosave] = useState<string>('');
  const userId = 'user123';

  const { loadDraft, clearDraft } = useAutosave({
    interval: 20000,
    userId,
    section: 'users-roles',
    data: { users, roles, aiRoleAssignment },
    onSave: () => {
      setLastAutosave(new Date().toLocaleTimeString('ar-SA'));
    }
  });

  const getRoleIcon = (level: number) => {
    switch (level) {
      case 0: return <Crown className="w-4 h-4 text-yellow-600" />;
      case 1: return <Shield className="w-4 h-4 text-red-600" />;
      case 2: return <Key className="w-4 h-4 text-blue-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
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

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'معلق';
      default: return 'غير معروف';
    }
  };

  const addUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const user: User = {
        id: Date.now().toString(),
        ...newUser,
        status: 'active',
        lastLogin: 'لم يسجل دخول بعد',
        permissions: roles.find(r => r.name === newUser.role)?.permissions || []
      };
      setUsers(prev => [...prev, user]);
      setNewUser({ name: '', email: '', role: '', department: '' });
      setShowAddUser(false);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleSave = async () => {
    try {
      console.log('Saving users & roles settings to /settings/users-roles/commit');
      clearDraft();
      
      const event = new CustomEvent('settings.updated', {
        detail: { section: 'users-roles', data: { users, roles, aiRoleAssignment } }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save users & roles settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-black/20">
            <Users className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-black">المستخدمين والأدوار</h2>
            <p className="text-sm font-normal text-black">إدارة المستخدمين والصلاحيات والأدوار</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">●</div>
            <p className="text-xs font-normal text-gray-400">محكم</p>
          </div>
        </div>
      </div>

      {/* نظام تعيين الأدوار الذكي */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
        <h3 className="text-md font-bold text-black mb-4 flex items-center gap-2">
          🤖 نظام تعيين الأدوار الذكي
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">AI Role Assignment</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4">
            <label className="flex items-center gap-2 mb-2">
              <input 
                type="checkbox" 
                checked={aiRoleAssignment.smartRecommendations}
                onChange={(e) => setAiRoleAssignment(prev => ({
                  ...prev,
                  smartRecommendations: e.target.checked
                }))}
              />
              <span className="text-sm font-bold text-black">التوصيات الذكية</span>
            </label>
            <p className="text-xs text-gray-600">اقتراح أدوار مناسبة للمستخدمين الجدد</p>
          </div>

          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4">
            <label className="flex items-center gap-2 mb-2">
              <input 
                type="checkbox" 
                checked={aiRoleAssignment.riskAssessment}
                onChange={(e) => setAiRoleAssignment(prev => ({
                  ...prev,
                  riskAssessment: e.target.checked
                }))}
              />
              <span className="text-sm font-bold text-black">تقييم المخاطر</span>
            </label>
            <p className="text-xs text-gray-600">تحليل مخاطر الصلاحيات الممنوحة</p>
          </div>

          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4">
            <label className="flex items-center gap-2 mb-2">
              <input 
                type="checkbox" 
                checked={aiRoleAssignment.autoProvisioning}
                onChange={(e) => setAiRoleAssignment(prev => ({
                  ...prev,
                  autoProvisioning: e.target.checked
                }))}
              />
              <span className="text-sm font-bold text-black">التوفير التلقائي</span>
            </label>
            <p className="text-xs text-gray-600">إنشاء حسابات تلقائياً للموظفين الجدد</p>
          </div>
        </div>
      </div>

      {/* إدارة المستخدمين */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-black">المستخدمين</h3>
          <button
            onClick={() => setShowAddUser(true)}
            className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium flex items-center gap-2"
          >
            <UserPlus size={14} />
            إضافة مستخدم
          </button>
        </div>

        {showAddUser && (
          <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 mb-4">
            <h4 className="text-sm font-bold text-black mb-3">إضافة مستخدم جديد</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="p-2 rounded-lg border text-sm"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="p-2 rounded-lg border text-sm"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                className="p-2 rounded-lg border text-sm"
              >
                <option value="">اختر الدور</option>
                {roles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="القسم"
                value={newUser.department}
                onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                className="p-2 rounded-lg border text-sm"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={addUser}
                className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium"
              >
                إضافة
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {users.map(user => (
            <div key={user.id} style={{ backgroundColor: '#f2ffff' }} className="rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black">{user.name}</h4>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleIcon(roles.find(r => r.name === user.role)?.level || 3)}
                      <span className="text-xs text-black">{user.role}</span>
                      <span className="text-xs text-gray-500">| {user.department}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">آخر دخول: {user.lastLogin}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إدارة الأدوار */}
      <div style={{ backgroundColor: '#f2ffff' }} className="rounded-3xl p-6 border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-black">الأدوار والصلاحيات</h3>
          <button
            onClick={() => setShowAddRole(true)}
            className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
          >
            إضافة دور
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map(role => (
            <div key={role.id} style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getRoleIcon(role.level)}
                  <div>
                    <h4 className="text-sm font-bold text-black">{role.name}</h4>
                    <p className="text-xs text-gray-600">{role.description}</p>
                  </div>
                </div>
                <span className="text-xs bg-white/50 px-2 py-1 rounded">{role.userCount} مستخدم</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-black">الصلاحيات:</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission, index) => (
                    <span key={index} className="text-xs bg-black text-white px-2 py-1 rounded">
                      {permission}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      +{role.permissions.length - 3} أخرى
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات المستخدمين */}
      <div className="grid grid-cols-4 gap-4">
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">{users.length}</div>
          <p className="text-xs font-normal text-gray-400">إجمالي المستخدمين</p>
        </div>
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">{users.filter(u => u.status === 'active').length}</div>
          <p className="text-xs font-normal text-gray-400">نشط</p>
        </div>
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">{roles.length}</div>
          <p className="text-xs font-normal text-gray-400">الأدوار المعرفة</p>
        </div>
        <div style={{ backgroundColor: '#f2ffff' }} className="rounded-2xl p-4 border border-black/10 text-center">
          <div className="text-2xl font-bold text-black mb-1">24h</div>
          <p className="text-xs font-normal text-gray-400">متوسط وقت الجلسة</p>
        </div>
      </div>

      {/* أزرار العمل */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-normal text-gray-400">
          {lastAutosave ? `آخر حفظ تلقائي: ${lastAutosave}` : 'لم يتم الحفظ بعد'}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setUsers([]);
              setRoles([]);
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
  );
};
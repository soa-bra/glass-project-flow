import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  X, 
  Shield, 
  Eye, 
  Edit3, 
  Download, 
  Upload, 
  Trash2,
  User,
  Users,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
}

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  color: string;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();

  // صلاحيات الملفات المتاحة
  const [filePermissions] = useState<Permission[]>([
    {
      id: 'view',
      name: 'عرض الملفات',
      description: 'إمكانية عرض وقراءة الملفات',
      icon: Eye,
      enabled: true
    },
    {
      id: 'download',
      name: 'تحميل الملفات',
      description: 'إمكانية تحميل الملفات للجهاز',
      icon: Download,
      enabled: true
    },
    {
      id: 'upload',
      name: 'رفع الملفات',
      description: 'إمكانية رفع ملفات جديدة',
      icon: Upload,
      enabled: false
    },
    {
      id: 'edit',
      name: 'تعديل الملفات',
      description: 'إمكانية تعديل وتحرير الملفات',
      icon: Edit3,
      enabled: false
    },
    {
      id: 'delete',
      name: 'حذف الملفات',
      description: 'إمكانية حذف الملفات نهائياً',
      icon: Trash2,
      enabled: false
    }
  ]);

  // أدوار المستخدمين
  const [userRoles, setUserRoles] = useState<UserRole[]>([
    {
      id: 'viewer',
      name: 'مشاهد',
      permissions: ['view'],
      color: '#10b981'
    },
    {
      id: 'editor',
      name: 'محرر',
      permissions: ['view', 'download', 'edit'],
      color: '#3b82f6'
    },
    {
      id: 'admin',
      name: 'مدير',
      permissions: ['view', 'download', 'upload', 'edit', 'delete'],
      color: '#ef4444'
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<string>('viewer');
  const [isRestrictedAccess, setIsRestrictedAccess] = useState(false);

  const handleSavePermissions = () => {
    toast({
      title: "تم حفظ الصلاحيات",
      description: "تم تحديث صلاحيات الوصول للملفات بنجاح",
    });
    onClose();
  };

  const togglePermissionForRole = (roleId: string, permissionId: string) => {
    setUserRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission 
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-0 overflow-hidden font-arabic"
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          zIndex: 9999,
        }}
      >
        <DialogTitle className="sr-only">إدارة صلاحيات الوصول للملفات</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">إدارة الصلاحيات</h2>
              <p className="text-sm text-black/70">تحديد صلاحيات الوصول للملفات والمجلدات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-transparent hover:bg-black/5 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            
            {/* إعدادات الوصول العامة */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعدادات الوصول العامة
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/20 rounded-2xl border border-black/10">
                  <div className="flex items-center gap-3">
                    {isRestrictedAccess ? (
                      <Lock className="w-5 h-5 text-red-600" />
                    ) : (
                      <Unlock className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <h4 className="font-medium text-black">وضع الوصول المقيد</h4>
                      <p className="text-xs text-black/70">
                        {isRestrictedAccess 
                          ? 'الوصول مقيد بناءً على الأدوار المحددة' 
                          : 'وصول مفتوح لجميع أعضاء المشروع'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsRestrictedAccess(!isRestrictedAccess)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isRestrictedAccess 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isRestrictedAccess ? 'مقيد' : 'مفتوح'}
                  </button>
                </div>
              </div>
            </div>

            {/* أدوار المستخدمين وصلاحياتهم */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                أدوار المستخدمين
              </h3>
              
              <div className="space-y-4">
                {userRoles.map((role) => (
                  <div key={role.id} className="bg-white/20 rounded-2xl p-4 border border-black/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: role.color }}
                        />
                        <h4 className="font-medium text-black">{role.name}</h4>
                      </div>
                      <span className="text-xs text-black/70">
                        {role.permissions.length} من {filePermissions.length} صلاحية
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {filePermissions.map((permission) => {
                        const IconComponent = permission.icon;
                        const hasPermission = role.permissions.includes(permission.id);
                        
                        return (
                          <button
                            key={permission.id}
                            onClick={() => togglePermissionForRole(role.id, permission.id)}
                            className={`p-3 rounded-xl border transition-all text-right ${
                              hasPermission
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-black/20 bg-white/30 text-black/70 hover:border-black/40'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <div className="text-xs">
                                <div className="font-medium">{permission.name}</div>
                                <div className="opacity-70">{permission.description}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* المستخدمون المسجلون */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                المستخدمون المسجلون
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'أحمد محمد', email: 'ahmed@company.com', role: 'admin' },
                  { name: 'فاطمة أحمد', email: 'fatima@company.com', role: 'editor' },
                  { name: 'خالد سعد', email: 'khalid@company.com', role: 'viewer' },
                  { name: 'نورا عبدالله', email: 'nora@company.com', role: 'editor' }
                ].map((user, index) => {
                  const userRole = userRoles.find(r => r.id === user.role);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/20 rounded-2xl border border-black/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-black">{user.name}</h4>
                          <p className="text-xs text-black/70">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: userRole?.color }}
                        />
                        <span className="text-sm text-black">{userRole?.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSavePermissions}
            className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium transition-colors"
          >
            حفظ الصلاحيات
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};